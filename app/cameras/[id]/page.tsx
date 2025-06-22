import type { Metadata } from "next"
import { CameraDetail } from "@/components/camera-detail"

export const metadata: Metadata = {
  title: "Camera Details | Camera Management System",
  description: "View detailed information about a specific camera",
}

export default function CameraDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <CameraDetail id={params.id} />
}
