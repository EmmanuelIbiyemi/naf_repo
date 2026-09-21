import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageNode } from "./ImageNode";

interface ImageComponentProps {
  src: string;
  altText: string;
  width: "inherit" | number;
  height: "inherit" | number;
  maxWidth: number;
  nodeKey: NodeKey;
}

const ImageComponent = ({
  src,
  altText,
  width,
  height,
  maxWidth,
  nodeKey,
}: ImageComponentProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const [editor] = useLexicalComposerContext();
  const [imageSize, setImageSize] = useState({
    width: width === "inherit" ? 0 : width,
    height: height === "inherit" ? 0 : height,
  });

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        payload.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if (node) {
          node.remove();
        }
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          if (event.target === imageRef.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = imageRef.current?.offsetWidth || 0;
    const startHeight = imageRef.current?.offsetHeight || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("e")) {
        newWidth = Math.max(100, startWidth + deltaX);
      } else if (direction.includes("w")) {
        newWidth = Math.max(100, startWidth - deltaX);
      }

      if (direction.includes("s")) {
        newHeight = Math.max(100, startHeight + deltaY);
      } else if (direction.includes("n")) {
        newHeight = Math.max(100, startHeight - deltaY);
      }

      // Maintain aspect ratio for corner resizing
      if (direction.length === 2) {
        const aspectRatio = startWidth / startHeight;
        newHeight = newWidth / aspectRatio;
      }

      setImageSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      
      // Update the node with new dimensions
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node instanceof ImageNode) {
          const writable = node.getWritable();
          writable.__width = imageSize.width;
          writable.__height = imageSize.height;
        }
      });

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    // Initialize image size from props
    if (imageRef.current && width === "inherit") {
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  }, [width]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        margin: "1em 0",
        userSelect: "none",
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        draggable={false}
        style={{
          maxWidth: maxWidth ? `${maxWidth}px` : "100%",
          width: imageSize.width === 0 ? "100%" : `${imageSize.width}px`,
          height: imageSize.height === 0 ? "auto" : `${imageSize.height}px`,
          display: "block",
          cursor: isSelected ? "default" : "pointer",
          outline: isSelected ? "2px solid #1a73e8" : "none",
          outlineOffset: "2px",
        }}
      />
      
      {isSelected && !isResizing && (
        <>
          {/* Corner resize handles */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "nw")}
            style={{
              position: "absolute",
              top: -4,
              left: -4,
              width: 8,
              height: 8,
              backgroundColor: "#1a73e8",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "nw-resize",
              zIndex: 10,
            }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "ne")}
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 8,
              height: 8,
              backgroundColor: "#1a73e8",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "ne-resize",
              zIndex: 10,
            }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "sw")}
            style={{
              position: "absolute",
              bottom: -4,
              left: -4,
              width: 8,
              height: 8,
              backgroundColor: "#1a73e8",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "sw-resize",
              zIndex: 10,
            }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "se")}
            style={{
              position: "absolute",
              bottom: -4,
              right: -4,
              width: 8,
              height: 8,
              backgroundColor: "#1a73e8",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "se-resize",
              zIndex: 10,
            }}
          />

          {/* Edge resize handles */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "n")}
            style={{
              position: "absolute",
              top: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 8,
              height: 8,
              backgroundColor: "#1a73e8",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "n-resize",
              zIndex: 10,
            }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "s")}
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 8,
              height: 8,
              backgroundColor: "#1a73e8",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "s-resize",
              zIndex: 10,
            }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "w")}
            style={{
              position: "absolute",
              left: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              backgroundColor: "#1a73e8",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "w-resize",
              zIndex: 10,
            }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "e")}
            style={{
              position: "absolute",
              right: -4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              backgroundColor: "#1a73e8",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "e-resize",
              zIndex: 10,
            }}
          />
        </>
      )}
    </div>
  );
};

export default ImageComponent;
