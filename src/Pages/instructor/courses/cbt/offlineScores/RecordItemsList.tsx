// import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, Button, TableHead } from "@mui/material";
import { recordResponse } from "../../../../../types/records";
// import CustomPagination from "../../../../../components/CustomPagination";

type ListProps = {
  lists: recordResponse[];
  handleButtonClick: (recordItem: recordResponse) => void;
};

const RecordsItemsList = ({ lists, handleButtonClick }: ListProps) => {
  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ border: "1px solid #D9D9D9" }}>
              {tableHead.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "#F1F1F1",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {lists?.map((item) => (
            <TableBody key={item.id}>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.obtainable_score}</TableCell>
                <TableCell>
                  <Button onClick={() => handleButtonClick(item)}>
                    Update record
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </TableContainer>
    </Box>
  );
};

const tableHead = [
  { id: 1, label: "Record name", minWidth: 170 },
  { id: 2, label: "Obtainable score", minWidth: 170 },
  { id: 3, label: "Action", minWidth: 100 },
];

export default RecordsItemsList;
