/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import CustomPagination from "../../../components/CustomPagination";
import { useNavigate } from "react-router-dom";

interface ListItems {
  id: string | number;
  title: string;
  lastEdited: string;
  status: "sent" | "draft";
}

type ListProps = {
  lists: ListItems[];
  menu?: boolean;
  deleteIcon?: boolean;
  edit?: boolean;
  handleOpenActionsModal: (list: any, type: string) => void;
  handleEditActionsModal: (list: any) => void;
};

const ITEMS_PER_PAGE = 10;

const AnnouncementItemsList = ({
  lists,
  menu,
  deleteIcon,
  edit,
  handleOpenActionsModal,
  handleEditActionsModal,
}: ListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<
    string | number | null
  >(null);

  const navigate = useNavigate();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMenuItemId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedMenuItemId(null);
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, lists.length);
  const displayedList = lists.slice(startIndex, endIndex);

  return (
    <Box sx={{ bgcolor: "white", borderRadius: "8px" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            {displayedList.map((list) => (
              <TableRow
                key={list.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#F5F5F5" },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "#D1D1D1",
                      "&.Mui-checked": {
                        color: "#0F5FC2",
                      },
                    }}
                  />
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Box
                      onClick={() =>
                        navigate(`${list.id}`, { state: { lists } })
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#474747",
                          fontWeight: 400,
                          "&:hover": { color: "#0F5FC2" },
                        }}
                      >
                        {list.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          height: "20px",
                          color: list.status === "sent" ? "#489C21" : "#E5484D",
                          textTransform: "capitalize",
                        }}
                      >
                        {list.status}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "#9A9A9A" }}>
                        Last edited on {list.lastEdited}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ pr: 2 }}>
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    {edit && (
                      <IconButton
                        onClick={() => handleEditActionsModal(list)}
                        sx={{ color: "#757575" }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                    {deleteIcon && (
                      <IconButton
                        onClick={() => handleOpenActionsModal(list, "delete")}
                        sx={{ color: "#757575" }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                    {menu && (
                      <>
                        <IconButton
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(e) => handleClick(e, list.id)}
                          sx={{ color: "#757575" }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open && selectedMenuItemId === list.id}
                          onClose={handleClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          <MenuItem onClick={handleClose}>
                            View details
                          </MenuItem>
                          <MenuItem onClick={handleClose}>Edit</MenuItem>
                          <MenuItem
                            onClick={handleClose}
                            sx={{ color: "error.main" }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2 }}>
        <CustomPagination
          startIndex={startIndex + 1}
          endIndex={endIndex}
          totalNumber={lists.length}
          count={Math.ceil(lists.length / ITEMS_PER_PAGE)}
          page={currentPage}
          handleChangePage={handleChangePage}
        />
      </Box>
    </Box>
  );
};

export default AnnouncementItemsList;
