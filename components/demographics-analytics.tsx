"use client"

import { useState } from "react"
import Link from "next/link"
import { useCamera } from "@/hooks/use-cameras"
import { useDemographicsResults } from "@/hooks/use-demographics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Filter, Users, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface DemographicsAnalyticsProps {
  cameraId: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"]

export function DemographicsAnalytics({ cameraId }: DemographicsAnalyticsProps) {
  const [filters, setFilters] = useState({
    gender: "all",
    age: "all",
    emotion: "all",
    ethnicity: "all",
    start_date: "",
    end_date: "",
  })

  const { data: camera } = useCamera(cameraId)
  const {
    data: results,
    isLoading,
    error,
  } = useDemographicsResults({
    camera_id: cameraId,
    ...filters,
  })

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || "all" }))
  }

  // Convert analytics data to chart format
  const getChartData = (distribution: Record<string, number>) => {
    return Object.entries(distribution).map(([name, value]) => ({ name, value }))
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading analytics: {(error as any).message}</p>
        <Button asChild className="mt-4">
          <Link href={`/cameras/${cameraId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Camera
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
            <Link href={`/cameras/${cameraId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Demographics Analytics</h1>
            {camera && <p className="text-muted-foreground">{camera.name}</p>}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.age} onValueChange={(value) => updateFilter("age", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="0-18">0-18</SelectItem>
                <SelectItem value="19-35">19-35</SelectItem>
                <SelectItem value="36-50">36-50</SelectItem>
                <SelectItem value="51+">51+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.emotion} onValueChange={(value) => updateFilter("emotion", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Emotions</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="sad">Sad</SelectItem>
                <SelectItem value="angry">Angry</SelectItem>
                <SelectItem value="surprised">Surprised</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="fear">Fear</SelectItem>
                <SelectItem value="disgust">Disgust</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.ethnicity} onValueChange={(value) => updateFilter("ethnicity", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ethnicities</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="hispanic">Hispanic</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filters.start_date}
              onChange={(e) => updateFilter("start_date", e.target.value)}
              placeholder="Start Date"
            />

            <Input
              type="date"
              value={filters.end_date}
              onChange={(e) => updateFilter("end_date", e.target.value)}
              placeholder="End Date"
            />
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  gender: "all",
                  age: "all",
                  emotion: "all",
                  ethnicity: "all",
                  start_date: "",
                  end_date: "",
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Detections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : results?.analytics.total_count || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : results?.items.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gender Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                Object.keys(results?.analytics.gender_distribution || {}).length
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Age Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                Object.keys(results?.analytics.age_distribution || {}).length
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : results?.analytics ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getChartData(results.analytics.gender_distribution)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getChartData(results.analytics.gender_distribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData(results.analytics.age_distribution)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Emotion Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Emotion Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData(results.analytics.emotion_distribution)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ethnicity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Ethnicity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getChartData(results.analytics.ethnicity_distribution)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getChartData(results.analytics.ethnicity_distribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No data available for the selected filters</p>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {results?.items && results.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Demographics Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Count</th>
                    <th className="text-left p-2">Gender</th>
                    <th className="text-left p-2">Age</th>
                    <th className="text-left p-2">Emotion</th>
                    <th className="text-left p-2">Ethnicity</th>
                    <th className="text-left p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {results.items.slice(0, 10).map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 font-medium">{item.count}</td>
                      <td className="p-2 capitalize">{item.gender}</td>
                      <td className="p-2">{item.age}</td>
                      <td className="p-2 capitalize">{item.emotion}</td>
                      <td className="p-2 capitalize">{item.ethnicity}</td>
                      <td className="p-2">{new Date(item.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.items.length > 10 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing 10 of {results.items.length} results
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
