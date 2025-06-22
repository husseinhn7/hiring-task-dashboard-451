"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCamera } from "@/hooks/use-cameras"
import { useCreateDemographicsConfig, useUpdateDemographicsConfig } from "@/hooks/use-demographics"
import { demographicsConfigSchema, type DemographicsConfigInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Clock, Target, Activity, AlertCircle, CheckCircle } from "lucide-react"

interface DemographicsConfigFormProps {
  cameraId?: string
}

export function DemographicsConfigForm({ cameraId }: DemographicsConfigFormProps) {
  const router = useRouter()
  const { data: camera, isLoading } = useCamera(cameraId || "")
  const createConfig = useCreateDemographicsConfig()
  const updateConfig = useUpdateDemographicsConfig()

  // Get config from camera data
  const config = camera?.demographics_config

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<DemographicsConfigInput>({
    resolver: zodResolver(demographicsConfigSchema),
    defaultValues: {
      camera_id: cameraId || "",
      track_history_max_length: 50,
      exit_threshold: 100,
      min_track_duration: 5,
      detection_confidence_threshold: 0.5,
      demographics_confidence_threshold: 0.7,
      min_track_updates: 10,
      box_area_threshold: 0.1,
      save_interval: 600,
      frame_skip_interval: 1.0,
    },
  })

  const detectionConfidenceThreshold = watch("detection_confidence_threshold")
  const demographicsConfidenceThreshold = watch("demographics_confidence_threshold")
  const boxAreaThreshold = watch("box_area_threshold")
  const frameSkipInterval = watch("frame_skip_interval")

  useEffect(() => {
    if (config) {
      reset({
        camera_id: config.camera_id,
        track_history_max_length: config.track_history_max_length,
        exit_threshold: config.exit_threshold,
        min_track_duration: config.min_track_duration,
        detection_confidence_threshold: config.detection_confidence_threshold,
        demographics_confidence_threshold: config.demographics_confidence_threshold,
        min_track_updates: config.min_track_updates,
        box_area_threshold: config.box_area_threshold,
        save_interval: config.save_interval,
        frame_skip_interval: config.frame_skip_interval,
      })
    }
  }, [config, reset])

  const onSubmit = async (data: DemographicsConfigInput) => {
    try {
      if (config) {
        // Configuration exists, update it
        await updateConfig.mutateAsync({ id: config.id, data })
      } else {
        // No configuration exists, create new one
        await createConfig.mutateAsync(data)
      }
      if (cameraId) {
        router.push(`/cameras/${cameraId}`)
      }
    } catch (error) {
      // Error is handled by the mutations
    }
  }

  const getConfidenceLevel = (value: number) => {
    if (value >= 0.8) return { label: "High", color: "bg-green-100 text-green-800" }
    if (value >= 0.6) return { label: "Medium", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Low", color: "bg-red-100 text-red-800" }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={cameraId ? `/cameras/${cameraId}` : "/demographics/config"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Demographics Configuration</h1>
            {camera ? (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">{camera.name}</p>
                {config ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Configured
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Global Configuration</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Detection Confidence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Detection Confidence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">
                  Detection Confidence Threshold: {detectionConfidenceThreshold?.toFixed(2)}
                </label>
                <Badge className={getConfidenceLevel(detectionConfidenceThreshold || 0.5).color}>
                  {getConfidenceLevel(detectionConfidenceThreshold || 0.5).label}
                </Badge>
              </div>
              <Slider
                value={[detectionConfidenceThreshold || 0.5]}
                onValueChange={([value]) => setValue("detection_confidence_threshold", value, { shouldDirty: true })}
                max={1.0}
                min={0.1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Minimum confidence level for object detection (0.1 - 1.0). Higher values reduce false positives but may
                miss some detections.
              </p>
              {errors.detection_confidence_threshold && (
                <p className="text-sm text-red-500 mt-1">{errors.detection_confidence_threshold.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">
                  Demographics Confidence Threshold: {demographicsConfidenceThreshold?.toFixed(2)}
                </label>
                <Badge className={getConfidenceLevel(demographicsConfidenceThreshold || 0.7).color}>
                  {getConfidenceLevel(demographicsConfidenceThreshold || 0.7).label}
                </Badge>
              </div>
              <Slider
                value={[demographicsConfidenceThreshold || 0.7]}
                onValueChange={([value]) => setValue("demographics_confidence_threshold", value, { shouldDirty: true })}
                max={1.0}
                min={0.1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Minimum confidence level for demographics classification (0.1 - 1.0). Higher values improve accuracy but
                may reduce detection rate.
              </p>
              {errors.demographics_confidence_threshold && (
                <p className="text-sm text-red-500 mt-1">{errors.demographics_confidence_threshold.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-4">
                Box Area Threshold: {boxAreaThreshold?.toFixed(2)}
              </label>
              <Slider
                value={[boxAreaThreshold || 0.1]}
                onValueChange={([value]) => setValue("box_area_threshold", value, { shouldDirty: true })}
                max={1.0}
                min={0.05}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Minimum bounding box area relative to frame size (0.05 - 1.0). Filters out very small detections.
              </p>
              {errors.box_area_threshold && (
                <p className="text-sm text-red-500 mt-1">{errors.box_area_threshold.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tracking Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Tracking Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="track_history_max_length" className="block text-sm font-medium mb-2">
                  Track History Max Length
                </label>
                <Input
                  id="track_history_max_length"
                  type="number"
                  min="1"
                  max="100"
                  {...register("track_history_max_length", { valueAsNumber: true })}
                  placeholder="50"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum number of track history points (1-100)</p>
                {errors.track_history_max_length && (
                  <p className="text-sm text-red-500 mt-1">{errors.track_history_max_length.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="exit_threshold" className="block text-sm font-medium mb-2">
                  Exit Threshold
                </label>
                <Input
                  id="exit_threshold"
                  type="number"
                  min="1"
                  max="300"
                  {...register("exit_threshold", { valueAsNumber: true })}
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground mt-1">Frames before considering track as exited (1-300)</p>
                {errors.exit_threshold && <p className="text-sm text-red-500 mt-1">{errors.exit_threshold.message}</p>}
              </div>

              <div>
                <label htmlFor="min_track_duration" className="block text-sm font-medium mb-2">
                  Min Track Duration (seconds)
                </label>
                <Input
                  id="min_track_duration"
                  type="number"
                  min="1"
                  max="60"
                  {...register("min_track_duration", { valueAsNumber: true })}
                  placeholder="5"
                />
                <p className="text-xs text-muted-foreground mt-1">Minimum track duration to be considered (1-60)</p>
                {errors.min_track_duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.min_track_duration.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="min_track_updates" className="block text-sm font-medium mb-2">
                  Min Track Updates
                </label>
                <Input
                  id="min_track_updates"
                  type="number"
                  min="1"
                  max="100"
                  {...register("min_track_updates", { valueAsNumber: true })}
                  placeholder="10"
                />
                <p className="text-xs text-muted-foreground mt-1">Minimum number of track updates (1-100)</p>
                {errors.min_track_updates && (
                  <p className="text-sm text-red-500 mt-1">{errors.min_track_updates.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Processing Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="save_interval" className="block text-sm font-medium mb-2">
                  Save Interval (seconds)
                </label>
                <Input
                  id="save_interval"
                  type="number"
                  min="300"
                  max="1800"
                  {...register("save_interval", { valueAsNumber: true })}
                  placeholder="600"
                />
                <p className="text-xs text-muted-foreground mt-1">How often to save demographics data (5-30 minutes)</p>
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {Math.floor((watch("save_interval") || 600) / 60)} minutes
                </div>
                {errors.save_interval && <p className="text-sm text-red-500 mt-1">{errors.save_interval.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-4">
                  Frame Skip Interval: {frameSkipInterval?.toFixed(1)}s
                </label>
                <Slider
                  value={[frameSkipInterval || 1.0]}
                  onValueChange={([value]) => setValue("frame_skip_interval", value, { shouldDirty: true })}
                  max={5.0}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Interval between processed frames (0.1 - 5.0 seconds). Higher values reduce processing load.
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  Processing rate: ~{(1 / (frameSkipInterval || 1.0)).toFixed(1)} FPS
                </div>
                {errors.frame_skip_interval && (
                  <p className="text-sm text-red-500 mt-1">{errors.frame_skip_interval.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        {(config || isDirty) && (
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Detection Confidence:</span>{" "}
                  <Badge className={getConfidenceLevel(detectionConfidenceThreshold || 0.5).color}>
                    {(detectionConfidenceThreshold || 0.5).toFixed(2)}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Demographics Confidence:</span>{" "}
                  <Badge className={getConfidenceLevel(demographicsConfidenceThreshold || 0.7).color}>
                    {(demographicsConfidenceThreshold || 0.7).toFixed(2)}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Processing Rate:</span> ~{(1 / (frameSkipInterval || 1.0)).toFixed(1)}{" "}
                  FPS
                </div>
                <div>
                  <span className="font-medium">Save Interval:</span> {Math.floor((watch("save_interval") || 600) / 60)}{" "}
                  minutes
                </div>
                <div>
                  <span className="font-medium">Min Track Duration:</span> {watch("min_track_duration") || 5} seconds
                </div>
                <div>
                  <span className="font-medium">Exit Threshold:</span> {watch("exit_threshold") || 100} frames
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={!isDirty || createConfig.isPending || updateConfig.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {createConfig.isPending || updateConfig.isPending
              ? config
                ? "Updating..."
                : "Creating..."
              : config
                ? "Update Configuration"
                : "Create Configuration"}
          </Button>
          <Button asChild variant="outline">
            <Link href={cameraId ? `/cameras/${cameraId}` : "/demographics/config"}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
