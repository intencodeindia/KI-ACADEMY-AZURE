import "./Main.css";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import FullScreenDialog from "../../../../components/mui/FullScreenDialogue";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { profilePicture, profilePicturePath } from "@/app/utils/core";
import { IoMdEye } from "react-icons/io";
import { capitalizeString } from "@/app/utils/functions";
import { FilePreview } from "@/app/(web)/profile/Docs";
import Image from "next/image";
interface CourseData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string;
  status?: string;
  user_status?: string;
  job_title?: string;
  bio?: string;
  id_document_type?: string;
  id_document_number?: string;
  proof_of_address?: string;
  kyc_id?: string;
  created_at?: string;
  updated_at?: string;
  verified_at?: string;
  rejected_reason?: string;
  document_image?: string;
  [key: string]: any; // For any additional dynamic fields
}

interface TableProps {
  data: CourseData[];
}

const TTable = ({ data }: any) => {
  const [columns, setColumns] = React.useState<GridColDef[]>([]);
  const [selectedTutor, setSelectedTutor] = React.useState<CourseData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (data?.length && data[0]) {
      const example_data = Object.keys(data[0]);
      const stringsToRemove = [
        "password",
        "role_id",
        "verification_code",
        "expires_at",
        "profile_picture",
        "user_id",
        "bio",
        "job_title",
        "verified_at",
        "updated_at",
        "deleted_at",
        "kyc_id",
        "rejected_reason",
        "status",
        "email",
        "user_status",
      ];
      const filteredKeys = example_data.filter(
        (item) => !stringsToRemove.includes(item)
      );

      const cols: GridColDef[] = [
        {
          field: "sr_no",
          headerName: "Sr No.",
          width: 70,
        },
        {
          field: "profile_picture",
          headerName: "Photo",
          width: 150,
          renderCell: (params) => {
            ;
            return (
              <Image
                src={`${params.row.profile_picture}` || profilePicture}
                alt="Profile"
                style={{ width: "35px", height: "35px", marginTop: "6px", objectFit: "cover", objectPosition: "center", background: "#EDEDED" }}
                onError={(e: any) => e.target.src = profilePicture}
              />
            );
          },
        },
        {
          field: "name",
          headerName: "Name",
          width: 200,
          renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography variant="body2">
                {`${params.row.first_name} ${params.row.last_name}`}
              </Typography>
            </div>
          ),
        },
        {
          field: "email",
          headerName: "Email",
          width: 200,
          renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography variant="body2">{params.row.email}</Typography>
            </div>
          ),
        },
        ...filteredKeys
          .filter((key) => key !== "first_name" && key !== "last_name")
          .map((key) => ({
            field: key,
            headerName: formatString(key),
            width: 150,
            renderCell: (params: any) => {
              const value = params.value;
              return <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                  {
                    key.endsWith("at")
                      ? value
                        ? moment(value).format("DD/MM/YYYY")
                        : "N/A"
                      : value || "N/A"
                  }
                </Typography>
              </div>
            },
          })),
        {
          field: "user_status",
          headerName: "Status",
          width: 100,
          renderCell: (params) => (
            <Typography
              variant="body2"
              style={{ color: getStatusColor(params.value), textTransform: "capitalize", height: "100%", display: "flex", alignItems: "center" }}
            >
              {params.value || "N/A"}
            </Typography>
          ),
        },
        {
          field: "actions",
          headerName: "Actions",
          width: 100,
          renderCell: (params) => (
            <div style={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer", }}>
              <IoMdEye style={{ marginRight: "0.5em" }} />
              <Typography
                onClick={() => handleViewTutor(params.row)}
                sx={{
                  fontSize: "0.9em",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                View Tutor
              </Typography>

            </div>
          ),
        },
      ];

      setColumns(cols);
    }
  }, [data]);

  const formatString = (str: string) =>
    str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleViewTutor = (row: CourseData) => {
    setSelectedTutor(row);
    setIsDialogOpen(true);
  };

  const handleChangeStatus = (row: CourseData, status: string) => {

  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "pending":
        return "orange";
      case "inactive":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ width: "calc(100vw - 120px)" }}>
      <DataGrid
        rows={data.map((item: any, index: any) => ({
          ...item,
          sr_no: index + 1,
        }))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        autoHeight
        disableRowSelectionOnClick
        getRowId={(row) => row.user_id || row.email}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgb(235, 235, 235)",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
      />
      <FullScreenDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        headerTitle="Tutor Details"
      >
        {selectedTutor && (
          <Card sx={{ width: "100%", borderRadius: 0, boxShadow: 0 }}>
            <CardContent sx={{ padding: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    alt={`${selectedTutor.first_name} ${selectedTutor.last_name}`}
                    src={`https://api.kiacademy.in/uploads/profile_pictures/${selectedTutor.profile_picture || "default_profile.png"
                      }`}
                    sx={{
                      width: 50,
                      height: 50,
                      border: "2px solid #4CAF50",
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {`${selectedTutor.first_name} ${selectedTutor.last_name}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTutor.email}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ margin: "20px 0" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Details
              </Typography>
              <Grid container spacing={1} sx={{ marginTop: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Job Title:</strong>{" "}
                    {selectedTutor.job_title || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Status:</strong>{" "}
                    {capitalizeString(selectedTutor.user_status) || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Bio:</strong> {selectedTutor.bio || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>ID Document Type:</strong>{" "}
                    {selectedTutor.id_document_type || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>ID Document Number:</strong>{" "}
                    {selectedTutor.id_document_number || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>KYC ID:</strong> {selectedTutor.kyc_id || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Created At:</strong>{" "}
                    {selectedTutor.created_at
                      ? moment(selectedTutor.created_at).format("DD/MM/YYYY")
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Updated At:</strong>{" "}
                    {selectedTutor.updated_at
                      ? moment(selectedTutor.updated_at).format("DD/MM/YYYY")
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Verified At:</strong>{" "}
                    {selectedTutor.verified_at
                      ? moment(selectedTutor.verified_at).format("DD/MM/YYYY")
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Rejected Reason:</strong>{" "}
                    {selectedTutor.rejected_reason || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Document Image Section */}
              <Grid container spacing={2} sx={{ marginTop: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Document Image
                  </Typography>
                  {selectedTutor.document_image ?
                    <FilePreview fileName={selectedTutor.document_image} label="No Document Image Available" /> :
                    <Typography>No Document Image Available</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Proof Of Address
                  </Typography>
                  {selectedTutor.document_image ?
                    <FilePreview fileName={selectedTutor.proof_of_address} label="No Proof Of Address Available" /> :
                    <Typography>No Proof Of Address Available</Typography>}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </FullScreenDialog>
    </div>
  );
};

export default TTable;
