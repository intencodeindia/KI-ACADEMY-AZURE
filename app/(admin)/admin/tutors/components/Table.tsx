import "./Main.css";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import FullScreenDialog from "../../../../components/mui/FullScreenDialogue";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Avatar,
  Grid,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { authorizationObj, baseUrl, profilePicture, profilePicturePath } from "@/app/utils/core";
import { IoMdEye } from "react-icons/io";
import Image from "next/image";
import { capitalizeString } from "@/app/utils/functions";
import axios from "axios";
import { SingleCourseCard } from "@/app/(web)/current-courses/components/courses-section/CourseCard";
import CourseCardSkeleton from "@/app/components/mui/CourseCardSkeleton";
import { useSelector } from "react-redux";
import { FilePreview } from "@/app/(web)/profile/Docs";

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
  [key: string]: any;
}

export const ViewTutor = ({ selectedTutor, setSelectedTutor, getAllTutors }: any) => {

  const [rejected_reason, set_rejected_reason] = React.useState(selectedTutor.rejected_reason ? capitalizeString(selectedTutor.rejected_reason) : "N/A")
  const [user_status, set_user_status] = React.useState(selectedTutor?.user_status)
  const [is_loading, set_is_loading] = React.useState(false)
  const [courses, set_courses] = React.useState<any[]>([])

  const user_statuses = [
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ]

  const update_tutor = async () => {
    try {
      set_is_loading(true)
      const formData = new FormData()
      formData.append("status", user_status)
      const resp = await axios.post(`${baseUrl}/users/update-status/${selectedTutor?.user_id}`, formData, authorizationObj)
      setSelectedTutor({ ...selectedTutor, user_status: user_status })
      getAllTutors()
      set_is_loading(false)
    } catch (error) {
      // console.error(error)
      set_is_loading(false)
    }
  }

  React.useEffect(() => {
    get_courses()
  }, [selectedTutor, selectedTutor?.user_id])

  const get_courses = async () => {
    if (!selectedTutor || !selectedTutor?.user_id || selectedTutor?.user_id?.trim() === "") return
    try {
      const resp = await axios.get(`${baseUrl}/courses/by-instructor/${selectedTutor?.user_id}`, authorizationObj)
      set_courses(resp?.data?.data ? resp?.data?.data : [])
    } catch (error) {
      // console.error(error)
    }
  }

  return (
    <>
      {selectedTutor && (
        <div className="overflow-y-auto">
          <Card sx={{ width: "100%", borderRadius: 0, boxShadow: 0 }}>
            <CardContent sx={{ padding: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Image
                    alt={`${selectedTutor.first_name} ${selectedTutor.last_name}`}
                    src={`${selectedTutor?.profile_picture}`}
                    className="w-[55px] h-[55px] border-1 bg-[#ededed]"
                    onError={(e: any) => e.target.src = profilePicture}
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
              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    value={selectedTutor.bio || "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    multiline
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Job Title"
                    value={selectedTutor?.job_title ? capitalizeString(selectedTutor?.job_title) : "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    options={user_statuses}
                    value={capitalizeString(user_status)}
                    sx={{ marginBottom: 1 }}
                    fullWidth
                    onChange={(e, val: any) => set_user_status(val.value)}
                    renderInput={(params) => <TextField {...params} label="Status" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Document Type"
                    value={selectedTutor.id_document_type ? capitalizeString(selectedTutor.id_document_type) : "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Document Number"
                    value={selectedTutor.id_document_number || "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="KYC ID"
                    value={selectedTutor.kyc_id || "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Created At"
                    value={selectedTutor.created_at ? moment(selectedTutor.created_at).format("DD/MM/YYYY") : "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Updated At"
                    value={selectedTutor.updated_at ? moment(selectedTutor.updated_at).format("DD/MM/YYYY") : "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Verified At"
                    value={selectedTutor.verified_at ? moment(selectedTutor.verified_at).format("DD/MM/YYYY") : "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Rejected Reason"
                    value={rejected_reason}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                    onChange={(e: any) => set_rejected_reason(e.target.value)}
                    disabled={user_status !== "rejected"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Institute ID"
                    value={selectedTutor.institute_id || "N/A"}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}></Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    color="secondary" variant="contained" disabled={user_status === selectedTutor.user_status || is_loading}
                    sx={{ marginTop: 0.5 }}
                    fullWidth onClick={update_tutor}
                  >{is_loading ? "Saving..." : "Save Changes"}</Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: 1, marginBottom: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Document Image
                  </Typography>
                  <FilePreview fileName={selectedTutor.document_image} label="No Document Image Available" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Proof Of Address
                  </Typography>
                  <FilePreview fileName={selectedTutor.proof_of_address} label="No Proof Of Address Available" />
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {`Tutor's Courses`}
              </Typography>
              {
                is_loading ?
                  <>
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </>
                  :
                  courses?.length ? (
                    <div className="courses-card-cont-admin">
                      {
                        courses?.map((course: any, i: number) => (
                          <SingleCourseCard course={course} key={i} />
                        ))
                      }
                    </div>
                  ) : (
                    <Typography>No Courses Available</Typography>
                  )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

const TTable = ({ data, getAllTutors }: any) => {

  const isDrawerOpen = useSelector((state: any) => state?.isAdminDrawerOpen)

  const [columns, setColumns] = React.useState<GridColDef[]>([]);
  const [selectedTutor, setSelectedTutor] = React.useState<CourseData | null>(null);
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
        "otp",
      ];
      const filteredKeys = example_data.filter(
        (item) => !stringsToRemove.includes(item)
      );

      // Define the columns
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
            return (
              <Image
                src={`${params.row.profile_picture || profilePicture}`}
                alt="profile picture"
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
              return <Typography sx={{
                textTransform: "capitalize",
                height: "100%",
                display: "flex",
                alignItems: "center",
                fontSize: "0.9em"
              }}>
                {
                  key.endsWith("at")
                    ? value
                      ? moment(value).format("DD/MM/YYYY")
                      : "N/A"
                    : value || "N/A"
                }
              </Typography>
            },
          })),
        {
          field: "user_status",
          headerName: "Status",
          width: 100,
          renderCell: (params) => (
            <Typography
              style={{
                color: getStatusColor(params.value),
                textTransform: "capitalize",
                height: "100%",
                display: "flex",
                alignItems: "center",
                fontSize: "0.9em"
              }}
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

  const handleViewTutor = async (row: CourseData) => {
    const userId = row?.user_id
    if (!userId) return
    try {
      const resp = await axios.get(`${baseUrl}/users/${userId}`, authorizationObj)
      if (resp?.data?.data) {
        setSelectedTutor(resp?.data?.data);
        setIsDialogOpen(true);
      }
    } catch (error) {
      // console.error(error)
    }
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
    <div style={{ width: `calc(100vw - ${isDrawerOpen ? "300px" : "120px"})` }}>
      <DataGrid
        rows={data.map((item: any, index: number) => ({
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
        disableRowSelectionOnClick // Updated prop name
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
        <ViewTutor
          selectedTutor={selectedTutor}
          getAllTutors={getAllTutors}
          setSelectedTutor={setSelectedTutor}
        />
      </FullScreenDialog>
    </div>
  );
};

export default TTable;
