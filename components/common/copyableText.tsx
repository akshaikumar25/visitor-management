"use client";
import React from "react";
import { FaCopy } from "react-icons/fa";
import { MdCopyAll } from "react-icons/md";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface CopyableTextProps {
  text: string;
}

const CopyableText: React.FC<CopyableTextProps> = ({ text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!", {
          position: "top-right",
          dismissible: true,
        });
      },
      (err) => {
        toast.error("Failed to copy to clipboard", {
          position: "top-right",
          dismissible: true,
        });
      }
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span>{text}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost">
              <MdCopyAll
                className="cursor-pointer text-gray-500"
                onClick={handleCopy}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-theme">
            <p>Copy to Clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CopyableText;
