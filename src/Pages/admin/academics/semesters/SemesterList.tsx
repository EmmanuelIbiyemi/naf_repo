import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  SemesterCombinedType,
  SemesterType,
} from "../../../../types/semesters";
import { Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteSemesterMutation,
  useUpdateSemesterMutation,
} from "../../../../store/api/semesters.api";
import FormModal from "../../../../components/FormModal";
import SemesterForm from "./SemesterForm";
import SuccessModal from "../../../../components/SuccessModal";
import { FormAction } from "../../../../types/forms";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { useGetSessionQuery } from "../../../../store/api/sessions.api";
import { useParams } from "react-router-dom";

const SemesterList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  //
  const { session_id } = useParams();
  const {
    data: session,
    isFetching,
    isError,
  } = useGetSessionQuery(+(session_id || 1));
  //
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>();
  const [semesters, setSemesters] = useState<SemesterType[] | undefined>(
    session?.data.semesters
  );
  const [deleteSemester] = useDeleteSemesterMutation();
  const [updateSemester] = useUpdateSemesterMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(session?.data.semesters);
    console.log(session_id);
    if (keyword && session?.data)
      setSemesters(
        session.data.semesters.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setSemesters(session?.data.semesters);
  }, [keyword, session]);

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, session]);

  const handleOpenModal = (semester: SemesterType, type: string) => {
    setSelectedSemester(semester);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedSemester(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (semester_id: number) => {
    try {
      await deleteSemester(semester_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSemester = async (semester: SemesterType) => {
    try {
      await updateSemester(semester).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(semester, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <SemesterForm
          actions={{
            submit: handleEditSemester as FormAction<SemesterCombinedType>,
            cancel: () => handleCloseModal("edit"),
          }}
          semester={selectedSemester}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedSemester) handleDelete(selectedSemester.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Semester ”${selectedSemester?.name}” ?`}
        title="Delete Semester?"
      />

      {/* Success */}
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
          setSelectedSemester(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Semester “${selectedSemester?.name}”.`}
        title="Updates Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Semesters"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!semesters?.length ? (
        <EmptyState
          title="No Semesters found"
          subTitle="Semesters will appear here after you add them in your school."
        />
      ) : null}
      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {semesters?.map((semester) => (
            <TableRow
              key={semester.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Typography
                  sx={{ fontWeight: 500, textTransform: "capitalize" }}
                >
                  {semester.name}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(semester, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(semester, "delete")}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SemesterList;
