import { NextResponse } from "next/server";
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  getAddress,
  http,
  isAddress,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

// Signing needs the Node runtime (not edge); always run per-request.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DRIP_AMOUNT = parseEther("0.02"); // enough for many wraps/unwraps
const FUND_IF_BELOW = parseEther("0.005"); // only top up near-empty wallets

const RPC =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

/**
 * POST /api/gas  { address }
 * Drips a little Sepolia ETH to a newly-created (embedded) wallet so email/social
 * users can pay for the faucet/wrap/unwrap transactions. Idempotent by design:
 * it refuses to fund a wallet that already has gas, so it can't be drained by
 * re-calling for the same address.
 */
export async function POST(req: Request) {
  const key = process.env.DRIP_PRIVATE_KEY;
  if (!key) {
    return NextResponse.json({ error: "Gas faucet not configured." }, { status: 503 });
  }

  let body: { address?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = body.address?.trim();
  if (!raw || !isAddress(raw)) {
    return NextResponse.json({ error: "A valid address is required." }, { status: 400 });
  }
  const recipient = getAddress(raw);

  const publicClient = createPublicClient({ chain: sepolia, transport: http(RPC) });

  // Already funded? Don't drip again.
  const recipientBalance = await publicClient.getBalance({ address: recipient });
  if (recipientBalance >= FUND_IF_BELOW) {
    return NextResponse.json({
      funded: false,
      reason: "already-funded",
      balance: formatEther(recipientBalance),
    });
  }

  const account = privateKeyToAccount(
    (key.startsWith("0x") ? key : `0x${key}`) as `0x${string}`,
  );

  // Make sure the faucet itself has enough to send.
  const faucetBalance = await publicClient.getBalance({ address: account.address });
  if (faucetBalance < DRIP_AMOUNT) {
    return NextResponse.json(
      { error: "Gas faucet is empty — top up the drip wallet.", faucet: account.address },
      { status: 503 },
    );
  }

  try {
    const wallet = createWalletClient({ account, chain: sepolia, transport: http(RPC) });
    const hash = await wallet.sendTransaction({ to: recipient, value: DRIP_AMOUNT });
    return NextResponse.json({ funded: true, hash, amount: formatEther(DRIP_AMOUNT) });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message.split("\n")[0] || "Failed to send gas." },
      { status: 500 },
    );
  }
}
