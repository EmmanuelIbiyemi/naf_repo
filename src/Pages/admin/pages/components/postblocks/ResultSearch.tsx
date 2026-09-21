import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { BlockType, ResultSearchScope, ResultSearchSettings } from "../../../../../types/blocks";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";
import { useGetResultScopesQuery } from "../../../../../store/api/results.api";
import { useGetSessionsQuery } from "../../../../../store/api/sessions.api";
import { useGetSemestersQuery } from "../../../../../store/api/semesters.api";

const defaultShowFields = {
  session: true,
  summary: true,
  participant: true,
};
const defaultParticipantFields = {
  name: true,
  email: true,
  matricNumber: true,
  photo: true,
  courseInfo: false,
};
const defaultSummaryFields = {
  cumulative_grade_point_average: true,
  cumulative_total_credit_units: true,
  cumulative_total_grade_points: true,
  grade_point_average: true,
  total_credit_units: true,
  total_grade_points: true,
};

const getScopeKey = (scope: ResultSearchScope) =>
  `${scope.department_id}-${scope.level_id}-${scope.semester}-${scope.session}`;

const formatScopeLabel = (scope: ResultSearchScope) => {
  const parts = [
    scope.department_name || `Dept ${scope.department_id}`,
    scope.level_name || `Level ${scope.level_id}`,
    scope.semester,
    scope.session,
  ].filter(Boolean);
  const countText = typeof scope.count === "number" ? ` (${scope.count})` : "";
  return `${parts.join(" • ")}${countText}`;
};

const summaryLabelMap: Record<string, string> = {
  cumulative_grade_point_average: "CGPA",
  cumulative_total_credit_units: "CTCU",
  cumulative_total_grade_points: "CTGP",
  grade_point_average: "GPA",
  total_credit_units: "TCU",
  total_grade_points: "TGP",
};

const formatSummaryLabel = (value: string) =>
  summaryLabelMap[value] ||
  value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
};

