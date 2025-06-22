"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCameras } from "@/hooks/use-cameras"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Edit, BarChart3, CameraIcon, Settings } from "lucide-react"

export function CameraList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")

  const { data, isLoading, error } = useCameras({
    page,
    size: pageSize,
    search: search || undefined,
  })

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-500" : "bg-red-500"
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive"
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading cameras: {(error as any).message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-3xl font-bold">Cameras</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cameras..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((camera) => (
              <Card key={camera.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{camera.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(camera.is_active)}`} />
                      <span className="text-sm text-muted-foreground">{getStatusText(camera.is_active)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{camera.status_message}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Camera Snapshot */}
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {camera.snapshot ? (
                        <Image
                          src={camera.snapshot || "/placeholder.svg"}
                          alt={`${camera.name} snapshot`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <CameraIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* RTSP URL */}
                    <div>
                      <p className="text-xs text-muted-foreground">RTSP URL</p>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded text-xs truncate">{camera.rtsp_url}</p>
                    </div>

                    {/* Tags */}
                    {camera.tags && camera.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
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
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/cameras/${camera.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/cameras/${camera.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/cameras/${camera.id}/demographics`}>
                          <Settings className="h-4 w-4 mr-1" />
                          Config
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/cameras/${camera.id}/analytics`}>
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data && data.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data.total)} of {data.total} cameras
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === data.pages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
