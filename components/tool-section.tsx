"use client";

import { ToolInvocation } from "ai";
// import { VideoSearchSection } from './video-search-section'
import RetrieveSection from "./retrieve-section";

interface ToolSectionProps {
  tool: ToolInvocation;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToolSection({ tool, isOpen, onOpenChange }: ToolSectionProps) {
  switch (tool.toolName) {
    case "getJourneyInsights":
      return (
        <RetrieveSection
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      );
    default:
      return null;
  }
}
