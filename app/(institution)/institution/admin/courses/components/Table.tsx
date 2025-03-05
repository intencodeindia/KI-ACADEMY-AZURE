import "./Main.css";
import * as React from "react";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import defaultCourseImage from "../../../../../../public/images/banner.jpg"
import { IoMdEye } from "react-icons/io";
import {
    Card, CardContent, Grid, TextField, Typography, Divider,
    Autocomplete, Rating,
    Button,
    FormControlLabel,
    Checkbox,
    Switch
} from "@mui/material";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import ConfirmAlertMUI from "@/app/components/mui/ConfirmAlertMUI";
import axios from "axios";
import { authorizationObj, baseUrl, course_language_options, courseThumbnailPath, courseVideoPath, lectureVideoPath } from "@/app/utils/core";
import AlertMUI from "@/app/components/mui/AlertMUI";
import FullScreenDialog from "@/app/components/mui/FullScreenDialogue";
import { capitalizeString, shuffleArray } from "@/app/utils/functions";
import MainEditableAccordionMUI from "@/app/components/mui/EditableAccordionMUI";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccordionMUI from "@/app/components/mui/AccordionMUI";
import 'react-markdown-editor-lite/lib/index.css';
import Markdown from "@/app/components/markdown/Markdown";
import Image from 'next/image'
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

