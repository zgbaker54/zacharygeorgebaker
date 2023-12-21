import { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import './styles/Global.css';
import { selectionButtonSx, backendURL } from './settings'


export default function GalleryAiDigitContent(){

    // states
    let [is_drawing, set_is_drawing] = useState(false);
    let [prediction, set_prediction] = useState(null);
    let [is_predicting, set_is_predicting] = useState(false);
    let [prediction_error, set_prediction_error] = useState(null);
    let [clear_button_disabled, set_clear_button_disabled] = useState(false);
    let [submit_button_disabled, set_submit_button_disabled] = useState(false);

    // refs
    let canvasRef = useRef(null);
    let ctxRef = useRef(null);
    let bottomRef = useRef(null);

    // scroll to bottom when query_nn_backend finishes updating state
    useEffect(() => {
        if (prediction || is_predicting || prediction_error){
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [prediction, is_predicting, prediction_error])

    function setup_canvas_context(){
        console.log('setting canvas context')
        // make canvas fit/scale to container
        const canvas = canvasRef.current;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // set context to draw 2d black pen strokes
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.ceil(canvas.offsetWidth / 12);
        ctxRef.current = ctx;
    }

    useEffect(() =>{
        setup_canvas_context()
        window.addEventListener("resize", setup_canvas_context, false);
        // stop scrolling on canvas in mobile
        canvasRef.current.addEventListener('touchmove', function(event) {
            event.preventDefault();
        });
    }, [])

    // starting the drawing
    const startDrawing = (event) => {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY,
        );
        set_is_drawing(true);
    }

    // ending the drawing
    const endDrawing = (event) => {
        ctxRef.current.closePath();
        set_is_drawing(false);
    }

    // ongoing drawing
    const draw = (event) => {
        if (!is_drawing) {
            return
        }
        ctxRef.current.lineTo(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY,
        )
        ctxRef.current.stroke();
    }

    // canvas for drawing
    let drawing_canvas = <canvas
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={endDrawing}
        ref={canvasRef}
        className='border1'
        width="200"
        height="200"
    />

    // function to fetch number prediction
    async function query_nn_backend(image_data){
        console.log('query_nn_backend running');
        let url = `${backendURL}/digitNN`
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let image_array = compile_image_data(image_data)
        console.log('image_array', image_array)
        let body = JSON.stringify({
            "image_array": image_array,
        });
        let response = await fetch(url, { method: 'POST', headers: headers, body: body });
        let result = await response.json();
        let _prediction = result.prediction
        console.log('query_nn_backend finished');
        return _prediction
    }

    // coverts image_data to image_array - a 2D boolean array
    function compile_image_data(image_data){
        let image_array = []
        let row = []
        for(let i=0; i<image_data.data.length; i++){
            if (i % 4 !== 3){ continue }
            row.push(image_data.data[i] === 255)
            if (row.length === image_data.width){
                image_array.push(row)
                row = []
            }
        }
        return image_array
    }

    // exhibit content
    let ai_digit_content = <Box className="Box">
        <Box className="galleryCaption">
            This exhibit showcases the "Hello World" version of Neural Networks - the MNIST Digit classification problem.
            <br/><br/>
            I built a simple Convolutional Neural Network using TensorFlow Keras to clasify handwritten digits.
            <br/><br/>
            Use the canvas below to write a handwritten-number and then click submit to classify it. Known problem: Try to write your digit using the entire canvas.
        </Box>
        <Box
            className="drawingCanvasBox border1"
        >
            {drawing_canvas}
        </Box>
        <Box className="aiDigitSelectionButtonBox">
            <Button
                sx={selectionButtonSx}
                onClick={() => {
                    set_prediction(null)
                    set_prediction_error(null)
                    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    console.log('canvas cleared')
                }}
                disabled={clear_button_disabled}
            >CLEAR</Button>
            <Button
                sx={selectionButtonSx}
                onClick={() => {
                    set_is_predicting(true);
                    set_prediction(null);
                    set_submit_button_disabled(true);
                    set_clear_button_disabled(true);
                    let image_data = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
                    console.log('image_data', image_data)
                    query_nn_backend(image_data)
                        .then(result => {
                            console.log('prediction', result)
                            set_prediction(result.toString());
                        })
                        .catch(error => {
                            console.log('err', error)
                            set_prediction_error(error)
                        })
                        .finally(() => {
                            set_is_predicting(false);
                            set_submit_button_disabled(false);
                            set_clear_button_disabled(false);
                        })
                }}
                disabled={submit_button_disabled}
            >SUBMIT</Button>
        </Box>
        <Box ref={bottomRef}>
            {is_predicting ?
                <Box className="galleryCaption">
                    {"Classifying on the backend..."}
                </Box> :
                null
            }
            {prediction_error ?
                <Box className="galleryCaption fontRed">
                    {`Error in query_nn_backend: ${prediction_error}`}
                </Box> :
                null
            }
            {prediction ?
                <Box className="galleryCaption">
                    {`Prediction ${prediction}`}
                </Box> :
                null
            }
        </Box>
    </Box>


    return ai_digit_content
}

