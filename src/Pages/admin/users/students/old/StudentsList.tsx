// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableRow from "@mui/material/TableRow";
// import { Student } from "../../../../../types/students";
// import { Box, Button, Checkbox, IconButton, TableHead } from "@mui/material";
// import { Delete, Edit } from "@mui/icons-material";
// import DeleteConfirmationModal from "../../../../../components/DeleteConfirmationModal";
// import { useState } from "react";
// import StudentSidebar from "./StudentsSidebar";

// type Props = {
//   students: Student[];
//   editStudent: (student: Student) => void;
//   deleteStudent: (id: number) => void;
//   selectedStudent: Student | undefined;
//   setSelectedStudent: (student: Student) => void;
// };

// const StudentList = ({
//   students,
//   editStudent,
//   deleteStudent,
//   selectedStudent,
//   setSelectedStudent,
// }: Props) => {
//   const [openModal, setOpenModal] = useState(false);
//   const [openSidebar, setOpenSidebar] = useState(false);

//   const handleOpenModal = (student: Student) => {
//     setSelectedStudent(student);
//     setOpenModal(true);
//   };

//   const handleDelete = (student: Student) => {
//     if (student?.id){
//       deleteStudent(student?.id);
//     }
//   };

//   const handleViewStudent = (student: Student) => {
//     setSelectedStudent(student);
//     setOpenSidebar(true);
//   };

//   const toggleDrawer = (state: boolean) => {
//     setOpenSidebar(state);
//   };

//   return (
//     <TableContainer>
//       <StudentSidebar
//         open={openSidebar}
//         student={selectedStudent as Student}
//         toggleDrawer={toggleDrawer}
//         openEditModal={() => editStudent(selectedStudent as Student)}
//       />
//       <DeleteConfirmationModal
//         actions={{
//           proceed: () => {
//             if (selectedStudent) handleDelete(selectedStudent);
//             console.log("proceed");
//           },
//           undo: () => {
//             console.log("cancel");
//           },
//         }}
//         close={() => setOpenModal(false)}
//         infoText=""
//         open={openModal}
//         subTitle={`Are you sure you want to delete <strong>“${selectedStudent?.first_name} ${selectedStudent?.last_name}”</strong>? You can’t undo this action.`}
//         title="Delete Student?"
//       />

//       <Table
//         sx={{
//           minWidth: 650,
//           ".MuiTableCell-root": {
//             maxWidth: 200,
//             a: {
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//             },
//           },
//         }}
//       >
//         <TableHead>
//           <TableRow>
//             <TableCell>Name</TableCell>
//             <TableCell>Email Address</TableCell>
//             <TableCell>Phone Number</TableCell>
//             <TableCell>Courses</TableCell>
//             <TableCell align="center">Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {students.map((student) => (
//             <TableRow
//               key={student.id}
//               sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//             >
//               <TableCell component="th" scope="row">
//                 <Box
//                   sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
//                 >
//                   <Checkbox />
//                   <Button
//                     style={{
//                       border: "none",
//                       color: "inherit",
//                       padding: 0,
//                       textTransform: "capitalize",
//                     }}
//                     onClick={() => handleViewStudent(student)}
//                   >
//                     {student.first_name} {student.last_name}
//                   </Button>
//                 </Box>
//               </TableCell>
//               <TableCell component="th" scope="row">
//                 {student.email}
//               </TableCell>
//               <TableCell component="th" scope="row">
//                 {student.phone_number}
//               </TableCell>
//               <TableCell component="th" scope="row">
//                 {student.courses.map((c) => c.name).join(", ")}
//               </TableCell>
//               <TableCell align="right">
//                 <IconButton onClick={() => editStudent(student)}>
//                   <Edit />
//                 </IconButton>
//                 <IconButton onClick={() => handleOpenModal(student)}>
//                   <Delete />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default StudentList;
