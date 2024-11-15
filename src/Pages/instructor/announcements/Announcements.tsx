import { useEffect, useState } from "react";
import { useGetAnnouncementsQuery } from "../../../store/api/posts.api";
import { Box, Grid2, Pagination, Typography } from "@mui/material";
// import { Post } from "../../../types/announcements";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import BlockBuilder from "../../../components/BlockBuilder";

// const formatDateTime = (dateTimeString: string) => {
//   try {
//     const date = new Date(dateTimeString);

//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     const year = date.getFullYear();
//     const formattedDate = `${month}/${day}/${year}`;

//     let hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     const formattedTime = `${hours}:${minutes
//       .toString()
//       .padStart(2, "0")} ${ampm}`;

//     return {
//       date: formattedDate,
//       time: formattedTime,
//       fullDateTime: `${formattedDate} ${formattedTime}`,
//     };
//   } catch (error) {
//     console.error("Error formatting datetime:", error);
//     return {
//       date: "",
//       time: "",
//       fullDateTime: "",
//     };
//   }
// };

const AnnouncementsPage = () => {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Announcements"));
  }, [dispatch]);
  const { data, isLoading, isError } = useGetAnnouncementsQuery(
    "announcement",
    {
      skip: false,
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000, // Refetch every minute
    }
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h5">Loading announcements...</Typography>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h5">
          Error loading announcements. Please try again later.
        </Typography>
      </Box>
    );
  }

  // Now TypeScript knows data is defined and has the correct type
  const { post, pagination } = data;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Announcements
      </Typography>

      <Grid2 container spacing={3}>
        {/* {post.map((announcement: Post) => (
          <Grid2
            size={12}
            key={announcement.id}
            sx={{
              backgroundColor: "#fff",
              padding: "2em",
              borderRadius: "8px",
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Typography variant="body2" sx={{ alignSelf: "end" }}>
                  {formatDateTime(announcement.date).fullDateTime}
                </Typography>
                <Typography variant="h4" sx={{ alignSelf: "center" }}>
                  {announcement.title}
                </Typography>
              </Box>
              <Box>
                <Box>
                  {announcement.blocks.map((item) => (
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                        {item.content}
                      </Typography>
                      {item.media.map((mediaItem) => (
                        <img
                          src={mediaItem.url}
                          alt={mediaItem.name}
                          style={{ margin: "1em 0" }}
                        />
                      ))}
                      {item.link && item.link !== null && (
                        <Typography variant="body2">
                          Link:{" "}
                          <a href={item.link} target="_blank">
                            {item.link}
                          </a>
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid2>
        ))} */}
        {post.map((announcement) => (
          <BlockBuilder blocks={announcement.blocks} />
        ))}
      </Grid2>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pagination.pages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default AnnouncementsPage;
