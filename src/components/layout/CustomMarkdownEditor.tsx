import { Box, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  ListsToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { Image as ImageIcon } from "@mui/icons-material";

type Props = {
  placeholder: string;
  value: string;
  minHeight?: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleImageUpload: (file: File) => any;
  isLoading: boolean;
};

const CustomMarkdownEditor = ({
  placeholder,
  value,
  minHeight,
  onChange,
  disabled,
  handleImageUpload,
  isLoading,
}: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const scrollSnapshotRef = useRef<
    { el: Element | Window; top: number; left: number }[]
  >([]);

  const getScrollableAncestors = (node: HTMLElement | null) => {
    const result: (Element | Window)[] = [];
    let current: HTMLElement | null = node;

    while (current) {
      const style = getComputedStyle(current);
      const canScrollY = /(auto|scroll)/.test(style.overflowY);
      const canScrollX = /(auto|scroll)/.test(style.overflowX);
      if ((canScrollY || canScrollX) && current.scrollHeight > current.clientHeight) {
        result.push(current);
      }
      current = current.parentElement;
    }

    result.push(window);
    return result;
  };

  const captureScrollPositions = () => {
    const container = editorContainerRef.current;
    if (!container) return;
    const targets = getScrollableAncestors(container);
    scrollSnapshotRef.current = targets.map((el) => {
      if (el === window) {
        return { el, top: window.scrollY, left: window.scrollX };
      }
      return { el, top: (el as Element).scrollTop, left: (el as Element).scrollLeft };
    });
  };

  const restoreScrollPositions = () => {
    scrollSnapshotRef.current.forEach(({ el, top, left }) => {
      if (el === window) {
        window.scrollTo({ top, left });
      } else {
        (el as Element).scrollTop = top;
        (el as Element).scrollLeft = left;
      }
    });
  };

  // Prevent scroll on block type changes
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    // Block editor-triggered auto scroll when changing block types or refocusing
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    const originalFocus = HTMLElement.prototype.focus;

    Element.prototype.scrollIntoView = function (arg?: boolean | ScrollIntoViewOptions) {
      if (container.contains(this)) {
        return;
      }
      originalScrollIntoView.call(this, arg);
    };

    HTMLElement.prototype.focus = function (options?: FocusOptions) {
      if (container.contains(this)) {
        return originalFocus.call(this, { ...options, preventScroll: true });
      }
      return originalFocus.call(this, options);
    };

    return () => {
      Element.prototype.scrollIntoView = originalScrollIntoView;
      HTMLElement.prototype.focus = originalFocus;
    };
  }, []);

  // Capture/restore scroll so heading changes don't jump the page
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    const handlePointerDown = () => captureScrollPositions();
    const handlePointerUp = () => {
      requestAnimationFrame(restoreScrollPositions);
    };

    container.addEventListener("pointerdown", handlePointerDown, true);
    container.addEventListener("pointerup", handlePointerUp, true);
    container.addEventListener("pointercancel", handlePointerUp, true);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown, true);
      container.removeEventListener("pointerup", handlePointerUp, true);
      container.removeEventListener("pointercancel", handlePointerUp, true);
    };
  }, []);

  const handleImageInsert = async (file: File) => {
    try {
      setIsUploading(true);
      const imageData = await handleImageUpload(file);

      const fileName = imageData[0]; // File name
      const fileURL = imageData[1]; // File URL

      const isImage = fileURL.match(/\.(jpg|jpeg|png|gif|svg)$/i);

      if (isImage) {
        // Insert image markdown at the end of current content
        const imageMarkdown = `\n\n![${fileName}](${fileURL})\n\n`;
        onChange(value + imageMarkdown);
      } else {
        // For other files, insert as link
        const linkMarkdown = `\n\n[${fileName}](${fileURL})\n\n`;
        onChange(value + linkMarkdown);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      ref={editorContainerRef}
      sx={{
        mx: "auto",
        mt: 2,
        bgcolor: "#fff",
        color: "#02306B",
        borderRadius: "8px",
        border: "1px solid #D1D1D6",
        overflow: "hidden",
        "& .mdxeditor": {
          minHeight: minHeight || "400px",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          scrollMarginTop: "0px !important",
        },
        "& .mdxeditor-toolbar": {
          backgroundColor: "#F5F5F7",
          borderBottom: "1px solid #D1D1D6",
          padding: "8px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        },
        "& .mdxeditor-root-contenteditable": {
          padding: "20px",
          fontSize: "15px",
          lineHeight: "1.7",
          color: "#1D1D1F",
          backgroundColor: "#fff",
          scrollMarginTop: "0px !important",
          scrollPaddingTop: "0px !important",
        },
        "& .mdxeditor-root-contenteditable *": {
          scrollMarginTop: "0px !important",
          scrollMarginBottom: "0px !important",
        },
        "& .mdxeditor-root-contenteditable h1": {
          fontSize: "2em",
          fontWeight: 700,
          marginTop: "1em",
          marginBottom: "0.5em",
          color: "#1D1D1F",
        },
        "& .mdxeditor-root-contenteditable h2": {
          fontSize: "1.75em",
          fontWeight: 700,
          marginTop: "1em",
          marginBottom: "0.5em",
          color: "#1D1D1F",
        },
        "& .mdxeditor-root-contenteditable h3": {
          fontSize: "1.5em",
          fontWeight: 600,
          marginTop: "1em",
          marginBottom: "0.5em",
          color: "#1D1D1F",
        },
        "& .mdxeditor-root-contenteditable p": {
          marginBottom: "1em",
        },
        "& .mdxeditor-root-contenteditable ul, & .mdxeditor-root-contenteditable ol": {
          paddingLeft: "2em",
          marginBottom: "1em",
        },
        "& .mdxeditor-root-contenteditable li": {
          marginBottom: "0.5em",
        },
        "& .mdxeditor-root-contenteditable code": {
          backgroundColor: "#F5F5F7",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "0.9em",
          fontFamily: "'SF Mono', 'Monaco', 'Courier New', monospace",
          color: "#02306B",
        },
        "& .mdxeditor-root-contenteditable pre": {
          backgroundColor: "#1E1E1E",
          padding: "1em",
          borderRadius: "8px",
          overflow: "auto",
          marginBottom: "1em",
        },
        "& .mdxeditor-root-contenteditable blockquote": {
          borderLeft: "4px solid #02306B",
          paddingLeft: "1em",
          marginLeft: 0,
          color: "#666",
          fontStyle: "italic",
        },
        "& .mdxeditor-root-contenteditable table": {
          borderCollapse: "collapse",
          width: "100%",
          marginBottom: "1em",
        },
        "& .mdxeditor-root-contenteditable th, & .mdxeditor-root-contenteditable td": {
          border: "1px solid #D1D1D6",
          padding: "8px 12px",
          textAlign: "left",
        },
        "& .mdxeditor-root-contenteditable th": {
          backgroundColor: "#F5F5F7",
          fontWeight: 600,
        },
        "& .mdxeditor-root-contenteditable img": {
          maxWidth: "100%",
          height: "auto",
          borderRadius: "8px",
          marginTop: "1em",
          marginBottom: "1em",
        },
        "& .mdxeditor-root-contenteditable a": {
          color: "#02306B",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #D1D1D6", bgcolor: "#F5F5F7" }}>
        <Button
          variant="outlined"
          component="label"
          size="small"
          startIcon={<ImageIcon />}
          sx={{
            color: "#02306B",
            borderColor: "#02306B",
            ":hover": {
              bgcolor: "#02306B10",
              borderColor: "#02306B",
            },
            textTransform: "none",
          }}
          disabled={isLoading || isUploading || disabled}
        >
          {isUploading ? "Uploading..." : "Upload Image/File"}
          <input
            type="file"
            hidden
            onChange={(e) => e.target.files && handleImageInsert(e.target.files[0])}
          />
        </Button>
      </Box>

      <MDXEditor
        markdown={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={disabled}
        autoFocus={false}
        contentEditableClassName="mdxeditor-content"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              javascript: "JavaScript",
              typescript: "TypeScript",
              python: "Python",
              css: "CSS",
              html: "HTML",
              json: "JSON",
            },
          }),
          diffSourcePlugin({ viewMode: "rich-text" }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <CreateLink />
                <ListsToggle />
                <InsertTable />
              </>
            ),
          }),
        ]}
      />
    </Box>
  );
};

export default CustomMarkdownEditor;
