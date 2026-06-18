/**
 * GalleryVisitMetricsContent.tsx
 *
 * Displays a "Visit Metrics" dashboard panel showing:
 * - Session click count (incremented on every click)
 * - Session duration (live-updating "m:ss" timer)
 *
 * Metrics update in real time via event listeners and an interval timer.
 */

import { Box } from '@mui/material';
import './styles/Global.css';
import { GetSessionClicks, GetSessionDuration } from './utils/utils'
import React, { useState, useEffect } from "react";


/**
 * Shape of each metric tile displayed in the UI.
 */
interface MetricTileData {
  icon: string;
  label: string;
  value: string | number;
}

/**
 * Renders a real-time visit-metrics panel.
 *
 * On mount, registers a global click listener (to refresh the click count)
 * and starts an interval that updates the session duration every second.
 * Both the listener and interval are cleaned up on unmount.
 */
export default function GalleryVisitMetricsContent(): React.ReactElement {

    // State: initialise from sessionStorage on first render
    let [sessionClicks, setSessionClicks] = useState<number>(GetSessionClicks())
    let [sessionDuration, setSessionDuration] = useState<string>(GetSessionDuration())

    /**
     * Called on every `click` event. Re-reads the stored click count from
     * sessionStorage (incremented by the global listener in utils.ts) and
     * pushes it into React state so the UI re-renders.
     */
    function HandleMouseClick() {
        console.log("boop!")
        setSessionClicks(GetSessionClicks())
    }

    // Wire up event listener and interval on mount; tear down on unmount
    useEffect(() => {
        window.addEventListener('click', HandleMouseClick)
        const intervalId = setInterval(() => {
            setSessionDuration(GetSessionDuration())
        })
        return () => {
            window.removeEventListener('click', HandleMouseClick)
            clearInterval(intervalId)
        }
    }, [])

    // Build the array of tile definitions consumed by the JSX template below
    let metrics: MetricTileData[] = [
        {
            icon: '🖱️',
            label: 'Session Clicks',
            value: sessionClicks,
        },
        {
            icon: '⏱️',
            label: 'Visit Duration',
            value: sessionDuration,
        },
    ]

    let content = <Box className='Box'>
        <Box className='metricsHeader'>
            Visit Metrics
        </Box>
        <Box className='metricsContainer'>
            {metrics.map((metric: MetricTileData) => (
                <Box key={metric.label} className='metricTile'>
                    <Box className='metricIcon'>{metric.icon}</Box>
                    <Box className='metricLabel'>{metric.label}</Box>
                    <Box className='metricValue'>{metric.value}</Box>
                </Box>
            ))}
        </Box>
    </Box>
    return content;
}