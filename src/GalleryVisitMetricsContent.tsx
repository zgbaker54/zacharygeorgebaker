/**
 * GalleryVisitMetricsContent.tsx
 *
 * Displays a "Visit Metrics" dashboard panel showing:
 * - Session click count (incremented on every click)
 * - Session duration (live-updating "m:ss" timer)
 * - Mouse travel distance (updated on every mousemove)
 * - Device tilt (requires HTTPS; iOS 13+ needs explicit user permission)
 *
 * Metrics update in real time via event listeners and an interval timer.
 * The device orientation sensor listener is only registered after the user
 * taps the "Start" button, satisfying iOS 13+ permission requirements.
 */

import { Box, Button } from '@mui/material';
import './styles/Global.css';
import { GetSessionClicks, GetSessionDuration, GetSessionMouseTravelPx, IsMobileDevice } from './utils/utils'
import React, { useState, useEffect, useCallback } from "react";


/**
 * Shape of each metric tile displayed in the UI.
 */
interface MetricTileData {
  icon: string;
  label: string;
  value: string | number;
  visibility: 'mobile' | 'desktop' | 'both';
  buttonLabel?: string;
  tiltChart?: { alpha: number; beta: number; gamma: number };
}

/**
 * Renders a real-time visit-metrics panel.
 *
 * On mount, registers a global click listener (to refresh the click count)
 * and starts an interval that updates the session duration every second.
 * Both the listener and interval are cleaned up on unmount.
 */
