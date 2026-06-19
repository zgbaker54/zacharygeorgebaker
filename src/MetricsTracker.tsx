/**
 * MetricsTracker.tsx
 *
 * Invisible component that tracks mouse movement across the entire page.
 * On every `mousemove` event, it calculates the Euclidean distance from
 * the previous mouse position and accumulates the total into sessionStorage
 * via `SetSessionMouseTravelPx()`.
 *
 * This component renders nothing (<div></div>) and is mounted once at the
 * app root level so tracking is always active.
 */
import React, { useEffect, useRef } from "react";
import {
    GetSessionMouseTravelPx,
    SetSessionMouseTravelPx,
    RecordSessionClick,
    GetSessionStartTimeUnixS,
    SetSessionStartTimeNowUnixS,
} from './utils/utils'

export default function MetricsTracker(): React.ReactElement {
    
    /** Tracks the last known mouse position for distance calculation */
    interface MousePosition {
        X: number | null;
        Y: number | null;
    }

    /** Ref holding the previous mouse position (avoids re-renders on mousemove) */
    const mousePositionRef = useRef<MousePosition>({X: null, Y: null})

    /**
     * Internal click handler attached to the `window` by `InitSessionTracking`.
     * Delegates to `RecordSessionClick()` to persist the increment.
     */
    function HandleClick(event: MouseEvent) {
        RecordSessionClick()
    }

    /**
     * Called on every `mousemove` event. Computes the Euclidean distance
     * from the last recorded position and adds it to the running total
     * stored in sessionStorage.
     */
    function HandleMouseMove(event: MouseEvent) {
        const currentX = event.clientX
        const currentY = event.clientY
        const prevX = mousePositionRef.current.X
        const prevY = mousePositionRef.current.Y
        let travelDistancePx = 0
        if (prevX !== null && prevY !== null) {
            travelDistancePx = Math.sqrt(((currentX - prevX) ** 2) + ((currentY - prevY) ** 2))
            SetSessionMouseTravelPx(GetSessionMouseTravelPx() + travelDistancePx)

        }
        mousePositionRef.current = {X: currentX, Y: currentY}
    }

    /**
     * On mount, registers global click and mousemove listeners and records the
     * session start time if one hasn't been set yet. Cleans up on unmount.
     */
    useEffect(() => {
        window.addEventListener('click', HandleClick)
        window.addEventListener('mousemove', HandleMouseMove)
        if (!GetSessionStartTimeUnixS()) {
            SetSessionStartTimeNowUnixS()
        }
        return () => {
            window.removeEventListener('click', HandleClick)
            window.removeEventListener('mousemove', HandleMouseMove)
        }
    }, [])

    return <></>
}
