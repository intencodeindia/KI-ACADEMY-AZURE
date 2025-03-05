"use client";

import "./Main.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { authorizationObj, baseUrl } from "@/app/utils/core";
import Table from "./components/Table";
import { Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { IoMdAddCircle } from "react-icons/io";
import FullScreenDialog from "@/app/components/mui/FullScreenDialogue";
import CreateCourseForm from "@/app/components/mui/CreateCourseForm";

const Main = () => {

    const currentUser = useSelector((state: any) => state.user)
    const [courses, set_courses] = useState([]);
    const [show_course_modal, set_show_course_modal] = useState(false)

    const getAllCourses = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/courses/by-instructor/${currentUser?.user_id}`, authorizationObj);
            set_courses(resp?.data?.data);
        } catch (error) {
            // console.error(error);
        }
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    return (
        <>
            <FullScreenDialog
                open={show_course_modal}
                onClose={() => set_show_course_modal(false)}
                headerTitle="Create Course"
                setOpen={set_show_course_modal}
            >
                <CreateCourseForm set_show_course_modal={set_show_course_modal} getAllCourses={getAllCourses} />
            </FullScreenDialog>
            <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1 overflow-x-auto">
                <div className="w-full flex justify-between items-center">
                    <Typography variant="h5" component="h3">Courses</Typography>
                    <Button variant="contained" color="secondary" onClick={() => set_show_course_modal(true)} >
                        <IoMdAddCircle style={{ marginRight: "0.5em" }} /> Add Course
                    </Button>
                </div>
                <Table data={courses} getAllCourses={getAllCourses} />
            </div>
        </>
    );
};

export default Main;
