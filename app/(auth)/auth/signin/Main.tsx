"use client"

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { authorizationObj, baseUrl, emailPattern, passwordPattern, serverToken, webDomainName, webUrl } from '../../../utils/core';
import axios from "axios"
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux"
import { login } from "../../../redux/user"
import logo from "../../../../public/images/logo-black.png"
import Image from "next/image"
import AlertMUI from '@/app/components/mui/AlertMUI';
import PasswordMUI from '@/app/components/mui/PasswordMUI';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useSession, signIn } from 'next-auth/react';

export const CompanyAvatar = () => {

    const router = useRouter()

    return (
        <Image src={logo} width={80} height={80} alt="logo"
            className='object-cover object-center cursor-pointer'
            onClick={() => router.push("/")}
        />
    )
}

export function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" target="_blank" href={webUrl} style={{
                textDecoration: "none"
            }}>
                KI Academy
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}



export default function Main() {

    const [password, setPassword] = React.useState<string>("")
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
    const [data, setData] = React.useState<any>(null)
    const [subdomain, set_subdomain] = React.useState<any>("")
    const [user, set_user] = React.useState<any>(null)
    const [is_institute, setIsInstitute] = React.useState(false)
    const { data: session } = useSession()
    const dispatch = useDispatch()

    const router = useRouter()

    React.useEffect(() => {
        if (!data) return
        localStorage.setItem("hart", JSON.stringify(data))
    }, [data])

    React.useEffect(() => {
        if (subdomain && subdomain?.subdomain && subdomain?.data) {
            const website_domain = window.location.host.replace("www.", "")
            const protocol = window.location.protocol
            let redirect_domain: string
            if (website_domain?.toLowerCase()?.includes(`${subdomain?.subdomain?.toLowerCase()}.`)) {
                setData(subdomain?.data)
                dispatch(login({ ...user, instituteData: subdomain?.instituteData }))
                switch (user?.role_id) {
                    case "4":
                        router.push("/institution/admin/analytics")
                        break;
                    case "2":
                        router.push("/institution/tutor/courses")
                        break;
                    case "3":
                        router.push("/current-courses")
                        break;
                    case "5":
                        router.push("/institution/sub-admin/analytics")
                        break;
                    default:
                        router.push("/auth/signin")
                        break;
                }
            } else {
                redirect_domain = `${protocol}//${subdomain?.subdomain}.${website_domain}/auth`
                window.location.href = redirect_domain
                if (website_domain.startsWith(webDomainName)) {
                    redirect_domain = `${protocol}//${subdomain?.subdomain}.${website_domain}/auth`
                    window.location.href = redirect_domain
                } else {
                    redirect_domain = `${protocol}//${subdomain?.subdomain}.${website_domain?.split(".")[1]}/auth`
                    window.location.href = redirect_domain
                }
            }
        }
    }, [subdomain])

    const handleSubmit = async (e: any) => {

        e.preventDefault();
        const data = new FormData(e?.currentTarget);
        const email: any = data.get('email')

        if (!email || !password || !emailPattern?.test(email) || !passwordPattern?.test(password)) {
            setErrorMessage("Email or Password incorrect")
            setTimeout(() => {
                setErrorMessage(null)
            }, 2000)
            return
        }

        try {
            setIsLoading(true)
            const formData = new FormData()
            formData.append("email", email)
            formData.append("password", password)

            const response = await axios.post(`${baseUrl}/auth/login`, formData,
                {
                    withCredentials: true,
                    headers: {
                        "Authorization": serverToken,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )

            setIsLoading(false)
            if (response?.data?.status >= 200 && response?.data?.status < 300) {
                setSuccessMessage(response?.data?.message)
            } else {
                setErrorMessage(response?.data?.message)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 2000)
                return
            }
            const userId = response?.data?.data?.user_id

            const resp = await axios.get(`${baseUrl}/users/${userId}`, authorizationObj)
            set_user(resp?.data?.data)
            if (resp?.data?.data?.role_id === "4" || resp?.data?.data?.institute_id) {
                const instituteId = resp?.data?.data?.institute_id
                const instResp = await axios.get(`${baseUrl}/institutions/${instituteId}`, authorizationObj)
                set_subdomain({
                    subdomain: instResp?.data?.data?.subdomain_name,
                    instituteData: instResp?.data?.data,
                    data: {
                        user_id: response?.data?.data?.user_id,
                        email: response?.data?.data?.email
                    }
                })
            } else {
                setData(response?.data?.data)
                dispatch(login(resp?.data?.data))
                router.push("/")
            }

            setTimeout(() => {
                setSuccessMessage(null)
                setErrorMessage(null)
            }, 2000);

        } catch (error: any) {
            // console.error(error);
            setIsLoading(false)
            setErrorMessage("Something went wrong, please try later")
            setTimeout(() => {
                setErrorMessage(null)
            }, 2000)
        }

    };

    const completeGoogleLogin = async () => {
        if (user?.user_id) return
        try {
            const formData = new FormData();
            formData.append("email", session?.user?.email || "");
            formData.append("name", session?.user?.name || "");
            formData.append("picture", session?.user?.image || "");
            setIsLoading(true)
            const response = await axios.post(`${baseUrl}/auth/login/google`, formData, authorizationObj);
            if (response?.data?.status > 299 || response?.data?.status < 200) {
                setErrorMessage(response?.data?.message)
                setTimeout(() => setErrorMessage(null), 3000)
                setIsLoading(false)
                return
            }
            const resp = await axios.get(`${baseUrl}/users/${response?.data?.user_id}`, authorizationObj)
            setIsLoading(false)
            dispatch(login(resp?.data?.data))
            router.push("/")
        } catch (error) {
            setIsLoading(false)
            setErrorMessage("Something went wrong")
            setTimeout(() => setErrorMessage(null), 3000)
        }
    };

    const completeFacebookLogin = async () => {
        console.log("facebook login")
    }

    React.useEffect(() => {
        if (session && session?.user && !user?.user_id) {
            if (session?.user?.image?.startsWith("https://lh3.googleusercontent.com")) {
                completeGoogleLogin()
            } else {
                completeFacebookLogin()
            }
        }
    }, [session]);

    const googleLogin = async () => {
        if (user?.user_id) return
        signIn("google", { callbackUrl: "https://kiacademy.in/auth/signin" })
    };

    const facebookLogin = async () => {
        signIn("facebook")
    };

    React.useEffect(() => {
        if (
            window?.location?.hostname?.split(".")[0]?.toLowerCase() !== webDomainName
        ) {
            setIsInstitute(true)
        }
    }, [])

    return (
        <>
            {errorMessage && <AlertMUI status="error" text={errorMessage} />}
            {successMessage && <AlertMUI status="success" text={successMessage} />}
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
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            autoFocus
                            type="email"
                            name="email"
                            style={{
                                marginBottom: "16px",
                            }}
                        />
                        <PasswordMUI
                            label="Password * "
                            required
                            onChange={(value: any) => setPassword(value)}
                            name="password"
                        />
                        <FormControlLabel style={{
                            marginTop: "16px"
                        }}
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {
                                isLoading ?
                                    <>
                                        <span className="buttonLoader"></span>
                                        Processing
                                    </>
                                    : "Sign In"
                            }
                        </Button>
                        {
                            isLoading ? null :
                                <>
                                    <Button 
                                        fullWidth 
                                        variant="outlined" 
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={googleLogin}
                                        disabled={isLoading}
                                        style={{ color: "#454545", border: "2px solid #454545" }}
                                    >
                                        <FaGoogle style={{ fontSize: "1.3em", marginRight: "0.5em", marginTop: "-0.2em" }} />
                                        Continue With Google
                                    </Button>
                                    <Button 
                                        fullWidth 
                                        variant="outlined" 
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={facebookLogin}
                                        disabled={isLoading}
                                        style={{ color: "#454545", border: "2px solid #454545" }}
                                    >
                                        <FaFacebook style={{ fontSize: "1.3em", marginRight: "0.5em", marginTop: "-0.2em" }} />
                                        Continue With Facebook
                                    </Button>
                                </>
                        }
                        <Grid container>
                            <Grid item xs style={{ marginRight: "16px" }}>
                                <Link className="cursor-pointer"
                                    onClick={() => router?.push("/auth/forgot-password")}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/auth/signup" variant="body2">
                                    Dont have an account? Sign up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </>
    );
}