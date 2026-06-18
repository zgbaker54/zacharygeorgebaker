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
const SessionStartTime = 'session_start_time'

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
 * Internal click handler attached to the `window` by `InitSessionTracking`.
 * Delegates to `RecordSessionClick()` to persist the increment.
 */
function HandleMouseClick(event: MouseEvent) {
    RecordSessionClick()
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
    const session_start_time = sessionStorage.getItem(SessionStartTime)
    return parseInt(session_start_time ? session_start_time : "0")
}

/**
 * Store the current Unix time as the session start time.
 * @returns The newly stored timestamp (Unix seconds).
 */
function SetSessionStartTimeNowUnixS(): number {
    const sessionStartTime = GetUnixSecondsNow()
    sessionStorage.setItem(SessionStartTime, sessionStartTime.toString())
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
 * Set up global session tracking.
 *
 * Should be called once (typically at app bootstrap). It:
 * 1. Registers a `click` listener on `window` that auto-increments the
 *    session click count on every click.
 * 2. Records the session start time if one hasn't been set yet.
 *
 * @returns A cleanup function that removes the click listener — suitable
 *          for returning from a React `useEffect` or calling on teardown.
 */
export function InitSessionTracking() {
    window.addEventListener('click', HandleMouseClick)
    if (!GetSessionStartTimeUnixS()) {
        SetSessionStartTimeNowUnixS()
    }
    return () => { window.removeEventListener('click', HandleMouseClick) }
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
