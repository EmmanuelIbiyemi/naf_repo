import {
  Box,
  SxProps,
} from "@mui/material";
import { BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";
import HeadingBlock from "./postblocks/Heading";
import DefaultBlock from "./postblocks/Default";
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


type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

const PageBuilder = ({ page, setPage }: Props) => {
  
  const displayEl = (element: BlockType, index: number) => {
    let el;

    switch (element.type) {
      case "heading":
      case "subheading":
      case "link":
        el =<HeadingBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "text":
        el =<TextBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "image":
      case "video":
      case "map":
        el =<MediaBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "banner":
        el =<BannerBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "link page":
        el =<LinkPageBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "link url":
      case "button link":
        el =<LinkUrlBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "link social":
        el =<LinkSocialBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "contacts":
        el =<ContactsBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "left card":
      case "right card":
        el =<CardBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "post carousel":
        el =<PostCarouselBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "post cards":
        el =<PostCardsBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "margin":
        el =<MarginBlock page={page} setPage={setPage} element={element} index={index}/>
        break
    }

    return (
      <Box key={`element-${element.id + index}`} className="element">
        {el}
      </Box>
    );
  };
  return <Box sx={formBuilderStyles}>
            {page.blocks?.map((el, index) => displayEl(el, index))}
        </Box>
}

  
export default PageBuilder;

const formBuilderStyles: SxProps = {
  padding: "1.5rem 1rem",

  ".element": {
    border: "1px solid transparent",
    borderRadius: "var(--border-radius)",
    position: "relative",
    transition: ".3s",

    "&:hover": {
      borderColor: "rgba(43, 135, 251, 1)",
    },
    ">*": {
      flexShrink: 0,
      padding: ".7rem 1rem",
    },

    ".MuiIconButton-root": {
      bgcolor: "rgba(170, 170, 170, 1)",
      color: "#fff",
      height: "35px",
      padding: "8px",
      width: "35px",
    },
  },

  ".MuiIconButton-root.delete_btn": {
    bgcolor: "rgba(229, 72, 77, 1)",
  },
};