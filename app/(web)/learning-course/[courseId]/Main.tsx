'use client';

import "./Main.css";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { authorizationObj, baseUrl } from '@/app/utils/core';
import Header from '@/app/components/header/Header';
import Footer from '@/app/components/footer/Footer';
import Sidebar from './components/Sidebar';
import ContentViewer from './components/ContentViewer';
import { BsBook, BsArrowRightCircle, BsArrowLeftCircle } from 'react-icons/bs';

interface MainProps {
    courseId: string;
}

const Main: React.FC<MainProps> = ({ courseId }) => {
    const router = useRouter();
    const currentUser = useSelector((state: any) => state?.user);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLecture, setSelectedLecture] = useState<any>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Check if we have user data in Redux store
        if (!currentUser?.user_id) {
            router.push('/auth/signin');
            return;
        }
        getCourse();
    }, [courseId, currentUser?.user_id]); // Changed dependency to user_id

    const getCourse = async () => {
        if (!courseId) return;

        try {
            setLoading(true);
            const resp = await axios.get(
                `${baseUrl}/courses/${courseId}/${currentUser?.user_id}`,
                authorizationObj
            );

            if (resp?.data?.data?.[0]) {
                const courseData = resp.data.data[0];
                // Check if user is enrolled or has special access
                const hasAccess =
                    courseData.is_enrolled ||
                    courseData.instructor_id === currentUser?.user_id ||
                    currentUser?.role_id === "1" || // Admin
                    (currentUser?.role_id === "4" && courseData.institute_id) || // Institute role
                    (currentUser?.role_id === "5" && courseData.institute_id); // Institute role

                if (!hasAccess) {
                    router.push(`/current-courses/${courseId}`);
                    return;
                }
                setCourse(resp.data.data);
            } else {
                router.push('/current-courses');
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            router.push('/current-courses');
        } finally {
            setLoading(false);
        }
    };

    const handleNextLecture = () => {
        if (!selectedLecture || !sections.length) return;

        let nextLecture = null;
        let currentSectionIndex = -1;
        let currentLectureIndex = -1;

        // Find current section and lecture indices
        sections.forEach((section, sIndex) => {
            section.lectures?.forEach((lecture: any, lIndex: number) => {
                if (lecture.lecture_id === selectedLecture.lecture_id) {
                    currentSectionIndex = sIndex;
                    currentLectureIndex = lIndex;
                }
            });
        });

        // Find next lecture
        if (currentSectionIndex !== -1 && currentLectureIndex !== -1) {
            const currentSection = sections[currentSectionIndex];

            // Check if there's a next lecture in current section
            if (currentLectureIndex < currentSection.lectures.length - 1) {
                nextLecture = currentSection.lectures[currentLectureIndex + 1];
            }
            // Check next section if exists
            else if (currentSectionIndex < sections.length - 1) {
                const nextSection = sections[currentSectionIndex + 1];
                if (nextSection.lectures?.length > 0) {
                    nextLecture = nextSection.lectures[0];
                }
            }
        }

        if (nextLecture) {
            setSelectedLecture(nextLecture);
        }
    };

    useEffect(() => {
        if (course?.[0]?.course_id) {
            getSections(course[0].course_id);
        }
    }, [course]);

    const getSections = async (courseId: string) => {
        try {
            const resp = await axios.get(
                `${baseUrl}/course-sections/by-course/${courseId}`,
                authorizationObj
            );
            if (resp?.data?.data) {
                const sectionsWithLectures = await Promise.all(
                    resp.data.data.map(async (section: any) => {
                        const lectures = await getLectures(section.section_id);
                        return { ...section, lectures };
                    })
                );
                setSections(sectionsWithLectures);
                // Auto-select first lecture if none selected
                if (!selectedLecture && sectionsWithLectures[0]?.lectures?.[0]) {
                    setSelectedLecture(sectionsWithLectures[0].lectures[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const getLectures = async (sectionId: string) => {
        try {
            const resp = await axios.get(
                `${baseUrl}/lectures/by-section/${sectionId}`,
                authorizationObj
            );
            return resp?.data?.data || [];
        } catch (error) {
            console.error('Error fetching lectures:', error);
            return [];
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!isSidebarCollapsed && window.innerWidth < 992) {
                document.body.classList.add('sidebar-open');
            } else {
                document.body.classList.remove('sidebar-open');
            }
        }

        return () => {
            document.body.classList.remove('sidebar-open');
        };
    }, [isSidebarCollapsed]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1 bg-light">
                <div className="container px-0 px-lg-3 mb-5">
                    <div className="row">

                        {/* First Section: Book Icon and Toggle Button (col-1 on large, col-2 on small screens) */}
                        <div className="col-2 col-lg-1 d-flex flex-column justify-content-between align-items-center shadow-sm rounded-3" style={{ position: 'relative', zIndex: 1000, maxHeight: '80vh' }}>
                            {/* Book Icon on top */}
                            <BsBook size={40} onClick={toggleSidebar} style={{ cursor: 'pointer', backgroundColor: 'white', padding: '10px', marginTop: '10px' }} />

                            {/* Button to toggle sidebar (Arrow Icon) */}
                            <div className="d-flex justify-content-center align-items-center">
                            <button
                                className="btn btn-link btn-primary p-0 mt-3  d-none d-lg-block"
                                onClick={toggleSidebar}
                                aria-label={isSidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                                style={{ position: 'absolute', bottom: '10px', right: '40px' }}
                            >
                                {isSidebarCollapsed ? (
                                    <BsArrowRightCircle size={30} />
                                ) : (
                                    <BsArrowLeftCircle size={30} />
                                )}
                            </button>
                            </div>
                        </div>

                        {/* Second Section: Sidebar (col-2 on small screens and col-3 on large screens) */}
                        <div className={`col-10 col-lg-3 ${isSidebarCollapsed ? 'd-none' : ''}`}>
                            <div className="course-sidebar">
                                <div className="h-100 border rounded-3">
                                    <div className="sidebar-content">
                                        <Sidebar
                                            course={course}
                                            sections={sections}
                                            onLectureSelect={setSelectedLecture}
                                            selectedLecture={selectedLecture}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Third Section: Main Content */}
                        <div className={`col-12 ${isSidebarCollapsed ? 'col-lg-11' : 'col-lg-8'}`}>
                            <div className="bg-white rounded-3 p-3 p-md-4">
                                <ContentViewer
                                    lecture={selectedLecture}
                                    course={course}
                                    sections={sections}
                                    onNextLecture={handleNextLecture}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Main; 