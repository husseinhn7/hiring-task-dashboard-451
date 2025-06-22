"use client"

import { useState } from "react"
import Link from "next/link"
import { useCameras } from "@/hooks/use-cameras"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Settings, CheckCircle, AlertCircle, Camera } from "lucide-react"

function CameraConfigCard({ camera }: { camera: any }) {
  const config = camera.demographics_config

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {camera.name}
          </CardTitle>
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
        <p className="text-sm text-muted-foreground">{camera.status_message}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {config ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Detection:</span> {config.detection_confidence_threshold?.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Demographics:</span>{" "}
                {config.demographics_confidence_threshold?.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Save Interval:</span> {Math.floor(config.save_interval / 60)}min
              </div>
              <div>
                <span className="font-medium">Frame Skip:</span> {config.frame_skip_interval}s
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">
                Last updated: {new Date(config.updated_at).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No demographics configuration found. Click "Create Config" to set up demographics detection for this
              camera.
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button asChild size="sm" variant={config ? "outline" : "default"}>
              <Link href={`/cameras/${camera.id}/demographics`}>
                <Settings className="h-4 w-4 mr-1" />
                {config ? "Edit Config" : "Create Config"}
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/cameras/${camera.id}`}>View Camera</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DemographicsConfigList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [search, setSearch] = useState("")

  const { data, isLoading, error } = useCameras({
    page,
    size: pageSize,
    search: search || undefined,
  })

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
        <div>
          <h1 className="text-3xl font-bold">Demographics Configuration</h1>
          <p className="text-muted-foreground mt-1">Manage demographics detection settings for each camera</p>
        </div>
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
              <SelectItem value="6">6 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
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
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
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
              <CameraConfigCard key={camera.id} camera={camera} />
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