const ResultSearchBlock = ({ page, setPage, element, index }: Props) => {
  const resultSettings = element.settings?.resultSearch || {};
  const { data: sessions } = useGetSessionsQuery({ search_term: "" });
  const selectedSessionId = resultSettings.sessionId || undefined;
  const { data: semesters } = useGetSemestersQuery(
    selectedSessionId ? { session_id: selectedSessionId } : undefined
  );
  const { data: scopeResponse } = useGetResultScopesQuery(
    resultSettings.session || resultSettings.semester
      ? { session: resultSettings.session, semester: resultSettings.semester }
      : undefined
  );
  const scopes = scopeResponse?.data || [];

  useEffect(() => {
    handlePositionChange(index + 1, element.randomId);
  }, [index]);

  const updateBlock = (newBlock: BlockType) => {
    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((block) =>
        block.randomId === newBlock.randomId ? newBlock : block
      );
      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });
  };

  const updateResultSettings = (patch: Partial<ResultSearchSettings>) => {
    const foundBlock = page.blocks.find((block) => block.randomId === element.randomId);
    if (!foundBlock) return;
    const currentSettings = foundBlock.settings?.resultSearch || {};

    updateBlock({
      ...foundBlock,
      settings: {
        ...(foundBlock.settings || {}),
        resultSearch: {
          ...currentSettings,
          showFields: {
            ...defaultShowFields,
            ...(currentSettings.showFields || {}),
          },
          participantFields: {
            ...defaultParticipantFields,
            ...(currentSettings.participantFields || {}),
          },
          summaryFields: {
            ...defaultSummaryFields,
            ...(currentSettings.summaryFields || {}),
          },
          ...patch,
        },
      },
    });
  };

  const handlePositionChange = (
    position: number,
    randomId: string | null | undefined
  ) => {
    const foundBlock = page.blocks.find((block) => block.randomId === randomId);
    if (foundBlock) {
      updateBlock({ ...foundBlock, position });
    }
  };

  const handleTitleChange = (value: string) => {
    updateBlock({ ...element, title: value });
  };

  const selectedScopes = resultSettings.scopes || [];
  const selectedKeys = selectedScopes.map(getScopeKey);

  const scopeByKey = useMemo(() => {
    return new Map(scopes.map((scope) => [getScopeKey(scope), scope]));
  }, [scopes]);

  const selectedScopeObjects = selectedKeys
    .map((key) => scopeByKey.get(key) || selectedScopes.find((scope) => getScopeKey(scope) === key))
    .filter(Boolean) as ResultSearchScope[];

  const showFields = {
    ...defaultShowFields,
    ...(resultSettings.showFields || {}),
  };
  const participantFields = {
    ...defaultParticipantFields,
    ...(resultSettings.participantFields || {}),
  };
  const summaryFields = {
    ...defaultSummaryFields,
    ...(resultSettings.summaryFields || {}),
  };

  return (
    <Box key={`element-${element.id + index}`} className="element">
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography variant="h5">Result Search</Typography>
        <ActionButtons block={element} setPage={setPage} />
      </Box>
      <Box sx={{ display: "grid", gap: "1rem" }}>
        <FormControl fullWidth>
          <TextField
            label="Heading"
            defaultValue={element.title}
            onBlur={(e) => handleTitleChange(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth>
          <Typography variant="subtitle2" sx={{ marginBottom: "0.25rem" }}>
            Response style
          </Typography>
          <Select
            displayEmpty
            value={resultSettings.responseStyle || "simple"}
            onChange={(event) =>
              updateResultSettings({
                responseStyle: event.target.value as "simple" | "detailed",
              })
            }
            size="small"
          >
            <MenuItem value="simple">Simple response</MenuItem>
            <MenuItem value="detailed">Detailed response</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
          <FormControl fullWidth>
            <Select
              displayEmpty
              value={resultSettings.sessionId || ""}
              onChange={(event) => {
                const sessionId = Number(event.target.value);
                const session = sessions?.data?.find((s) => s.id === sessionId);
                updateResultSettings({
                  sessionId,
                  session: session?.name || "",
                  semesterId: undefined,
                  semester: "",
                  scopes: [],
                });
              }}
              size="small"
            >
              <MenuItem disabled value="">
                Select session
              </MenuItem>
              {(sessions?.data || []).map((session) => (
                <MenuItem key={session.id} value={session.id}>
                  {session.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              displayEmpty
              value={resultSettings.semesterId || ""}
              onChange={(event) => {
                const semesterId = Number(event.target.value);
                const semester = semesters?.data?.find((s) => s.id === semesterId);
                updateResultSettings({
                  semesterId,
                  semester: semester?.name || "",
                  scopes: [],
                });
              }}
              size="small"
            >
              <MenuItem disabled value="">
                Select semester
              </MenuItem>
              {(semesters?.data || []).map((semester) => (
                <MenuItem key={semester.id} value={semester.id}>
                  {semester.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <FormControl fullWidth>
          <Select
            multiple
            displayEmpty
            value={selectedKeys}
            onChange={(event) => {
              const nextKeys = event.target.value as string[];
              const nextScopes = nextKeys
                .map((key) => scopeByKey.get(key))
                .filter(Boolean) as ResultSearchScope[];
              updateResultSettings({ scopes: nextScopes });
            }}
            renderValue={(selected) => {
              if ((selected as string[]).length === 0) {
                return "Select result scopes";
              }
              return selectedScopeObjects.map(formatScopeLabel).join(", ");
            }}
            size="small"
          >
            <MenuItem disabled value="">
              Select result scopes
            </MenuItem>
            {scopes.map((scope) => (
              <MenuItem key={getScopeKey(scope)} value={getScopeKey(scope)}>
                {formatScopeLabel(scope)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "grid", gap: "0.5rem" }}>
          <Typography variant="subtitle2">Visible fields</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(showFields.session)}
                onChange={(event) =>
                  updateResultSettings({
                    showFields: { ...showFields, session: event.target.checked },
                  })
                }
              />
            }
            label="Session"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(showFields.participant)}
                onChange={(event) =>
                  updateResultSettings({
                    showFields: { ...showFields, participant: event.target.checked },
                  })
                }
              />
            }
            label="Participant"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(showFields.summary)}
                onChange={(event) =>
                  updateResultSettings({
                    showFields: { ...showFields, summary: event.target.checked },
                  })
                }
              />
            }
            label="Summary"
          />
        </Box>
        {showFields.participant ? (
          <Box sx={{ display: "grid", gap: "0.5rem" }}>
            <Typography variant="subtitle2">Participant fields</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(participantFields.name)}
                  onChange={(event) =>
                    updateResultSettings({
                      participantFields: {
                        ...participantFields,
                        name: event.target.checked,
                      },
                    })
                  }
                />
              }
              label="Name"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(participantFields.matricNumber)}
                  onChange={(event) =>
                    updateResultSettings({
                      participantFields: {
                        ...participantFields,
                        matricNumber: event.target.checked,
                      },
                    })
                  }
                />
              }
              label="Matric number"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(participantFields.email)}
                  onChange={(event) =>
                    updateResultSettings({
                      participantFields: {
                        ...participantFields,
                        email: event.target.checked,
                      },
                    })
                  }
                />
              }
              label="Email"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(participantFields.photo)}
                  onChange={(event) =>
                    updateResultSettings({
                      participantFields: {
                        ...participantFields,
                        photo: event.target.checked,
                      },
                    })
                  }
                />
              }
              label="Photo"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(participantFields.courseInfo)}
                  onChange={(event) =>
                    updateResultSettings({
                      participantFields: {
                        ...participantFields,
                        courseInfo: event.target.checked,
                      },
                    })
                  }
                />
              }
              label="Program information"
            />
          </Box>
        ) : null}
        {showFields.summary ? (
          <Box sx={{ display: "grid", gap: "0.5rem" }}>
            <Typography variant="subtitle2">Summary fields</Typography>
            {Object.entries(defaultSummaryFields).map(([key]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={Boolean((summaryFields as Record<string, boolean>)[key])}
                    onChange={(event) =>
                      updateResultSettings({
                        summaryFields: {
                          ...summaryFields,
                          [key]: event.target.checked,
                        },
                      })
                    }
                  />
                }
                label={formatSummaryLabel(key)}
              />
            ))}
          </Box>
        ) : null}
        <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
          <TextField
            label="Input label"
            defaultValue={resultSettings.inputLabel || "Matric number"}
            onBlur={(e) => updateResultSettings({ inputLabel: e.target.value })}
          />
          <TextField
            label="Input placeholder"
            defaultValue={resultSettings.inputPlaceholder || "Enter matric number"}
            onBlur={(e) => updateResultSettings({ inputPlaceholder: e.target.value })}
          />
          <TextField
            label="Button label"
            defaultValue={resultSettings.buttonLabel || "Search"}
            onBlur={(e) => updateResultSettings({ buttonLabel: e.target.value })}
          />
          <TextField
            label="Empty message"
            defaultValue={resultSettings.emptyMessage || "No result found for this matric number."}
            onBlur={(e) => updateResultSettings({ emptyMessage: e.target.value })}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ResultSearchBlock;
