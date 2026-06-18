import { useState, useEffect, useRef } from 'react';
import { Box, Button, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import GalleryBackendContent from './GalleryBackendContent';
import GalleryLinePlotsContent from './GalleryLinePlotsContent'
import GalleryAiDigitContent from './GalleryAiDigitContent';
import GalleryVisitMetricsContent from './GalleryVisitMetricsContent';
import './styles/Global.css';
import { fade_duration, selectionButtonSx } from './settings'


type GalleryOption = 'ai_digit' | 'backend' | 'line_plots' | 'visit_metrics'


export default function Gallery(): React.ReactElement {
    // Gallery contains exhibits that showcase my techical skillsets.

    // refs
    let topRef = useRef<HTMLDivElement>(null);

    // gallery startup
    useEffect(() => {
        // fade gallery in
        set_gallery_fade(true)
        // scroll to top on gallery startup
        topRef.current?.scrollIntoView({ behavior: 'instant' });
      }, [])

    // states
    let [gallery_fade, set_gallery_fade] = useState(false);
    let [gallery_option, set_gallery_option] = useState<GalleryOption>('visit_metrics');

    // gallery content
    let content = <Fade
        in={gallery_fade}
        timeout={fade_duration}
    >
        <Box className='Box' ref={topRef}>
            <Box className="galleryTitle">
                GALLERY
            </Box>
            <Button
                component={Link}
                to="/"
                sx={selectionButtonSx}
            >
                BACK
            </Button>
            <Box className="hr h1px"><hr/></Box>
            <Box className="hr h1px"><hr/></Box>
            <Box className="hr"><hr/></Box>
            <Box />
            <Box className="gallerySubtitle">
                Exhibits:
            </Box>
            <Box className={"exhibitSelectionBox"}>
                {/* <Button
                    sx={{
                        ...(gallery_option === 'ai_digit' ? {backgroundColor: 'lightBlue', ":hover": {backgroundColor: 'lightBlue'}} : {}),
                        ...selectionButtonSx
                    }}
                    onClick={() => {set_gallery_option("ai_digit")}}
                >
                    AI DIGIT
                </Button> */}
                <Button
                    sx={{
                        ...(gallery_option === 'backend' ? {backgroundColor: 'lightBlue', ":hover": {backgroundColor: 'lightBlue'}} : {}),
                        ...selectionButtonSx
                    }}
                    onClick={() => {set_gallery_option("backend")}}
                >
                    BACKEND
                </Button>
                <Button
                    sx={{
                        ...(gallery_option === 'line_plots' ? {backgroundColor: 'lightBlue', ":hover": {backgroundColor: 'lightBlue'}} : {}),
                        ...selectionButtonSx
                    }}
                    onClick={() => {set_gallery_option("line_plots")}}
                >
                    LINE PLOTS
                </Button>
                <Button
                    sx={{
                        ...(gallery_option === 'visit_metrics' ? {backgroundColor: 'lightBlue', ":hover": {backgroundColor: 'lightBlue'}} : {}),
                        ...selectionButtonSx
                    }}
                    onClick={() => {set_gallery_option("visit_metrics")}}
                >
                    VISIT METRICS
                </Button>
            </Box>
            <Box className={'exhibitBox'}>
            {
                gallery_option === "ai_digit" ?
                    <GalleryAiDigitContent/> :
                gallery_option === "backend" ?
                    <GalleryBackendContent/> :
                gallery_option === "line_plots" ?
                    <GalleryLinePlotsContent /> :
                gallery_option === "visit_metrics" ?
                    <GalleryVisitMetricsContent /> :
                `Invalid gallery_option state ${gallery_option}`
            }
            </Box>
        </Box>
    </Fade>
    return content
}