'use client';

import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { BsPlayCircle, BsArrowRight, BsCheckCircleFill } from 'react-icons/bs';
import { courseVideoPath, lectureVideoPath, baseUrl, authorizationObj } from '@/app/utils/core';
import axios from 'axios';
import 'plyr/dist/plyr.css';
import 'plyr/dist/plyr.js';

interface ContentViewerProps {
    lecture: any;
    course: any;
    sections: any[];
    onNextLecture?: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ lecture, course, sections, onNextLecture }) => {
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(Math.round(percentage));
        }
    };

    const handleVideoEnd = async () => {
        try {
            await axios.post(
                `${baseUrl}/lectures/complete/${lecture.lecture_id}`,
                {},
                authorizationObj
            );
        } catch (error) {
            console.error('Error marking lecture as complete:', error);
        }
    };

    if (!lecture) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <h5 className="text-muted">Select a lecture to begin</h5>
            </div>
        );
    }
   

// Step 1: Add responsive classes into the figure and img tags
const parser = new DOMParser();
const doc = parser.parseFromString(lecture.content, 'text/html');

// Add responsive classes to <figure> tags
const figures = doc.querySelectorAll('figure');
figures.forEach(figure => {
    figure.setAttribute('class', 'img-fluid w-100 responsive-figure');
});

// Add responsive classes to <img> tags
const images = doc.querySelectorAll('img');
images.forEach(img => {
    img.setAttribute('class', 'img-fluid w-100');
});

// Step 2: Get the modified HTML content
const modifiedContent = doc.body.innerHTML;

// Step 3: Sanitize the content with DOMPurify
const content = DOMPurify.sanitize(modifiedContent);
    
    

    return (
        <div className="container-fluid py-4">
            {/* Title */}
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="mb-0" style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1.1 }}>{lecture.lecture_title}</h1>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-12">
                    <h6 className="mb-0 p-3 alert border-1 border-dark border-opacity-10 rounded-3  shadow-sm">
                        <span className="border rounded-2 p-2 border-0 fs-5" style={{ backgroundColor: '#def8bf' }}>
                            <svg
                                fill="#5fc733"
                                version="1.1"
                                id="Capa_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 412 412"
                                xmlSpace="preserve"
                                transform="rotate(270)"
                                stroke="#5fc733"
                                width="25px"
                                height="25px"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <g>
                                            <g>
                                                <path d="M206,0C92.411,0,0,92.411,0,206s92.411,206,206,206s206-92.411,206-206S319.589,0,206,0z M206,380 c-95.944,0-174-78.057-174-174c0-95.944,78.056-174,174-174c95.944,0,174,78.056,174,174C380,301.943,301.944,380,206,380z" />
                                                <path d="M206,80c-69.477,0-126,56.523-126,126c0,69.477,56.523,126,126,126c23.45,0,45.42-6.447,64.243-17.65l-8.818-9.138 c-0.955,2.227-2.335,4.222-4.096,5.92c-3.415,3.298-7.922,5.119-12.684,5.119c-7.452-0.022-14.061-4.458-16.885-11.3 l-2.833-6.866C218.812,299.34,212.482,300,206,300c-51.832,0-94-42.168-94-94s42.168-94,94-94s94,42.168,94,94 c0,7.398-0.862,14.598-2.486,21.508l7.137,3.246c6.743,3.071,10.938,9.835,10.692,17.235 c-0.241,7.331-4.801,13.759-11.632,16.418l8.691,9.008C324.806,253.908,332,230.779,332,206C332,136.523,275.477,80,206,80z" />
                                                <path d="M206.836,188.056c2.619,0,5.157,0.549,7.543,1.63l29.5,13.421C242.398,183.473,226.012,168,206,168 c-20.987,0-38,17.013-38,38c0,19.822,15.18,36.092,34.548,37.837l-12.602-30.546c-2.879-6.977-1.229-14.873,4.205-20.114 C197.564,189.878,202.073,188.056,206.836,188.056z" />
                                                <path d="M278.439,258.434l21.138-7.991c1.232-0.47,2.065-1.632,2.109-2.951c0.046-1.318-0.711-2.534-1.912-3.082l-90.251-41.06 c-1.223-0.554-2.657-0.307-3.624,0.625c-0.965,0.931-1.264,2.356-0.752,3.597l37.815,91.657c0.503,1.222,1.69,2.021,3.011,2.022 c0.867,0.002,1.681-0.339,2.279-0.917c0.314-0.303,0.57-0.669,0.745-1.088l8.741-20.84l32.472,33.649 c1.252,1.3000000000000003,3.321,1.336,4.621,0.082l15.995-15.435c1.299-1.254,1.336-3.323,0.081-4.621L278.439,258.434z" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </span>
                        <br />
                        <h6 className="mt-3"> Objective</h6>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus optio quas maiores aliquid quam eum quia, officiis id pariatur repellat nesciunt, dolore rerum. Delectus, suscipit possimus placeat unde dignissimos maiores!</p>
                    </h6>
                </div>
            </div>

            {/* Video Player */}
            <div className="row">
                <div className="col-12">
                    {lecture.lecture_video_url && (
                        <div className="video-container">
                            <video
                                ref={videoRef}
                                className="w-100 rounded shadow-sm" 
                                controls
                                controlsList="nodownload"
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleVideoEnd}
                                src={`${lectureVideoPath}/${lecture.lecture_video_url}`}
                                playsInline
                                preload="metadata"
                            >
                                Your browser does not support the video tag.
                            </video>
                            <div className="progress mt-3" style={{ height: '6px', backgroundColor: '#e9ecef' }}>
                                <div
                                    className="progress-bar bg-primary"
                                    role="progressbar"
                                    style={{ 
                                        width: `${progress}%`,
                                        transition: 'width 0.2s ease'
                                    }}
                                    aria-valuenow={progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-3">

                       {/* {content} */}
                       <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            {lecture.completed && (
                                <span className="text-success">
                                    <BsCheckCircleFill className="me-2" />
                                    Completed
                                </span>
                            )}
                        </div>
                        <div className="d-flex gap-3">
                            {!lecture.completed && (
                                <button
                                    className="btn btn-success"
                                    onClick={handleVideoEnd}
                                >
                                    Mark Complete
                                </button>
                            )}
                            {onNextLecture && (
                                <button
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                    onClick={onNextLecture}
                                >
                                    Next Lecture
                                    <BsArrowRight />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentViewer; 