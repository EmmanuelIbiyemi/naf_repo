import {
  Box,
  FormControl,
  LinearProgress,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import InstructorPageHeader from "../../../../components/layout/InstructorPageHeader";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import { useNavigate } from "react-router-dom";
import { useGetInstructorCoursesQuery } from "../../../../store/api/courses.api";
import {
  useDeleteNoteMutation,
  useGetCourseNotesQuery,
} from "../../../../store/api/notes.api";
import CoursesItemList from "../CoursesItemList";
import CustomPagination from "../../../../components/CustomPagination";
import EmptyState from "../../../../components/EmptyState";
import NotesUploadModal from "./NotesUploadModal";
import CustomSuccessModal from "../../../../components/CustomSuccessModal";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import CustomPreviewModal from "../../../../components/CustomPreviewModal";
import { note } from "../../../../types/notes";

const Notes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State for modals and interactions
  const [openModal, setOpenModal] = useState(false);
  const [openFileSuccessModal, setOpenFileSuccessModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // State for notes actions and preview
  const [openActionsModal, setOpenActionsModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedNotes, setSelectedNotes] = useState<note | undefined>();
  const [openPreviewModals, setOpenPreviewModals] = useState<{
    [key: number]: boolean;
  }>({});

  // Fetch instructor courses
  const { data: instructorCourses, isLoading: isLoadingCourses } =
    useGetInstructorCoursesQuery({ page: 1, per_page: 1000 });

  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  // Fetch notes for selected course
  const { data: note, isLoading: isGettingNotes } = useGetCourseNotesQuery(
    {
      course_id: parseInt(selectedCourseId),
      page: currentPage,
    },
    { skip: !selectedCourseId }
  );

  // Pagination calculations
  const totalItems = note?.pagination?.total || 0;
  const itemsPerPage = note?.pagination.per_page || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Set page name
  useEffect(() => {
    dispatch(setPageName("Notes"));
  }, [dispatch]);

  // Event handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCourseChange = (event: any) => {
    setSelectedCourseId(event.target.value as string);
    setCurrentPage(1); // Reset to first page when changing course
  };

  const handleCreateNewNote = () => navigate(`${selectedCourseId}/new`);

  const handleUploadModalClose = () => setOpenModal(false);

  const handleFileChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      setOpenFileSuccessModal(true);
    } catch (error) {
      // Error handled silently - consider adding toast notification
    }
    setOpenModal(false);
  };

  const handleProcessFileUrl = (fileUrl: string) => {
    // TODO: Implement file URL processing
    void fileUrl;
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  // Preview and actions modal handlers
  const handleOpenPreviewModal = (noteId: number) => {
    setOpenPreviewModals((prev) => ({ ...prev, [noteId]: true }));
  };

  const handleClosePreviewModal = (noteId: number) => {
    setOpenPreviewModals((prev) => ({ ...prev, [noteId]: false }));
  };

  const handleOpenActionsModal = (course: note, type: string) => {
    setSelectedNotes(course);
    setOpenActionsModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseActionsModal = (type: string) => {
    setSelectedNotes(undefined);
    setOpenActionsModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleEditActionsModal = (note: note) => {
    handleOpenPreviewModal(note.id);
  };

  const handleDelete = async (noteId: number) => {
    try {
      await deleteNote(noteId).unwrap();
      setOpenActionsModal((prev) => ({ ...prev, delete: false, success: true }));
    } catch (error) {
      console.error(error);
      setOpenActionsModal((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <InstructorPageHeader
        heading="Notes"
        subHeading="List of notes for your courses"
        additionalButton={{
          action: handleCreateNewNote,
          text: "Create New Note",
          isLoading: !selectedCourseId,
        }}
      />

      {isLoadingCourses && <LinearProgress />}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
        }}
      >
        <Box sx={{ marginBottom: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="course-select-label">Select Course</InputLabel>
            <Select
              labelId="course-select-label"
              id="course-select"
              value={selectedCourseId}
              label="Select Course"
              onChange={handleCourseChange}
            >
              {instructorCourses?.data.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {isGettingNotes && <LinearProgress />}

        {selectedCourseId ? (
          <>
            <Box>
              <CoursesItemList
                lists={note?.data || []}
                handleOpenActionsModal={handleOpenActionsModal}
                handleEditActionsModal={handleEditActionsModal}
                deleteIcon={true}
                edit={true}
                view={true}
                courseId={parseInt(selectedCourseId)}
              />
              {note?.data.map((singleNote) => (
                <CustomPreviewModal
                  key={singleNote.id}
                  openModal={openPreviewModals[singleNote.id] || false}
                  handleCloseModal={() =>
                    handleClosePreviewModal(singleNote.id)
                  }
                  note={singleNote}
                />
              ))}
            </Box>

            {note?.data.length ? (
              <CustomPagination
                startIndex={startIndex + 1}
                endIndex={endIndex}
                totalNumber={totalItems}
                count={Math.ceil(totalItems / itemsPerPage)}
                page={currentPage}
                handleChangePage={handleChangePage}
              />
            ) : (
              <EmptyState
                title="No notes found"
                subTitle="This course does not have any notes yet"
              />
            )}
          </>
        ) : (
          <EmptyState
            title="Please select a course"
            subTitle="Choose a course from the dropdown to view its notes"
          />
        )}
      </Box>

      <NotesUploadModal
        open={openModal}
        handleClose={handleUploadModalClose}
        handleFileChange={handleFileChange}
        handleProcessFileUrl={handleProcessFileUrl}
      />

      <CustomSuccessModal
        message="Your document has been added successfully"
        open={openFileSuccessModal}
        handleClose={() => setOpenFileSuccessModal(false)}
        viewButton={true}
        handleClickView={() => setOpenFileSuccessModal(false)}
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedNotes) handleDelete(selectedNotes.id);
          },
        }}
        close={() => handleCloseActionsModal("delete")}
        infoText="You can't undo this action."
        open={openActionsModal.delete}
        subTitle={`Are you sure you want to delete the note "${selectedNotes?.title}" ?`}
        title="Delete Note?"
      />
      <Backdrop open={isDeleting}>
        <CircularProgress />
      </Backdrop>
    </Box>
  );
};

export default Notes;
