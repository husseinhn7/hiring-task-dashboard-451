import type { Metadata } from "next"
import { DemographicsConfigList } from "@/components/demographics-config-list"

export const metadata: Metadata = {
  title: "Demographics Configuration | Camera Management System",
  description: "Configure demographics detection settings for all cameras",
}

export default function DemographicsConfigPage() {
  return <DemographicsConfigList />
}
