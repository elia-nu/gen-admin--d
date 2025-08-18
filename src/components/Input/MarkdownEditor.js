import React from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

// Initialize markdown parser
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function MarkdownEditor({
  value,
  onChange,
  placeholder = "Enter your content here...",
  height = 400,
  labelTitle,
  containerStyle = "",
}) {
  const handleEditorChange = ({ html, text }) => {
    // Return both HTML and markdown text
    onChange(text, html);
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      {labelTitle && (
        <label className="label">
          <span className="label-text text-base-content">{labelTitle}</span>
        </label>
      )}
      <div className="markdown-editor-wrapper">
        <MdEditor
          value={value || ""}
          style={{ height: `${height}px` }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
          placeholder={placeholder}
          config={{
            view: {
              menu: true,
              md: true,
              html: true,
            },
            canView: {
              menu: true,
              md: true,
              html: true,
              fullScreen: false,
              hideMenu: false,
            },
          }}
          plugins={[
            "header",
            "font-bold",
            "font-italic",
            "font-underline",
            "font-strikethrough",
            "list-unordered",
            "list-ordered",
            "block-quote",
            "block-wrap",
            "block-code-inline",
            "block-code-block",
            "table",
            "image",
            "link",
            "clear",
            "logger",
            "mode-toggle",
            "full-screen",
          ]}
        />
      </div>
    </div>
  );
}

export default MarkdownEditor;