export const SingleQuestion = ({ get_questions, question, quiz, singleCourse, is_loading, set_is_loading, set_error_message, set_success_message, section_id }: any) => {
    const [question_text, set_question_text] = React.useState(question?.question_text);
    const [explanation, set_explanation] = React.useState(question?.description);
    const [answers, set_answers] = React.useState<any[]>(JSON.parse(question?.answers));
    const [alertData, setAlertdata] = React.useState<any>(null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    React.useEffect(() => {
        set_question_text(question?.question_text);
        set_answers(JSON.parse(question?.answers) || []);
    }, [question]);

    const handleAnswerChange = (index: number, field: string, value: any) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index][field] = value;
        set_answers(updatedAnswers);
    };

    const addAnswerOption = () => {
        set_answers([...answers, { answer_text: "", is_correct: false }]);
    };

    const update_question = async () => {
        if (!question?.question_id?.trim()) return;

        if (!question_text || question_text.trim() === "") {
            set_error_message("Question is required.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!explanation || explanation.trim() === "") {
            set_error_message("Question explanation is required.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (answers.some(answer => !answer?.text || answer?.text?.trim() === "")) {
            set_error_message("All answer options must be filled.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!answers.some(answer => answer.isCorrect)) {
            set_error_message("At least one answer must be marked as correct.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData();
        formData.append("question_text", question_text);
        formData.append("description", explanation);
        formData.append("answers", JSON.stringify(answers));

        try {
            set_is_loading(true);
            const resp = await axios.post(`${baseUrl}/questions/update/${question?.question_id}`, formData, authorizationObj);
            set_is_loading(false);
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message);
            }
            get_questions();
            set_success_message("Question updated successfully.");
        } catch (error) {
            // console.error(error);
            set_is_loading(false);
            set_error_message("Failed to update the question.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    };

    const delete_question_confirmation = () => {
        if (!question?.question_id?.trim()) return;
        setAlertdata({
            title: "Delete Question?",
            description: "Are you sure you want to delete this question? The action cannot be undone.",
            fun: () => delete_question(question.question_id),
        });
        setIsAlertOpen(true);
    };

    const delete_question = async (questionId: string) => {
        if (!questionId.trim()) return;

        try {
            set_is_loading(true);
            const resp = await axios.delete(`${baseUrl}/questions/delete/${questionId}`, authorizationObj);
            set_is_loading(false);
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message);
            }
            setIsAlertOpen(false);
            set_success_message("Question deleted successfully.");
            get_questions();
        } catch (error) {
            // console.error(error);
            setIsAlertOpen(false);
            set_is_loading(false);
            set_error_message("Failed to delete the question.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    };

    return (
        <>
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={is_loading}
            />
            <Grid item xs={12}>
                <TextField
                    label="Question"
                    value={question_text || ""}
                    color="primary"
                    variant="outlined"
                    sx={{ marginBottom: 1, width: "100%" }}
                    onChange={(e) => set_question_text(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Question Explanation"
                    value={explanation || ""}
                    color="primary"
                    variant="outlined"
                    sx={{ marginBottom: 1, width: "100%" }}
                    onChange={(e) => set_explanation(e.target.value)}
                />
            </Grid>
            {answers.map((answer, index) => (
                <Grid item xs={12} sm={6} key={index} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Checkbox
                        checked={answer?.isCorrect}
                        onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                    />
                    <TextField
                        label={`Option ${index + 1}`}
                        value={answer?.text || ""}
                        color={answer?.isCorrect ? "success" : "error"}
                        variant="outlined"
                        sx={{ marginBottom: 1, flexGrow: 1 }}
                        onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                    />
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button onClick={addAnswerOption} color="secondary" variant="contained" sx={{ marginTop: "8px" }}>
                    Add Another Option
                </Button>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
                <Button onClick={update_question} color="secondary" variant="contained" disabled={is_loading}>
                    Save Question
                </Button>
                <Button onClick={delete_question_confirmation} color="secondary" variant="contained" disabled={is_loading}>
                    Delete Question
                </Button>
            </Grid>
        </>
    );
};

export const QuestionAnswers = ({
    quiz,
    singleCourse,
    is_loading,
    set_is_loading,
    set_error_message,
    set_success_message,
    section_id,
}: any) => {

    const [questions, set_questions] = React.useState<any[]>([]);
    const [question, set_question] = React.useState("");
    const [explanation, set_explanation] = React.useState("");
    const [answers, set_answers] = React.useState([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);

    React.useEffect(() => {
        if (quiz?.quiz_id) get_questions();
    }, [quiz]);

    const get_questions = async () => {
        if (!quiz || !quiz?.quiz_id?.trim()) return;
        try {
            const resp = await axios.get(`${baseUrl}/questions/${quiz?.quiz_id}`, authorizationObj);
            if (resp?.data?.data) {
                set_questions(resp?.data?.data);
            } else {
                set_questions([]);
            }
        } catch (error) {
            // console.error(error);
            set_questions([]);
        }
    };

    const handleAnswerChange = (index: number, field: string, value: any) => {
        const updatedAnswers: any = [...answers];
        updatedAnswers[index][field] = value;
        set_answers(updatedAnswers);
    };

    const addAnswerField = () => {
        set_answers([...answers, { text: "", isCorrect: false }]);
    };

    const add_question = async () => {
        if (!quiz?.quiz_id?.trim()) return

        if (!question || !question?.trim()) {
            set_error_message("Question is required.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!explanation || !explanation?.trim()) {
            set_error_message("Question explanation is required.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!answers.every(answer => answer?.text && answer?.text?.trim())) {
            set_error_message("All answer options must be filled.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!answers.some((answer: any) => answer.isCorrect)) {
            set_error_message("At least one answer must be marked as correct.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData();
        formData.append("question_text", question);
        formData.append("quiz_id", quiz.quiz_id);
        formData.append("answers", JSON.stringify(answers));
        formData.append("description", explanation);

        try {
            set_is_loading(true);
            const resp = await axios.post(`${baseUrl}/questions/create`, formData, authorizationObj);
            set_is_loading(false);
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message);
            }
            set_question("");
            set_explanation("");
            set_answers([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
            get_questions();
            set_success_message("Question added successfully");
        } catch (error) {
            // console.error(error);
            set_is_loading(false);
            set_error_message("Failed to add the question");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    };

    return (
        <>
            <Grid item xs={12}><Typography sx={{ fontSize: "22px", fontWeight: "semi-bold" }}>Questions</Typography></Grid>
            <Grid item xs={12}>
                <TextField
                    label="Enter Question"
                    value={question || ""}
                    variant="outlined"
                    sx={{ marginBottom: 1, width: "100%" }}
                    onChange={(e) => set_question(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Question Explanation"
                    value={explanation || ""}
                    variant="outlined"
                    sx={{ marginBottom: 1, width: "100%" }}
                    onChange={(e) => set_explanation(e.target.value)}
                />
            </Grid>

            {answers.map((answer, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <TextField
                        label={`Option ${index + 1}`}
                        value={answer.text || ""}
                        variant="outlined"
                        sx={{ marginBottom: 1, width: "80%" }}
                        onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                        type="text"
                        required={true}
                        color={answer?.isCorrect ? "success" : "error"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={answer?.isCorrect}
                                onChange={(e: any) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                            />
                        }
                        label="Correct Answer"
                    />
                </Grid>
            ))}

            <Grid item xs={12}>
                <Button variant="contained" color="secondary" onClick={addAnswerField} sx={{ marginTop: 2 }}>
                    Add Another Option
                </Button>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                <Button
                    color="secondary" variant="contained" disabled={is_loading}
                    sx={{ width: "200px" }}
                    onClick={add_question}
                >
                    {is_loading ? "Adding" : "Add Question"}
                </Button>
            </Grid>

            {questions?.map((question: any, i: number) => (
                <SingleQuestion
                    key={i}
                    question={question}
                    get_questions={get_questions}
                    section_id={section_id}
                    singleCourse={singleCourse}
                    is_loading={is_loading}
                    set_is_loading={set_is_loading}
                    set_error_message={set_error_message}
                    set_success_message={set_success_message}
                    quiz={quiz}
                />
            ))}
        </>
    );
};

export const Quiz = ({ singleCourse, is_loading, set_is_loading, set_error_message, set_success_message, section_id }: any) => {

    const [quiz, set_quiz] = React.useState<any>(null)
    const [quiz_title, set_quiz_title] = React.useState("")
    const [quiz_description, set_quiz_description] = React.useState("")

    const [alertData, setAlertdata] = React.useState<any>(null)
    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false)

    React.useEffect(() => {
        get_quiz()
    }, [singleCourse?.course_id])

    const get_quiz = async () => {
        if (!section_id || section_id?.trim() === "") return
        try {
            const resp = await axios.get(`${baseUrl}/quizzes/${section_id}`, authorizationObj)
            if (resp?.data?.data) {
                set_quiz(resp?.data?.data)
                set_quiz_title(resp?.data?.data?.title)
                set_quiz_description(resp?.data?.data?.description)
            }
        } catch (error) {
            // console.error(error)
            set_quiz(null)
        }
    }

    const create_quiz = async () => {
        if (!section_id || section_id?.trim() === "") return

        if (!quiz_title || quiz_title.trim() === "") {
            set_error_message("Quiz title is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!quiz_description || quiz_description.trim() === "") {
            set_error_message("Quiz description is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("title", quiz_title)
        formData.append("description", quiz_description)
        formData.append("section_id", section_id)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/quizzes/create`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            set_quiz_title("")
            get_quiz()
            set_success_message("Quiz added Sucessfully")
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to add the quiz");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    const update_quiz = async () => {
        if (!quiz) return
        if (!quiz?.quiz_id || quiz?.quiz_id?.trim() === "") return

        if (!quiz_title || quiz_title.trim() === "") {
            set_error_message("Quiz title is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!quiz_description || quiz_description.trim() === "") {
            set_error_message("Quiz description is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("title", quiz_title)
        formData.append("description", quiz_description)
        formData.append("section_id", section_id)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/quizzes/update/${quiz?.quiz_id}`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            set_quiz_title("")
            get_quiz()
            set_success_message("Quiz updated Sucessfully")
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to update the quiz");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }

    }

    return (
        <>
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={is_loading}
            />
            <AccordionMUI
                title={<Typography variant="h6" sx={{ fontWeight: "semi-bold" }}>Quiz</Typography>}
                summary={
                    <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: "semi-bold", marginLeft: "16px", marginBottom: "16px", marginTop: "8px" }}>Create or update a quiz</Typography>
                        <Grid item xs={12}>
                            <TextField
                                label="Quiz Title"
                                value={quiz_title || ""}
                                variant="outlined"
                                sx={{ marginBottom: 1, width: "100%" }}
                                onChange={(e: any) => set_quiz_title(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Markdown
                                label="Quiz Description"
                                value={quiz_description}
                                onChange={(text: any) => set_quiz_description(text)}
                            />
                        </Grid>
                        <Grid item xs={12}
                            sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "8px" }}
                        >
                            <Button
                                color="secondary" variant="contained" disabled={is_loading}
                                sx={{ width: "200px" }}
                                onClick={quiz ? update_quiz : create_quiz}
                            >{
                                    quiz ?
                                        is_loading ? "Updating..." : "Save Changes"
                                        :
                                        is_loading ? "Adding..." : "Add Quiz"
                                }</Button>
                        </Grid>
                        <QuestionAnswers
                            section_id={section_id}
                            singleCourse={singleCourse}
                            is_loading={is_loading}
                            set_is_loading={set_is_loading}
                            set_error_message={set_error_message}
                            set_success_message={set_success_message}
                            quiz={quiz}
                        />
                    </Grid>
                }
            />
        </>
    )
}

export const SingleLecture = ({ lecture, get_lectures, section_id, singleCourse, is_loading, set_is_loading, set_error_message, set_success_message }: any) => {

    const videoInputRef: any = React.useRef()

    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const [alertData, setAlertdata] = React.useState<any>(null)
    const [lecture_title, set_lecture_title] = React.useState(lecture?.lecture_title)
    const [lecture_video, set_lecture_video] = React.useState<any>(null)
    const [lecture_video_url, set_lecture_video_url] = React.useState<any>(`${lectureVideoPath}/${lecture?.lecture_video_url}`)
    const [lecture_description, set_lecture_description] = React.useState(lecture?.content)
    const [media_type, set_media_type] = React.useState(lecture?.file_type)

    const update_lecture = async () => {

        if (!lecture?.lecture_id || lecture?.lecture_id?.trim() === "") return
        if (!section_id || section_id?.trim() === "") return

        if (!lecture_title || lecture_title?.trim() === "") {
            set_error_message("Lecture title is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("lecture_title", lecture_title)
        formData.append("section_id", section_id)
        if (lecture_video) {
            formData.append("lecture_video", lecture_video)
        }

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/lectures/update/${lecture?.lecture_id}`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            set_success_message("Lecture Updated Sucessfully")
            get_lectures()
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to update the lecture");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    const delete_lecture = async (lectureId: string) => {

        if (!lectureId || lectureId?.trim() === "") return

        try {
            set_is_loading(true)
            const resp = await axios.delete(`${baseUrl}/lectures/delete/${lectureId}`, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            setIsAlertOpen(false)
            set_success_message("Lecture Deleted Sucessfully")
            get_lectures()
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            setIsAlertOpen(false)
            set_is_loading(false)
            set_error_message("Failed to delete the lecture");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    const delete_lecture_confirmation = () => {

        if (!lecture?.lecture_id || lecture?.lecture_id?.trim() === "") return

        setAlertdata({
            title: "Delete Lecture?",
            description: "Are you sure you want to delete this lecture?. The action cannot be undone",
            fun: () => delete_lecture(lecture?.lecture_id),
        })
        setIsAlertOpen(true)

    }

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: any = e.target.files[0];
            set_lecture_video(file);
            set_media_type(file.type);
            if (lecture_video_url) {
                URL.revokeObjectURL(lecture_video_url);
            }
            set_lecture_video_url(null);
            setTimeout(() => {
                set_lecture_video_url(URL.createObjectURL(file));
            }, 0);
        }
    };

    return (
        <>
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={is_loading}
            />
            <Divider sx={{ marginBottom: 2, marginLeft: "8px" }} />
            <Typography className="pl-2">{moment(lecture?.created_at).format("DD/MM/YYYY hh:mm A")}</Typography>
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid item xs={12}>
                    <TextField
                        label="Lecture Title"
                        value={lecture_title || ""}
                        variant="outlined"
                        sx={{ marginBottom: 1, width: "100%" }}
                        onChange={(e: any) => set_lecture_title(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Markdown
                        label="Lecture Description"
                        value={lecture_description}
                        onChange={(text: any) => set_lecture_description(text)}
                    />
                </Grid>
                <Grid item xs={12}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    <input type="file" ref={videoInputRef} id="lecture-create-video" accept="video/*, image/*" hidden multiple={false}
                        onChange={handleVideoChange}
                        className="cursor-pointer"
                    />
                    {
                        media_type?.startsWith("video") ?
                            <div className="w-full h-[300px]" onClick={() => videoInputRef.current?.click()}>
                                <video src={lecture_video_url} controls
                                    className="border-2 w-full h-full object-cover object-center rounded-[4px] cursor-pointer bg-black"
                                /></div> : media_type?.startsWith("image") ?
                                <div className="w-full h-full" onClick={() => videoInputRef.current?.click()}>
                                    <Image src={lecture_video_url}
                                        alt="lecture media"
                                        className="border-2 w-full h-full object-contain object-center rounded-[4px] cursor-pointer"
                                    /> </div> : null
                    }
                </Grid>
                <Grid item xs={12}
                    sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "8px", gap: "16px" }}
                >
                    <Button
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40px" }}
                        onClick={update_lecture} color="secondary" variant="contained"
                    > <EditIcon sx={{ fontSize: "16px", marginRight: "8px" }} /> <span className='mt-[3px]'>Save Lecture</span></Button>
                    <Button
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40px" }}
                        onClick={delete_lecture_confirmation} color="secondary" variant="contained"
                    > <DeleteIcon sx={{ fontSize: "16px", marginRight: "8px" }} /> <span className='mt-[3px]'>Delete Lecture</span></Button>
                </Grid>
            </Grid>
        </>
    )
}

export const Lecture = ({ singleCourse, is_loading, set_is_loading, set_error_message, set_success_message, section_id }: any) => {

    const lectureMediaRef: any = React.useRef()
    const [lectures, set_lectures] = React.useState<any[]>([])
    const [lecture_title, set_lecture_title] = React.useState("")
    const [lecture_video, set_lecture_video] = React.useState<any>("")
    const [lecture_video_url, set_lecture_video_url] = React.useState<string | null>(null);
    const [lecture_media_type, set_lecture_media_type] = React.useState("")

    const [alertData, setAlertdata] = React.useState<any>(null)
    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false)
    const [lecture_description, set_lecture_description] = React.useState("")

    React.useEffect(() => {
        get_lectures()
    }, [singleCourse?.course_id])

    React.useEffect(() => {
        return () => {
            if (lecture_video_url) {
                URL.revokeObjectURL(lecture_video_url);
            }
        }
    })

    const get_lectures = async () => {
        if (!section_id || section_id?.trim() === "") return
        try {
            const resp = await axios.get(`${baseUrl}/lectures/by-section/${section_id}`, authorizationObj)
            if (resp?.data?.data && resp?.data?.data?.length && resp?.data?.data[0]) {
                set_lectures(resp?.data?.data)
            }
        } catch (error) {
            // console.error(error)
            set_lectures([])
        }
    }

    const create_lecture = async () => {
        if (!section_id || section_id?.trim() === "") return
        if (!lecture_media_type) return

        if (!lecture_title || lecture_title.trim() === "") {
            set_error_message("Lecture title is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!lecture_description || lecture_description.trim() === "") {
            set_error_message("Lecture description is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!lecture_video) {
            set_error_message("Lecture media is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("lecture_title", lecture_title)
        formData.append("section_id", section_id)
        formData.append("lecture_video", lecture_video)
        formData.append("file_type", lecture_media_type)
        formData.append("content", lecture_description)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/lectures/create`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            set_lecture_title("")
            set_lecture_description("")
            set_lecture_video(null)
            get_lectures()
            set_success_message("Lecture added Sucessfully")
            set_lecture_video_url(null)
            set_lecture_media_type("")
            lectureMediaRef.current = ""
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to add the lecture");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file: any = e.target.files[0];
            set_lecture_video(file);
            set_lecture_media_type(file.type);
            if (lecture_video_url) {
                URL.revokeObjectURL(lecture_video_url);
            }
            set_lecture_video_url(null);
            setTimeout(() => {
                set_lecture_video_url(URL.createObjectURL(file));
            }, 0);
        }
    };

    return (
        <>
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={is_loading}
            />
            <AccordionMUI
                title={
                    <Typography variant="h6" sx={{ fontWeight: "semi-bold" }}>Lectures</Typography>
                }
                summary={
                    <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: "semi-bold", marginLeft: "16px" }}>Create a lecture</Typography>
                        <Grid item xs={12}>
                            <TextField
                                label="Lecture Title"
                                value={lecture_title || ""}
                                variant="outlined"
                                sx={{ marginBottom: 1, width: "100%" }}
                                onChange={(e: any) => set_lecture_title(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Markdown
                                label="Lecture Description"
                                value={lecture_description}
                                onChange={(text: any) => set_lecture_description(text)}
                            />
                        </Grid>
                        <Grid item xs={12}
                            sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
                        >
                            <input type="file" id="lecture-create-video" hidden={lecture_video}
                                accept="video/*, image/*" multiple={false}
                                onChange={handleVideoChange}
                                className="cursor-pointer"
                                ref={lectureMediaRef}
                            />
                            <label htmlFor="lecture-create-video">
                                {
                                    lecture_video_url ?
                                        (
                                            lecture_media_type?.startsWith("image") ?
                                                <><Image src={lecture_video_url} alt="lecture media"
                                                    className="h-[300px] object-cover object-center cursor-pointer border"
                                                /></>
                                                :
                                                lecture_media_type?.startsWith("video") ?
                                                    <><video src={lecture_video_url} controls
                                                        className="h-[300px] bg-black cursor-pointer border"
                                                        onClick={() => document.getElementById("lecture-create-video")?.click()}
                                                    /></>
                                                    : null
                                        )
                                        : null
                                }
                            </label>
                        </Grid>
                        <Grid item xs={12}
                            sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "8px" }}
                        >
                            <Button
                                color="secondary" variant="contained" disabled={is_loading}
                                sx={{ width: "200px" }}
                                onClick={create_lecture}
                            >{is_loading ? "Adding..." : "Add Lecture"}</Button>
                        </Grid>
                        <Typography variant="h6" sx={{ fontWeight: "semi-bold", marginLeft: "16px", marginTop: "16px" }}>All lectures</Typography>
                        {
                            lectures?.map((lecture: any, i: number) => (
                                <Grid item xs={12} key={i}>
                                    <SingleLecture
                                        lecture={lecture}
                                        section_id={section_id}
                                        singleCourse={singleCourse}
                                        is_loading={is_loading}
                                        set_is_loading={set_is_loading}
                                        set_error_message={set_error_message}
                                        set_success_message={set_success_message}
                                        get_lectures={get_lectures}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                }
            />
        </>
    )
}

export const Sections = ({ singleCourse, is_loading, set_is_loading, set_error_message, set_success_message }: any) => {

    const [course_sections, set_course_sections] = React.useState<any[]>([])
    const [section_title, set_section_title] = React.useState("")
    const [section_description, set_section_description] = React.useState("")
    const [alertData, setAlertdata] = React.useState<any>(null)
    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false)

    React.useEffect(() => {
        get_course_sections()
    }, [singleCourse?.course_id])

    const get_course_sections = async () => {
        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return
        try {
            const resp = await axios.get(`${baseUrl}/course-sections/by-course/${singleCourse?.course_id}`, authorizationObj)
            if (resp?.data?.data && resp?.data?.data?.length && resp?.data?.data[0]) {
                set_course_sections(resp?.data?.data)
            }
        } catch (error) {
            // console.error(error)
            set_course_sections([])
        }
    }

    const create_course_section = async () => {
        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return

        if (!section_title || section_title.trim() === "") {
            set_error_message("Unit title is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!section_description || section_description.trim() === "") {
            set_error_message("Unit description is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("title", section_title)
        formData.append("description", section_description)
        formData.append("course_id", singleCourse?.course_id)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/course-sections/create`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            set_section_title("")
            get_course_sections()
            set_success_message("Course unit created Sucessfully")
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to add the course unit");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    const update_course_section = async (title: string, description: string, sectionId: string) => {

        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return
        if (!sectionId || sectionId?.trim() === "") return

        if (!title || title.trim() === "") {
            set_error_message("Unit title is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!description || description.trim() === "") {
            set_error_message("Unit description is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("title", title)
        formData.append("description", description)
        formData.append("course_id", singleCourse?.course_id)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/course-sections/update/${sectionId}`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            set_success_message("Unit Updated Sucessfully")
            get_course_sections()
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to update the Unit");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    const delete_course_section = async (sectionId: string) => {

        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return
        if (!sectionId || sectionId?.trim() === "") return

        try {
            set_is_loading(true)
            const resp = await axios.delete(`${baseUrl}/course-sections/delete/${sectionId}`, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            setIsAlertOpen(false)
            set_success_message("Unit Deleted Sucessfully")
            get_course_sections()
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            setIsAlertOpen(false)
            set_is_loading(false)
            set_error_message("Failed to delete the unit");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    const delete_section_confirmation = (sectionId: string) => {

        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return
        if (!sectionId || sectionId?.trim() === "") return

        setAlertdata({
            title: "Delete Unit?",
            description: "Are you sure you want to delete this unit?. The action cannot be undone",
            fun: () => delete_course_section(sectionId),
        })
        setIsAlertOpen(true)

    }

    return (
        <>
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={is_loading}
            />
            <Divider sx={{ marginTop: 4 }} />
            <Typography variant="h6" sx={{ fontWeight: "semi-bold", marginTop: 2 }}>
                Course Units
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
                <Grid item xs={12}>
                    <TextField
                        label="New Unit Title"
                        value={section_title || ""}
                        // InputProps={{ readOnly: true }}
                        variant="outlined"
                        sx={{ marginBottom: 1, width: "100%" }}
                        onChange={(e: any) => set_section_title(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Markdown
                        label="Unit Description"
                        value={section_description || ""}
                        onChange={(text: any) => set_section_description(text)}
                    />
                </Grid>
                <Grid item xs={12}
                    sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "8px" }}
                >
                    <Button
                        color="secondary" variant="contained" disabled={is_loading}
                        sx={{ width: "200px" }}
                        onClick={create_course_section}
                    >{is_loading ? "Creating..." : "Create Unit"}</Button>
                </Grid>
                {
                    course_sections?.map((sec: any, i: number) => (
                        <Grid item xs={12} key={i}
                            sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
                        >
                            <MainEditableAccordionMUI
                                onEdit={(title: any, description: any) => update_course_section(title, description, sec?.section_id)}
                                onDelete={() => delete_section_confirmation(sec?.section_id)}
                                time={sec?.created_at}
                                title={sec?.title}
                                description={sec?.description}
                                summary={
                                    <>
                                        <Lecture
                                            section_id={sec?.section_id}
                                            singleCourse={singleCourse}
                                            is_loading={is_loading}
                                            set_is_loading={set_is_loading}
                                            set_error_message={set_error_message}
                                            set_success_message={set_success_message}
                                        />
                                        <Quiz
                                            section_id={sec?.section_id}
                                            singleCourse={singleCourse}
                                            is_loading={is_loading}
                                            set_is_loading={set_is_loading}
                                            set_error_message={set_error_message}
                                            set_success_message={set_success_message}
                                        />
                                    </>
                                }
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </>
    )
}

export const AdditionalInfo = ({ singleCourse, is_loading, set_is_loading, set_error_message, set_success_message }: any) => {

    const [course_additional_information, set_course_additional_information] = React.useState<any>(null)
    const [old_info, set_old_info] = React.useState(false)

    React.useEffect(() => {
        set_old_info(
            course_additional_information?.requirements &&
            course_additional_information?.what_you_will_learn &&
            course_additional_information?.who_is_for
        )
    }, [course_additional_information])

    React.useEffect(() => {
        set_requirements(course_additional_information?.requirements)
        set_what_you_will_learn(course_additional_information?.what_you_will_learn)
        set_who_is_for(course_additional_information?.who_is_for)
    }, [course_additional_information])

    React.useEffect(() => {
        get_course_additional_information()
    }, [singleCourse?.course_id])

    const [requirements, set_requirements] = React.useState(course_additional_information?.requirements)
    const [what_you_will_learn, set_what_you_will_learn] = React.useState(course_additional_information?.what_you_will_learn)
    const [who_is_for, set_who_is_for] = React.useState(course_additional_information?.who_is_for)

    const get_course_additional_information = async () => {
        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return
        try {
            const resp = await axios.get(`${baseUrl}/courses/${singleCourse?.course_id}/additional`, authorizationObj)
            if (resp?.data?.data && resp?.data?.data?.length && resp?.data?.data[0]) {
                set_course_additional_information(resp?.data?.data[0])
            }
        } catch (error) {
            // console.error(error)
            set_course_additional_information(null)
        }
    }

    const create_course_additional_information = async () => {
        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return

        if (!requirements || requirements.trim() === "") {
            set_error_message("Course requirements are required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!what_you_will_learn || what_you_will_learn.trim() === "") {
            set_error_message("Course results are required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!who_is_for || who_is_for.trim() === "") {
            set_error_message("Please specify who the course is for.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("who_is_for", who_is_for)
        formData.append("requirements", requirements)
        formData.append("what_you_will_learn", what_you_will_learn)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/courses/${singleCourse?.course_id}/additional/create`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
                return
            }
            set_success_message("Course Information added Sucessfully")
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
            set_old_info(true)
            get_course_additional_information()
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to add the course information");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    const update_additional_info = async () => {

        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return
        if (!course_additional_information?.course_additional_id || course_additional_information?.course_additional_id.trim() === "") return

        if (!requirements || requirements.trim() === "") {
            set_error_message("Course requirements are required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!what_you_will_learn || what_you_will_learn.trim() === "") {
            set_error_message("Course results are required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!who_is_for || who_is_for.trim() === "") {
            set_error_message("Please specify who the course is for.");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("who_is_for", who_is_for)
        formData.append("requirements", requirements)
        formData.append("what_you_will_learn", what_you_will_learn)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/courses/${singleCourse?.course_id}/additional/update/${course_additional_information?.course_additional_id}`, formData, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
                return
            }
            set_success_message("Course Information Updated Sucessfully")
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
            get_course_additional_information()
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to update the course information");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    }

    return (
        <>
            <Divider sx={{ marginTop: 4 }} />
            <Typography variant="h6" sx={{ fontWeight: "semi-bold", marginTop: 2 }}>
                More Info
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
                <Grid item xs={12}>
                    <Markdown
                        label="Requirements"
                        value={requirements}
                        onChange={(text: any) => set_requirements(text)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Markdown
                        label="What You Will Learn ?"
                        value={what_you_will_learn}
                        onChange={(text: any) => set_what_you_will_learn(text)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Markdown
                        label="Who Is For ?"
                        value={who_is_for}
                        onChange={(text: any) => set_who_is_for(text)}
                    />
                </Grid>
                <Grid item xs={12}
                    sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
                >
                    <Button
                        color="secondary" variant="contained" disabled={is_loading}
                        sx={{ width: "200px" }}
                        fullWidth onClick={old_info ? update_additional_info : create_course_additional_information}
                    >{is_loading ? "Saving..." : "Save Changes"}</Button>
                </Grid>
            </Grid>
        </>
    )
}

export const ViewSingleCourse = ({ singleCourse, setSingleCourse, getAllCourses }: any) => {

    const currentUser = useSelector((state: any) => state?.user)
    const videoInputRef: any = React.useRef()

    const [course_title, set_course_title] = React.useState(singleCourse?.course_title)
    const [course_description, set_course_description] = React.useState(singleCourse?.course_description)
    const [course_language, set_course_language] = React.useState(singleCourse?.course_language)
    const [course_level, set_course_level] = React.useState(singleCourse?.course_level)
    const [display_currency, set_display_currency] = React.useState(singleCourse?.display_currency)
    const [course_display_price, set_course_display_price] = React.useState({
        label: singleCourse?.course_display_price,
        value: singleCourse?.course_price,
    })
    const [course_status, set_course_status] = React.useState(singleCourse?.course_status)
    const [is_public, set_is_public] = React.useState(singleCourse?.is_public === "1" ? true : false)
    const [prices, set_prices] = React.useState<any>([])

    const [course_thumbnail, set_course_thumbnail] = React.useState<any>(null)
    const [course_thumbnail_url, set_course_thumbnail_url] = React.useState<any>(`${courseThumbnailPath}/${singleCourse?.course_thumbnail}`)
    const [course_video, set_course_video] = React.useState<any>(null)
    const [course_video_url, set_course_video_url] = React.useState<any>(`${courseVideoPath}/${singleCourse?.course_intro_video}`)

    const [is_loading, set_is_loading] = React.useState(false)
    const [error_message, set_error_message] = React.useState<null | string>(null)
    const [success_message, set_success_message] = React.useState<null | string>(null)

    React.useEffect(() => {
        getPriceMatrix(display_currency)
    }, [display_currency])

    const getPriceMatrix = async (currency: string) => {
        if (!currency) return
        try {
            const resp = await axios.get(`${baseUrl}/payment/get-priceMatrix/${currency}`, authorizationObj)
            const processed_data = resp?.data?.data?.map((d: any) => ({
                value: d?.ID,
                label: d?.tier_price
            }))
            set_prices(processed_data)
        } catch (error) {
            // console.error(error)
        }
    }

    const levelOptions = [
        { label: "Beginner", value: "beginnner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advance", value: "advance" },
    ]

    const update_course = async () => {

        if (!singleCourse?.course_id || singleCourse?.course_id.trim() === "") return

        if (!course_title || course_title.trim() === "") {
            set_error_message("Course title is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!course_description || course_description.trim() === "") {
            set_error_message("Course description is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!course_language || course_language.trim() === "") {
            set_error_message("Course language is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!course_level || course_level.trim() === "") {
            set_error_message("Course level is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!display_currency || display_currency.trim() === "") {
            set_error_message("Currency is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        if (!course_display_price) {
            set_error_message("Course display price is required");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
            return;
        }

        const formData = new FormData()

        formData.append("course_title", course_title)
        formData.append("course_description", course_description)
        formData.append("course_language", course_language)
        formData.append("course_price", course_display_price?.value)
        formData.append("course_level", course_level)
        formData.append("display_currency", display_currency)
        formData.append("is_public", is_public ? "1" : "0")
        if (course_thumbnail) {
            formData.append("course_thumbnail", course_thumbnail)
        }
        if (course_video) {
            formData.append("course_intro_video", course_video)
        }

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/courses/update/${singleCourse?.course_id}`, formData, authorizationObj)
            // assign_course()
            set_is_loading(false)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null);
                }, 3000);
            }
            set_success_message("Course Updated Sucessfully")
            getAllCourses()
            setTimeout(() => {
                set_success_message(null);
            }, 3000);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
            set_error_message("Failed to update the course");
            setTimeout(() => {
                set_error_message(null);
            }, 3000);
        }
    };

    React.useEffect(() => {
        get_currencies()
    }, [])

    const [currencies, set_currencies] = React.useState<any[]>([])

    const get_currencies = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/payment/get-currency`, authorizationObj)
            set_currencies(resp?.data?.currency)
        } catch (error) {
            // console.error(error)
        }
    }

    const handleCurrencyChange = (e: any, newVal: any) => {
        set_display_currency(newVal)
    }

    return (
        <>
            {error_message && <AlertMUI text={error_message} status="error" />}
            {success_message && <AlertMUI text={success_message} status="success" />}
            {singleCourse && (
                <div className="overflow-y-auto">
                    <Card sx={{ width: "100%", borderRadius: 0, boxShadow: 0 }}>
                        <CardContent sx={{ padding: 3 }}>
                            <TextField
                                value={course_title || ""}
                                label="Course Title"
                                // InputProps={{ readOnly: true }}
                                variant="outlined"
                                fullWidth
                                onChange={(e: any) => set_course_title(e.target.value)}
                            />
                            <Divider sx={{ margin: "20px 0" }} />
                            <Rating
                                name="read-only"
                                value={Math.round(+singleCourse?.average_rating)}
                                readOnly
                                precision={0.5}
                            />
                            <Typography variant="h6" sx={{ fontWeight: "semi-bold" }}>
                                Course Details
                            </Typography>
                            <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
                                <Grid item xs={12} sm={6} sx={{ marginBottom: 1.5 }}>
                                    <input type="file" id="course-thumbnail" accept="image/*" hidden multiple={false}
                                        onChange={(e: any) => {
                                            if (e?.target?.files?.length) {
                                                set_course_thumbnail_url(URL.createObjectURL(e.target.files[0]))
                                                set_course_thumbnail(e.target.files[0])
                                            }
                                        }} />
                                    <label htmlFor="course-thumbnail" className="w-full h-[300px]">
                                        <Image src={course_thumbnail_url} alt="thumbnail"
                                            className="border-2 w-full h-[300px] object-cover object-center rounded-[4px] cursor-pointer"
                                            onError={(e: any) => e.target.src = defaultCourseImage?.src}
                                        />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ marginBottom: 1.5 }}>
                                    <input ref={videoInputRef} type="file" id="course-video" accept="video/*" hidden multiple={false}
                                        onChange={(e: any) => {
                                            if (e?.target?.files?.length) {
                                                set_course_video_url(URL.createObjectURL(e.target.files[0]))
                                                set_course_video(e.target.files[0])
                                            }
                                        }} />
                                    <div className="w-full h-[300px]" onClick={() => videoInputRef.current?.click()}>
                                        <video autoPlay src={course_video_url} controls
                                            className="border-2 w-full h-full object-cover object-center rounded-[4px] cursor-pointer bg-black"
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <Markdown
                                        label="Description"
                                        value={course_description}
                                        onChange={(text: any) => set_course_description(text)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        disablePortal
                                        options={course_language_options}
                                        renderInput={(params) => <TextField {...params} label="Language" required />}
                                        fullWidth
                                        onChange={(e, val: any) => set_course_language(val)}
                                        sx={{ marginBottom: 1 }}
                                        value={course_language}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        disablePortal
                                        options={levelOptions}
                                        value={capitalizeString(course_level) || ""}
                                        renderInput={(params) => <TextField {...params} label="Level" fullWidth />}
                                        fullWidth
                                        onChange={(e, val: any) => set_course_level(val?.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        value={display_currency}
                                        disablePortal
                                        options={currencies}
                                        renderInput={(params) => <TextField {...params} label="Display Currency" required />}
                                        onChange={handleCurrencyChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        disablePortal
                                        options={prices}
                                        value={course_display_price?.label || null}
                                        renderInput={(params) => <TextField {...params} label="Display Price" fullWidth />}
                                        fullWidth
                                        onChange={(e, val: any) => set_course_display_price(val)}
                                        sx={{ marginBottom: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Course Status"
                                        value={capitalizeString(course_status) || ""}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Created At"
                                        value={singleCourse.created_at ? moment(singleCourse.created_at).format("DD/MM/YYYY") : ""}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Updated At"
                                        value={singleCourse.updated_at ? moment(singleCourse.updated_at).format("DD/MM/YYYY") : ""}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginBottom: 1 }}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        disablePortal
                                        options={tutors}
                                        value={capitalizeString(tutor?.label) || ""}
                                        renderInput={(params) => <TextField {...params} label="Tutor" fullWidth />}
                                        fullWidth
                                        onChange={(e, val: any) => set_tutor(val)}
                                    />
                                </Grid> */}
                                <Grid item xs={12} sm={12}
                                    sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", gap: "4px" }}
                                >
                                    <FormControlLabel
                                        control={<Switch checked={is_public} color="secondary" />}
                                        label="Public for KI Academy"
                                        onChange={(e: any) => set_is_public(e?.target?.checked)}
                                    />
                                    <Button
                                        color="secondary" variant="contained" disabled={is_loading}
                                        sx={{ width: "200px" }}
                                        onClick={update_course}
                                    >{is_loading ? "Saving..." : "Save Changes"}</Button>
                                </Grid>
                            </Grid>
                            <AdditionalInfo
                                singleCourse={singleCourse}
                                is_loading={is_loading}
                                set_is_loading={set_is_loading}
                                set_error_message={set_error_message}
                                set_success_message={set_success_message}
                            />
                            <Sections
                                singleCourse={singleCourse}
                                is_loading={is_loading}
                                set_is_loading={set_is_loading}
                                set_error_message={set_error_message}
                                set_success_message={set_success_message}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};

const TTable = ({ data, getAllCourses }: any) => {

    const isDrawerOpen = useSelector((state: any) => state?.isAdminDrawerOpen)

    const [rows, setRows] = React.useState<CourseData[]>([]);
    const [example_obj, set_example_obj] = React.useState<string[]>([]);
    const [singleCourse, setSingleCourse] = React.useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (data?.length) {
            const example_data = Object.keys(data[0]);
            const stringsToRemove = [
                "course_description",
                "course_intro_video",
                "course_price",
                "updated_at",
                "deleted_at",
                "instructor_id",
                "course_category_id",
                "instructor_first_name",
                "instructor_last_name",
                "course_id",
                "display_currency",
                "institute_id",
            ];
            const updatedStrs = example_data.filter(item => !stringsToRemove.includes(item));
            set_example_obj(updatedStrs);
        }
    }, [data]);

    React.useEffect(() => {
        if (data?.length) {
            const formattedData = data.map((item: any, index: any) => ({
                ...item,
                // instituteName: `${item.instructor_first_name} ${item.instructor_last_name}`,
                sr_no: index + 1,
            }));
            setRows(formattedData);
        }
    }, [data]);

    const formatString = (str: string) => str.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    const handleViewCourse = async (row: any) => {
        const id = row?.course_id
        if (!id || id?.trim() === "") return
        try {
            const resp = await axios.get(`${baseUrl}/courses/${id}`, authorizationObj)
            if (resp?.data?.status > 199 || resp?.data?.status < 300) {
                setSingleCourse(resp?.data?.data?.length ? resp?.data?.data[0] : null)
                if (resp?.data?.data?.length) {
                    setIsDialogOpen(true)
                }
            } else {
                return
            }
        } catch (error) {
            // console.error(error)
        }
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
        // {
        //     field: "instructorName",
        //     headerName: "Instructor Name",
        //     width: 250,
        // },
    ];

    const dynamicColumns = [
        ...example_obj
            .filter(item => !fixedColumns.some(col => col.field === item))
            .map(item => ({
                field: item,
                headerName: item === "is_public" ? "Visibility Status" : formatString(item),
                width: 150,
                renderCell: (params: any) => {
                    const value = params.value;
                    if (item === "average_rating") {
                        return params.row.average_rating ? parseFloat(params.row.average_rating).toFixed(1) : "N/A"
                    } else if (item.endsWith("at")) {
                        return value ? moment(value).format("DD/MM/YYYY") : "";
                    }
                    else if (item === "is_public") {
                        return value === "0" ? "Private" : "Public"
                    } else {
                        return <p style={{ textTransform: "capitalize" }
                        } > {value || ""
                            }</p >
                    }
                },
            })),
        {
            field: "actions",
            headerName: "Actions",
            width: 250,
            renderCell: (params: any) => (
                <div className="flex h-full justify-start items-center gap-8">
                    <div style={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer", marginLeft: 2 }}>
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
                    <div
                        style={{
                            display: "flex", alignItems: "center", height: "100%",
                            cursor: params?.row?.course_status === "active" ? "not-allowed" : "pointer",
                        }}>
                        <FaTrash style={{ marginRight: "0.5em", fontSize: "0.9em" }} />
                        <Typography
                            onClick={() => deleteCourseConfirmation(params?.row)}
                            sx={{
                                fontSize: "0.9em",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "4px",
                            }}
                        >
                            Delete Course
                        </Typography>

                    </div>
                </div>
            ),
        }
    ]

    const coursePriceIndex = dynamicColumns.findIndex(column => column.field === "course_price");

    if (coursePriceIndex !== -1) {
        dynamicColumns.splice(coursePriceIndex + 1, 0, {
            field: "currency",
            headerName: "Currency",
            width: 100,
            renderCell: (params: any) => (
                <p style={{ textTransform: "uppercase" }}>{params.row.display_currency || "USD"}</p>
            ),
        });
    }

    const columns = [...fixedColumns, ...dynamicColumns];

    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const [alertData, setAlertData] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error_message, set_error_message] = React.useState<null | string>(null)
    const [success_message, set_success_message] = React.useState<null | string>(null)

    const deleteCourseConfirmation = (course: any) => {
        if (course?.course_status === "active") return
        if (!course || !course?.course_id || course?.course_id?.trim() === "") return
        setAlertData({
            title: "Delete Course?",
            description: "Are you sure you want to delete this course?. The action cannot be undone",
            fun: () => delete_course(course?.course_id),
        })
        setIsAlertOpen(true)
    }

    const delete_course = async (course_id: any) => {
        if (!course_id || course_id?.trim() === "") return
        try {
            setIsLoading(true)
            const resp = await axios.delete(`${baseUrl}/courses/delete/${course_id}`, authorizationObj)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => {
                    set_error_message(null)
                }, 3000);
            }
            setIsLoading(false)
            getAllCourses()
            setAlertData(null)
            setIsAlertOpen(false)
            set_success_message("Course deleted successfully")
            setTimeout(() => {
                set_success_message(null)
            }, 3000);
        } catch (error: any) {
            // console.error(error)
            setIsLoading(false)
            setAlertData(null)
            setIsAlertOpen(false)
            set_error_message(error?.response.data.message)
            setTimeout(() => {
                set_error_message(null)
            }, 3000);
        }
    }

    return (
        <>
            {error_message && <AlertMUI status="error" text={error_message} />}
            {success_message && <AlertMUI status="success" text={success_message} />}
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={isLoading}
            />
            <FullScreenDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                headerTitle="Course Details"
            >
                <ViewSingleCourse
                    singleCourse={singleCourse}
                    getAllCourses={getAllCourses}
                    setSingleCourse={setSingleCourse}
                />
            </FullScreenDialog>
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
        </>
    );
};

export default TTable;
