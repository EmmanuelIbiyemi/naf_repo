import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import EmptyState from "../../../../components/EmptyState";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import AdminForm from "./AdminsForm";
import AdminList from "./AdminsList";
import { Admin, AdminFormAction } from "../../../../types/admins.ts";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useAddAdminMutation,
  useGetAdminsQuery,
} from "../../../../store/api/admins.api.ts";

const AdminsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [adminName, setAdminName] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin>();
  const { data: admins } = useGetAdminsQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addAdmin] = useAddAdminMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Users/Admins"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedAdmin(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddAdmin = async (admin: Admin) => {
    try {
      await addAdmin(admin).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setAdminName(`${admin.first_name} ${admin.last_name}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <AdminForm
          actions={{
            submit: handleAddAdmin as AdminFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          admin={selectedAdmin}
        />
      </FormModal>

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
          setSelectedAdmin(undefined);
        }}
        infoText="The instructors added in this admin will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new admin <strong>"${adminName}.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Admins",
        }}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        {admins?.data && admins.data.length > 0 ? (
          <AdminList />
        ) : (
          <EmptyState
            title="No Admins at this time"
            subTitle="Admins will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default AdminsPage;
