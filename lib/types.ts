export interface Tag {
  id: string
  name: string
  color: string
}

export interface DemographicsConfig {
  id: string
  camera_id: string
  track_history_max_length: number
  exit_threshold: number
  min_track_duration: number
  detection_confidence_threshold: number
  demographics_confidence_threshold: number
  min_track_updates: number
  box_area_threshold: number
  save_interval: number
  frame_skip_interval: number
  created_at: string
  updated_at: string
}

export interface Camera {
  id: string
  name: string
  rtsp_url: string
  tags: Tag[]
  is_active: boolean
  status_message: string
  snapshot: string
  created_at: string
  updated_at: string
  stream_frame_width: number
  stream_frame_height: number
  stream_max_length: number
  stream_quality: number
  stream_fps: number
  stream_skip_frames: number
  demographics_config?: DemographicsConfig
}

export interface CameraUpdateRequest {
  name: string
  rtsp_url: string
  stream_frame_width: number
  stream_frame_height: number
  stream_max_length: number
  stream_quality: number
  stream_fps: number
  stream_skip_frames: number
  tags: string[]
}

export interface DemographicsConfigRequest {
  camera_id: string
  track_history_max_length?: number
  exit_threshold?: number
  min_track_duration?: number
  detection_confidence_threshold?: number
  demographics_confidence_threshold?: number
  min_track_updates?: number
  box_area_threshold?: number
  save_interval?: number
  frame_skip_interval?: number
}

export interface DemographicsResult {
  count: number
  gender: "male" | "female" | "unknown"
  age: string
  emotion: "happy" | "sad" | "angry" | "surprised" | "neutral" | "fear" | "disgust"
  ethnicity: string
  id: string
  config_id: string
  created_at: string
}

export interface DemographicsAnalytics {
  gender_distribution: Record<string, number>
  age_distribution: Record<string, number>
  emotion_distribution: Record<string, number>
  ethnicity_distribution: Record<string, number>
  total_count: number
}

export interface DemographicsResponse {
  items: DemographicsResult[]
  analytics: DemographicsAnalytics
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}
