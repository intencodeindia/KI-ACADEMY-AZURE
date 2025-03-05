"use client";

import "./Main.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { authorizationObj, baseUrl } from "@/app/utils/core";
import { Button, Typography } from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";
import AddCategoryForm from "@/app/components/mui/AddCategoryForm";
import AntdDrawer from "@/app/components/antd/AntdDrawer";
import moment from "moment";
import { IoMdTrash } from "react-icons/io";
import { MdRemoveRedEye } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmAlertMUI from "@/app/components/mui/ConfirmAlertMUI";
import AlertMUI from "@/app/components/mui/AlertMUI";
import UpdateCategoryForm from "@/app/components/mui/UpdateCategoryForm";


const Main = () => {
    const [categories, set_categories] = useState([]);
    const [show_sidebar, set_show_sidebar] = useState(false)
    const [data, set_data] = useState([])
    const [is_loading, set_is_loading] = useState(false)
    const [is_alert_open, set_is_alert_open] = useState(false)
    const [alert_data, set_alert_data] = useState<any>(null)
    const [error_message, set_error_message] = useState("")
    const [success_message, set_success_message] = useState("")
    const [category, set_category] = useState(null)
    const [is_editing, set_is_editing] = useState(false)

    const getAllCategories = async () => {
        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/course-categories`, authorizationObj);
            set_is_loading(false)
            set_categories(resp?.data?.data);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
        }
    };

    useEffect(() => { getAllCategories() }, []);
    useEffect(() => {
        if (!categories?.length) return
        const processed_data: any = categories?.map((c: any, i: number) => {
            return {
                id: i + 1,
                s_no: i + 1,
                name: c?.category_name,
                description: c?.category_description,
                created_on: moment(c?.created_at).format("DD/MM/YYYY"),
                category_id: c?.category_id
            }
        })
        set_data(processed_data)
    }, [categories])

    const columns = [
        { field: "s_no", headerName: "S. No", width: 75 },
        { field: "name", headerName: "Category Name", flex: 1 },
        { field: "description", headerName: "Description", flex: 1 },
        { field: "created_on", headerName: "Created At", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params: any) => (
                <div className='w-full flex justify-center items-center px-2 gap-4 h-fit'>
                    <div className='flex justify-start items-center gap-[4px] cursor-pointer h-fit'
                        onClick={() => delete_category_confirmation(params?.row?.category_id)}
                    >
                        <IoMdTrash style={{ marginTop: "-4px" }} />
                        <p>Delete</p>
                    </div>
                    <div className='flex justify-start items-center gap-[4px] cursor-pointer h-fit'
                        onClick={() => view_category(params?.row?.category_id)}
                    >
                        <MdRemoveRedEye style={{ marginTop: "-4px" }} />
                        <p>View</p>
                    </div>
                </div>
            ),
        },
    ];

    const delete_category_confirmation = (categoryId: string) => {
        if (!categoryId) return
        set_alert_data({
            title: "Delete category?",
            description: "Are you sure you want to delete this category?. The action cannot be undone",
            fun: () => delete_category(categoryId)
        })
        set_is_alert_open(true)
    }

    const delete_category = async (categoryId: string) => {
        if (!categoryId) return
        try {
            set_is_loading(true)
            const resp = await axios.delete(`${baseUrl}/course-categories/delete/${categoryId}`, authorizationObj)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => { set_error_message("") }, 3000);
                return
            }
            set_is_loading(false)
            set_alert_data(null)
            set_is_alert_open(false)
            set_success_message("Category deleted successfully")
            setTimeout(() => { set_success_message("") }, 3000);
            getAllCategories()

        } catch (error) {
            set_is_loading(false)
            // console.error(error)
            set_error_message("Something went wrong, please try later")
            setTimeout(() => { set_error_message("") }, 3000);
        }
    }

    const view_category = async (categoryId: string) => {
        if (!categoryId) return
        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/course-categories/${categoryId}`, authorizationObj)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => { set_error_message("") }, 3000);
                return
            }
            if (resp?.data?.data) {
                set_category(resp?.data?.data)
                set_is_editing(true)
            } else {
                set_error_message("Category not found")
                setTimeout(() => { set_error_message("") }, 3000);
            }
            set_is_loading(false)

        } catch (error) {
            set_is_loading(false)
            // console.error(error)
            set_error_message("Something went wrong, please try later")
            setTimeout(() => { set_error_message("") }, 3000);
        }
    }

    return (
        <>
            {error_message && <AlertMUI text={error_message} status="error" />}
            {success_message && <AlertMUI text={success_message} status="success" />}
            <ConfirmAlertMUI
                isLoading={is_loading}
                open={is_alert_open}
                setOpen={set_is_alert_open}
                title={alert_data?.title}
                description={alert_data?.description}
                fun={alert_data?.fun}
            />
            <AntdDrawer open={show_sidebar} setOpen={set_show_sidebar} title="Add Category">
                <AddCategoryForm
                    set_show_sidebar={set_show_sidebar}
                    get_all_categories={getAllCategories}
                />
            </AntdDrawer>
            <AntdDrawer open={is_editing} setOpen={set_is_editing} title="Update Category">
                <UpdateCategoryForm
                    set_show_sidebar={set_is_editing}
                    get_all_categories={getAllCategories}
                    category={category}
                />
            </AntdDrawer>
            <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1 overflow-x-auto">
                <div className="w-full flex justify-between items-center">
                    <Typography variant="h5" component="h3">Course Categories</Typography>
                    <Button variant="contained" color="secondary" onClick={() => set_show_sidebar(true)} >
                        <IoMdAddCircle style={{ marginRight: "0.5em" }} /> Add Category
                    </Button>
                </div>
                <div className='w-full h-full'>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                        pageSizeOptions={[10, 20, 30, 40, 50]}
                        hideFooterSelectedRowCount
                        disableColumnSelector
                        style={{ width: "100%", height: "100%", minHeight: "4em" }}
                        loading={is_loading}
                    />
                </div>
            </div>
        </>
    );
};

export default Main;
