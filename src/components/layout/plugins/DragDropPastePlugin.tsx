import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { isMimeType, mediaFileReader } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";
import { $createLinkNode } from "@lexical/link";
import { $insertNodes, $getSelection, $isRangeSelection } from "lexical";

const ACCEPTABLE_IMAGE_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
];

interface DragDropPastePluginProps {
  onUpload?: (file: File) => Promise<{ url: string; id: number }>;
}

const DragDropPastePlugin = ({ onUpload }: DragDropPastePluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        (async () => {
          const filesResult = await mediaFileReader(
            files,
            [ACCEPTABLE_IMAGE_TYPES].flatMap((x) => x)
          );
          
          for (const { file } of filesResult) {
            if (!onUpload) {
              console.warn("No upload handler provided");
              continue;
            }

            try {
              const uploadedFile = await onUpload(file);
              
              if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
                // Insert image
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  altText: file.name,
                  src: uploadedFile.url,
                });
              } else {
                // Insert as link for non-image files
                editor.update(() => {
                  const selection = $getSelection();
                  if ($isRangeSelection(selection)) {
                    const linkNode = $createLinkNode(uploadedFile.url);
                    const textNode = document.createTextNode(file.name);
                    linkNode.append(textNode as any);
                    $insertNodes([linkNode]);
                  }
                });
              }
            } catch (error) {
              console.error("Upload failed:", error);
            }
          }
        })();
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onUpload]);

  return null;
};

export default DragDropPastePlugin;
