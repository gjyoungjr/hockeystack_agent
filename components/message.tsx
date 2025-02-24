/* eslint-disable */
"use client";

import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Citing } from "./custom-link";
import { MemoizedReactMarkdown } from "./ui/markdown";

export function BotMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  // Check if the content contains LaTeX patterns
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    message || ""
  );

  // Modify the content to render LaTeX equations if LaTeX patterns are found
  const processedData = preprocessLaTeX(message || "");

  if (containsLaTeX) {
    return (
      <MemoizedReactMarkdown
        rehypePlugins={[
          [rehypeExternalLinks, { target: "_blank" }],
          [rehypeKatex],
        ]}
        remarkPlugins={[remarkGfm, remarkMath]}
        className={cn(
          "prose-sm prose-neutral prose-a:text-accent-foreground/50",
          className
        )}
      >
        {processedData}
      </MemoizedReactMarkdown>
    );
  }

  return (
    <MemoizedReactMarkdown
      rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
      remarkPlugins={[remarkGfm]}
      className={cn(
        "prose-sm prose-neutral prose-a:text-accent-foreground/50",
        className
      )}
      components={{
        a: Citing,
      }}
    >
      {message}
    </MemoizedReactMarkdown>
  );
}

// Preprocess LaTeX equations to be rendered by KaTeX
// ref: https://github.com/remarkjs/react-markdown/issues/785
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  );
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};
