"use client";
import "./Main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import Section1 from "./components/Section1";
import Accordion from "./components/Accordion";
import axios from "axios";
import { authorizationObj, baseUrl } from "@/app/utils/core";
import RatingandReviews from "./components/RatingandReviews";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic';

interface MainProps {
  courseId: string;
}

const Main = ({ courseId }: MainProps) => {
  const router = useRouter();
  const currentUser = useSelector((state: any) => state?.user);
  const [course, setCourse] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('courseContent');
  
  // Refs for sections
  const courseContentRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Bootstrap
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
    if (courseId) {
      getCourse(courseId);
    }

    // Handle scroll to update active button
    const handleScroll = () => {
      if (!courseContentRef.current || !reviewsRef.current) return;

      const courseContentTop = courseContentRef.current.offsetTop - 100; // Offset for sticky header
      const reviewsTop = reviewsRef.current.offsetTop - 100; // Offset for sticky header
      const currentScroll = window.scrollY;

      if (currentScroll >= reviewsTop) {
        setActiveSection('reviews');
      } else if (currentScroll >= courseContentTop) {
        setActiveSection('courseContent');
      } else {
        setActiveSection('courseContent'); // Default to course content
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [courseId]);

  const getCourse = async (id: string) => {
    if (!id?.trim()) return;

    const url = currentUser?.user_id 
      ? `${baseUrl}/courses/${id}/${currentUser?.user_id}` 
      : `${baseUrl}/courses/${id}`;

    try {
      const resp = await axios.get(url, authorizationObj);
      if (resp?.data?.data?.[0]?.course_status?.toLowerCase() !== "approved") {
        if (currentUser?.role_id !== "1" && currentUser?.user_id !== resp?.data?.data[0]?.instructor_id) {
          router.push("/current-courses");
        } else {
          setCourse(resp?.data?.data);
        }
      } else {
        setCourse(resp?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const scrollToSection = (section: string) => {
    const element = section === 'courseContent' 
      ? courseContentRef.current 
      : reviewsRef.current;
    
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for sticky header
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <div className="container-fluid pb-4 px-0">
          <div className="row">
            <div className="col-12">
              <Section1 course={course} />
            </div>
          </div>
          
          {/* Navigation Section - Fixed to top */}
          <div 
            
            style={{ 
              position: 'sticky',
              top: '0',
              backgroundColor: 'white',
              borderBottom: '1px solid #e5e5e5',
              zIndex: 1000,
            }}
          >
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center py-3">
                    <span className="me-3 text-secondary">On this page:</span>
                    <div className="d-flex">
                      <button
                        onClick={() => scrollToSection('courseContent')}
                        className={`btn px-4 py-2 me-2 ${
                          activeSection === 'courseContent' ? 'active' : ''
                        }`}
                        style={{
                          backgroundColor: activeSection === 'courseContent' ? '#0070f2' : 'transparent',
                          color: activeSection === 'courseContent' ? '#fff' : '#666',
                          border: activeSection === 'courseContent' ? 'none' : '1px solid #ddd',
                          borderRadius: '4px',
                          transition: 'all 0.3s ease',
                          fontWeight: 500
                        }}
                      >
                        Course Content
                      </button>
                      <button
                        onClick={() => scrollToSection('reviews')}
                        className={`btn px-4 py-2 ${
                          activeSection === 'reviews' ? 'active' : ''
                        }`}
                        style={{
                          backgroundColor: activeSection === 'reviews' ? '#0070f2' : 'transparent',
                          color: activeSection === 'reviews' ? '#fff' : '#666',
                          border: activeSection === 'reviews' ? 'none' : '1px solid #ddd',
                          borderRadius: '4px',
                          transition: 'all 0.3s ease',
                          fontWeight: 500
                        }}
                      >
                        Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="container">
            <div className="row mt-4">
              <div 
                className="col-lg-12" 
                id="courseContentSection"
                ref={courseContentRef}
              >
                <Accordion course={course} />
              </div>

              <div 
                className="col-lg-12 mt-5" 
                id="reviewsSection"
                ref={reviewsRef}
              >
                <RatingandReviews courseId={courseId} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Main;
