import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, BarChart3, Settings, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Camera Management System</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your camera network and analyze demographics data with powerful insights and analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Camera className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Cameras</CardTitle>
            <CardDescription>View and manage all cameras</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/cameras">View Cameras</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Demographics insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cameras">Select Camera</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Settings className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Demographics settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/demographics/config">Configure</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>Demographics</CardTitle>
            <CardDescription>Population analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/demographics/config">Setup</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
