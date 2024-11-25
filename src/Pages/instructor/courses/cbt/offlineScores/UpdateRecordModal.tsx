import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  // Select,
  // MenuItem,
  // FormControl,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
// import { CoursesResponse } from "../../../../../types/courses";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState } from "react";
import { useUpdateRecordMutation } from "../../../../../store/api/records.api";
import { recordResponse } from "../../../../../types/records";

interface UpdateRecordModalProps {
  open: boolean;
  handleClose: () => void;
  records: recordResponse[];
}

const UpdateRecordModal = ({
  open,
  handleClose,
  records,
}: // coursesList,
UpdateRecordModalProps) => {
  const [updateRecord, { isLoading }] = useUpdateRecordMutation();

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      obtainable_score: "",
    },
    validationSchema: yup.object({
      id: yup.number().required(),
      name: yup.string().required(),
      obtainable_score: yup.number().required(),
    }),
    onSubmit: async (values) => {
      await updateRecord({
        id: parseInt(values.id),
        name: values.name,
        obtainable_score: parseInt(values.obtainable_score),
      }).unwrap();
      handleOpenSuccessModal();
      // console.log(values);
    },
  });

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="500">
            Update a record
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "48%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Name
                </Typography>
                <Select
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue("name", e.target.value);
                    const selectedRecord = records.find(
                      (record) => record.name === e.target.value
                    );
                    formik.setFieldValue("id", selectedRecord?.id || null);
                  }}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    <em>Select Record</em>
                  </MenuItem>
                  {records?.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ width: "48%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Obtainable score
                </Typography>
                <TextField
                  fullWidth
                  label="Obtainable score"
                  id="obtainable_score"
                  name="obtainable_score"
                  value={formik.values.obtainable_score}
                  onChange={formik.handleChange}
                  type="number"
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ textTransform: "none" }}
                disabled={isLoading}
              >
                Update Record
              </Button>
            </Box>
          </Stack>
        </form>
      </DialogContent>
      <SuccessModal
        close={handleCloseSuccessModal}
        infoText="Please check back later"
        open={openSuccessModal}
        subTitle={`Record is being updated`}
        title="Successful"
      />
    </Dialog>
  );
};

export default UpdateRecordModal;
