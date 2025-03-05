"use client"

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { userNamePattern, emailPattern, passwordPattern, baseUrl, serverToken, profilePicture } from '../../../utils/core';
import axios from 'axios';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useRouter } from 'next/navigation';
import { CompanyAvatar, Copyright } from '../signin/Main';
import { Button } from '@mui/material';
import AlertMUI from '@/app/components/mui/AlertMUI';
import PasswordMUI from '@/app/components/mui/PasswordMUI';
import Image from "next/image"
import { SelectedFile } from '@/app/components/mui/CreateUserForm';

export const TutorDocs = ({ file, setFile }: any) => {
    return (
        <div>file</div>
    )
}

export const StudentOrTutor = ({ state, setState }: any) => {
    return (
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={state}
                onChange={(e: any) => setState(e?.target?.value)}
            >
                <FormControlLabel value="tutor" control={<Radio />} label="Tutor" />
                <FormControlLabel value="student" defaultChecked control={<Radio />} label="Student" />
            </RadioGroup>
        </FormControl>
    );
}

export default function SignUp() {

    const router = useRouter()

    const [password, setPassword] = React.useState<string>("")
    const [repeatPassword, setRepeatPassword] = React.useState<string>("")
    const [phoneNumber, setPhoneNumber] = React.useState<string>("")
    const [clientErrorMessage, setClientErrorMessage] = React.useState<string | null>(null)
    const [clientSuccessMessage, setClientSuccessMessage] = React.useState<string | null>(null)
    const [role, setRole] = React.useState<string>("student")
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [imageBase64, setImageBase64] = React.useState<any>(null)
    const [file, setFile] = React.useState<any>(null)
    const [viewImage, setViewImage] = React.useState<any>(null)

    const [document_number, set_document_number] = React.useState("")
    const [document_name, set_document_name] = React.useState("")
    const [proof_of_address, set_proof_of_address] = React.useState<File | null>(null)
    const [document_image, set_document_image] = React.useState<File | null>(null)

    const handleSubmit = async (event: any) => {

        event?.preventDefault();
        const data = new FormData(event?.currentTarget);

        const firstName: any = data.get('firstName')
        const lastName: any = data.get('lastName')
        const email: any = data.get('email')

        if (!firstName || !userNamePattern.test(firstName)) {
            setClientErrorMessage("First Name must between 2 to 15 characters long")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!lastName || !userNamePattern.test(lastName)) {
            setClientErrorMessage("Last Name must between 2 to 15 characters long")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!email || !emailPattern.test(email)) {
            setClientErrorMessage("Email pattern is invalid")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        if (!phoneNumber || phoneNumber?.trim() === "") {
            setClientErrorMessage("Phone number is required")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

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

        const roles = ["tutor", "student"]

        if (!role || !roles?.includes(role)) {
            setClientErrorMessage("Role must be a Tutor or Student")
            setTimeout(() => {
                setClientErrorMessage(null)
            }, 2000)
            return
        }

        // if (!file) {
        //     setClientErrorMessage("Profile picture is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        // if (role === "tutor" && !document_name) {
        //     setClientErrorMessage("Document name is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        // if (role === "tutor" && !document_number) {
        //     setClientErrorMessage("Document number is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        // if (role === "tutor" && !document_image) {
        //     setClientErrorMessage("Document image is required")
        //     setTimeout(() => {
        //         setClientErrorMessage(null)
        //     }, 2000)
        //     return
        // }

        // if (role === "tutor" && !proof_of_address) {
        //     setClientErrorMessage("Proof of address is required")
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

        try {

            const formData = new FormData()
            formData.append("first_name", firstName)
            formData.append("last_name", lastName)
            formData.append("email", email)
            formData.append("password", password)
            formData.append("role_id", role === "student" ? "3" : "2")
            if (file) formData.append("profile_picture", file)
            if (document_name && role === "tutor") formData.append("id_document_type", document_name)
            if (document_number && role === "tutor") formData.append("id_document_number", document_number)
            if (document_image && role === "tutor") formData.append("document_image", document_image)
            if (proof_of_address && role === "tutor") formData.append("proof_of_address", proof_of_address)
            setIsLoading(true)
            const resp = await axios.post(`${baseUrl}/users/create`, formData, {
                withCredentials: true,
                headers: { "Authorization": serverToken }
            });

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

            setClientSuccessMessage("We have sent a verification link to your email, please verify your account")

            setTimeout(() => {
                setClientSuccessMessage(null)
                setClientErrorMessage(null)
                router.push("/auth/signin")
            }, 4000)

        } catch (error) {
            setIsLoading(false)
            setClientErrorMessage("Something went wrong, please try later")
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
                        Sign up
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
                                <StudentOrTutor state={role} setState={setRole} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Phone Number"
                                    type="number"
                                    onChange={(e: any) => setPhoneNumber(e?.target?.value)}
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
                            {
                                role === "tutor" ?
                                    <React.Fragment>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Document Name"
                                                value={document_name}
                                                onChange={(e) => set_document_name(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Document Number"
                                                value={document_number}
                                                onChange={(e) => set_document_number(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                fullWidth
                                            >
                                                Upload Document Image
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={(e: any) => set_document_image(e.target.files[0])}
                                                    accept=".pdf,.docx,image/*"
                                                />
                                            </Button>
                                            {document_image && <SelectedFile file={document_image} set_file={set_document_image} />}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                fullWidth
                                            >
                                                Upload Proof of Address
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={(e: any) => set_proof_of_address(e.target.files[0])}
                                                    accept=".pdf,.docx,image/*"
                                                />
                                            </Button>
                                            {proof_of_address && <SelectedFile file={proof_of_address} set_file={set_proof_of_address} />}
                                        </Grid>
                                    </React.Fragment>
                                    : null
                            }
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {
                                isLoading ? <span className="buttonLoader"></span> : null
                            }
                            {
                                isLoading ? "Processing" : "Sign Up"
                            }
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