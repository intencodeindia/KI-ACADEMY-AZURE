"use client"

import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa"
import { RiTwitterXFill } from "react-icons/ri"
import { facebookUrl, instagramUrl, linkedinUrl, twitterUrl, youtubeUrl } from "@/app/utils/data"
import { Copyright } from "@/app/(auth)/auth/signin/Main"
import logo from "../../../public/images/logo-white.png"
import "./Footer.css"
const FooterList = ({ title, options }: any) => {
    return (
        <div className="col-md-6 col-lg-3 mb-4 footer-links">
            <h5 className="text-white mb-3">{title}</h5>
            <ul className="list-unstyled">
                {options?.map((option: any, i: number) => (
                    <li className="mb-2" key={i}>
                        <Link href={option?.path} className="text-light">
                            {option?.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const Footer = () => {
    const currentUser = useSelector((state: any) => state?.user)

    const footerOptions = [
        {
            title: "Help",
            options: [
                { label: "FAQ", path: "/frequently-asked-questions" },
                { label: "Contact Us", path: "/contact" },
                { label: "About Us", path: "/about" },
            ]
        },
        {
            title: "More Information", 
            options: [
                { label: "Terms & Conditions", path: "/terms-and-conditions" },
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "Refund Policy", path: "/refund-policy" },
                { label: "User Data Deletion", path: "/data-deletion" },
            ]
        },
    ]

    return (
        <footer className="footer bg-dark text-decoration-none py-5">
            <div className="container">
                {!currentUser?.institute_id && (
                    <div className="row">
                        <div className="col-lg-4 mb-4 footer-brand">
                            <div className="d-flex flex-column align-items-start gap-3">
                                <Image 
                                    src={logo} 
                                    alt="logo" 
                                    width={100} 
                                    height={100} 
                                    className="footer-logo rounded-circle"
                                />
                                <p className="text-light mb-0">
                                    KI Academy: Empowering Learning, Anywhere Anytime
                                </p>
                            </div>
                        </div>
                        
                        {footerOptions?.map((option: any, i: number) => (
                            <FooterList 
                                key={i} 
                                title={option?.title} 
                                options={option?.options} 
                            />
                        ))}

                        <div className="col-md-6 col-lg-2 mb-4">
                            <h5 className="text-white mb-3">Follow Us</h5>
                            <div className="d-flex gap-3 social-icons flex-wrap">
                                <Link href={twitterUrl} target="_blank">
                                    <RiTwitterXFill />
                                </Link>
                                <Link href={facebookUrl} target="_blank">
                                    <FaFacebook />
                                </Link>
                                <Link href={linkedinUrl} target="_blank">
                                    <FaLinkedin />
                                </Link>
                                <Link href={instagramUrl} target="_blank">
                                    <FaInstagram />
                                </Link>
                                <Link href={youtubeUrl} target="_blank">
                                    <FaYoutube />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="text-center border-top border-secondary pt-4 mt-4">
                    <Copyright />
                </div>
            </div>
        </footer>
    )
}

export default Footer