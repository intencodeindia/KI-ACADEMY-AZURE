import { Autocomplete, TextField } from '@mui/material'
import { Button } from '@mui/material'
import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import AlertMUI from '../mui/AlertMUI'
import axios from 'axios'
import { authorizationObj, baseUrl, subscription_plans_medium_plural } from '@/app/utils/core'
import { capitalizeString } from '@/app/utils/functions'

const EditPlanForm = ({ set_is_editing, data, get_plans, set_data }: any) => {
    const [plan_name, set_plan_name] = useState(data?.plan_name)
    const [plan_description, set_plan_description] = useState(data?.plan_description)
    const [plan_price, set_plan_price] = useState(+data?.plan_price)
    const [plan_medium, set_plan_medium] = useState(data?.plan_medium)
    const [plan_duration, set_plan_duration] = useState(+data?.plan_duration)
    const [tutors_allowed, set_tutors_allowed] = useState(+data?.tutors_allowed)
    const [courses_allowed, set_courses_allowed] = useState(+data?.courses_allowed)
    const [storage_allowed, set_storage_allowed] = useState(+data?.storage_allowed)

    const [is_loading, set_is_loading] = useState(false)
    const [error_message, set_error_message] = useState("")
    const [success_message, set_success_message] = useState("")

    useEffect(() => {
        set_plan_name(data?.plan_name)
        set_plan_description(data?.plan_description)
        set_plan_price(+data?.plan_price)
        set_plan_medium(data?.plan_medium)
        set_plan_duration(+data?.plan_duration)
        set_tutors_allowed(+data?.tutors_allowed)
        set_courses_allowed(+data?.courses_allowed)
        set_storage_allowed(+data?.storage_allowed)
    }, [data])

    const update_plan = async (e: FormEvent) => {
        e.preventDefault()
        if (!data?.id) return
        if (!plan_name) {
            set_error_message("Plan name is required")
            setTimeout(() => set_error_message(""), 3000);
            return
        }
        if (!plan_description) {
            set_error_message("Plan description is required")
            setTimeout(() => set_error_message(""), 3000);
            return
        }
        if (!plan_duration) {
            set_error_message("Plan duration is required")
            setTimeout(() => set_error_message(""), 3000);
            return
        }
        if (!plan_medium) {
            set_error_message("Plan medium is required")
            setTimeout(() => set_error_message(""), 3000);
            return
        }
        if (!tutors_allowed) {
            set_error_message("Allowed tutors are required")
            setTimeout(() => set_error_message(""), 3000);
            return
        }
        if (!courses_allowed) {
            set_error_message("Allowed courses are required")
            setTimeout(() => set_error_message(""), 3000);
            return
        }
        if (!storage_allowed) {
            set_error_message("Allowed storage is required")
            setTimeout(() => set_error_message(""), 3000);
            return
        }

        const formData = new FormData()
        formData.append("plan_name", plan_name)
        formData.append("plan_description", plan_description)
        formData.append("plan_price", plan_price.toString())
        formData.append("plan_medium", plan_medium)
        formData.append("plan_duration", plan_duration.toString())
        formData.append("tutors_allowed", tutors_allowed.toString())
        formData.append("courses_allowed", courses_allowed.toString())
        formData.append("storage_allowed", storage_allowed.toString())

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/subscription-plans/update/${data?.id}`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => set_error_message(""), 3000);
                return
            }
            set_success_message("Plan updated successfully")
            setTimeout(() => set_success_message(""), 3000);
            get_plans()
            set_data(null)
            set_is_editing(false)

        } catch (error) {
            // console.error(error)
            set_is_loading(false)
            set_error_message("Something went wrong, please try later")
            setTimeout(() => set_error_message(""), 3000);
        }

    }

    return (
        <Fragment>
            {error_message && <AlertMUI text={error_message} status="error" />}
            {success_message && <AlertMUI text={success_message} status="success" />}
            <form className='w-full flex flex-col justify-start items-start gap-4'
                onSubmit={update_plan}
            >
                <TextField
                    label="Plan Name"
                    value={plan_name || ""}
                    onChange={(e: any) => set_plan_name(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Plan Description"
                    value={plan_description || ""}
                    onChange={(e: any) => set_plan_description(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Plan Price In USD"
                    type="number"
                    value={plan_price || 0}
                    onChange={(e: any) => set_plan_price(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Duration"
                    type='number'
                    value={plan_duration || 0}
                    onChange={(e: any) => set_plan_duration(e.target.value)}
                    fullWidth
                />

                <Autocomplete
                    disablePortal
                    options={subscription_plans_medium_plural}
                    value={capitalizeString(plan_medium) || ""}
                    sx={{ marginBottom: 1 }}
                    fullWidth
                    onChange={(e, val: any) => set_plan_medium(val?.toLowerCase())}
                    renderInput={(params) => <TextField {...params} label="Plan Medium" />}
                />

                <TextField
                    label="Tutors Allowed"
                    type='number'
                    value={tutors_allowed || 0}
                    onChange={(e: any) => set_tutors_allowed(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Courses Allowed"
                    type='number'
                    value={courses_allowed || 0}
                    onChange={(e: any) => set_courses_allowed(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Storage Allowed In GBs"
                    type='number'
                    value={storage_allowed || 0}
                    onChange={(e: any) => set_storage_allowed(e.target.value)}
                    fullWidth
                />

                <Button
                    color='secondary'
                    variant='contained'
                    type='submit'
                    disabled={is_loading}
                    fullWidth
                >
                    Update Plan
                </Button>
            </form>
        </Fragment>
    )
}

export default EditPlanForm
