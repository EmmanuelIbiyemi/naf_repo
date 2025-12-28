import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import "./GoogleDocsEditor.css";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import FloatingToolbarPlugin from "./plugins/FloatingToolbarPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import SlashCommandPlugin from "./plugins/SlashCommandPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import DragDropPastePlugin from "./plugins/DragDropPastePlugin";
import { ImageNode } from "./nodes/ImageNode";

interface GoogleDocsEditorProps {
  initialContent?: string;
  onChange?: (content: string, editorState: EditorState) => void;
  placeholder?: string;
  readOnly?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  onFileUpload?: (file: File) => Promise<{ url: string; name: string }>;
  onUpload?: (file: File) => Promise<{ url: string; id: number }>;
}

const editorTheme = {
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
  },
  list: {
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
  },
  link: "editor-link",
  code: "editor-code",
};

const GoogleDocsEditor = ({
  initialContent,
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  onImageUpload,
  onFileUpload,
  onUpload,
}: GoogleDocsEditorProps) => {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = useCallback((_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  }, []);

  // Parse initial content safely
  const getInitialEditorState = () => {
    if (!initialContent || initialContent.trim() === "") {
      return undefined; // Let Lexical create empty state
    }
    
    try {
      // Try to parse as JSON (Lexical state)
      JSON.parse(initialContent);
      return initialContent;
    } catch {
      // If not valid JSON, return undefined to start fresh
      console.warn("Invalid initial content, starting with empty editor");
      return undefined;
    }
  };

  const initialConfig = {
    namespace: "GoogleDocsEditor",
    theme: editorTheme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
    ],
    editorState: getInitialEditorState(),
    editable: !readOnly,
  };

  const handleEditorChange = (editorState: EditorState) => {
    if (onChange) {
      const json = JSON.stringify(editorState.toJSON());
      onChange(json, editorState);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F9FBFD",
      }}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              backgroundColor: "#F9FBFD",
              borderBottom: "1px solid #E8EAED",
            }}
          >
            <ToolbarPlugin 
              onImageUpload={onImageUpload}
              onFileUpload={onFileUpload}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingY: 3,
              backgroundColor: "#F9FBFD",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "816px",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  minHeight: "1056px",
                  padding: "96px",
                  position: "relative",
                  pageBreakAfter: "always",
                }}
                className="editor-page"
              >
                <Box ref={onRef} sx={{ position: "relative" }}>
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className="editor-input"
                        style={{
                          outline: "none",
                          fontSize: "11pt",
                          fontFamily: "Arial, sans-serif",
                          lineHeight: "1.6",
                          color: "#202124",
                        }}
                      />
                    }
                    placeholder={
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          color: "#80868B",
                          fontSize: "11pt",
                          pointerEvents: "none",
                        }}
                      >
                        {placeholder}
                      </Box>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <OnChangePlugin onChange={handleEditorChange} />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                  <ListPlugin />
                  <LinkPlugin />
                  <ImagesPlugin onUpload={onUpload} />
                  <DragDropPastePlugin onUpload={onUpload} />
                  <FloatingLinkEditorPlugin />
                  <SlashCommandPlugin />
                  {floatingAnchorElem && (
                    <FloatingToolbarPlugin anchorElem={floatingAnchorElem} />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </LexicalComposer>
    </Box>
  );
};

export default GoogleDocsEditor;
