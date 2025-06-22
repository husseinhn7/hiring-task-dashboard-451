import type { Metadata } from "next"
import { DemographicsAnalytics } from "@/components/demographics-analytics"

export const metadata: Metadata = {
  title: "Demographics Analytics | Camera Management System",
  description: "View demographics analytics and insights",
}

export default function AnalyticsPage({
  params,
}: {
  params: { id: string }
}) {
  return <DemographicsAnalytics cameraId={params.id} />
}
