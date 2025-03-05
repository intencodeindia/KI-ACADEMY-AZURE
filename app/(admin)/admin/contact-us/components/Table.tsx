import "./Main.css";
import * as React from "react";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { IoMdEye } from "react-icons/io";
import { TextField, Typography } from "@mui/material";
import AntdDrawer from "@/app/components/antd/AntdDrawer";

const SingleMessage = ({ message }: any) => {
    return (
        <div className="w-full flex flex-col justify-start items-start gap-4">
            <TextField
                fullWidth label="Sent At"
                value={moment(message?.created_date).format("DD/MM/YYYY hh:mm A")}
            />
            <TextField
                fullWidth label="Name"
                value={message?.c_name}
            />
            <TextField
                fullWidth label="Email"
                value={message?.email?.toLowerCase()}
            />
            <TextField
                fullWidth label="Contact"
                value={message?.contact}
            />
            <TextField
                fullWidth label="Message"
                value={message?.message}
                multiline rows={6}
            />
        </div>
    )
}

const TTable = ({ data }: any) => {
    const isDrawerOpen = useSelector((state: any) => state?.isAdminDrawerOpen);

    const [rows, setRows] = React.useState<any[]>([]);
    const [example_obj, set_example_obj] = React.useState<string[]>([]);
    const [message, set_message] = React.useState(null)
    const [drawer_open, set_drawer_open] = React.useState(false)

    React.useEffect(() => {
        if (data?.length) {
            const example_data = Object.keys(data[0]);
            const stringsToRemove = ["id", "contact"];
            const updatedStrs = example_data.filter(item => !stringsToRemove.includes(item));
            set_example_obj(updatedStrs);
        }
    }, [data]);

    React.useEffect(() => {
        if (data?.length) {
            const formattedData = data.map((item: any, index: any) => ({
                ...item,
                Name: item.c_name,
                email: item.email.toLowerCase(),
                created_date: item?.created_date,
                sr_no: index + 1,
            }));
            setRows(formattedData);
        }
    }, [data]);

    const formatString = (str: string) => {
        if (str === "c_name") return "Name";
        return str
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const fixedColumns: any[] = [
        {
            field: "sr_no",
            headerName: "Sr. no",
            width: 70
        }
    ];

    const dynamicColumns = [
        ...example_obj
            .filter(item => !fixedColumns.some(col => col.field === item))
            .map(item => ({
                field: item === "c_name" ? "Name" : item,
                headerName: formatString(item),
                width: 200,
                renderCell: (params: any) => {
                    const value = params.value;
                    if (item.endsWith("date") && item !== "created_date") {
                        return value ? moment(value).format("DD/MM/YYYY") : "N/A";
                    } else if (item === "email") {
                        return <p style={{ textTransform: "lowercase" }}>{value || "N/A"}</p>;
                    } else {
                        return <p style={{ textTransform: "capitalize" }}>{value || "N/A"}</p>;
                    }
                },
            })),
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params: any) => (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", cursor: "pointer", }}>
                    <IoMdEye style={{ marginRight: "0.5em", fontSize: "0.9em" }} />
                    <Typography
                        onClick={() => handleViewMessage(params.row)}
                        sx={{
                            fontSize: "0.9em",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "4px",
                        }}
                    >
                        View Message
                    </Typography>

                </div>
            )
        }
    ];

    const columns = [...fixedColumns, ...dynamicColumns];

    const handleViewMessage = (data: any) => {
        set_message(data)
        set_drawer_open(true)
    }

    return (
        <div className="table-cont-sts" style={{ width: `calc(100vw - ${isDrawerOpen ? "300px" : "120px"})` }}>
            <AntdDrawer
                open={drawer_open}
                setOpen={set_drawer_open}
                title="Message"
            >
                <SingleMessage message={message} />
            </AntdDrawer>
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
            />
        </div>
    );
};

export default TTable;