"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { XIcon } from "lucide-react";

interface ExpandableCardProps<T> {
  items: T[];
  renderItem: (item: T, id: string) => React.ReactNode;
  renderExpandedContent: (item: T, id: string) => React.ReactNode;
  isActiveItem: (active: any) => active is T;
}

export function ExpandableCard<T>({
  items,
  renderItem,
  renderExpandedContent,
  isActiveItem
}: ExpandableCardProps<T>) {
  const [active, setActive] = useState<T | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && isActiveItem(active)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, isActiveItem]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && isActiveItem(active) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && isActiveItem(active) ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <XIcon />
            </motion.button>
            <div ref={ref}>
              {renderExpandedContent(active, id)}
            </div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className=" w-full gap-4">
        {items.map((item, index) => (
          <div key={index} onClick={() => setActive(item)}>
            {renderItem(item, id)}
          </div>
        ))}
      </ul>
    </>
  );
}