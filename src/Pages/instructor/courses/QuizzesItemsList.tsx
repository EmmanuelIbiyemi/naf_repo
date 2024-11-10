import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import CustomPagination from "../../../components/CustomPagination";
import { useNavigate } from "react-router-dom";
import { InstructorQuizzesResponse } from "../../../types/quizzes";

type ListProps = {
  lists: InstructorQuizzesResponse[];
  menu?: boolean;
  deleteIcon?: boolean;
  edit?: boolean;
  handleOpenActionsModal: (
    list: InstructorQuizzesResponse,
    type: string
  ) => void;
  handleEditActionsModal: (list: InstructorQuizzesResponse) => void;
};

const ITEMS_PER_PAGE = 10;

const QuizzesItemsList = ({
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
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const handleNavigateToTest = (test: InstructorQuizzesResponse) => {
    navigate(`${test.id}`, {
      state: { selectedTest: test },
    });
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, lists.length);
  const displayedList = lists.slice(startIndex, endIndex);

  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            {displayedList.map((list) => (
              <TableRow
                key={list.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box
                    onClick={() => handleNavigateToTest(list)}
                    sx={{ cursor: "pointer" }}
                  >
                    <Typography variant="body2" sx={{ color: "#474747" }}>
                      {list.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {edit && (
                    <IconButton onClick={() => handleEditActionsModal(list)}>
                      <Edit />
                    </IconButton>
                  )}
                  {deleteIcon && (
                    <IconButton
                      onClick={() => handleOpenActionsModal(list, "delete")}
                    >
                      <Delete />
                    </IconButton>
                  )}
                  {menu && (
                    <IconButton
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <MoreVert />
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </Menu>
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomPagination
        startIndex={startIndex + 1}
        endIndex={endIndex}
        totalNumber={lists.length}
        count={Math.ceil(lists.length / ITEMS_PER_PAGE)}
        page={currentPage}
        handleChangePage={handleChangePage}
      />
    </Box>
  );
};

export default QuizzesItemsList;
