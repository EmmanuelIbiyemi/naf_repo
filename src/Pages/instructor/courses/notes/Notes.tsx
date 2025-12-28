import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import InstructorPageHeader from "../../../../components/layout/InstructorPageHeader";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName, setPageLoading } from "../../../../store/app.slice";
import { useNavigate, useLocation } from "react-router-dom";
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
import { note } from "../../../../types/notes";

const Notes = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Get persisted course ID from localStorage or location state
  const getInitialCourseId = () => {
    const locationState = location.state as { selectedCourseId?: string } | null;
    if (locationState?.selectedCourseId) {
      return locationState.selectedCourseId;
    }
    return localStorage.getItem('lastSelectedCourseId') || '';
  };

  // State for modals and interactions
  const [openModal, setOpenModal] = useState(false);
  const [openFileSuccessModal, setOpenFileSuccessModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(getInitialCourseId);
  const [currentPage, setCurrentPage] = useState(1);

  // State for notes actions
  const [openActionsModal, setOpenActionsModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedNotes, setSelectedNotes] = useState<note | undefined>();

  // Fetch instructor courses
  const { data: instructorCourses, isLoading: isLoadingCourses } =
    useGetInstructorCoursesQuery({ page: 1, per_page: 1000 });

  const [deleteNote] = useDeleteNoteMutation();

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

  useEffect(() => {
    if (isLoadingCourses || isGettingNotes) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isLoadingCourses, isGettingNotes, dispatch]);

  // Event handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCourseChange = (event: any) => {
    const courseId = event.target.value as string;
    setSelectedCourseId(courseId);
    localStorage.setItem('lastSelectedCourseId', courseId);
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

  // Actions modal handlers
  const handleOpenActionsModal = (course: note, type: string) => {
    setSelectedNotes(course);
    setOpenActionsModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseActionsModal = (type: string) => {
    setSelectedNotes(undefined);
    setOpenActionsModal((prev) => ({ ...prev, [type]: false }));
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
    <Box className="content-container">
      <InstructorPageHeader
        heading="Notes"
        subHeading="List of notes for your courses"
        additionalButton={{
          action: handleCreateNewNote,
          text: "Create New Note",
          isLoading: !selectedCourseId,
        }}
      />

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
          position: "sticky",
          top: 0,
          zIndex: 1,
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

        {selectedCourseId ? (
          <>
            <Box>
              <CoursesItemList
                lists={note?.data || []}
                handleOpenActionsModal={handleOpenActionsModal}
                deleteIcon={true}
                edit={true}
                courseId={parseInt(selectedCourseId)}
              />
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
    </Box>
  );
};

export default Notes;
