import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import CustomPagination from "../../../../components/CustomPagination";

interface NoteType {
  id: number;
  name: string;
  created: string;
  modified: string;
}

const ITEMS_PER_PAGE = 10;

const NotesList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<NoteType | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenModal = (course: NoteType, type: string) => {
    setSelectedCourse(course);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedCourse(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = (noteId: number) => {
    console.log(noteId);
    setOpenModal((prev) => ({ ...prev, delete: true }));
  };

  //   const handleEditCourse = async (note: NoteType) => {
  //     console.log(note);
  //     handleCloseModal("edit");
  //     handleOpenModal(note, "success");
  //   };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, notes.length);
  const displayedNotes = notes.slice(startIndex, endIndex);

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
        <DeleteConfirmationModal
          actions={{
            proceed: () => {
              if (selectedCourse) handleDelete(selectedCourse.id);
              console.log("proceed");
            },
            undo: () => {
              console.log("cancel");
            },
          }}
          close={() => handleCloseModal("delete")}
          infoText="The students enrolled in this Course will get notified."
          open={openModal.delete}
          subTitle={`Are you sure you want to delete Course <strong>"${selectedCourse?.name}"</strong>? You can't undo this action.`}
          title="Delete Course?"
        />

        <SuccessModal
          actions={{
            proceed: () => {
              console.log("proceed");
            },
            undo: () => {
              console.log("undo");
            },
          }}
          close={() => {
            handleCloseModal("success");
            setSelectedCourse(undefined);
          }}
          infoText=""
          open={openModal.success}
          subTitle={`You have successfully added a new Course <strong>"${selectedCourse?.name}"</strong>.`}
          title="Updates Successful"
        />

        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            {displayedNotes.map((note) => (
              <TableRow
                key={note.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                >
                  <Checkbox />
                  <Link
                    to={`notes/${note.id}`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {note.name}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenModal(note, "edit")}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenModal(note, "delete")}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomPagination
        startIndex={startIndex + 1}
        endIndex={endIndex}
        totalNumber={notes.length}
        count={Math.ceil(notes.length / ITEMS_PER_PAGE)}
        page={currentPage}
        handleChangePage={handleChangePage}
      />
    </Box>
  );
};

const notes = [
  {
    id: 1,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 2,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 3,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 4,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 5,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 6,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 7,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 8,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 9,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 10,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 11,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 12,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 13,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 14,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 15,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 16,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 17,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 18,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 19,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 20,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
  {
    id: 21,
    name: "B.Tech Specialization in Health Informatics",
    created: "22/09",
    modified: "25/09",
  },
];

export default NotesList;
