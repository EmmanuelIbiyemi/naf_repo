import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  // Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useGetEligiblesQuery } from "../../../../store/api/eligibles.api";
import { EligibleType } from "../../../../types/eligibles";
import dayjs from "dayjs";
// import { Delete } from "@mui/icons-material";
import { useAppSelector } from "../../../../store/hooks";
import { selectKeyword } from "../../../../store/app.slice";
import { useEffect, useState } from "react";

const EligiblesList: React.FC = () => {
  const { data: elgbles, isLoading } = useGetEligiblesQuery(null);
  const [eligibles, setEligibles] = useState<EligibleType[] | undefined>(
    elgbles?.data
  );
  const keyword = useAppSelector(selectKeyword);

  useEffect(() => {
    if (keyword && elgbles?.data)
      setEligibles(
        elgbles.data.filter((elg) =>
          elg.reg_number.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setEligibles(elgbles?.data);
  }, [keyword, elgbles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: 650,
          ".MuiSelect-select": { padding: ".5rem", maxWidth: "200px" },
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              borderBottom: "1px solid",
              "&:last-child td, &:last-child th": { border: 0 },
              "td.MuiTableCell-body": {
                padding: 0,
              },
            }}
          >
            <TableCell
              component="th"
              scope="row"
              sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
            >
              Reg number
            </TableCell>
            <TableCell align="center">Session</TableCell>
            <TableCell align="center">Date</TableCell>
            {/* <TableCell align="center">Actions</TableCell> */}
          </TableRow>
        </TableHead>

        <TableBody>
          {!eligibles?.length ? (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                No items found
              </TableCell>
            </TableRow>
          ) : null}
          {eligibles?.map((eligible: EligibleType) => (
            <TableRow
              key={eligible.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "td.MuiTableCell-body": {
                  padding: 0,
                },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Link
                  to={`/eligibles/${eligible.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {eligible.reg_number}
                </Link>
              </TableCell>
              <TableCell align="center">{eligible.session}</TableCell>
              <TableCell align="center">
                {dayjs(eligible.created_at).format("DD-MM-YYYY")}
              </TableCell>
              {/* <TableCell align="center">
                <Button onClick={() => {}}>
                  <Delete />
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EligiblesList;
