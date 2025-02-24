"use client";

import { ToolInvocation } from "ai";
import RetrieveSection from "./retrieve-section";

interface ToolSectionProps {
  tool: ToolInvocation;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToolSection({ tool, isOpen, onOpenChange }: ToolSectionProps) {
  switch (tool.toolName) {
    case "retrieve":
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
