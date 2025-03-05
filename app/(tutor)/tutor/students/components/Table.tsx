import "./Main.css";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import moment from "moment";
import ConfirmAlertMUI from "@/app/components/mui/ConfirmAlertMUI";
import { Typography, Card, CardContent, Grid, Divider, TextField } from "@mui/material";
import AlertMUI from "@/app/components/mui/AlertMUI";
import FullScreenDialog from "@/app/components/mui/FullScreenDialogue";
import { IoMdEye } from "react-icons/io";
import { authorizationObj, baseUrl, profilePicture, profilePicturePath } from "@/app/utils/core";
import { capitalizeString } from "@/app/utils/functions";
import axios from "axios";
import { useSelector } from "react-redux";
import Image from 'next/image'
export const ViewStudent = ({ selectedStudent, setSelectedStudent, getAllStudents }: any) => {

    return (
        <>
            {
                selectedStudent && (
                    <div className="overflow-y-auto">
                        <Card sx={{ width: "100%", borderRadius: 0, boxShadow: 0 }}>
                            <CardContent sx={{ padding: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Image
                                            alt={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
                                            src={`${selectedStudent?.profile_picture}`}
                                            className="w-[55px] h-[55px] border-1 bg-[#ededed]"
                                            onError={(e: any) => e.target.src = profilePicture}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                            {`${selectedStudent.first_name} ${selectedStudent.last_name}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedStudent.email}
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
                                            value={selectedStudent.bio || "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Address"
                                            value={selectedStudent?.address ? capitalizeString(selectedStudent?.address) : "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Status"
                                            value={capitalizeString(selectedStudent.user_status) || "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Mobile Number"
                                            value={selectedStudent.student_mobile_number || "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Parents Email"
                                            value={selectedStudent.student_parent_email || "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Parents Mobile Number"
                                            value={selectedStudent.student_parent_mobile || "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Date Of Birth"
                                            value={selectedStudent.date_of_birth ? moment(selectedStudent.date_of_birth).format("DD/MM/YYYY") : "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Created At"
                                            value={selectedStudent.created_at ? moment(selectedStudent.created_at).format("DD/MM/YYYY") : "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Updated At"
                                            value={selectedStudent.updated_at ? moment(selectedStudent.updated_at).format("DD/MM/YYYY") : "N/A"}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                )
            }
        </>
    )
}

const TTable = ({ data, getAllStudents }: any) => {
    const isDrawerOpen = useSelector((state: any) => state?.isAdminDrawerOpen)

    const [alertData, setAlertdata] = React.useState<any>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);
    const [clientErrorMessage, setClientErrorMessage] = React.useState<string | null>(null);
    const [clientSuccessMessage, setClientSuccessMessage] = React.useState<string | null>(null);
    const [isViewing, setIsViewing] = React.useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = React.useState<any>(null);
    const [rows, setRows] = React.useState<any>([]);

    React.useEffect(() => {
        if (data?.length) {
            const formattedData = data.map((item: any) => ({
                id: item?.id,
                student_name: `${item?.first_name} ${item?.last_name}`,
                email: item?.email,
                user_id: item?.user_id,
                course_title: item?.course_title,
                enrollment_date: item?.enrollment_date,
                profile_picture: item?.profile_picture,
            }));
            setRows(formattedData);
        }
    }, [data]);

    const formatString = (str: string) => str?.split('_').map(word => word.charAt(0)?.toUpperCase() + word.slice(1))?.join(' ');

    const handleViewStudent = async (student: any) => {
        const studentId = student?.user_id
        if (!studentId || studentId?.trim() === "") return
        try {
            const resp = await axios.get(`${baseUrl}/users/${studentId}`, authorizationObj)
            setSelectedStudent(resp?.data?.data);
            setIsViewing(true);
        } catch (error) {
            // console.error(error)
            setIsViewing(false);
        }
    };

    const columns: any = [
        {
            field: 'sr_no',
            headerName: 'Sr. No',
            width: 70,
        },
        {
            field: 'profile_picture',
            headerName: 'Picture',
            width: 70,
            renderCell: (params: any) => {
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
            field: 'student_name',
            headerName: 'Student Name',
            width: 200
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200
        },
        {
            field: 'course_title',
            headerName: 'Course',
            width: 250,
            renderCell: (params: any) => (
                params.value ?
                    <p>{params?.value}</p>
                    : "N/A"
            )
        },
        {
            field: 'enrollment_date',
            headerName: 'Enrollment Date',
            width: 150,
            renderCell: (params: any) => (
                params.value ? formatString(moment(params.value)?.format('DD/MM/YYYY')) : "N/A"
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params: any) => (
                <div style={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer", }}>
                    <IoMdEye style={{ marginRight: "0.5em" }} />
                    <Typography
                        onClick={() => handleViewStudent(params.row)}
                        sx={{
                            fontSize: "0.9em",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "4px",
                        }}
                    >
                        View Student
                    </Typography>
                </div>
            ),
        },
    ];

    return (
        <>
            {clientErrorMessage && <AlertMUI status="error" text={clientErrorMessage} />}
            {clientSuccessMessage && <AlertMUI status="success" text={clientSuccessMessage} />}
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={false}
            />
            <FullScreenDialog
                open={isViewing}
                setOpen={setIsViewing}
                headerTitle="View Student"
                onClose={() => setIsViewing(false)}
            >
                <ViewStudent
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                    getAllStudents={getAllStudents}
                />
            </FullScreenDialog>
            <div className="table-cont-sts"
                style={{ width: `calc(100vw - ${isDrawerOpen ? "300px" : "120px"})` }}
            >
                <DataGrid
                    rows={
                        rows.map((item: any, index: number) => ({
                            ...item,
                            sr_no: index + 1,
                            id: index + 1,
                        }))
                    } columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>
        </>
    );
}

export default TTable;