export default function GalleryVisitMetricsContent(): React.ReactElement {

    const isMobile = IsMobileDevice()

    // State: initialise from sessionStorage on first render
    let [sessionClicks, setSessionClicks] = useState<number>(GetSessionClicks())
    let [sessionDuration, setSessionDuration] = useState<string>(GetSessionDuration())
    let [sessionMouseTravel, setSessionMouseTravel] = useState<number>(GetSessionMouseTravelPx())
    // Tilt tile state: store the three orientation axes as numbers for the bar chart
    let [tiltData, setTiltData] = useState<{ alpha: number; beta: number; gamma: number }>({ alpha: 0, beta: 0, gamma: 0 })
    // Tracks whether the user has clicked "Start" to activate device orientation sensors
    let [sensorsStarted, setSensorsStarted] = useState<boolean>(false)
    // DeviceOrientationEvent only works in secure contexts (HTTPS); detect for showing a warning
    let isHttp = window.location.protocol === 'http:'

    /**
     * Called on every `click` event. Re-reads the stored click count from
     * sessionStorage (incremented by the global listener in utils.ts) and
     * pushes it into React state so the UI re-renders.
     */
    function HandleMouseClick() {
        setSessionClicks(GetSessionClicks())
    }

    /**
     * Called on every `mousemove` event. Re-reads the accumulated mouse
     * travel distance from sessionStorage (updated by MetricsTracker.tsx)
     * and pushes it into React state so the UI re-renders.
     */
    function HandleMouseMove() {
        setSessionMouseTravel(GetSessionMouseTravelPx())
    }

    /**
     * Called on every `deviceorientation` event. Extracts the three
     * orientation axes (alpha, beta, gamma) as rounded integers and
     * stores them in state for display in the tilt tile's badge UI.
     */
    function HandleTilt(event: DeviceOrientationEvent) {
        const alpha = Math.round(event.alpha ? event.alpha : 0)
        const beta = Math.round(event.beta ? event.beta : 0)
        const gamma = Math.round(event.gamma ? event.gamma : 0)
        setTiltData({ alpha, beta, gamma })
    }

    /**
     * Called from the "Start" button onClick on the Device Tilt tile.
     *
     * iOS 13+ requires the user to grant permission via
     * DeviceOrientationEvent.requestPermission() before the
     * 'deviceorientation' event can be listened to.
     * On other platforms the event is available without permission.
     *
     * This MUST be called from a user gesture (onClick) for the
     * permission prompt to work on iOS.
     */
    const handleStartSensors = useCallback(async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            const response = await (DeviceOrientationEvent as any).requestPermission();
            if (response === 'granted') {
                window.addEventListener('deviceorientation', HandleTilt);
                setSensorsStarted(true);
            }
        } else {
            // Non-iOS device, just listen
            window.addEventListener('deviceorientation', HandleTilt);
            setSensorsStarted(true);
        }
    }, []);

    // Wire up event listener and interval on mount; tear down on unmount
    useEffect(() => {
        window.addEventListener('click', HandleMouseClick)
        window.addEventListener('mousemove', HandleMouseMove)
        const intervalId = setInterval(() => {
            setSessionDuration(GetSessionDuration())
        })
        return () => {
            window.removeEventListener('click', HandleMouseClick)
            window.removeEventListener('mousemove', HandleMouseMove)
            clearInterval(intervalId)
        }
    }, [])

    // Build the array of tile definitions consumed by the JSX template below
    let metrics: MetricTileData[] = [
        {
            icon: '🖱️',
            label: 'Session Clicks',
            value: sessionClicks,
            visibility: 'desktop',
        },
        {
            icon: '🫆',
            label: 'Session Taps',
            value: sessionClicks,
            visibility: 'mobile',
        },
        {
            icon: '⏱️',
            label: 'Visit Duration',
            value: sessionDuration,
            visibility: 'both',
        },
        {
            icon: '📏',
            label: 'Mouse Travel',
            value: `${sessionMouseTravel.toLocaleString()} px`,
            visibility: 'desktop',
        },
        {
            icon: '⚖️',
            label: 'Device Tilt',
            // Show an HTTPS warning on http://, or the bar chart once active, or empty before "Start"
            value: isHttp ? '⚠️ Requires HTTPS' : '',
            visibility: 'mobile',
            // Show a "Start" button on HTTPS only, before sensors are activated
            buttonLabel: (!isHttp && !sensorsStarted) ? 'Start' : undefined,
            tiltChart: sensorsStarted ? tiltData : undefined,
        },
    ]

    let filteredMetrics = metrics.filter(metric => 
        metric.visibility === 'both' || 
        (metric.visibility === 'mobile' && isMobile) || 
        (metric.visibility === 'desktop' && !isMobile)
    )

    let content = <Box className='Box'>
        <Box className='metricsHeader'>
            Visit Metrics
        </Box>
        <Box className='galleryCaption'>
            This exhibit tracks your session activity in real time using <code>sessionStorage</code> and browser event listeners. Metrics update live as you interact with the page.
        </Box>
        <Box className='metricsContainer'>
            {filteredMetrics.map((metric: MetricTileData) => (
                <Box key={metric.label} className='metricTile'>
                    <Box className='metricIcon'>{metric.icon}</Box>
                    <Box className='metricLabel'>{metric.label}</Box>
                    <Box className='metricValue'>
                        {metric.buttonLabel ? (
                            <Button variant="contained" size="small" onClick={handleStartSensors}>
                                {metric.buttonLabel}
                            </Button>
                        ) : metric.tiltChart ? (
                            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                                {[
                                    { axis: 'α', value: metric.tiltChart.alpha },
                                    { axis: 'β', value: metric.tiltChart.beta },
                                    { axis: 'γ', value: metric.tiltChart.gamma },
                                ].map(({ axis, value }) => (
                                    <Box key={axis} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        background: '#f0f2f5',
                                        borderRadius: 2,
                                        px: 1.5,
                                        py: 0.5,
                                        minWidth: 48,
                                    }}>
                                        <Box sx={{ fontSize: 11, fontWeight: 600, color: '#6c757d', lineHeight: 1.2 }}>{axis}</Box>
                                        <Box sx={{ fontSize: 18, fontWeight: 700, color: '#495057', lineHeight: 1.3 }}>{value}°</Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <span style={{ color: typeof metric.value === 'string' && metric.value.includes('Requires HTTPS') ? 'red' : 'inherit' }}>
                                {metric.value}
                            </span>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    </Box>
    return content;
}