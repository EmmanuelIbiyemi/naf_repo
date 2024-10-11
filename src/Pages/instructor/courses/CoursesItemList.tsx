import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, Checkbox, IconButton, Menu, MenuItem } from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../../../components/CustomPagination";

interface ListType {
  id: number;
  name: string;
  created: string;
  modified: string;
}

type ListProps = {
  lists: ListType[];
  menu?: boolean;
  handleOpenActionsModal: (list: ListType, type: string) => void;
  handleEditActionsModal: (list: ListType) => void;
};

const ITEMS_PER_PAGE = 10;

const CoursesItemList = ({
  lists,
  menu,
  handleOpenActionsModal,
  handleEditActionsModal,
}: ListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, lists.length);
  const displayedList = lists.slice(startIndex, endIndex);

  return (
    <Box>
      <TableContainer>
        {/* ADD
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <CourseForm
          actions={{
            submit: handleEditCourse as CourseFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          course={selectedCourse}
        />
      </FormModal> */}

        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            {displayedList.map((list) => (
              <TableRow
                key={list.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                >
                  <Checkbox />
                  <Link
                    to={`${list.id}`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {list.name}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditActionsModal(list)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenActionsModal(list, "delete")}
                  >
                    <Delete />
                  </IconButton>
                  {menu && (
                    <IconButton
                      // onClick={() => handleOpenActionsModal(list, "delete")}
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

export default CoursesItemList;
