import "./Main.css";
import * as React from "react";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import defaultCourseImage from "../../../../../public/images/banner.jpg"
import { IoMdEye } from "react-icons/io";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
interface CourseData {
    course_id: string;
    course_thumbnail: string;
    course_title: string;
    instructor_first_name: string;
    instructor_last_name: string;
    course_price: number;
    display_currency?: string;
    sr_no: number;
}

const TTable = ({ data }: any) => {

    const router = useRouter()
    const isDrawerOpen = useSelector((state: any) => state?.isAdminDrawerOpen)

    const [rows, setRows] = React.useState<CourseData[]>([]);
    const [example_obj, set_example_obj] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (data?.length) {
            const example_data = Object.keys(data[0]);
            const stringsToRemove = [
                "course_description",
                "course_intro_video",
                "display_currency",
                "course_price",
                "updated_at",
                "deleted_at",
                "instructor_id",
                "course_category_id",
                "instructor_first_name",
                "instructor_last_name",
                "course_id",
                "is_public",
            ];
            const updatedStrs = example_data.filter(item => !stringsToRemove.includes(item));
            set_example_obj(updatedStrs);
        }
    }, [data]);

    React.useEffect(() => {
        if (data?.length) {
            const formattedData = data.map((item: any, index: any) => ({
                ...item,
                instructorName: `${item.instructor_first_name} ${item.instructor_last_name}`,
                sr_no: index + 1,
            }));
            setRows(formattedData);
        }
    }, [data]);

    const formatString = (str: string) => str.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    const handleViewCourse = (row: any) => {
        const id = row?.course_id
        router.push(`/current-courses/${id}`)
    }

    const fixedColumns = [
        {
            field: "sr_no",
            headerName: "Sr No.",
            width: 70,
        },
        {
            field: "course_thumbnail",
            headerName: "Photo",
            width: 100,
            renderCell: (params: any) => (
                <Image
                    src={`https://api.kiacademy.in/uploads/courses/image/${params?.value}`}
                    alt="course"
                    onError={(e: any) => { e.target.src = defaultCourseImage.src; }}
                    style={{ width: '70px', height: '35px', marginTop: "8px", marginBottom: "8px" }}
                />
            ),
        },
        {
            field: "course_title",
            headerName: "Course Title",
            width: 250,
        },
        {
            field: "instructorName",
            headerName: "Instructor Name",
            width: 250,
        },
    ];

    const dynamicColumns = [...example_obj
        .filter(item => !fixedColumns.some(col => col.field === item))
        .map(item => ({
            field: item,
            headerName: formatString(item),
            width: 200,
            renderCell: (params: any) => {
                const value = params.value;
                if (item.endsWith("at")) {
                    return value ? moment(value).format("DD/MM/YYYY") : "N/A";
                } else {
                    return <p style={{ textTransform: "capitalize" }}>{value || "N/A"}</p>
                }
            },
        })),
    {
        field: "actions",
        headerName: "Actions",
        width: 100,
        renderCell: (params: any) => (
            <div style={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer", }}>
                <IoMdEye style={{ marginRight: "0.5em", fontSize: "0.9em" }} />
                <Typography
                    onClick={() => handleViewCourse(params.row)}
                    sx={{
                        fontSize: "0.9em",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "4px",
                    }}
                >
                    View Course
                </Typography>

            </div>
        ),
    }
    ]

    const columns = [...fixedColumns, ...dynamicColumns];

    return (
        <div className="table-cont-sts" style={{ width: `calc(100vw - ${isDrawerOpen ? "300px" : "120px"})` }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.course_id || row.sr_no}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                // checkboxSelection
                autoHeight
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "rgb(235, 235, 235)",
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: "#fff",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                    },
                    "& .MuiCheckbox-root": {
                        color: "#333",
                    },
                }}
            />
        </div>
    );
};

export default TTable;
