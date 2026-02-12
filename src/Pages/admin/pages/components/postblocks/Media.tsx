import {
    Box,
    Dialog,
    IconButton,
    SxProps,
    Typography,
  } from "@mui/material";
  import { BlockType } from "../../../../../types/blocks";
  import { useCallback, useEffect, useState } from "react";
  import { PostCreateType, PostType } from "../../../../../types/posts";
  import { ActionButtons } from ".././ActionButtons";
import { MediaType } from "../../../../../types/media";
import { Close, CloudUploadOutlined } from "@mui/icons-material";
import MediaLibraryModal from "../../../media/MediaLibraryModal";
import { useUpdatePostMutation } from "../../../../../store/api/posts.api";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { EditorState, FORMAT_TEXT_COMMAND } from "lexical";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
  
  const capitalizeText = (text: string) => {
    const allTexts = text.split(" ");
    return allTexts.map((t) => t[0].toUpperCase() + t.substring(1)).join(" ");
  };
  
  
  type Props = {
    page: PostType;
    setPage: React.Dispatch<React.SetStateAction<PostType>>;
    element: BlockType,
    index: number;
    disableApiSync?: boolean;
  };

  type Media = {
      media: MediaType | null;
      type: string;
      modal: boolean;
    };

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
  };
  
  const MediaBlock = ({ page, setPage, element, index, disableApiSync = false }: Props) => {

    const [updatePost] = useUpdatePostMutation();

    const [activeBlock, setActiveBlock] = useState<BlockType>();
    const [media, setMediaData] = useState<Media>({
      media: null,
      type: element.type == "map"? "image" : element.type,
      modal: false,
    });

    useEffect(()=>{
        handlePositionChange(index+1, element.randomId)
    }, [index])
  
    const updateBlock = (newBlock: BlockType) => {
      setPage((prev) => {
        if (!prev) return prev;
  
        const updatedBlocks = prev.blocks.map((block) =>
          block.randomId === newBlock.randomId ? newBlock : block
        );
  
        return {
          ...prev,
          blocks: updatedBlocks,
        };
      });
    };

    const handlePositionChange = (
        position: number,
        randomId: string | null | undefined
      ) => {
        const foundBlock = page.blocks.find((block) => block.randomId === randomId);
        if (foundBlock) {
          const newBlock: BlockType = {
            ...foundBlock,
            position: position
          };
          updateBlock(newBlock);
        }
      };

      const handleCaptionChange = useCallback(
        (_editorState: EditorState, randomId: string | null | undefined) => {
          const json = JSON.stringify(_editorState.toJSON());
          const foundBlock = page.blocks.find((block) => block.randomId === randomId);
          if (foundBlock) {
            const newBlock: BlockType = {
              ...foundBlock,
              caption: json,
            };
            updateBlock(newBlock);
          }
        },
        [page, updateBlock]
      );

      const getInitialCaptionState = () => {
        if (!element.caption || element.caption.trim() === "") {
          return undefined;
        }
        try {
          return JSON.parse(element.caption);
        } catch {
          return undefined;
        }
      };

      const handleOpenModal = (type: string) => {
            setMediaData((prev) => ({ ...prev, modal: true, type }));
          };
        
      const handleCloseModal = () =>
        setMediaData((prev) => ({ ...prev, modal: false }));
    
      const handleOpenMediaSelect = (block: BlockType, type: string) => {
        setActiveBlock(block);
        handleOpenModal(type);
      };
      
      const handleSelectImage = async (media: MediaType, blockId: number) => {
            if (page) {
              try {
                const blocks = page.blocks.map((b) => {
                  if (b.id === blockId)
                    return {
                      ...b,
                      media: [{ id: media.id }],
                    };
                  return b;
                });

                setPage((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    blocks: prev.blocks.map((b) =>
                      b.id === blockId ? { ...b, media: [media] } : b
                    ),
                  };
                });

                if (!disableApiSync) {
                  const payload: PostCreateType = {
                    ...page,
                    blocks: blocks,
                    categories: page.categories?.map((cat) => cat.name),
                    tags: page.tags?.map((cat) => cat.name),
                  };

                  updatePost(payload).unwrap();
                }
              } catch (error) {
                console.log(error);
              }
              handleCloseModal();
            }
          };
  
    return (
      <>
      <Dialog
          open={media.modal}
          onClose={handleCloseModal}
          scroll="body"
          sx={{
            ".MuiPaper-root": { maxWidth: "100% !important" },
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              width: "min(100vw, 1000px)",
            }}
          >
            <Box sx={{ padding: "1rem 1rem 0 0", textAlign: "end" }}>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </Box>
            <MediaLibraryModal
              key="modal-2"
              selectMedia={(media) =>
                handleSelectImage(media, activeBlock?.id as number)
              }
              mediaType={media.type}
            />
          </Box>
        </Dialog>

          <Box sx={imageEl}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <Typography variant="h5" id={`element-${element.id}`}>
                {capitalizeText(element.type)}
              </Typography>
              <ActionButtons block={element} setPage={setPage} />
            </Box>
            <Box
              id={`element-${element.id}`}
              className="image_el dashed_border"
              onClick={() => handleOpenMediaSelect(element, element.type == "map"? "image":element.type)}
            >
              {element.media?.length && (element.media[0] as MediaType)?.url ? (
                <Box
                  className="hide_scrollbar"
                  sx={{
                    display: "flex",
                    gap: "10px",
                    height: "100%",
                    maxWidth: "550px",
                    overflow: "auto",
                    ">div": {
                      flexShrink: "0",
                      height: "100%",
                      width: "100px",
                    },
                  }}
                >
                  {element.media?.map((m) => (
                    <Box className="has_bg_image" key={`media-${m?.id}`}>
                      {element.type === "image" || element.type === "map" ? (
                        <img
                          className="bg"
                          src={(m as MediaType).url}
                          alt={(m as MediaType).name}
                        />
                      ) : (
                        <video>
                          <source src={(m as MediaType).url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    width: "100%",
                  }}
                >
                  <CloudUploadOutlined /> Drag and drop your {element.type} here or
                  browse
                </Box>
              )}
            </Box>
            {element.type === "image" ? (
              <Box sx={{ marginTop: "1rem" }}>
                <Typography variant="subtitle2" sx={{ marginBottom: "0.5rem" }}>
                  Caption
                </Typography>
                <Box
                  sx={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    backgroundColor: "#fff",
                  }}
                >
                  <LexicalComposer
                    initialConfig={{
                      namespace: "ImageCaptionEditor",
                      theme: editorTheme,
                      onError: (error: Error) => console.error(error),
                      nodes: [HeadingNode, QuoteNode, ListItemNode, ListNode, AutoLinkNode, LinkNode],
                      editorState: getInitialCaptionState(),
                    }}
                  >
                    <CaptionToolbar />
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable className="editor-input" />
                      }
                      placeholder={
                        <Typography variant="body2" color="text.secondary">
                          Write a caption...
                        </Typography>
                      }
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <OnChangePlugin
                      onChange={(editorState) =>
                        handleCaptionChange(editorState, element.randomId)
                      }
                    />
                  </LexicalComposer>
                </Box>
              </Box>
            ) : null}
          </Box>
          </>
          );
    };

  const CaptionToolbar = () => {
    const [editor] = useLexicalComposerContext();
    return (
      <Box sx={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
        <IconButton size="small" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
          <FormatBoldIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
          <FormatItalicIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
          <FormatUnderlinedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
          <FormatListNumberedIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

    const imageEl: SxProps = {
      alignItems: "center",
      padding: "1rem",
    
      ".image_el": {
        alignItems: "center",
        backgroundColor: "rgba(204, 204, 204, 0.3)",
        borderRadius: "var(--border-radius)",
        cursor: "pointer",
        display: "flex",
        gap: "1rem",
        height: "100px",
        padding: "1rem",
      },
    };
    

  export default MediaBlock;
