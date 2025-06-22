import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CameraList } from "@/components/camera-list"
import { apiClient } from "@/lib/api"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the API client
jest.mock("@/lib/api")
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(<QueryClientProvider client={testQueryClient}>{component}</QueryClientProvider>)
}

describe("CameraList", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders loading state", () => {
    mockApiClient.getCameras.mockImplementation(() => new Promise(() => {}))

    renderWithQueryClient(<CameraList />)

    expect(screen.getByText("Cameras")).toBeInTheDocument()
    // Check for skeleton loaders
    expect(document.querySelectorAll(".animate-pulse")).toHaveLength(6)
  })

  it("renders camera list successfully", async () => {
    const mockCameras = {
      data: [
        {
          id: "1",
          name: "Camera 1",
          stream_status: "active" as const,
          location: "Office",
          description: "Main office camera",
          tags: ["security", "office"],
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      total: 1,
      page: 1,
      page_size: 10,
      total_pages: 1,
    }

    mockApiClient.getCameras.mockResolvedValue(mockCameras)

    renderWithQueryClient(<CameraList />)

    await waitFor(() => {
      expect(screen.getByText("Camera 1")).toBeInTheDocument()
      expect(screen.getByText("Office")).toBeInTheDocument()
      expect(screen.getByText("Main office camera")).toBeInTheDocument()
      expect(screen.getByText("security")).toBeInTheDocument()
      expect(screen.getByText("office")).toBeInTheDocument()
    })
  })

  it("renders error state", async () => {
    mockApiClient.getCameras.mockRejectedValue(new Error("Failed to fetch"))

    renderWithQueryClient(<CameraList />)

    await waitFor(() => {
      expect(screen.getByText(/Error loading cameras/)).toBeInTheDocument()
    })
  })
})
