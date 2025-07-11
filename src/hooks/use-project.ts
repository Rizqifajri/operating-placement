// lib/hooks/use-project.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { instance } from "@/lib/instance"

export interface Project {
  id?: string
  Source: string
  Division: string
  Brand: string
  "Brand Category": string
  Quarter: string
  Platform: string
  Link: string
  Status: string
  Date: string
  Bundling: {
    Content: string
    SOW: string
  }[]
}

// Format for the frontend table (optional mapping)
export const mapProjectToTable = (data: Project[], withNumber = true) => {
  return data.map((item, index) => {
    let isoDate = item.Date
    // Convert dd/mm/yyyy HH:mm:ss → yyyy-mm-ddTHH:mm:ss
    const match = item.Date.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/)
    if (match) {
      const [, day, month, year, hh, mm, ss] = match
      isoDate = `${year}-${month}-${day}T${hh}:${mm}:${ss}`
    }

    return {
      no: withNumber ? index + 1 : 0,
      source: item.Source,
      division: item.Division,
      brand: item.Brand,
      category: item["Brand Category"],
      quarter: item.Quarter,
      platform: item.Platform,
      sow: item.Bundling?.[0]?.SOW || "",
      content: item.Bundling?.[0]?.Content || "",
      link: item.Link,
      status: item.Status,
      date: isoDate,
      id: item.id,
    }
  })
}


// GET all
export const useGetProjects = () => {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await instance.get("/project")
      return res.data
    },
  })
}

// CREATE
export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newProject: Project) => {
      const res = await instance.post("/project", newProject)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

// UPDATE
export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
      const res = await instance.put(`/project/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

// DELETE
export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await instance.delete(`/project/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
