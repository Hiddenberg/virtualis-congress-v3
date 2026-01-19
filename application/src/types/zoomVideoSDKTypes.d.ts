export interface SessionMetricsListObject {
   /** The report's start date, in 'yyyy-mm-dd' format. */
   from: string;
   /** The report's end date, in 'yyyy-mm-dd' format. */
   to: string;
   /**
    * The number of records returned within a single API call.
    * (default: 30, maximum: 300)
    */
   page_size?: number;
   /**
    * Used to paginate through large result sets.
    * A next page token will be returned when the results exceed the current page size.
    */
   next_page_token?: string;
   /** Information about the sessions. */
   sessions: SessionMetrics[];
}

export interface SessionMetrics {
   /**
    * The session's ID. If the ID begins with a `+`, `/`, or contains `//`
    * characters, you must **double-encode** this value.
    */
   id: string;
   /** The session's name. */
   session_name: string;
   /** The session's start time in ISO date-time format (e.g. 2019-08-20T19:09:01Z). */
   start_time: string;
   /** The session's end time in ISO date-time format (e.g. 2019-08-20T19:19:01Z). */
   end_time: string;
   /** The session's duration, in 'hh:mm:ss' format. */
   duration: string;
   /** The session's user count. */
   user_count: number;
   /** Whether VoIP was used in the session. */
   has_voip: boolean;
   /** Whether video was used in the session. */
   has_video: boolean;
   /** Whether the screen share feature was used in the session. */
   has_screen_share: boolean;
   /** Whether the recording feature was used in the session. */
   has_recording: boolean;
   /** Whether the PSTN feature was used in the session. */
   has_pstn: boolean;
   /** The Video SDK custom session ID. */
   session_key: string;
   /** Whether the session summary was used in the session. */
   has_session_summary: boolean;
   /** Audio quality rating. */
   audio_quality: AudioQuality;
   /** Video quality rating. */
   video_quality: VideoQuality;
   /** Screen share quality rating. */
   screen_share_quality: ScreenShareQuality;
}

export type AudioQuality = "good" | "fair" | "poor" | "bad";
export type VideoQuality = "good" | "fair" | "poor" | "bad";
export type ScreenShareQuality = "good" | "fair" | "poor" | "bad";
