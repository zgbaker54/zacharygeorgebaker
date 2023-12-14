import { useState, useEffect } from 'react';
import { Box, Button, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line'
import { line_data } from './GalleryData/LineData'
import './styles/Global.css';
import { fade_duration, selectionButtonSx } from './settings'


export default function Gallery(){
    // Gallery contains exhibits that showcase my techical skillsets.

    // fade gallery in
    useEffect(() => {
        set_gallery_fade(true)
      }, [])

    // states
    let [gallery_fade, set_gallery_fade] = useState(false);
    let [gallery_option, set_gallery_option] = useState('backend');  // may be "backend" or "line_plots"
    let [image_url, set_image_url] = useState(null);
    let [image_url_loading, set_image_url_loading] = useState(false);

    // line chart from Nivo
    const MyResponsiveLine = ({ line_data }) => (
        <ResponsiveLine
            data={line_data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'X Value',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Y Value',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    )

    // content to show for line plot exhibit
    let line_plot_content = <Box className='Box'>
        <Box className='galleryCaption'>
            This exhibit shows sample data plotted in a line chart. It is powered by <a href="https://nivo.rocks/" target='_blank' rel="noreferrer">Nivo</a>.
        </Box>
        <Box className='galleryChart'>
            <MyResponsiveLine line_data={line_data([
                'linear',
                'exponential',
                'sinusoidal',
            ])} />
        </Box>
    </Box>

    // content to show for backend exhibit
    // TODO: add error handling for hitting backend and fetching image from signed url
    let backend_content = <Box className='Box'>
        <Box className="galleryCaption">
            This exhibit is powered by a Dockerized Python backend  I authored myself and deployed using AWS services - specifically ECR, Lambda,
            API Gateway, and S3.
            The backend code is committed <a href="https://github.com/zgbaker54/zacharygeorgebaker_backend/tree/main" target='_blank' rel="noreferrer">here</a>.
            <br/> <br/>
            Use the INITIATE BACKEND button to generate and regress sample data in the backend and then display its result: a matplotlib figure from S3.
        </Box>
        <Button
            sx={selectionButtonSx}
            onClick={()=>{
                set_image_url_loading(true);
                set_image_url(null);
                console.log('fetching from backend');
                let url = 'https://4uqoc6a5s7.execute-api.us-west-1.amazonaws.com/dev'
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                let body = JSON.stringify({
                    "data_type": "exponential",
                    "regress_type": "exponential"
                });
                fetch(url, { method: 'POST', headers: headers, body: body })
                    .then(response => response.json())
                    .then(result => {
                        console.log('result', result)
                        let signed_url = result.signed_url;
                        console.log('signed_url', signed_url)
                        fetch(signed_url)
                            .then(stream => {
                                console.log('stream', stream)
                                return stream.blob()
                            })
                            .then(blob => {
                                console.log('blob', blob)
                                let image_url = URL.createObjectURL(blob);
                                console.log('image_url', image_url)
                                set_image_url(image_url);
                                set_image_url_loading(false);
                            })
                    })
            }}
        >
            INITIATE BACKEND
        </Button>
        <Box className="logoBox">
            <img src="/python_logo.png" alt="missingImg" className="logoImage"/>
            <img src="/docker_logo.png" alt="missingImg" className="logoImage"/>
            <img src="/ecr_logo.png" alt="missingImg" className="logoImage"/>
            <img src="/lambda_logo.png" alt="missingImg" className="logoImage"/>
            <img src="/api-gateway_logo.png" alt="missingImg" className="logoImage"/>
            <img src="/s3_logo.png" alt="missingImg" className="logoImage"/>
        </Box>
        {image_url_loading ?
            <Box className="galleryCaption">
                {"Processing on the backend..."}
            </Box> :
            null}
        {image_url ?
            <Box className="backendImageBox">
                <img src={image_url} alt="missingImg" className="backendImage"/>
            </Box> :
        null}
    </Box>

    // main content
    let content = <Fade
        in={gallery_fade}
        timeout={fade_duration}
    >
        <Box className='Box'>
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
            <Box>
                <Button
                    sx={{
                        ...(gallery_option === 'backend' ? {backgroundColor: 'lightBlue'} : {}),
                        ...selectionButtonSx
                    }}
                    onClick={() => {set_gallery_option("backend")}}
                >
                    BACKEND
                </Button>
                <Button
                    sx={{
                        ...(gallery_option === 'line_plots' ? {backgroundColor: 'lightBlue'} : {}),
                        ...selectionButtonSx
                    }}
                    onClick={() => {set_gallery_option("line_plots")}}
                >
                    LINE PLOTS
                </Button>
            </Box>
            {
                gallery_option === "backend" ?
                    backend_content :
                gallery_option === "line_plots" ?
                    line_plot_content :
                `Invalid gallery_option state ${gallery_option}`
            }
        </Box>
    </Fade>
    return content
}