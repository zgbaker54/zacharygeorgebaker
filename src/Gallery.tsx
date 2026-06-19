import { useState, useEffect, useRef } from 'react';
import { Box, Button, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import GalleryBackendContent from './GalleryBackendContent';
import GalleryLinePlotsContent from './GalleryLinePlotsContent'
import GalleryAiDigitContent from './GalleryAiDigitContent';
import GalleryVisitMetricsContent from './GalleryVisitMetricsContent';
import './styles/Global.css';
import { fade_duration, exhibitTabSx, smallButtonSx } from './settings'


type GalleryOption = 'ai_digit' | 'backend' | 'line_plots' | 'visit_metrics'


export default function Gallery(): React.ReactElement {

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
        <Box className='galleryPage' ref={topRef}>
            <Box className='galleryCard'>
                <Box className="galleryTitle">
                    GALLERY
                </Box>
                <Button
                    component={Link}
                    to="/"
                    sx={{ ...smallButtonSx, mb: 1 }}
                >
                    ← BACK
                </Button>
                <Box className='landingSeparator' />
                <Box className="gallerySubtitle">
                    Exhibits
                </Box>
                <Box className={"exhibitSelectionBox"}>
                    <Button
                        sx={exhibitTabSx(gallery_option === 'visit_metrics')}
                        onClick={() => {set_gallery_option("visit_metrics")}}
                    >
                        VISIT METRICS
                    </Button>
                    <Button
                        sx={exhibitTabSx(gallery_option === 'backend')}
                        onClick={() => {set_gallery_option("backend")}}
                    >
                        BACKEND
                    </Button>
                    <Button
                        sx={exhibitTabSx(gallery_option === 'line_plots')}
                        onClick={() => {set_gallery_option("line_plots")}}
                    >
                        LINE PLOTS
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
        </Box>
    </Fade>
    return content
}
