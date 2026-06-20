/**
 * utils.ts
 *
 * Session-tracking utilities that read/write click counts and visit
 * duration via `sessionStorage`. Designed to be used by the Visit Metrics
 * dashboard panel (GalleryVisitMetricsContent).
 *
 * Key flows:
 * - `InitSessionTracking()` sets up a global click listener on the
 *   `window` and records the session start time (once per session).
 * - `GetSessionClicks()` / `GetSessionDuration()` read live values.
 */

/** sessionStorage key for the running click count */
const SessionClicksKey = 'session_clicks'
/** sessionStorage key for the session start Unix timestamp (seconds) */
const SessionStartTimeKey = 'session_start_time'
/** sessionStorage key for the running total of mouse travel distance (pixels) */
const SessionMouseTravelKey = 'session_mouse_travel'

// ── API helper functions ──────────────────────────────────────────────
export async function GetLandingBio(): Promise<string> {
    let url = `${import.meta.env.VITE_BACKEND_URL}/getLandingBio`
    const response = await fetch(url)
    const data = await response.json()
    return data.landingBio
}

export async function GetResumeLink(): Promise<string> {
    let url = `${import.meta.env.VITE_BACKEND_URL}/getResumeLink`
    const response = await fetch(url)
    const data = await response.json()
    return data.resumeLink
}

/**
 * Read the current click count from sessionStorage.
 * Returns 0 when no value has been stored yet.
 */
export function GetSessionClicks(): number {
    const session_clicks = sessionStorage.getItem(SessionClicksKey)
    return parseInt(session_clicks ? session_clicks : "0")
}

/**
 * Increment the stored click count by 1 and return the new value.
 * Useful when you need to both persist and act on the updated number.
 */
export function RecordSessionClick(): number {
    const newValue = GetSessionClicks() + 1
    sessionStorage.setItem(SessionClicksKey, newValue.toString());
    return newValue
}

/**
 * Read the accumulated mouse travel distance from sessionStorage.
 * Returns 0 when no value has been stored yet.
 */
export function GetSessionMouseTravelPx(): number {
    const session_travel = sessionStorage.getItem(SessionMouseTravelKey)
    return parseInt(session_travel ? session_travel : "0")
}

/**
 * Store a new mouse travel distance value to sessionStorage.
 *
 * Called on every `mousemove` event by GalleryVisitMetricsContent
 * to persist the running total of pixels the mouse has moved.
 */
export function SetSessionMouseTravelPx(sessionMouseTravelPx: number) {
    sessionStorage.setItem(SessionMouseTravelKey, sessionMouseTravelPx.toString())
}

/**
 * @returns Current Unix time in seconds (floored).
 */
function GetUnixSecondsNow(): number {
    return Math.floor(Date.now() / 1000)
}

/**
 * Read the session start timestamp from sessionStorage.
 * @returns Unix seconds, or 0 if no start time has been recorded.
 */
export function GetSessionStartTimeUnixS(): number {
    const session_start_time = sessionStorage.getItem(SessionStartTimeKey)
    return parseInt(session_start_time ? session_start_time : "0")
}

/**
 * Store the current Unix time as the session start time.
 * @returns The newly stored timestamp (Unix seconds).
 */
export function SetSessionStartTimeNowUnixS(): number {
    const sessionStartTime = GetUnixSecondsNow()
    sessionStorage.setItem(SessionStartTimeKey, sessionStartTime.toString())
    return sessionStartTime
}

/**
 * Convert a duration in seconds to a "m:ss" format string.
 * @example FormatDurationSeconds(65)  // => "1:05"
 * @example FormatDurationSeconds(3723) // => "62:03"
 */
export function FormatDurationSeconds(durationSeconds: number): string {
    const minutes = Math.floor(durationSeconds / 60)
    const seconds = durationSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Compute the elapsed session duration as a human-readable "m:ss" string.
 *
 * Relies on the start timestamp previously stored by `InitSessionTracking`
 * (or direct use of `SetSessionStartTimeNowUnixS`).
 */
export function GetSessionDuration(): string {
    const durationSeconds = GetUnixSecondsNow() - GetSessionStartTimeUnixS()
    const minutes = Math.floor(durationSeconds / 60)
    const seconds = durationSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`

}

/**
 * Detect whether the current browser is running on a mobile device
 * by inspecting the user-agent string.
 *
 * @returns `true` if the user-agent matches common mobile patterns.
 */
export function IsMobileDevice(): boolean {
    const ua = navigator.userAgent
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
}
