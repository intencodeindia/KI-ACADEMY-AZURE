import "./Main.css";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { authorizationObj, baseUrl, profilePicture, profilePicturePath } from "@/app/utils/core";
import { IoMdEye } from "react-icons/io";
import { useSelector } from "react-redux";
import Image from "next/image";
import {
  Typography,
  Box,
  CardContent,
  Grid,
  Card,
  Button,
  Divider,
  Autocomplete,
  TextField
} from "@mui/material";
import FullScreenDialog from "@/app/components/mui/FullScreenDialogue";
import axios from "axios";
import { capitalizeString } from "@/app/utils/functions";
import { FilePreview } from "@/app/(web)/profile/Docs";

const ViewInstitute = ({ selectedInstitute, getAllInstitutions, setSelectedInstitute }: any) => {

  const [user_status, set_user_status] = React.useState(selectedInstitute?.status)
  const [is_loading, set_is_loading] = React.useState(false)

  const user_statuses = [
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ]

  const update_institute = async () => {
    if (!selectedInstitute || !selectedInstitute?.institute_id || selectedInstitute?.institute_id?.trim() === "") return
    try {
      set_is_loading(true)
      const formData = new FormData()
      formData.append("status", user_status)
      const resp = await axios.post(`${baseUrl}/users/update-status/${selectedInstitute?.institute_id}`, formData, authorizationObj)
      setSelectedInstitute({ ...selectedInstitute, user_status: user_status })
      getAllInstitutions()
      set_is_loading(false)
    } catch (error) {
      // console.error(error)
      set_is_loading(false)
    }
  }

  return (
    <>
      <div className="overflow-y-auto">
        <Card sx={{ width: "100%", borderRadius: 0, boxShadow: 0 }}>
          <CardContent sx={{ padding: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Image
                  alt={selectedInstitute.name}
                  src={`${selectedInstitute.profile_image}`}
                  style={{
                    width: "55px",
                    height: "55px",
                    backgroundColor: "#ededed",
                    border: "1px solid #ccc",
                  }}
                  onError={(e: any) => (e.target.src = profilePicture)}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {selectedInstitute.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedInstitute.email}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ margin: "20px 0" }} />

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Details
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  value={selectedInstitute.address || "N/A"}
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
                  label="Contact Number"
                  value={selectedInstitute.contact_number || "N/A"}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Registration Number"
                  value={selectedInstitute.registration_number || "N/A"}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="TIN Number"
                  value={selectedInstitute.tin_number || "N/A"}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Created At"
                  value={moment(selectedInstitute.created_at).format("DD/MM/YYYY")}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Updated At"
                  value={moment(selectedInstitute.updated_at).format("DD/MM/YYYY")}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  color="secondary" variant="contained" disabled={user_status === selectedInstitute.user_status || is_loading}
                  sx={{ marginTop: 0.5 }}
                  fullWidth onClick={update_institute}
                >{is_loading ? "Saving..." : "Save Changes"}</Button>
              </Grid>
            </Grid>

            <Divider sx={{ margin: "20px 0" }} />

            <Grid container spacing={2} sx={{ marginTop: 3, marginBottom: 3 }}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                  Supporting Document
                </Typography>
                {selectedInstitute?.supporting_document
                  ? <FilePreview fileName={selectedInstitute?.supporting_document} label="No Supporting Document Available" />
                : <Typography>No Supporting Document Available</Typography>}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

const TTable = ({ data, getAllInstitutions }: any) => {
  const isDrawerOpen = useSelector((state: any) => state?.isAdminDrawerOpen);
  const [columns, setColumns] = React.useState<GridColDef[]>([]);
  const [selectedInstitute, setSelectedInstitute] = React.useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (data?.length) {
      const cols: GridColDef[] = [
        {
          field: "sr_no",
          headerName: "Sr No.",
          width: 70,
        },
        {
          field: "profile_image",
          headerName: "Photo",
          width: 100,
          renderCell: (params) => {
            return (
              <div className="h-full flex items-center">
                <Image
                  src={params.row.profile_image ? `${params.row.profile_image}` : profilePicture}
                  alt="Profile"
                  style={{ width: "35px", height: "35px", objectFit: "cover", background: "#EDEDED" }}
                  onError={(e: any) => (e.target.src = profilePicture)}
                />
              </div>
            );
          },
        },
        {
          field: "name",
          headerName: "Institute Name",
          width: 200,
          renderCell: (params) => (
            <div className="h-full flex items-center">
              <Typography variant="body2">
                {params.row.name}
              </Typography>
            </div>
          ),
        },
        {
          field: "address",
          headerName: "Address",
          width: 200,
          renderCell: (params) => (
            <div className="h-full flex items-center">
              <Typography variant="body2">
                {params.row.address || "N/A"}
              </Typography>
            </div>
          ),
        },
        {
          field: "contact_number",
          headerName: "Contact Number",
          width: 150,
          renderCell: (params) => (
            <div className="h-full flex items-center">
              <Typography variant="body2">
                {params.row.contact_number || "N/A"}
              </Typography>
            </div>
          ),
        },
        {
          field: "email",
          headerName: "Email",
          width: 200,
          renderCell: (params) => (
            <div className="h-full flex items-center">
              <Typography variant="body2">
                {params.row.email || "N/A"}
              </Typography>
            </div>
          ),
        },
        {
          field: "registration_number",
          headerName: "Registration No.",
          width: 150,
          renderCell: (params) => (
            <div className="h-full flex items-center">
              <Typography variant="body2">
                {params.row.registration_number || "N/A"}
              </Typography>
            </div>
          ),
        },
        {
          field: "tin_number",
          headerName: "Tin No.",
          width: 150,
          renderCell: (params) => (
            <div className="h-full flex items-center">
              <Typography variant="body2">
                {params.row.tin_number || "N/A"}
              </Typography>
            </div>
          ),
        },
        {
          field: "created_at",
          headerName: "Created At",
          width: 150,
          renderCell: (params) => (
            <div className="h-full flex items-center">
              <Typography variant="body2">
                {moment(params.row.created_at).format("DD/MM/YYYY")}
              </Typography>
            </div>
          ),
        },
        {
          field: "status",
          headerName: "Status",
          width: 100,
          renderCell: (params) => (
            <div className="h-full flex items-center">
              <Typography
                variant="body2"
                sx={{ textTransform: "capitalize" }}
              >
                {params.row.status}
              </Typography>
            </div>
          ),
        },
        {
          field: "actions",
          headerName: "Actions",
          width: 100,
          renderCell: (params) => (
            <Box onClick={() => handleViewInstitute(params.row)} sx={{ cursor: "pointer", height: "100%", display: "flex", alignItems: "center" }}>
              <IoMdEye style={{ marginRight: "0.5em" }} />
              <Typography variant="body2">View</Typography>
            </Box>
          ),
        },
      ];

      setColumns(cols);
    }
  }, [data]);

  const getStatusColor = (status: string) => {
    return status === "active" ? "green" : status === "pending" ? "yellow" : "red";
  };

  const handleViewInstitute = (row: any) => {
    setSelectedInstitute(row);
    setIsDialogOpen(true);
  };

  return (
    <div style={{ width: `calc(100vw - ${isDrawerOpen ? "300px" : "120px"})` }}>
      <DataGrid
        rows={data.map((item: any, index: number) => ({
          ...item,
          sr_no: index + 1,
        }))}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        getRowId={(row) => row.institute_id}
        sx={{
          minHeight: "250px",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgb(235, 235, 235)",
          },
        }}
      />
      <FullScreenDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        headerTitle="Institute Details"
      >
        <ViewInstitute
          selectedInstitute={selectedInstitute}
          getAllInstitutions={getAllInstitutions}
          setSelectedInstitute={setSelectedInstitute}
        />
      </FullScreenDialog>
    </div>
  );
};

export default TTable;