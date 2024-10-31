import { Box } from "@mui/material";
import {
  BoldItalicUnderlineToggles,
  InsertTable,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  imagePlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertThematicBreak,
  linkPlugin,
} from "@mdxeditor/editor";

type Props = {
  placeholder: string;
  value: string;
  minHeight?: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
};

const CustomMarkdownEditor = ({
  placeholder,
  value,
  minHeight,
  onChange,
  disabled,
}: Props) => {
  return (
    <Box
      sx={{
        maxWidth: "91vw",
        "& ._editorWrapper_1qea1_141": {
          border: "1px solid #E7EAE9",
          borderRadius: "10px",
          "& ._toolbarRoot_1qea1_147": {
            borderRadius: "10px 10px 0px 0px",
            backgroundColor: "#F9F9F9",
            borderBottom: "1px solid grey",
          },
          "& ._rootContentEditableWrapper_1qea1_1062": {
            "& ._contentEditable_1qea1_356": {
              backgroundColor: "#F9F9F9",
              borderRadius: "0px 0px 10px 10px",
              py: 4,
              px: 5,
              minHeigh: minHeight || "250px",
              // overflow: "scroll",
              "&._placeholder_1qea1_1049": {
                color: "#55555",
              },
            },
          },
          "& ._editorWrapper_uazmk_154": {
            border: "1px solid #E1E1E2",
          },
        },
      }}
    >
      <MDXEditor
        placeholder={placeholder}
        markdown={value}
        onChange={onChange}
        readOnly={disabled}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          imagePlugin(),
          tablePlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <InsertTable />
                <CreateLink />
                <InsertImage />
                <InsertThematicBreak />
              </>
            ),
          }),
        ]}
      />
    </Box>
  );
};

export default CustomMarkdownEditor;
