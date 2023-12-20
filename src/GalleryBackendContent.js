import { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import './styles/Global.css';
import { selectionButtonSx } from './settings'


export default function GalleryBackendContent(){
    // GalleryBackendContent showcases a Dockerized Python backend running regressions and delivering matplotlib figures

    // states
    let [image_url, set_image_url] = useState(null);
    let [image_url_loading, set_image_url_loading] = useState(false);
    let [image_url_loading_error, set_image_url_loading_error] = useState(null);

    // scroll to bottom when the query_backend finishes updating state
    const bottomRef = useRef(null);
    useEffect(() => {
        if (image_url || image_url_loading || image_url_loading_error){
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [image_url_loading, image_url_loading_error, image_url])

    // async function to ping the backend
    async function query_backend(){
        console.log('query_backend running');
        let url = 'https://4uqoc6a5s7.execute-api.us-west-1.amazonaws.com/dev/regfigs'
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = JSON.stringify({
            "data_type": "exponential",
            "regress_type": "exponential"
        });
        let response = await fetch(url, { method: 'POST', headers: headers, body: body });
        let result = await response.json();
        let signed_url = result.signed_url;
        let stream = await fetch(signed_url);
        let blob = await stream.blob()
        let image_url = URL.createObjectURL(blob);
        console.log('query_backend finished');
        return image_url
    }

    // content to show for backend exhibit
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
                set_image_url_loading_error(null);
                set_image_url(null);
                query_backend()
                    .then(image_url => {
                        set_image_url(image_url);
                    })
                    .catch(error => {
                        set_image_url_loading_error(error)
                    })
                    .finally(() => {
                        set_image_url_loading(false);
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
        <Box ref={bottomRef}>
            {image_url_loading ?
                <Box className="galleryCaption">
                    {"Processing on the backend..."}
                </Box> :
                null
            }
            {image_url_loading_error ?
                <Box className="galleryCaption fontRed">
                    {`Error in query_backend: ${image_url_loading_error}`}
                </Box> :
                null
            }
            {image_url ?
                <Box className="backendImageBox">
                    <img src={image_url} alt="missingImg" className="backendImage"/>
                </Box> :
                null
            }
        </Box>
    </Box>
    return backend_content;
}