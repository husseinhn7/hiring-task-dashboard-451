"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCamera, useUpdateCamera, useTags } from "@/hooks/use-cameras"
import { cameraUpdateSchema, type CameraUpdateInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CameraEditFormProps {
  id: string
}

export function CameraEditForm({ id }: CameraEditFormProps) {
  const router = useRouter()
  const { data: camera, isLoading, error } = useCamera(id)
  const { data: availableTags, isLoading: tagsLoading } = useTags()
  const updateCamera = useUpdateCamera()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagId, setNewTagId] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<CameraUpdateInput>({
    resolver: zodResolver(cameraUpdateSchema),
    defaultValues: {
      stream_frame_width: 1920,
      stream_frame_height: 1080,
      stream_max_length: 3600,
      stream_quality: 80,
      stream_fps: 30,
      stream_skip_frames: 0,
    },
  })

  useEffect(() => {
    if (camera) {
      const currentTagNames = camera.tags?.map((tag) => tag.name) || []
      setSelectedTags(currentTagNames)

      reset({
        name: camera.name,
        rtsp_url: camera.rtsp_url || "",
        stream_frame_width: camera.stream_frame_width || 1920,
        stream_frame_height: camera.stream_frame_height || 1080,
        stream_max_length: camera.stream_max_length || 3600,
        stream_quality: camera.stream_quality || 80,
        stream_fps: camera.stream_fps || 30,
        stream_skip_frames: camera.stream_skip_frames || 0,
        tags: currentTagNames,
      })
    }
  }, [camera, reset])

  const onSubmit = async (data: CameraUpdateInput) => {
    try {
      const submitData = {
        ...data,
        tags: selectedTags,
      }
      await updateCamera.mutateAsync({ id, data: submitData })
      router.push(`/cameras/${id}`)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleTagToggle = (tagName: string, checked: boolean) => {
    if (checked) {
      setSelectedTags((prev) => [...prev, tagName])
    } else {
      setSelectedTags((prev) => prev.filter((tag) => tag !== tagName))
    }
    setValue("tags", checked ? [...selectedTags, tagName] : selectedTags.filter((tag) => tag !== tagName), {
      shouldDirty: true,
    })
  }

  const handleAddTag = (tagId: string) => {
    if (!tagId) return

    const tag = availableTags?.find((t) => t.id === tagId)
    if (tag && !selectedTags.includes(tag.name)) {
      const updatedTags = [...selectedTags, tag.name]
      setSelectedTags(updatedTags)
      setValue("tags", updatedTags, { shouldDirty: true })
    }
    setNewTagId("")
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading camera: {(error as any).message}</p>
        <Button asChild className="mt-4">
          <Link href="/cameras">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cameras
          </Link>
        </Button>
      </div>
    )
  }

  if (isLoading || tagsLoading) {
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
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!camera) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Camera not found</p>
        <Button asChild className="mt-4">
          <Link href="/cameras">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cameras
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={`/cameras/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Camera</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Camera Name *
              </label>
              <Input id="name" {...register("name")} placeholder="Enter camera name" />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="rtsp_url" className="block text-sm font-medium mb-2">
                RTSP URL *
              </label>
              <Input id="rtsp_url" {...register("rtsp_url")} placeholder="rtsp://example.com/stream" />
              {errors.rtsp_url && <p className="text-sm text-red-500 mt-1">{errors.rtsp_url.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>

              {/* Add New Tag Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Add Tag</label>
                <div className="flex gap-2">
                  <Select value={newTagId} onValueChange={setNewTagId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a tag to add..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags
                        ?.filter((tag) => !selectedTags.includes(tag.name))
                        .map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                              {tag.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={() => handleAddTag(newTagId)} disabled={!newTagId} size="sm">
                    Add
                  </Button>
                </div>
              </div>

              {/* All Available Tags */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">All Available Tags</label>
                {availableTags && availableTags.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                    {availableTags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.name)}
                          onCheckedChange={(checked) => handleTagToggle(tag.name, checked as boolean)}
                        />
                        <label
                          htmlFor={`tag-${tag.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ backgroundColor: tag.color + "20", color: tag.color, borderColor: tag.color }}
                          >
                            {tag.name}
                          </Badge>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                )}
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Selected Tags ({selectedTags.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map((tagName) => {
                      const tag = availableTags?.find((t) => t.name === tagName)
                      return (
                        <Badge
                          key={tagName}
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: tag?.color + "20" || "#6B728020",
                            color: tag?.color || "#6B7280",
                            borderColor: tag?.color || "#6B7280",
                          }}
                        >
                          {tagName}
                          <button
                            type="button"
                            onClick={() => handleTagToggle(tagName, false)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stream Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="stream_frame_width" className="block text-sm font-medium mb-2">
                  Frame Width *
                </label>
                <Input
                  id="stream_frame_width"
                  type="number"
                  min="1"
                  max="4096"
                  {...register("stream_frame_width", { valueAsNumber: true })}
                  placeholder="1920"
                />
                {errors.stream_frame_width && (
                  <p className="text-sm text-red-500 mt-1">{errors.stream_frame_width.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="stream_frame_height" className="block text-sm font-medium mb-2">
                  Frame Height *
                </label>
                <Input
                  id="stream_frame_height"
                  type="number"
                  min="1"
                  max="4096"
                  {...register("stream_frame_height", { valueAsNumber: true })}
                  placeholder="1080"
                />
                {errors.stream_frame_height && (
                  <p className="text-sm text-red-500 mt-1">{errors.stream_frame_height.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="stream_fps" className="block text-sm font-medium mb-2">
                  Frame Rate (FPS) *
                </label>
                <Input
                  id="stream_fps"
                  type="number"
                  min="1"
                  max="60"
                  {...register("stream_fps", { valueAsNumber: true })}
                  placeholder="30"
                />
                {errors.stream_fps && <p className="text-sm text-red-500 mt-1">{errors.stream_fps.message}</p>}
              </div>

              <div>
                <label htmlFor="stream_quality" className="block text-sm font-medium mb-2">
                  Quality (1-100) *
                </label>
                <Input
                  id="stream_quality"
                  type="number"
                  min="1"
                  max="100"
                  {...register("stream_quality", { valueAsNumber: true })}
                  placeholder="80"
                />
                {errors.stream_quality && <p className="text-sm text-red-500 mt-1">{errors.stream_quality.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="stream_max_length" className="block text-sm font-medium mb-2">
                  Max Length (seconds) *
                </label>
                <Input
                  id="stream_max_length"
                  type="number"
                  min="1"
                  {...register("stream_max_length", { valueAsNumber: true })}
                  placeholder="3600"
                />
                {errors.stream_max_length && (
                  <p className="text-sm text-red-500 mt-1">{errors.stream_max_length.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="stream_skip_frames" className="block text-sm font-medium mb-2">
                  Skip Frames *
                </label>
                <Input
                  id="stream_skip_frames"
                  type="number"
                  min="0"
                  {...register("stream_skip_frames", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.stream_skip_frames && (
                  <p className="text-sm text-red-500 mt-1">{errors.stream_skip_frames.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={!isDirty || updateCamera.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateCamera.isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/cameras/${id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
