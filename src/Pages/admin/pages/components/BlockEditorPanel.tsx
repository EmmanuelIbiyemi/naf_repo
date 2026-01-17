import { Box } from "@mui/material";
import { BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";
import HeadingBlock from "./postblocks/Heading";
import MediaBlock from "./postblocks/Media";
import BannerBlock from "./postblocks/Banner";
import CardBlock from "./postblocks/Card";
import TextBlock from "./postblocks/Text";
import LinkPageBlock from "./postblocks/LinkPage";
import LinkUrlBlock from "./postblocks/LinkUrl";
import LinkSocialBlock from "./postblocks/LinkSocial";
import ContactsBlock from "./postblocks/Contacts";
import PostCarouselBlock from "./postblocks/PostCarousel";
import PostCardsBlock from "./postblocks/PostCards";
import MarginBlock from "./postblocks/Margin";
import DropdownBlock from "./postblocks/Dropdown";
import BlockStyleFields from "./postblocks/BlockStyleFields";
import BlockTypeSelector from "./BlockTypeSelector";
import RichTextBlock from "./postblocks/RichText";
import GalleryBlock from "./postblocks/Gallery";
import FeatureGridBlock from "./postblocks/FeatureGrid";
import AccordionBlock from "./postblocks/Accordion";

type Props = {
  block: BlockType;
  index: number;
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  showAppearance?: boolean;
};

const BlockEditorPanel = ({ block, index, page, setPage, showAppearance = true }: Props) => {
  let el: React.ReactNode = null;
  const isRowBlock = block.settings?.layout === "row" && block.settings?.rowId;

  switch (block.type) {
    case "heading":
    case "subheading":
    case "link":
      el = <HeadingBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "text":
      el = <TextBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "image":
    case "video":
    case "map":
      el = <MediaBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "banner":
      el = <BannerBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "link page":
      el = <LinkPageBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "link url":
    case "button link":
      el = <LinkUrlBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "link social":
      el = <LinkSocialBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "dropdown":
      el = <DropdownBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "contacts":
      el = <ContactsBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "left card":
    case "right card":
      el = <CardBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "post carousel":
      el = <PostCarouselBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "post cards":
      el = <PostCardsBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "rich text":
      el = <RichTextBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "gallery":
      el = <GalleryBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "feature grid":
      el = <FeatureGridBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "accordion":
      el = <AccordionBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    case "margin":
      el = <MarginBlock page={page} setPage={setPage} element={block} index={index} />;
      break;
    default:
      el = null;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: "1rem",
        ...(isRowBlock
          ? {
              ".move_up_btn, .move_down_btn": { display: "none" },
              ".delete_btn": { height: "28px", width: "28px", padding: "4px" },
            }
          : {}),
      }}
    >
      <BlockTypeSelector block={block} setPage={setPage} />
      {el}
      {showAppearance ? (
        <BlockStyleFields block={block} blocks={page.blocks} setPage={setPage} />
      ) : null}
    </Box>
  );
};

export default BlockEditorPanel;
