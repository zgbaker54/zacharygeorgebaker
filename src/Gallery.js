import { useState, useEffect } from 'react';
import { Box, Button, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line'
import { line_data } from './GalleryData/LineData'
import './styles/Global.css';
import { fade_duration, selectionButtonSx } from './settings'


export default function Gallery(){
    // Gallery is intended to contain several examples of data visualization. Currently it has just 1 plot - a line plot with several sample signals.

    // fade gallery in
    useEffect(() => {
        set_gallery_fade(true)
      }, [])

    // states
    let [galery_fade, set_gallery_fade] = useState(false);

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

    // back button, caption linking Nivo's website, and line chart
    let content = <Fade
        in={galery_fade}
        timeout={fade_duration}
    >
        <Box className='Box'>
            <Button
                component={Link}
                to="/"
                sx={selectionButtonSx}
            >
                BACK
            </Button>
            <Box className='galleryCaption'>
                Powered by <a href="https://nivo.rocks/" target='_blank' rel="noreferrer">Nivo</a>
            </Box>
            <Box className='galleryChart'>
                <MyResponsiveLine line_data={line_data([
                    'linear',
                    'exponential',
                    'sinusoidal',
                ])} />
            </Box>
        </Box>
    </Fade>

  return content
}