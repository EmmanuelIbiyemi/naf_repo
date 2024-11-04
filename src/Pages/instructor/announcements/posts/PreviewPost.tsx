import { Box, Button, SxProps, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addAnnouncement,
  selectCurrentAnnouncement,
} from "../../../../store/announcement.slice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import PostBuilder from "../../../admin/application copy/components/PostBuilder";
import { ParticipantData } from "../../../../types/participants";
import ShareWithModal from "../../../../components/ShareWithModal";

const PreviewPostPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedAnnouncement = useAppSelector(selectCurrentAnnouncement);
  const [openShareModal, setOpenShareModal] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    if (selectedAnnouncement) {
      dispatch(addAnnouncement(selectedAnnouncement));
      setOpenShareModal(true);
    }
  };

  return (
    <Box sx={formContentContainerStyles}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h4" sx={{ fontSize: "1.4rem" }}>
            Preview & Share
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", color: "#9A9A9A" }}
          >
            Preview the posts that you have created and share it
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={() => navigate(-1)}>Back</Button>
          <Button variant="contained" onClick={handleShare}>
            Share
          </Button>
        </Box>
      </Box>
      <Box ref={elRef}>
        <ShareWithModal
          open={openShareModal}
          handleClose={() => setOpenShareModal(false)}
          participants={dummyParticipants}
        />
      </Box>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            <span
              dangerouslySetInnerHTML={{
                __html: selectedAnnouncement?.title || "",
              }}
            />
          </Typography>
        </Box>
        <Box sx={dropAreaStyles}>
          {selectedAnnouncement ? (
            <PostBuilder
              post={selectedAnnouncement}
              setPost={() => {}}
              allowDelete={false}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

const dummyParticipants: ParticipantData[] = [
  {
    id: 1,
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    matric_number: "MAT001",
    level: "300",
    photo: "https://example.com/photo1.jpg",
    signature: "https://example.com/sig1.jpg",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    courses: {
      data: [],
    },
  },
  {
    id: 2,
    user_id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    address: "456 Oak Ave",
    matric_number: "MAT002",
    level: "400",
    photo: "https://example.com/photo2.jpg",
    signature: "https://example.com/sig2.jpg",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    courses: {
      data: [],
    },
  },
  {
    id: 3,
    user_id: 3,
    first_name: "Michael",
    last_name: "Johnson",
    email: "michael.j@example.com",
    phone: "+1122334455",
    address: "789 Pine Rd",
    matric_number: "MAT003",
    level: "200",
    photo: "https://example.com/photo3.jpg",
    signature: "https://example.com/sig3.jpg",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    courses: {
      data: [],
    },
  },
];

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
