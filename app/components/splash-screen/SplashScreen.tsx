import React from 'react'
import logo from "../../../public/images/logo-black.png"
import Image from "next/image"

const SplashScreen = () => {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Image src={logo} width={250} height={180} alt="logo" />
        </div>
    )
}

export default SplashScreen
