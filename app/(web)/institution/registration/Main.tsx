"use client"

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { emailPattern, passwordPattern, baseUrl, profilePicture, authorizationObj } from '../../../utils/core';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CompanyAvatar, Copyright } from '../../../(auth)/auth/signin/Main';
import { Button } from '@mui/material';
import AlertMUI from '@/app/components/mui/AlertMUI';
import PasswordMUI from '@/app/components/mui/PasswordMUI';
import Image from "next/image"
import { UploadOutlined } from '@ant-design/icons';
import { Button as AntdButton, Upload } from 'antd';
import FullScreenDialog from '@/app/components/mui/FullScreenDialogue';
import PaymentPlans from '@/app/components/stripe/PaymentPlans';

export default function SignUp() {

    const router = useRouter()

    const [password, setPassword] = React.useState<string>("")
    const [repeatPassword, setRepeatPassword] = React.useState<string>("")
    const [clientErrorMessage, setClientErrorMessage] = React.useState<string | null>(null)
    const [clientSuccessMessage, setClientSuccessMessage] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [imageBase64, setImageBase64] = React.useState<any>(null)
    const [file, setFile] = React.useState<any>(null)
    const [viewImage, setViewImage] = React.useState<any>(null)
    const [fileList, setFileList] = React.useState<any>();

    const handleSubmit = async (event: any) => {
        event?.preventDefault();
        const data = new FormData(event?.currentTarget);

        const instituteName = data.get('inst-name')
        const phone = data.get('phone-number');
        const email: any = data.get('email')
        const regNumber = data.get('reg-number');
        const tinNumber = data.get('tin-number');
        const subdomain = data.get('subdomain');
        const address = data.get('address');

        if (!instituteName) {
            setClientErrorMessage("Institute name is required")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!phone) {
            setClientErrorMessage("Contact number is required")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!email) {
            setClientErrorMessage("Email is required")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!emailPattern.test(email)) {
            setClientErrorMessage("Email is invalid")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        // if (!regNumber) {
        //     setClientErrorMessage("Registration number is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        // if (!tinNumber) {
        //     setClientErrorMessage("TIN number is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        if (!subdomain) {
            setClientErrorMessage("Subdomain name is required")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        // if (!address) {
        //     setClientErrorMessage("Address is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        if (!passwordPattern.test(password)) {
            setClientErrorMessage("Password must be alphanumeric and 8 to 24 characters long")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (password !== repeatPassword) {
            setClientErrorMessage("Passwords do not match")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        // if (!file) {
        //     setClientErrorMessage("Institute logo is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        // if (!fileList || !fileList?.length || !fileList[0]) {
        //     setClientErrorMessage("Supporting document is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        if (file) {
            const url: any = URL.createObjectURL(file)
            setImageBase64(url)
            setIsLoading(true)
        }

        const formData = new FormData()
        formData.append("name", instituteName)
        if (address) formData.append("address", address) // optional
        formData.append("contact_number", phone)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("role_id", "4")
        if (regNumber) formData.append("registration_number", regNumber) // optional
        if (tinNumber) formData.append("tin_number", tinNumber) // optional
        formData.append("subdomain_name", subdomain?.toString()?.toLowerCase())
        if (fileList?.length && fileList[0]?.originFileObj) formData.append("supporting_document", fileList[0]?.originFileObj) // optional
        if (file) formData.append("profile_picture", file) // optional

        try {
            setIsLoading(true)
            const resp = await axios.post(`${baseUrl}/institutions/create`, formData, authorizationObj);
            setIsLoading(false)

            if (resp?.data?.status >= 200 && resp?.data?.status < 300) {
                setClientSuccessMessage(resp?.data?.message)
            } else {
                setClientErrorMessage(resp?.data?.message)
                setTimeout(() => {
                    setClientErrorMessage(null)
                }, 2000)
                return
            }

            setClientSuccessMessage("Your KYC verification is in progress, keep connected for further updates")
            setTimeout(() => {
                setClientSuccessMessage(null)
                setClientErrorMessage(null)
                router.push("/auth/signin")
            }, 4000)

        } catch (error) {
            setIsLoading(false)
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

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
                        Register your Institute
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <input accept="image/*" type="file" id="file-sts" hidden onChange={async (e: any) => {
                                    setFile(e?.target?.files[0])
                                    setViewImage(URL.createObjectURL(e?.target?.files[0]))
                                }} />
                                <label htmlFor="file-sts" className='ml-auto mr-auto flex justify-center'>
                                    <Image src={viewImage || profilePicture} alt="profile image" width={100} height={100}
                                        className='w-[100px] h-[100px] object-cover object-center cursor-pointer rounded-full'
                                    />
                                </label>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="inst-name"
                                    name="inst-name"
                                    required
                                    fullWidth
                                    id="inst-name"
                                    label="Institute Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    type='number'
                                    id="phone-number"
                                    label="Contact Number"
                                    name="phone-number"
                                    autoComplete="phone-number"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="reg-number"
                                    label="Registration Number"
                                    name="reg-number"
                                    autoComplete="reg-number"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="tin-number"
                                    label="TIN Number"
                                    name="tin-number"
                                    autoComplete="tin-number"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="subdomain"
                                    label="Subdomain Name"
                                    name="subdomain"
                                    autoComplete="subdomain"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="address"
                                    label="Address"
                                    name="address"
                                    autoComplete="address" multiline
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordMUI
                                    name="password"
                                    label="Password * "
                                    onChange={(value: any) => setPassword(value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordMUI
                                    name="repeatPassword"
                                    label="Confirm Password * "
                                    onChange={(value: any) => setRepeatPassword(value)}
                                />
                            </Grid>
                            <Grid item xs={12}
                                display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}
                            >
                                <Upload className='text-center'
                                    onChange={(e: any) => setFileList(e?.fileList?.slice(-1))}
                                    fileList={fileList ? fileList?.slice(-1) : []}
                                    accept=".pdf" multiple={false}
                                ><AntdButton icon={<UploadOutlined />}> Select Supporting Document</AntdButton></Upload>
                                <p style={{ color: '#757575', fontSize: '0.875rem', marginTop: 8 }}>
                                    Upload one PDF including all documents
                                </p>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLoading ? <span className="buttonLoader"></span> : null}
                            {isLoading ? "Processing" : "Register"}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/auth/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </>
    );
}