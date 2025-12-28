import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from "lexical";
import { $createImageNode, ImagePayload } from "../nodes/ImageNode";
import { useEffect } from "react";

interface ImagesPluginProps {
  onUpload?: (file: File) => Promise<{ url: string; id: number }>;
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand();

const ImagesPlugin = ({ onUpload }: ImagesPluginProps): null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register command to insert images
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload: ImagePayload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
};

export default ImagesPlugin;
