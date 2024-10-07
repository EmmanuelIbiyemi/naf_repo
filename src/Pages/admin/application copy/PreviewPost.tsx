import { Box, Button, SxProps, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../../components/SuccessModal";
import PostBuilder from "./components/PostBuilder";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addPost, selectCurrentPost } from "../../../store/posts.slice";

const PreviewPostPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector(selectCurrentPost);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <Box sx={formContentContainerStyles}>
      <Box ref={elRef}>
        <SuccessModal
          actions={{
            proceed: () => {
              if (selectedPost) dispatch(addPost(selectedPost));
              navigate("/posts");
            },
            undo: () => {
              console.log("undo");
            },
          }}
          close={() => setOpenModal(false)}
          infoText="This form will be displayed publicly."
          open={openModal}
          subTitle={`You have successfully added a new form to your school.`}
          title="Updates Successful"
        />
      </Box>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            <span
              dangerouslySetInnerHTML={{ __html: selectedPost?.title || "" }}
            />
          </Typography>
        </Box>
        <Box sx={dropAreaStyles}>
          {selectedPost ? (
            <PostBuilder
              post={selectedPost}
              setPost={() => {}}
              allowDelete={false}
            />
          ) : null}
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Button onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" onClick={handleOpenModal}>
          Share
        </Button>
      </Box>
    </Box>
  );
};

export default PreviewPostPage;

const formContentContainerStyles: SxProps = {
  display: "grid",
  padding: "2rem",
  placeItems: "center",

  "&, label": {
    color: "#000",
  },
};

const dropContainerStyles: SxProps = {
  bgcolor: "#fff",
  boxShadow: "0px 5px 10px rgba(150,150,150,0.3)",
  marginInline: "auto",
  width: "30vw",
};

const dropAreaStyles: SxProps = {
  display: "grid",
  paddingInline: "2rem",
  placeItems: "center",
  paddingBlock: "2rem",

  ">div": {
    width: "100%",
    marginBottom: "1rem",
  },

  ".MuiInputBase-root": {
    bgcolor: "rgba(248, 250, 252, 1)",
    border: "1px solid rgba(204, 204, 204, 1)",
    borderRadius: "4px",
  },

  ".MuiFormLabel-root": {
    marginBottom: ".6rem",
  },
};
