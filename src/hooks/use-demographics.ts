"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { useCamera } from "@/hooks/use-cameras"
import type { DemographicsConfigRequest } from "@/lib/types"
import { toast } from "sonner"

export function useCameraDemographicsConfig(cameraId: string) {
  const { data: camera } = useCamera(cameraId)

  return useQuery({
    queryKey: ["camera-demographics-config", cameraId],
    queryFn: () => Promise.resolve(camera?.demographics_config || null),
    enabled: !!cameraId && !!camera,
  })
}

export function useCreateDemographicsConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DemographicsConfigRequest) => apiClient.createDemographicsConfig(data),
    onSuccess: (config) => {
      // Invalidate camera queries to refetch with new demographics_config
      queryClient.invalidateQueries({ queryKey: ["camera", config.camera_id] })
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      toast.success("Demographics configuration created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create demographics configuration")
    },
  })
}

export function useUpdateDemographicsConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DemographicsConfigRequest> }) =>
      apiClient.updateDemographicsConfig(id, data),
    onSuccess: (config) => {
      // Invalidate camera queries to refetch with updated demographics_config
      queryClient.invalidateQueries({ queryKey: ["camera", config.camera_id] })
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      toast.success("Demographics configuration updated successfully")
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message || "Failed to update demographics configuration")
    },
  })
}

export function useDemographicsResults(params: {
  camera_id: string
  gender?: string
  age?: string
  emotion?: string
  ethnicity?: string
  start_date?: string
  end_date?: string
}) {
  return useQuery({
    queryKey: ["demographics-results", params],
    queryFn: () => apiClient.getDemographicsResults(params),
    enabled: !!params.camera_id,
  })
}

// ---------------------------------------------------------------------------
// Legacy alias – keeps older components working without code changes
// ---------------------------------------------------------------------------
export const useDemographicsConfig = useCameraDemographicsConfig
