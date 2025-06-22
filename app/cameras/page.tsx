import type { Metadata } from "next"
import { CameraList } from "@/components/camera-list"

export const metadata: Metadata = {
  title: "Cameras | Camera Management System",
  description: "View and manage all cameras in your network",
}

export default function CamerasPage() {
  return <CameraList />
}
