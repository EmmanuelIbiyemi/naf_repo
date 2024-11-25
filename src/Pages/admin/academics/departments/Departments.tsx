import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddDepartmentMutation } from "../../../../store/api/departments.api";
import {
  Department,
  DepartmentFormAction,
} from "../../../../types/departments";
import DepartmentForm from "./DepartmentForm";
import DepartmentList from "./DepartmentList";

const DepartmentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [departmentName, setDepartmentName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [addDepartment] = useAddDepartmentMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Academics/Departments"));
  }, []);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedDepartment(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddDepartment = async (department: Department) => {
    try {
      await addDepartment(department).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setDepartmentName(department.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <DepartmentForm
          actions={{
            submit: handleAddDepartment as DepartmentFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          department={selectedDepartment}
        />
      </FormModal>

      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedDepartment(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new department “${departmentName}”.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Department",
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
        <DepartmentList />
      </Box>
    </Box>
  );
};

export default DepartmentsPage;
