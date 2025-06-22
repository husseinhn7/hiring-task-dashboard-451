import type {
  Camera,
  CameraUpdateRequest,
  DemographicsConfig,
  DemographicsConfigRequest,
  DemographicsResponse,
  PaginatedResponse,
  ApiError,
  Tag,
} from "./types"

const API_BASE_URL = "https://task-451-api.ryd.wafaicloud.com"

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "An unexpected error occurred",
      }))
      throw error
    }

    return response.json()
  }

  // Camera endpoints
  async getCameras(params?: {
    page?: number
    size?: number
    search?: string
  }): Promise<PaginatedResponse<Camera>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.size) searchParams.set("size", params.size.toString())
    if (params?.search) searchParams.set("camera_name", params.search)

    const query = searchParams.toString()
    return this.request(`/cameras/${query ? `?${query}` : ""}`)
  }

  async getCamera(id: string): Promise<Camera> {
    return this.request(`/cameras/${id}`)
  }

  async updateCamera(id: string, data: CameraUpdateRequest): Promise<Camera> {
    return this.request(`/cameras/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Tags endpoint
  async getTags(): Promise<Tag[]> {
    return this.request("/tags")
  }

  // Demographics config endpoints
  async getDemographicsConfig(): Promise<DemographicsConfig[]> {
    return this.request("/demographics/config")
  }

  async getCameraDemographicsConfig(cameraId: string): Promise<DemographicsConfig | null> {
    // This method is now deprecated since we get config from camera endpoint
    // But keeping for backward compatibility
    try {
      const camera = await this.getCamera(cameraId)
      return camera.demographics_config || null
    } catch (error) {
      return null
    }
  }

  async createDemographicsConfig(data: DemographicsConfigRequest): Promise<DemographicsConfig> {
    return this.request("/demographics/config", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateDemographicsConfig(id: string, data: Partial<DemographicsConfigRequest>): Promise<DemographicsConfig> {
    return this.request(`/demographics/config/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteDemographicsConfig(id: string): Promise<void> {
    return this.request(`/demographics/config/${id}`, {
      method: "DELETE",
    })
  }

  // Demographics results endpoints
  async getDemographicsResults(params: {
    camera_id: string
    gender?: string
    age?: string
    emotion?: string
    ethnicity?: string
    start_date?: string
    end_date?: string
  }): Promise<DemographicsResponse> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") searchParams.set(key, value.toString())
    })

    const query = searchParams.toString()
    return this.request(`/demographics/results${query ? `?${query}` : ""}`)
  }
}

export const apiClient = new ApiClient()
