import "./Main.css";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import FullScreenDialog from "../../../../../components/mui/FullScreenDialogue";
import { Card, CardContent, Typography, Grid, Divider, Button } from "@mui/material";
import axios from "axios";
import { authorizationObj, baseUrl } from "@/app/utils/core";
import { IoMdEye } from "react-icons/io";
import { useSelector } from "react-redux";

interface PaymentData {
  payment_id: string;
  student_name: string | null;
  transaction_id: string;
  amount: string;
  payment_date: string;
  currency: string;
}

interface CourseData {
  course_title: string;
  instructor_id: string;
  instructor_name: string;
  enrollment_date: string;
}

const PaymentTable = ({ data }: any) => {

  const isDrawerOpen = useSelector((state: any) => state?.isAdminDrawerOpen)

  const [columns, setColumns] = React.useState<GridColDef[]>([]);
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [courses, setCourses] = React.useState<CourseData[]>([]);

  React.useEffect(() => {
    const cols: GridColDef[] = [
      { field: "sr_no", headerName: "Sr No.", width: 70 },
      {
        field: "student_name",
        headerName: "Student Name",
        width: 200,
        renderCell: (params) => (
          <Typography variant="body2"
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >{params.value || "N/A"}</Typography>
        ),
      },
      {
        field: "transaction_id",
        headerName: "Transaction ID",
        width: 200,
        renderCell: (params) => (
          <Typography variant="body2"
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >{params.value ? params.value : "N/A"}</Typography>
        ),
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 150,
        renderCell: (params) => (
          <Typography variant="body2"
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >{params.value ? Math.round(+params.value).toLocaleString() : "N/A"}</Typography>
        ),
      },
      {
        field: "currency",
        headerName: "Currency",
        width: 100,
        renderCell: (params) => (
          <Typography variant="body2"
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >{params?.value ? params?.value : "N/A"}</Typography>
        ),
      },
      {
        field: "payment_date",
        headerName: "Payment Date",
        width: 200,
        renderCell: (params) => (
          <Typography variant="body2"
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {params.value ? moment(params.value).format("DD/MM/YYYY HH:mm") : "N/A"}
          </Typography>
        ),
      },
      {
        field: "action",
        headerName: "Action",
        width: 150,
        renderCell: (params) => (
          <div style={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer", }}>
            <IoMdEye style={{ marginRight: "0.5em" }} />
            <Typography
              onClick={() => handleViewPayment(params.row)}
              sx={{
                fontSize: "0.9em",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "4px",
              }}
            >
              View Details
            </Typography>
          </div>
        ),
      },
    ];

    setColumns(cols);
  }, [data]);

  const handleViewPayment = async (row: PaymentData) => {
    setSelectedPayment(row);
    setIsDialogOpen(true);
    try {
      const response = await axios.get(`${baseUrl}/payment/courses/${row.payment_id}`, authorizationObj);
      const result = response.data;
      if (result.status === 200) {
        setCourses(result.data);
      } else {
        // console.error("Failed to fetch courses data");
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
    }
  };

  const courseColumns: GridColDef[] = [
    { field: "course_title", headerName: "Course Title", width: 250 },
    { field: "instructor_name", headerName: "Instructor Name", width: 200 },
    {
      field: "enrollment_date",
      headerName: "Enrollment Date",
      width: 200,
      renderCell: (params) => moment(params.value).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <div
      style={{ width: `calc(100vw - ${isDrawerOpen ? "300px" : "120px"})` }}
    >
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
        getRowId={(row) => row.payment_id}
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
        headerTitle="Payment Details"
      >
        {selectedPayment && (
          <Card sx={{ width: "100%", borderRadius: 0, boxShadow: 0 }}>
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Payment ID: {selectedPayment.payment_id}
              </Typography>
              <Divider sx={{ margin: "20px 0" }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Student Name:</strong>{" "}
                    {selectedPayment.student_name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Transaction ID:</strong>{" "}
                    {selectedPayment.transaction_id}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Amount:</strong> {Math.round(+selectedPayment.amount).toLocaleString()} {selectedPayment.currency}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Payment Date:</strong>{" "}
                    {moment(selectedPayment.payment_date).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ margin: "20px 0" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Courses</Typography>
              <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                  rows={courses.map((course, index) => ({
                    ...course,
                    id: index, // or use another unique id
                  }))}
                  columns={courseColumns}
                  autoHeight
                  disableRowSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "rgb(235, 235, 235)",
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "none",
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </FullScreenDialog>
    </div>
  );
};

export default PaymentTable;
