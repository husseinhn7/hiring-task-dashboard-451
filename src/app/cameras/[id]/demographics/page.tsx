import type { Metadata } from "next"
import { CameraDemographicsConfig } from "@/components/camera-demographics-config"

export const metadata: Metadata = {
  title: "Demographics Configuration | Camera Management System",
  description: "Configure demographics detection settings for camera",
}

export default function CameraDemographicsPage({
  params,
}: {
  params: { id: string }
}) {
  return <CameraDemographicsConfig cameraId={params.id} />
}
