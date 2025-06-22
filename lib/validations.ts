import { z } from "zod"

export const cameraUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  rtsp_url: z.string().min(1, "RTSP URL is required"),
  stream_frame_width: z.number().min(1, "Width must be greater than 0").max(4096, "Width too large"),
  stream_frame_height: z.number().min(1, "Height must be greater than 0").max(4096, "Height too large"),
  stream_max_length: z.number().min(1, "Max length must be greater than 0"),
  stream_quality: z.number().min(1, "Quality must be between 1-100").max(100, "Quality must be between 1-100"),
  stream_fps: z.number().min(1, "FPS must be greater than 0").max(60, "FPS too high"),
  stream_skip_frames: z.number().min(0, "Skip frames cannot be negative"),
  tags: z.array(z.string()).optional(),
})

export const demographicsConfigSchema = z.object({
  camera_id: z.string().min(1, "Camera ID is required"),
  track_history_max_length: z
    .number()
    .min(1, "Track history max length must be at least 1")
    .max(100, "Track history max length cannot exceed 100")
    .optional(),
  exit_threshold: z
    .number()
    .min(1, "Exit threshold must be at least 1")
    .max(300, "Exit threshold cannot exceed 300")
    .optional(),
  min_track_duration: z
    .number()
    .min(1, "Min track duration must be at least 1 second")
    .max(60, "Min track duration cannot exceed 60 seconds")
    .optional(),
  detection_confidence_threshold: z
    .number()
    .min(0.1, "Detection confidence threshold must be at least 0.1")
    .max(1.0, "Detection confidence threshold cannot exceed 1.0")
    .optional(),
  demographics_confidence_threshold: z
    .number()
    .min(0.1, "Demographics confidence threshold must be at least 0.1")
    .max(1.0, "Demographics confidence threshold cannot exceed 1.0")
    .optional(),
  min_track_updates: z
    .number()
    .min(1, "Min track updates must be at least 1")
    .max(100, "Min track updates cannot exceed 100")
    .optional(),
  box_area_threshold: z
    .number()
    .min(0.05, "Box area threshold must be at least 0.05")
    .max(1.0, "Box area threshold cannot exceed 1.0")
    .optional(),
  save_interval: z
    .number()
    .min(300, "Save interval must be at least 300 seconds (5 minutes)")
    .max(1800, "Save interval cannot exceed 1800 seconds (30 minutes)")
    .optional(),
  frame_skip_interval: z
    .number()
    .min(0.1, "Frame skip interval must be at least 0.1")
    .max(5.0, "Frame skip interval cannot exceed 5.0")
    .optional(),
})

export type CameraUpdateInput = z.infer<typeof cameraUpdateSchema>
export type DemographicsConfigInput = z.infer<typeof demographicsConfigSchema>
