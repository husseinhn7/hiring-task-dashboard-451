"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import type { CameraUpdateRequest } from "@/lib/types"
import { toast } from "sonner"

export function useCameras(params?: {
  page?: number
  size?: number
  search?: string
}) {
  return useQuery({
    queryKey: ["cameras", params],
    queryFn: () => apiClient.getCameras(params),
  })
}

export function useCamera(id: string) {
  return useQuery({
    queryKey: ["camera", id],
    queryFn: () => apiClient.getCamera(id),
    enabled: !!id,
  })
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => apiClient.getTags(),
  })
}

export function useUpdateCamera() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CameraUpdateRequest }) => apiClient.updateCamera(id, data),
    onSuccess: (updatedCamera) => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      queryClient.setQueryData(["camera", updatedCamera.id], updatedCamera)
      toast.success("Camera updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update camera")
    },
  })
}
