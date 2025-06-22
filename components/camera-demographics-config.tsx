"use client"

import { DemographicsConfigForm } from "@/components/demographics-config-form"

interface CameraDemographicsConfigProps {
  cameraId: string
}

export function CameraDemographicsConfig({ cameraId }: CameraDemographicsConfigProps) {
  return <DemographicsConfigForm cameraId={cameraId} />
}
