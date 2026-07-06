"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/cn";

/** Sticky table-of-contents with scroll-spy — highlights the section in view. */
export function DocsNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav className="hidden lg:block">
      <div className="sticky top-10">
        <p className="label mb-3 text-faint">On this page</p>
        <ul className="border-l border-hairline">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors duration-150",
                  active === i.id
                    ? "border-ink font-medium text-ink"
                    : "border-transparent text-muted hover:border-hairline-strong hover:text-ink",
                )}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
