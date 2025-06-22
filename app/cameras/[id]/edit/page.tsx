import type { Metadata } from "next"
import { CameraEditForm } from "@/components/camera-edit-form"

export const metadata: Metadata = {
  title: "Edit Camera | Camera Management System",
  description: "Edit camera configuration and details",
}

export default function CameraEditPage({
  params,
}: {
  params: { id: string }
}) {
  return <CameraEditForm id={params.id} />
}
