import { useState, useEffect } from 'react';
import { Box, Button, Fade, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import './styles/Global.css';
import { fade_delay, fade_duration, actionButtonSx } from './settings'
import { GetLandingBio, GetResumeLink } from './utils/utils';


export default function Landing(): React.ReactElement {

    // states
    let [title_fade, set_title_fade] = useState(false);
    let [subtitle_fade0, set_subtitle_fade0] = useState(false);
    let [icon_selections_fade, set_icon_selections_fade] = useState(false)
    let [landingBio, setLandingBio] = useState<string | null>(null)
    let [resumeLink, setResumeLink] = useState<string | null>(null)

    // fades title in after delay
    useEffect(() => {
        setTimeout(() => { set_title_fade(true) }, fade_delay * 4)
    }, [])

    useEffect(() => {
        GetLandingBio().then(
            (value: string) => {
                setLandingBio(value)
            },
            () => {
                setLandingBio("[error fetching bio]")
            }
        )
        GetResumeLink().then(
            (value: string) => {
                setResumeLink(value)
            }
        )
    }, [])

    // main title (my name)
    let main_title = <Fade
        in={title_fade}
        onEntered={() => {setTimeout(() => { set_subtitle_fade0(true) }, fade_delay * 2)}}
        timeout={fade_duration}
    >
        <Box
            className='landing_title'
        >
            {'Zachary George Baker'}
        </Box>
    </Fade>

    // Flavor text giving people an idea of what I'm looking for
    let subtitle = <Box>
        <Fade
            in={subtitle_fade0}
            onEntered={() => {setTimeout(() => { set_icon_selections_fade(true) }, fade_delay)}}
            timeout={fade_duration}
        >
            <Box className='landing_subtitle'>
                {landingBio === null ? (
                    <CircularProgress size={28} sx={{ color: '#6c757d', my: 1 }} />
                ) : (
                    landingBio
                )}
            </Box>
        </Fade>
    </Box>

    // Button linking to Google Doc of my general resume (view-only)
    let resume_button = <Button
        href={resumeLink ? resumeLink : ""}
        target="_blank"
        sx={actionButtonSx}
        disabled={!resumeLink}
    >
        R&Eacute;SUM&Eacute;
    </Button>

    // Button routing to the Gallery page on the website, showcasing data visualizations
    let gallery_button = <Button
        component={Link}
        to="/gallery"
        sx={actionButtonSx}
    >
        GALLERY
    </Button>

    // organize selection buttons with a separator
    let icon_selections = <Fade
        in={icon_selections_fade}
        timeout={fade_duration}
    >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 1 }}>
            <Box className='landingSeparator' />
            <Box className='iconSelections'>
                {resume_button}
                {gallery_button}
            </Box>
        </Box>
    </Fade>

    // text linking this frontend's code repo on GitHub
    let disclosure = <Fade
        in={icon_selections_fade}
        timeout={fade_duration}
    >
        <Box className='disclosure' sx={{ mt: 2 }}>
            This is a React frontend coded and deployed (on AWS Amplify) entirely by me — Zachary Baker. It is intended to demonstrate my
            ability to program and deploy a full-stack dashboard capable of processing and showcasing data.<br />
            The site's frontend code is committed <a href="https://github.com/zgbaker54/zacharygeorgebaker/tree/master" target='_blank' rel="noreferrer">here</a>.
        </Box>
    </Fade>

    // organize all content for Landing inside a card layout
    let content = <Box className='landingPage'>
        <Box className='landingCard'>
            {main_title}
            {subtitle}
            {icon_selections}
            {disclosure}
        </Box>
    </Box>
    return content;

}