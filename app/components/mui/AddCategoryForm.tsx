import React, { FormEvent, useState } from 'react'
import AlertMUI from './AlertMUI'
import { Button, TextField } from '@mui/material'
import { IoMdAddCircle } from 'react-icons/io'
import { authorizationObj, baseUrl } from '@/app/utils/core'
import axios from 'axios'

const AddCategoryForm = ({ set_show_sidebar, get_all_categories }: any) => {
    const [error_message, set_error_message] = useState("")
    const [success_message, set_success_message] = useState("")
    const [category_name, set_category_name] = useState("")
    const [category_description, set_category_description] = useState("")
    const [is_loading, set_is_loading] = useState(false)

    const create_category = async (e: FormEvent) => {
        e.preventDefault()
        if (!category_name) {
            set_error_message("Category name is required")
            setTimeout(() => set_error_message(""), 3000)
            return
        }
        if (!category_description) {
            set_error_message("Category description is required")
            setTimeout(() => set_error_message(""), 3000)
            return
        }
        const formData = new FormData()
        formData.append("category_name", category_name)
        formData.append("category_description", category_description)
        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/course-categories/create`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => set_error_message(""), 3000)
                return
            }
            set_category_name("")
            set_category_description("")
            get_all_categories()
            set_show_sidebar(false)
            set_success_message("Category added successfully")
            setTimeout(() => set_success_message(""), 3000)
        } catch (error) {
            set_is_loading(true)
            // console.error(error)
            set_is_loading(false)
            set_error_message("Something went wrong, please try later")
            setTimeout(() => set_error_message(""), 3000)
        }
    }

    return (
        <>
            {error_message && <AlertMUI text={error_message} status="error" />}
            {error_message && <AlertMUI text={success_message} status="success" />}
            <form onSubmit={create_category} className='w-full flex flex-col justify-start items-start gap-4'>
                <TextField
                    label="Category Title" fullWidth
                    variant="outlined" required value={category_name}
                    onChange={(e: any) => set_category_name(e?.target?.value)}
                />
                <TextField
                    label="Category Description" fullWidth
                    variant="outlined" required value={category_description}
                    onChange={(e: any) => set_category_description(e?.target?.value)}
                    multiline rows={8}
                />
                <Button
                    fullWidth type="submit" disabled={is_loading}
                    variant='contained' color="secondary"
                >
                    <IoMdAddCircle style={{ marginRight: "8px", marginTop: "-2px" }} /> Add Category
                </Button>
            </form>
        </>
    )
}

export default AddCategoryForm