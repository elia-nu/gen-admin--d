import React from "react";
import ReactMarkdown from "react-markdown";

function MarkdownPreview({ content, maxLength = 100, className = "" }) {
  if (!content) return <span className="text-gray-500">No content</span>;

  // For table display, show only plain text preview
  const getTextContent = (markdown) => {
    // Remove markdown syntax for table preview
    return markdown
      .replace(/#{1,6}\s?/g, "") // Headers
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
      .replace(/\*([^*]+)\*/g, "$1") // Italic
      .replace(/`([^`]+)`/g, "$1") // Inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // Images
      .replace(/[-*+]\s/g, "") // List items
      .replace(/^\d+\.\s/gm, "") // Numbered lists
      .replace(/\n/g, " ") // Line breaks
      .trim();
  };

  const textContent = getTextContent(content);
  const truncatedText =
    textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <span className="text-sm">{truncatedText}</span>
    </div>
  );
}

// Full markdown renderer for detailed view
export function MarkdownRenderer({ content, className = "" }) {
  if (!content) return <div className="text-gray-500">No content</div>;

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default MarkdownPreview;
