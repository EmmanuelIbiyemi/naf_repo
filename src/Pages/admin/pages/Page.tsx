import { Box, Button, SxProps, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import PageBuilder from "./components/PageBuilder";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddPostMutation,
  useUpdatePostMutation,
  useGetPostCategoriesByTagQuery,
} from "../../../store/api/posts.api";
import { PostType, PostCreateType } from "../../../types/posts";
import { pageElements } from "./elements/page-elements";
import { BlockType } from "../../../types/blocks";
import LoadingScreen from "../../../components/LoadingScreen";

const Page = () => {
  const navigate = useNavigate();
  const { name: pageName } = useParams();
  const [addPost] = useAddPostMutation();
  const [updatePost, updateState] = useUpdatePostMutation();

  const { data: pageData, isFetching } = useGetPostCategoriesByTagQuery(
    pageName as string,
    { skip: !pageName }
  );

  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    const initializePost = async () => {
      if (!pageName) return;

      if (pageData?.post?.[0]) {
        setPost(pageData.post[0]);
      } else if (!pageData?.post?.[0]) {
        try {
          const newPost: PostCreateType = {
            title: pageName,
            slug: pageName.toLowerCase(),
            blocks: [],
            categories: ["page", pageName],
            tags: ["page", pageName],
            featured_image: "",
          };

          const result = await addPost(newPost).unwrap();
          if (result.post) {
            setPost(result.post);
          }
        } catch (error) {
          console.error("Failed to create post:", error);
        }
      }
    };

    initializePost();
  }, [pageData, pageName, addPost]);

  const addBlock = useCallback((type: string) => {
    setPost((prev) => {
      if (!prev) return null;
      const content = pageElements.find((el) => el.type === type)?.name ?? "";
      const newBlock: BlockType = {
        id: +(Date.now() + "0000"),
        content: `${content}::::`,
        type,
        caption: "",
        link: "",
        media: [],
        position: prev.blocks[prev.blocks?.length - 1].position + 1,
        title: "",
      };

      return {
        ...prev,
        blocks: [...(prev.blocks ?? []), newBlock],
      };
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!post) return;
    const payload: PostCreateType = {
      ...post,
      blocks: post.blocks.map((b) =>
        b.id.toString().endsWith("0000")
          ? {
              ...b,
              id: 0,
            }
          : b
      ),
      categories: post.categories?.map((cat) => cat.name),
      tags: post.tags?.map((tag) => tag.name),
    };

    try {
      await updatePost(payload).unwrap();
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  }, [post, updatePost]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Box sx={contentStyles}>
      {updateState.isLoading || isFetching ? <LoadingScreen /> : null}
      <Box sx={{ paddingBottom: "2rem" }}>
        <Box sx={headerStyles}>
          <Button onClick={handleBack}>Back</Button>
          <Button variant="contained" onClick={handleSave} disabled={!post}>
            Save Changes
          </Button>
        </Box>
        <Box sx={blockContainerStyles}>
          {post && (
            <PageBuilder
              page={post}
              setPage={(newPost) => {
                if (typeof newPost === "function") {
                  setPost((prev) => {
                    if (!prev) return prev;
                    return newPost(prev);
                  });
                } else {
                  setPost(newPost);
                }
              }}
            />
          )}
        </Box>
      </Box>
      <Box sx={sidebarContentStyles}>
        <Box>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Blocks
          </Typography>
          <Box sx={elementSideBar}>
            {pageElements.map((el, i) => (
              <Button
                key={el.id + "-" + i}
                onClick={() => addBlock(el.type)}
                disabled={!post}
              >
                <el.icon />
                <span>{el.name}</span>
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;

const contentStyles: SxProps = {
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "1fr 300px",
  paddingInline: "2rem 0rem",
  height: "100%",
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem",
};

const blockContainerStyles: SxProps = {
  bgcolor: "#fff",
  border: "1px solid rgba(204, 204, 204, 0.5)",
  borderRadius: "var(--border-radius)",
  minHeight: "50%",
};

const sidebarContentStyles: SxProps = {
  bgcolor: "#fff",
  borderLeft: "1px solid rgba(204, 204, 204, 0.5)",

  ">div": { position: "sticky", top: 0, padding: "1rem" },
};

const elementSideBar: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "1fr 1fr",
  gridAutoRows: "100px",

  button: {
    bgcolor: "rgba(245, 245, 245, 1)",
    color: "inherit",
    display: "grid",
    placeContent: "center",
    placeItems: "center",
  },
};
