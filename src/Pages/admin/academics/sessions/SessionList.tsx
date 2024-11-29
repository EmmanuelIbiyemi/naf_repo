import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { SessionCombinedType, SessionType } from "../../../../types/sessions";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteSessionMutation,
  useGetSessionsQuery,
  useUpdateSessionMutation,
} from "../../../../store/api/sessions.api";
import FormModal from "../../../../components/FormModal";
import SessionForm from "./SessionForm";
import SuccessModal from "../../../../components/SuccessModal";
import { FormAction } from "../../../../types/forms";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { Link } from "react-router-dom";

const SessionList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const {
    data: sessionss,
    isFetching,
    isError,
  } = useGetSessionsQuery({
    search_term: keyword,
  });
  const [selectedSession, setSelectedSession] = useState<SessionType>();
  const [sessions, setSessions] = useState<SessionType[] | undefined>(
    sessionss?.data
  );
  const [deleteSession] = useDeleteSessionMutation();
  const [updateSession] = useUpdateSessionMutation();

  useEffect(() => {
    if (sessionss?.data) setSessions(sessionss?.data);
  }, [keyword, sessionss]);

  useEffect(() => {
    if (isFetching && !isError) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, sessionss]);

  const handleOpenModal = (session: SessionType | null, type: string) => {
    if (session) setSelectedSession(session);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedSession(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (session_id: number) => {
    try {
      await deleteSession(session_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSession = async (session: SessionType) => {
    try {
      await updateSession(session).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(session, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <SessionForm
          actions={{
            submit: handleEditSession as FormAction<SessionCombinedType>,
            cancel: () => handleCloseModal("edit"),
          }}
          session={selectedSession}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedSession) handleDelete(selectedSession.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Session "${selectedSession?.name}" ?`}
        title="Delete Session?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedSession(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Session "${selectedSession?.name}".`}
        title="Updates Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Sessions"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!sessions?.length ? (
        <EmptyState
          title="No Sessions found"
          subTitle="Sessions will appear here after you add them in your school."
        />
      ) : null}
      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {sessions?.map((session) => (
            <TableRow
              key={session.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/sessions/${session.id}`}
                  style={{ fontWeight: 500, textTransform: "capitalize" }}
                >
                  {session.name}
                </Link>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(session, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(session, "delete")}>
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

export default SessionList;
