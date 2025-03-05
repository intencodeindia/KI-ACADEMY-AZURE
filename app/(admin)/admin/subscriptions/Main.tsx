"use client"

import AntdDrawer from '@/app/components/antd/AntdDrawer'
import { authorizationObj, baseUrl } from '@/app/utils/core'
import { Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MdRemoveRedEye } from "react-icons/md";
import { DataGrid } from '@mui/x-data-grid'
import ConfirmAlertMUI from '@/app/components/mui/ConfirmAlertMUI'
import moment from "moment"
import AlertMUI from '@/app/components/mui/AlertMUI'
import { get_plan_medium } from '../plans/Main'
import ViewSubscription from '@/app/components/forms/ViewSubscription'
import { capitalizeString } from '@/app/utils/functions'

const Main = () => {
    const currentUser = useSelector((state: any) => state?.user)

    const [subscriptions, set_subscriptions] = useState([])
    const [processed_data, set_processed_data] = useState<any>([])
    const [alert_data, set_alert_data] = useState<any>(null)
    const [is_alert_open, set_is_alert_open] = useState(false)
    const [is_loading, set_is_loading] = useState(false)
    const [error_message, set_error_message] = useState("")
    const [success_message, set_success_message] = useState("")
    const [single_subscription, set_single_subscription] = useState<any>(null)
    const [is_viewing, set_is_viewing] = useState(false)

    useEffect(() => { get_subscriptions() }, [])

    const get_subscriptions = async () => {
        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/subscriptions`, authorizationObj)
            set_is_loading(false)
            set_subscriptions(resp?.data?.data)
        } catch (error) {
            // console.error(error)
            set_subscriptions([])
        }
    }

    useEffect(() => {
        const data = subscriptions?.map((d: any, i: number) => {
            return {
                s_no: i + 1,
                id: d?.id,
                plan_name: d?.plan_name,
                plan_price: d?.plan_price ? d?.plan_price === "0.00" ? "Free" : `$ ${d?.plan_price}` : "Free",
                plan_duration: `${d?.plan_duration}  ${get_plan_medium(d?.plan_medium, d?.plan_duration)}`,
                status: capitalizeString(d?.status),
            }
        })
        set_processed_data(data)
    }, [subscriptions, subscriptions.length])

    const columns = [
        { field: "s_no", headerName: "S. No", width: 75 },
        { field: "plan_name", headerName: "Plan Name", flex: 1 },
        { field: "plan_price", headerName: "Price", flex: 1 },
        { field: "plan_duration", headerName: "Duration", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params: any) => (
                <div className='w-full flex justify-center items-center px-2 h-fit gap-2'>
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

    // console.log("subscriptions", subscriptions)
    // console.log("single_subscription", single_subscription)

    const view_plan = async (subsId: string) => {
        if (!subsId) return
        try {
            const resp = await axios.get(`${baseUrl}/subscriptions/${subsId}`, authorizationObj)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => set_error_message(""), 2500)
                return
            }
            if (resp?.data?.data) {
                set_single_subscription(resp?.data?.data)
                set_is_viewing(true)
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
                open={is_viewing}
                setOpen={set_is_viewing}
                title="View Subscription"
                placement="right"
            >
                <ViewSubscription
                    data={single_subscription}
                />
            </AntdDrawer>

            <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1 overflow-x-auto">
                <div className="w-full flex justify-between items-center">
                    <Typography variant="h5" component="h3">Subscriptions</Typography>
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