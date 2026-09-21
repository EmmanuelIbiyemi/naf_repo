import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess, Refresh } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../store/app.slice";
import { Pagination } from "../../../types/pagination";
import { ActivityLog, ActivityLogFilters, ActionType } from "../../../types/activitylog";
import { useGetMyActivityLogsQuery } from "../../../store/api/activitylog.api";
import CustomPagination from "../../../components/CustomPagination";
import EmptyState from "../../../components/EmptyState";
import { formatDateTime } from "../../../utils/dateUtils";

const ACTION_TYPE_COLORS: Record<ActionType, "success" | "info" | "warning" | "error" | "default"> = {
  CREATE: "success",
  UPDATE: "info",
  DELETE: "error",
  VIEW: "default",
  EXPORT: "info",
  UPLOAD: "info",
  DOWNLOAD: "info",
  OTHER: "default",
};

const MyActivity = () => {
  const dispatch = useAppDispatch();
  const keyword = useAppSelector(selectKeyword);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 20,
  });
  const [filters, setFilters] = useState<ActivityLogFilters>({});
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const queryParams: ActivityLogFilters = {
    ...pagination,
    search_term: keyword || undefined,
    ...filters,
  };

  const {
    data: logsData,
    isFetching,
    isError,
    refetch,
  } = useGetMyActivityLogsQuery(queryParams);

  useEffect(() => {
    dispatch(setPageLoading(isFetching));
  }, [isFetching, dispatch]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [keyword, filters]);

  const handleFilterChange = (key: keyof ActivityLogFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const toggleRowExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const actionTypes: ActionType[] = [
    "CREATE", "UPDATE", "DELETE", "VIEW", "EXPORT", "UPLOAD", "DOWNLOAD", "OTHER"
  ];

  return (
    <Box sx={{ padding: "1rem" }}>
      <Typography variant="h5" sx={{ marginBottom: "1rem", fontWeight: 600 }}>My Activity</Typography>
      
      {/* Filters Section */}
      <Paper sx={{ padding: "1rem", marginBottom: "1rem" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showFilters ? "1rem" : 0 }}>
          <Typography variant="h6">Filters</Typography>
          <Box>
            <IconButton onClick={() => refetch()} title="Refresh">
              <Refresh />
            </IconButton>
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>
        
        <Collapse in={showFilters}>
          <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Action Type</InputLabel>
              <Select
                value={filters.action_type || ""}
                label="Action Type"
                onChange={(e) => handleFilterChange("action_type", e.target.value)}
              >
                <MenuItem value="">All Actions</MenuItem>
                {actionTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={filters.start_date?.split("T")[0] || ""}
              onChange={(e) =>
                handleFilterChange("start_date", e.target.value ? `${e.target.value}T00:00:00` : "")
              }
            />

            <TextField
              size="small"
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={filters.end_date?.split("T")[0] || ""}
              onChange={(e) =>
                handleFilterChange("end_date", e.target.value ? `${e.target.value}T23:59:59` : "")
              }
            />

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{ cursor: "pointer", color: "primary.main", textDecoration: "underline" }}
                onClick={clearFilters}
              >
                Clear Filters
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        {isError ? (
          <EmptyState
            title="Could not fetch activity logs"
            subTitle="Check your internet connection"
          />
        ) : !logsData?.data.length ? (
          <EmptyState
            title="No activity found"
            subTitle="Your activity will appear here as you interact with the system."
          />
        ) : (
          <>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date/Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Resource</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logsData?.data.map((log: ActivityLog) => (
                  <>
                    <TableRow
                      key={log.id}
                      sx={{
                        "&:hover": { backgroundColor: "#fafafa" },
                        cursor: log.extra_data ? "pointer" : "default",
                      }}
                      onClick={() => log.extra_data && toggleRowExpand(log.id)}
                    >
                      <TableCell>
                        <Typography variant="body2">{formatDateTime(log.created_at)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.action_type}
                          size="small"
                          color={ACTION_TYPE_COLORS[log.action_type] || "default"}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                          {log.resource_type || "N/A"}
                          {log.resource_id ? ` #${log.resource_id}` : ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {log.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {log.extra_data && (
                          <IconButton size="small">
                            {expandedRow === log.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                    {log.extra_data && (
                      <TableRow key={`${log.id}-details`}>
                        <TableCell colSpan={5} sx={{ padding: 0 }}>
                          <Collapse in={expandedRow === log.id}>
                            <Box sx={{ padding: "1rem", backgroundColor: "#f9f9f9" }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Additional Details:
                              </Typography>
                              <Typography variant="body2" component="pre" sx={{ fontSize: "0.8rem", overflow: "auto" }}>
                                {JSON.stringify(log.extra_data, null, 2)}
                              </Typography>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
            <CustomPagination
              count={Math.ceil(logsData.pagination.total / logsData.pagination.per_page)}
              page={logsData.pagination.page}
              handleChangePage={(_, page) => {
                setPagination({
                  per_page: logsData.pagination.per_page,
                  page,
                });
              }}
              startIndex={logsData.pagination.per_page * (logsData.pagination.page - 1) + 1}
              endIndex={Math.min(
                logsData.pagination.per_page * logsData.pagination.page,
                logsData.pagination.total
              )}
              totalNumber={logsData.pagination.total}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default MyActivity;
