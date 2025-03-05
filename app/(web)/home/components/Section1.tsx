"use client"

import "./main.css"
import { useState } from "react"
import { Button, IconButton, TextField } from "@mui/material"
import { Search } from "@mui/icons-material"
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation"
// import bgVideo from "/videos/banner-video.mp4"

const SearchBar = ({ text, setText }: any) => {
    return (
        <TextField
            label=""
            placeholder="Search our 4000+ courses"
            id="fullWidth"
            className="feedSearchinput"
            InputProps={{
                endAdornment: (
                    text ?
                        <IconButton onClick={() => setText("")}><RxCross2 /></IconButton> : <Search />
                ),
                sx: { borderRadius: '100px', width: "400px", padding: "0 1em" },
            }}
            variant="outlined"
            value={text}
            onChange={(e: any) => setText(e?.target?.value)}
            sx={{ background: "#fff", borderRadius: "200px" }}
        />
    )

}

const Section1 = () => {
    const router = useRouter()
    const [searchInput, setSearchInput] = useState<string>("")

    const searchCourses = async (e: any) => {
        e?.preventDefault()
        if (!searchInput || searchInput?.trim() === "") return
        router.push(`/current-courses?q=${searchInput}`)
    }

    return (
        <>
            <div className="section-1">
                <video autoPlay muted loop>
                    <source
                        src="/videos/banner-video.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
                <div className="left">
                    <h1>Bring your goals <br /> into focus</h1>
                    <p>KI Academy offers online courses and programs that <br /> prepare you for every career moment</p>
                    <form onSubmit={searchCourses}>
                        <SearchBar text={searchInput} setText={setSearchInput} />
                        <Button type="submit" className="btn p-3 rounded-pill" style={{ backgroundColor: "#fefefe", color: "grey" }}>
                            Search
                        </Button>
                    </form>
                </div>
                {/* <>
                    <div className="right">
                        <img src={man} alt="man" width={100} height={100} />
                    </div>
                </> */}
            </div>
        </>
    )
}

export default Section1