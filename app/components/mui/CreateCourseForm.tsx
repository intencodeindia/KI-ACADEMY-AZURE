"use client"

import "./index.css"
import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { Button, Radio, FormControlLabel, RadioGroup, Switch } from "@mui/material"
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { get_courses_categories } from "@/app/utils/functions";
import AlertMUI from "./AlertMUI";
import { useSelector } from "react-redux";
import axios from "axios";
import { authorizationObj, baseUrl, course_language_options, serverToken } from "@/app/utils/core";
import Markdown from "../markdown/Markdown";
import Image from 'next/image'
export const Step1 = ({ set_show_course_modal, getAllCourses }: any) => {

    const currentUser = useSelector((state: any) => state?.user)
    const instituteData = currentUser?.instituteData
    const { Dragger } = Upload

    const [success_message, set_success_message] = useState<null | string>(null)
    const [error_message, set_error_message] = useState<null | string>(null)
    const [is_loading, set_is_loading] = useState(false)
    const [course_category_options, set_course_category_options] = useState<any[]>([])
    const [currencies, set_currencies] = useState<any[]>([])
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [is_public, set_is_public] = useState<any>(false)

    const course_level_options = [
        { label: "Advance", value: "advance" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Beginner", value: "beginner" },
    ]

    useEffect(() => {
        get_categories()
        get_currencies()
    }, [])

    const get_categories = async () => {
        const categories: any = await get_courses_categories()
        set_course_category_options(categories?.data?.data?.map((cat: any) => {
            return { value: cat?.category_id, label: cat?.category_name }
        }))
    }

    const get_currencies = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/payment/get-currency`, authorizationObj)
            set_currencies(resp?.data?.currency)
        } catch (error) {
            // console.error(error)
        }
    }

    const [course_title, set_course_title] = useState("")
    const [course_description, set_course_description] = useState("")
    const [course_category_id, set_course_category_id] = useState("")
    const [course_language, set_course_language] = useState("")
    const [currency, set_currency] = useState("")
    const [course_price, set_course_price] = useState("")
    const [course_level, set_course_level] = useState("")
    const [course_thumbnail, set_course_thumbnail] = useState<any>(null)
    const [course_intro_video, set_course_intro_video] = useState<any>(null)
    const [prices, set_prices] = useState<any>([])

    const submit_course = async () => {

        // if (!instituteData || !instituteData?.institute_id) return

        if (!course_category_id) {
            set_error_message("Course category is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        if (!course_title || course_title.trim() === "") {
            set_error_message("Course title is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        if (!course_language || course_language.trim() === "") {
            set_error_message("Course language is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        if (!course_price) {
            set_error_message("Course price is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        if (!currency) {
            set_error_message("Currency is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        if (!course_level || !course_level?.length || !course_level[0]) {
            set_error_message("Course level is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        if (!course_description || course_description?.trim() === "") {
            set_error_message("Course description is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        if (!course_thumbnail) {
            set_error_message("Course thumbnail is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        if (!course_intro_video) {
            set_error_message("Course intro video is required")
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
            return
        }

        try {
            set_is_loading(true)

            const formData = new FormData()

            formData.append("course_title", course_title)
            formData.append("course_description", course_description)
            formData.append("instructor_id", currentUser?.user_id)
            formData.append("course_category_id", course_category_id)
            formData.append("course_language", course_language)
            formData.append("currency", currency)
            formData.append("course_price", course_price)
            formData.append("course_level", course_level)
            formData.append("course_thumbnail", course_thumbnail)
            formData.append("course_intro_video", course_intro_video)
            formData.append("is_public", is_public)
            if (instituteData && instituteData?.institute_id) {
                formData.append("institute_id", instituteData?.institute_id)
            }

            const resp = await axios.post(`${baseUrl}/courses/create`, formData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: serverToken,
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            if (resp.data.status > 299 || resp.data.status < 200) {
                set_error_message(resp.data.message)
                setTimeout(() => {
                    set_error_message(null)
                }, 3000)
                set_is_loading(false)
                return
            }

            set_success_message("Course created successfully")
            set_is_loading(false)
            setTimeout(() => {
                set_success_message(null)
                set_show_course_modal(false)
            }, 2000)
            getAllCourses()

        } catch (error) {
            // console.error(error)
            set_is_loading(false)
            set_error_message("Something went wrong, please try later")
            setTimeout(() => {
                set_error_message(null)
            }, 3000)
        }

    }

    const handle_category_change = (e: any, newVal: any) => {
        set_course_category_id(newVal?.value)
    }

    const handleCurrencyChange = async (e: any, newVal: any) => {
        set_currency(newVal)
        try {
            const resp = await axios.get(`${baseUrl}/payment/get-priceMatrix/${newVal}`, authorizationObj)
            const processed_data = resp?.data?.data?.map((d: any) => ({
                value: d?.ID,
                label: d?.tier_price
            }))
            set_prices(processed_data)
        } catch (error) {
            // console.error(error)
        }
    }

    const [thumbnail_list, set_thumbnail_list] = useState([]);
    const [video_list, set_video_list] = useState([]);

    const handleChangeThumbnail = (info: any) => {
        if (!info?.fileList?.length) {
            setThumbnailPreview(null)
            set_thumbnail_list([])
            return
        }
        set_thumbnail_list(info.fileList.slice(-1));
        const file = info.file;
        set_course_thumbnail(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setThumbnailPreview(reader.result as string);
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleChangeVideo = (info: any) => {
        if (!info?.fileList?.length) {
            setVideoPreview(null)
            set_video_list([])
            return
        }
        set_video_list(info.fileList.slice(-1));
        const file = info.file;
        set_course_intro_video(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setVideoPreview(reader.result as string);
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        set_course_level(value);
    };

    return (
        <>
            {error_message && <AlertMUI status="error" text={error_message} />}
            {success_message && <AlertMUI status="success" text={success_message} />}
            <div className='w-full flex flex-col justify-start items-start gap-4 hide-scrollbar'>
                <div className='w-full flex flex-col justify-start items-start gap-4'>
                    <Autocomplete
                        disablePortal
                        options={course_category_options}
                        renderInput={(params) => <TextField {...params} label="Course Category" required />}
                        fullWidth
                        onChange={handle_category_change}
                    />
                    <div className='w-full flex justify-start items-start gap-4'>
                        <TextField id="outlined-basic-1" label="Course Title" variant="outlined" required
                            sx={{ width: "66%" }}
                            onChange={(e: any) => set_course_title(e?.target?.value)}
                        />
                        <Autocomplete
                            disablePortal
                            options={course_language_options}
                            renderInput={(params) => <TextField {...params} label="Course Language" required />}
                            fullWidth
                            onChange={(e, val: any) => set_course_language(val)}
                            sx={{ width: "33%" }}
                        />
                    </div>
                    <div className='w-full flex justify-start items-start gap-4'>
                        <Autocomplete
                            disablePortal
                            options={currencies}
                            renderInput={(params) => <TextField {...params} label="Currency" required />}
                            fullWidth
                            onChange={handleCurrencyChange}
                        />
                        <Autocomplete
                            disablePortal
                            options={prices}
                            renderInput={(params) => <TextField {...params} label="Course Price" required />}
                            fullWidth
                            onChange={(e, val: any) => set_course_price(val?.value)}
                        />
                    </div>
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-4'>
                    <Markdown
                        label="Course Descrpition"
                        value={course_description}
                        onChange={(val: any) => set_course_description(val)}
                    />
                </div>
                <div className="w-full flex flex-col justify-start items-start mt-4">
                    <p className="w-full text-left text-xl font-semibold mb-2">{`Course Level (may select more than one)`}</p>
                    <div className="flex justify-start items-start gap-4">
                        <RadioGroup
                            value={course_level}
                            onChange={handleRadioChange}
                            row
                        >
                            {course_level_options?.map((level: any, i: number) => (
                                <FormControlLabel
                                    key={i}
                                    control={
                                        <Radio
                                            value={level?.value}
                                            size="small"
                                        />
                                    }
                                    label={level?.label}
                                />
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            </div>
            <p className="w-full text-left text-xl font-semibold mb-2">Course Thumbnail</p>
            <Dragger accept="image/*" style={{ width: "100%" }} multiple={false}
                beforeUpload={() => { return false }}
                fileList={thumbnail_list}
                onChange={handleChangeThumbnail}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Course Thumbnail</p>
                <p className="ant-upload-hint">
                    Support for a single file upload. Strictly prohibited from uploading company data or other banned files.
                </p>
            </Dragger>
            {thumbnailPreview && (
                <div className="w-full mt-4">
                    <Image src={thumbnailPreview} alt="Course Thumbnail Preview"
                        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
                        className="border"
                    />
                </div>
            )}
            <p className="w-full text-left text-xl font-semibold mb-2 mt-8">Course Intro Video</p>
            <Dragger accept="video/*" style={{ width: "100%" }} multiple={false} className="mb-8"
                beforeUpload={() => { return false }}
                fileList={video_list}
                onChange={handleChangeVideo}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Course Intro Video</p>
                <p className="ant-upload-hint">
                    Support for a single file upload. Strictly prohibited from uploading company data or other banned files.
                </p>
            </Dragger>
            {videoPreview && (
                <div className="w-full mt-4">
                    <video width="100%" height="auto" controls className="border">
                        <source src={videoPreview} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

            {
                currentUser?.instituteData ?
                    <div className="w-full flex justify-end items-ceneter pl-4">
                        <FormControlLabel control={<Switch checked={is_public} />} label="Also publish for KI Academy"
                            onChange={(e: any) => set_is_public(e?.target?.checked)}
                        />
                    </div> : null
            }

            <Button disabled={is_loading} color="primary" variant="contained" sx={{ paddingX: "4em" }}
                onClick={submit_course}
            >{is_loading ? <><span className="buttonLoader"></span> Creating</> : "Submit"}</Button>
        </>
    )
}

export const Stepper = ({ step }: any) => {
    return (
        <>
            <div className="line"
                style={{ background: `linear-gradient(to right, #000 ${(step / 2) * 100}%, #dbdbdb ${(step / 2) * 100}%)` }}
            ></div>
        </>
    )
}

const CreateCourseForm = ({ set_show_course_modal, getAllCourses }: any) => {

    return (
        <>
            <div className='w-full flex flex-col justify-start items-start gap-4 p-8'>
                <Step1 set_show_course_modal={set_show_course_modal} getAllCourses={getAllCourses} />
            </div>
        </>
    )
}

export default CreateCourseForm
