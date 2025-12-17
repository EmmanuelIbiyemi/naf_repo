import { Box, SxProps, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { Post } from "../types/announcements";

const imageContainerStyles: SxProps = {
  position: "relative",
  img: {
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
};

type Props = {
  blocks: Post["blocks"];
};

const BlockBuilder = ({ blocks }: Props) => {
  return (
    <>
      {blocks.map((block, index) => {
        let title = "";
        if (block.content) title = block.content.split("::")[0];
        if (block.type === "image")
          return block?.media.map((m, i) => (
            <Box
              key={`block-${index + 1}`}
              sx={{
                ...imageContainerStyles,
                width: "100%",
              }}
            >
              <img
                src={m?.url}
                key={`block-image-${index + 1}-${i + 1}`}
                alt={m.name}
              />
            </Box>
          ));
        else if (block.type === "heading")
          return (
            <Typography
              key={`block-${index + 1}`}
              variant="h3"
              component="h2"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
            />
          );
        else if (block.type === "text")
          return (
            <Typography
              key={`block-${index + 1}`}
              sx={{ marginBottom: "1rem" }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
            />
          );
        else if (block.type === "title")
          return (
            <Typography
              key={`block-${index + 1}`}
              variant="h3"
              component="h2"
              sx={{ fontWeight: 500 }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
            />
          );
        else if (block.type === "subtitle")
          return (
            <Typography
              key={`block-${index + 1}`}
              sx={{ margin: ".5rem 0 2.5rem !important" }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
            />
          );
        else if (block.type === "big space")
          return (
            <Box
              sx={{ marginTop: { xs: "4rem", md: "8rem" } }}
              key={`block-${index + 1}`}
            />
          );
        else if (block.type === "small space")
          return <Box sx={{ marginTop: "2rem" }} key={`block-${index + 1}`} />;
      })}
    </>
  );
};

export default BlockBuilder;
