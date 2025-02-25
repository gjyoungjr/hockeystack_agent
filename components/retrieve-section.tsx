"use client";

import { Section, ToolArgsSection } from "@/components/section";
import { SearchResults } from "@/components/search-results";
import { ToolInvocation } from "ai";
import { DefaultSkeleton } from "./default-skeleton";
import { CollapsibleMessage } from "./collapsible-message";
import ReactMarkdown from "react-markdown";
import { MemoizedReactMarkdown } from "./ui/markdown";
import { Citing } from "./custom-link";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";

interface RetrieveSectionProps {
  tool: ToolInvocation;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RetrieveSection({
  tool,
  isOpen,
  onOpenChange,
}: RetrieveSectionProps) {
  const isLoading = tool.state === "call";
  const data = tool.state === "result" ? tool.result : undefined;
  const url = tool.args.url as string | undefined;

  const header = (
    <ToolArgsSection tool="getJourneyInsights">{url}</ToolArgsSection>
  );

  console.log("data", data);

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {!isLoading && data ? (
        <Section title="Sources">
          <MemoizedReactMarkdown
            rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
            remarkPlugins={[remarkGfm]}
            className={cn(
              "prose-sm prose-neutral prose-a:text-accent-foreground/50"
            )}
            components={{
              a: Citing,
            }}
          >
            {data}
          </MemoizedReactMarkdown>
        </Section>
      ) : (
        <DefaultSkeleton />
      )}
    </CollapsibleMessage>
  );
}

export default RetrieveSection;
