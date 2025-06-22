"use client"

import Link from "next/link"
import Image from "next/image"
import { useCamera } from "@/hooks/use-cameras"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Edit, BarChart3, Calendar, Settings, CameraIcon, LinkIcon } from "lucide-react"

interface CameraDetailProps {
  id: string
}

export function CameraDetail({ id }: CameraDetailProps) {
  const { data: camera, isLoading, error } = useCamera(id)

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-500" : "bg-red-500"
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive"
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/cameras">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{camera.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(camera.is_active)}`} />
              <span className="text-sm text-muted-foreground">{getStatusText(camera.is_active)}</span>
              <span className="text-sm text-muted-foreground">• {camera.status_message}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/cameras/${camera.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Camera
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/cameras/${camera.id}/demographics`}>
              <Settings className="h-4 w-4 mr-2" />
              Demographics Config
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/cameras/${camera.id}/analytics`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CameraIcon className="h-5 w-5" />
              Camera Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Snapshot */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {camera.snapshot ? (
                <Image
                  src={camera.snapshot || "/placeholder.svg"}
                  alt={`${camera.name} snapshot`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <CameraIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* RTSP URL */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <LinkIcon className="h-3 w-3" />
                RTSP Stream URL
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-mono break-all">{camera.rtsp_url}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Camera Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm">{camera.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.is_active)}`} />
                <span className="text-sm">{camera.status_message}</span>
              </div>
            </div>

            {camera.tags && camera.tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {camera.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-xs"
                      style={{ backgroundColor: tag.color + "20", color: tag.color, borderColor: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created
                </label>
                <p className="text-sm">{new Date(camera.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Updated</label>
                <p className="text-sm">{new Date(camera.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
