"use client"

import "./Main.css"
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { MdOutlineEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { redirect, useRouter } from 'next/navigation';
import { CompanyAvatar, Copyright } from './signin/Main';
import { Button } from '@mui/material';
import AlertMUI from "@/app/components/mui/AlertMUI";
import { useSession, signIn, signOut } from "next-auth/react"
import { authorizationObj, webDomainName } from "@/app/utils/core";
import axios from "axios"
import { baseUrl } from "../../utils/core";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/redux/user"

export default function Main() {

    const router = useRouter()
    const { data: session } = useSession()
    const currentUser = useSelector((state: any) => state?.user)
    const dispatch = useDispatch()
    // console.log("session", session)

    const [clientErrorMessage, setClientErrorMessage] = React.useState<string | null>(null)
    const [clientSuccessMessage, setClientSuccessMessage] = React.useState<string | null>(null)
    const [is_institute, set_is_institute] = React.useState(false)
    const [is_loading, set_is_loading] = React.useState(false)
    const [data, setData] = React.useState<any>(null)

    React.useEffect(() => {
        if (!data || !data?.email || !data?.user_id) return
        const session_data = { user_id: data?.user_id, email: data?.email }
        localStorage.setItem("hart", JSON.stringify(session_data))
        redirect("/")
    }, [data])

    React.useEffect(() => {
        if (
            window?.location?.hostname?.split(".")[0]?.toLowerCase() !== webDomainName
        ) {
            set_is_institute(true)
            router.push("/auth/signin")
        }
    }, [])

    const completeGoogleLogin = async () => {
        if (currentUser?.user_id) return
        try {
            const formData = new FormData();
            formData.append("email", session?.user?.email || "");
            formData.append("name", session?.user?.name || "");
            formData.append("picture", session?.user?.image || "");
            set_is_loading(true)
            const response = await axios.post(`${baseUrl}/auth/login/google`, formData, authorizationObj);
            if (response?.data?.status > 299 || response?.data?.status < 200) {
                setClientErrorMessage(response?.data?.message)
                setTimeout(() => setClientErrorMessage(""), 3000)
                set_is_loading(false)
                return
            }
            const resp = await axios.get(`${baseUrl}/users/${response?.data?.user_id}`, authorizationObj)
            set_is_loading(false)
            setData(resp?.data?.data)
            dispatch(login(resp?.data?.data))
            router.push("/")
        } catch (error) {
            // console.error(error);
        }
    };

    const completeFacebookLogin = async () => {
        console.log("facebook login")
    }

    React.useEffect(() => {
        if (session && session?.user && !currentUser?.user_id) {
            if (session?.user?.image?.startsWith("https://lh3.googleusercontent.com")) {
                completeGoogleLogin()
            } else {
                completeFacebookLogin()
            }
        }
    }, [session, router]);

    const googleLogin = async () => {
        if (currentUser?.user_id) return
        signIn("google", { callbackUrl: "https://kiacademy.in/auth" })
    };

    const facebookLogin = async () => {
        signIn("facebook")
    };

    return (
        <>
            {clientErrorMessage && <AlertMUI status="error" text={clientErrorMessage} />}
            {clientSuccessMessage && <AlertMUI status="success" text={clientSuccessMessage} />}
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <CompanyAvatar />
                    <Typography component="h1" variant="h5" sx={{ marginTop: "0.8em" }}>
                        KI Academy
                    </Typography>
                </Box>
                <div className="authentication-buttons">
                    <Button style={{ color: "#fff", width: "100%" }}
                        onClick={() => router.push("/auth/signin")}
                        color='primary' variant='contained' disabled={is_loading}
                    >
                        <MdOutlineEmail style={{ fontSize: "1.3em", marginRight: "0.5em", marginTop: "-0.2em" }} />
                        Continue With Email
                    </Button>
                </div>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </>
    );
}