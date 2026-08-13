"use client";

import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";

interface MdxRendererProps {
  code: string;
  className?: string;
}

export function MdxRenderer({ code, className }: MdxRendererProps) {
  const Content = useMemo(() => {
    try {
      const fn = new Function(code);
      const result = fn({ jsx });
      return result?.default ?? null;
    } catch {
      return null;
    }
  }, [code]);

  if (!Content) return null;

  return (
    <div className={className}>
      <Content components={{}} />
    </div>
  );
}
