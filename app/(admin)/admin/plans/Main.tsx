"use client"

import AntdDrawer from '@/app/components/antd/AntdDrawer'
import { authorizationObj, baseUrl } from '@/app/utils/core'
import { Button, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoMdAddCircle, IoMdTrash } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { MdRemoveRedEye } from "react-icons/md";
import { DataGrid } from '@mui/x-data-grid'
import ConfirmAlertMUI from '@/app/components/mui/ConfirmAlertMUI'
import CreatePlanForm from '@/app/components/forms/CreatePlanForm'
import EditPlanForm from '@/app/components/forms/EditPlanForm'
import moment from "moment"
import AlertMUI from '@/app/components/mui/AlertMUI'

export const get_plan_medium = (medium: string, duration: number) => {
    switch (medium) {
        case "years":
            return duration == 1 ? "year" : "years"
            break;
        case "months":
            return duration == 1 ? "month" : "months"
            break;
        case "days":
            return duration == 1 ? "day" : "days"
            break;
        default:
            return ""
            break;
    }
}

const Main = () => {
    const currentUser = useSelector((state: any) => state?.user)

    const [plans, set_plans] = useState([])
    const [show_plan_modal, set_show_plan_modal] = useState<boolean>(false)
    const [processed_data, set_processed_data] = useState<any>([])
    const [alert_data, set_alert_data] = useState<any>(null)
    const [is_alert_open, set_is_alert_open] = useState(false)
    const [is_loading, set_is_loading] = useState(false)
    const [error_message, set_error_message] = useState("")
    const [success_message, set_success_message] = useState("")
    const [single_plan, set_single_plan] = useState<any>(null)
    const [is_editing, set_is_editing] = useState(false)

    useEffect(() => { get_plans() }, [])

    const get_plans = async () => {
        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/subscription-plans`, authorizationObj)
            set_is_loading(false)
            set_plans(resp?.data?.data)
        } catch (error) {
            // console.error(error)
            set_plans([])
        }
    }

    useEffect(() => {
        const data = plans?.map((d: any, i: number) => {
            return {
                s_no: i + 1,
                id: d?.id,
                plan_name: d?.plan_name,
                plan_price: d?.plan_price ? d?.plan_price === "0.00" ? "Free" : `$ ${d?.plan_price}` : "Free",
                plan_duration: `${d?.plan_duration}  ${get_plan_medium(d?.plan_medium, d?.plan_duration)}`,
                created_at: moment(d?.created_at).format("DD/MM/YYYY"),
            }
        })
        set_processed_data(data)
    }, [plans, plans.length])

    const columns = [
        { field: "s_no", headerName: "S. No", width: 75 },
        { field: "plan_name", headerName: "Plan Name", flex: 1 },
        { field: "plan_price", headerName: "Price", flex: 1 },
        { field: "plan_duration", headerName: "Duration", flex: 1 },
        { field: "created_at", headerName: "Created On", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params: any) => (
                <div className='w-full flex justify-center items-center px-2 h-fit gap-2'>
                    <div className='flex justify-start items-center gap-[4px] cursor-pointer h-fit'
                        onClick={() => delete_plan_confirmation(params?.row?.id)}
                    >
                        <IoMdTrash style={{ marginTop: "-4px" }} />
                        <p>Delete</p>
                    </div>
                    <div className='flex justify-start items-center gap-[4px] cursor-pointer h-fit'
                        onClick={() => view_plan(params?.row?.id)}
                    >
                        <MdRemoveRedEye style={{ marginTop: "-4px" }} />
                        <p>View</p>
                    </div>
                </div>
            ),
        },
    ];

    const delete_plan_confirmation = (planId: string) => {
        if (!planId) return
        set_alert_data({
            title: "Delete Plan?",
            description: "Are you sure you want to delete this plan?. The action cannot be undone",
            fun: () => delete_plan(planId)
        })
        set_is_alert_open(true)
    }

    const delete_plan = async (planId: string) => {
        if (!planId) return
        try {
            set_is_loading(true)
            const resp = await axios.delete(`${baseUrl}/subscription-plans/delete/${planId}`, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => set_error_message(""), 3000)
                return
            }
            set_success_message("Plan deleted successfullly")
            setTimeout(() => set_success_message(""), 3000)
            set_alert_data(null)
            set_is_alert_open(false)
            get_plans()
        } catch (error) {
            // console.error(error)
            set_is_loading(false)
            set_alert_data(null)
            set_is_alert_open(false)
            set_error_message("Something went wrong, please try later")
            setTimeout(() => set_error_message(""), 3000)
        }
    }

    const view_plan = async (planId: string) => {
        if (!planId) return
        try {
            const resp = await axios.get(`${baseUrl}/subscription-plans/${planId}`, authorizationObj)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => set_error_message(""), 2500)
                return
            }
            if (resp?.data?.data?.length) {
                set_single_plan(resp?.data?.data[0])
                set_is_editing(true)
            }
        } catch (error) {
            // console.error(error)
            setTimeout(() => set_error_message(""), 2500)
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

            <AntdDrawer
                open={is_editing}
                setOpen={set_is_editing}
                title="Edit Plan"
                placement="right"
            >
                <EditPlanForm set_is_editing={set_is_editing} get_plans={get_plans} data={single_plan} set_data={set_single_plan} />
            </AntdDrawer>

            <AntdDrawer
                open={show_plan_modal}
                setOpen={set_show_plan_modal}
                title="Add Plan"
                placement="right"
            >
                <CreatePlanForm set_show_plan_modal={set_show_plan_modal} get_plans={get_plans} />
            </AntdDrawer>
            <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1 overflow-x-auto">
                <div className="w-full flex justify-between items-center">
                    <Typography variant="h5" component="h3">Plans</Typography>
                    <Button variant="contained" color="secondary" onClick={() => set_show_plan_modal(true)} >
                        <IoMdAddCircle style={{ marginRight: "0.5em" }} /> Add Plan
                    </Button>
                </div>
                <div className='w-full h-full'>
                    <DataGrid
                        rows={processed_data}
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                        pageSizeOptions={[10, 20, 30, 40, 50]}
                        hideFooterSelectedRowCount
                        disableColumnSelector
                        style={{ width: "100%", height: "100%", minHeight: "15em" }}
                        loading={is_loading}
                    />
                </div>
            </div>
        </>
    );
}

export default Main