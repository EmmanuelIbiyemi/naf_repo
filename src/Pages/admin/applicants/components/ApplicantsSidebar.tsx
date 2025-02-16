import {
  Box,
  Button,
  Divider,
  Drawer,
  SxProps,
  Typography,
} from "@mui/material";
import formStyles from "../../../../components/form/form.module.scss";
import { ApplicantType2 } from "../../../../types/applicants";
import { useGetApplicantResultMutation } from "../../../../store/api/applicants.api";
import { useEffect } from "react";

type Props = {
  applicant: ApplicantType2 | undefined;
  toggleDrawer: () => void;
};

const ApplicantSidebar = ({ applicant, toggleDrawer }: Props) => {
  const [getResult, resultsState] = useGetApplicantResultMutation();

  const fetchResults = async () => {
    try {
      const response = await getResult(applicant?.id || 0).unwrap();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (applicant) fetchResults();
  }, [applicant]);

  const renderFieldValue = (field: any, value: any) => {
    if (!value) return <Typography variant="body2">-</Typography>;
    if (typeof value === "string") {
      const lowerValue = value.toLowerCase();
      if (/\.(jpeg|jpg|png|gif|bmp)$/.test(lowerValue)) {
        return (
          <Box>
            <img
              src={value}
              alt={field.name}
              style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "4px" }}
            />
          </Box>
        );
      } else if (/\.(pdf|doc|docx|xls|xlsx)$/.test(lowerValue)) {
        return (
          <Button variant="contained" component="a" href={value} download>
            Download {field.name}
          </Button>
        );
      }
    }
    return <Typography variant="body2">{value}</Typography>;
  };

  return (
    <Drawer open={Boolean(applicant)} onClose={toggleDrawer} anchor="right">
      <Box sx={sideBarStyles}>
        <Box>
          <Typography variant="h5">{applicant?.form?.name}</Typography>
        </Box>
        <Divider sx={{ marginBottom: "1.5rem", marginTop: "1rem" }} />

        {/* Dynamic Form Sections */}
        {applicant?.form?.sections.map((section: any, index: number) => (
          <Box key={index} sx={infoSectionStyles}>
            <Typography
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                p: ".4rem 1rem",
              }}
              variant="h6"
            >
              {section.name}
            </Typography>
            {section.rows.map((row: any, ridx: number) => (
              <Box
                key={ridx}
                sx={{ display: "flex", flexWrap: "wrap", gap: "1rem", mt: ".5rem" }}
              >
                {row.fields.map((field: any, fidx: number) => (
                  <Box key={fidx} sx={{ minWidth: "45%" }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {field.name}
                    </Typography>
                    {renderFieldValue(field, (applicant?.data as any)[field.key])}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        ))}

        {/* Result Section */}
        <Box sx={infoSectionStyles}>
          <Typography
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: ".4rem 1rem",
            }}
          >
            Result
          </Typography>
          {!resultsState.data?.data.result.length ? (
            <Typography>Applicant did not take any assessment</Typography>
          ) : null}
          {resultsState.data?.data.result.map((rs: any, index: number) => (
            <Typography key={index}>
              <span>{rs.assessment.name}</span>
              <span>
                <span style={{ color: "green" }}>{rs.right}</span> |{" "}
                <span style={{ color: "red" }}>{rs.wrong}</span>
              </span>
            </Typography>
          ))}
        </Box>

        <Box className={formStyles.btn_group} sx={{ marginTop: "2rem" }}>
          <Button
            onClick={toggleDrawer}
            className={formStyles.cancel_btn}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ApplicantSidebar;

const sideBarStyles: SxProps = {
  height: "100%",
  padding: "1.5rem",
  width: "35vw",
  p: {
    margin: 0,
  },
};

const infoSectionStyles: SxProps = {
  marginTop: "2rem",
  ".MuiTypography-root": {
    display: "flex",
    justifyContent: "space-between",
    padding: ".4rem 1rem",
  },
};
