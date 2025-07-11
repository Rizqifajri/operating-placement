"use client"

import {
  useGetProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  mapProjectToTable,
  Project
} from "@/hooks/use-project"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  DownloadIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  Search,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AddDataForm from "./add-data-form"
import * as XLSX from "xlsx"
import { Input } from "./ui/input"
import { CardDetailModal } from "./card-details"
import { max } from "date-fns"
import { formatDate } from "@/utils/format-date"

interface TableDataItem extends Project {
  no: number
  source: string
  division: string
  brand: string
  category: string
  quarter: string
  platform: string
  sow: string
  content: string
  link: string
  status: string
  date: string
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Published":
      return <Badge className="bg-green-500/20 text-green-600 border-green-600">Published</Badge>
    case "On Going":
      return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-600">On Going</Badge>
    case "Completed":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completed</Badge>
    default:
      return <Badge className="bg-gray-500/20 text-gray-600 border-gray-600">{status}</Badge>
  }
}

export const TableContent = () => {
  const { data: rawData, isLoading } = useGetProjects()
  const { mutate: createProject } = useCreateProject()
  const { mutate: updateProject } = useUpdateProject()
  const { mutate: deleteProject } = useDeleteProject()

  //@ts-ignore
  const data: TableDataItem[] = mapProjectToTable(rawData || [])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TableDataItem | null>(null)
  const [detailItem, setDetailItem] = useState<TableDataItem | null>(null)
  const [searchText, setSearchText] = useState("")
  const [deleteItem, setDeleteItem] = useState<TableDataItem | null>(null)

  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })


  const displayData = sortedData.map((item, index) => ({
    ...item,
    no: index + 1,
  }))

  const years = Array.from(new Set(displayData.map((item) => item.date?.slice(0, 4)))).sort()
  const quarters = Array.from(new Set(displayData.map((item) => item.quarter))).sort()
  const status = Array.from(new Set(displayData.map((item) => item.status))).sort()
  const monthNames = {
    "01": "January", "02": "February", "03": "March", "04": "April",
    "05": "May", "06": "June", "07": "July", "08": "August",
    "09": "September", "10": "October", "11": "November", "12": "December"
  }

  const months = Array.from(
    new Set(displayData.map((item) => item.date?.slice(5, 7)))
  ).sort()


  const [selectedYear, setSelectedYear] = useState("__all__")
  const [selectedMonth, setSelectedMonth] = useState("__all__")
  const [selectedQuarter, setSelectedQuarter] = useState("__all__")
  const [selectedStatus, setSelectedStatus] = useState("__all__")

  const filteredData = displayData.filter((item) => {
    const matchesYear = selectedYear === "__all__" || item.date?.startsWith(selectedYear)
    const matchesMonth =
      selectedMonth === "__all__" ||
      new Date(item.date).getMonth() + 1 === parseInt(selectedMonth)
    const matchesQuarter = selectedQuarter === "__all__" || item.quarter === selectedQuarter
    const matchesStatus = selectedStatus === "__all__" || item.status === selectedStatus
    const matchesSearch =
      searchText === "" ||
      Object.values(item).some(
        (value) => typeof value === "string" && value.toLowerCase().includes(searchText.toLowerCase())
      )
    return matchesYear && matchesQuarter && matchesMonth && matchesStatus && matchesSearch
  })


  const itemsPerPage = 30
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const [page, setPage] = useState(1)
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleFormSubmit = async (formData: any) => {
    const payload = {
      Source: formData.source,
      Division: formData.division,
      Brand: formData.brand,
      "Brand Category": formData.category,
      Quarter: formData.quarter,
      Platform: formData.platform,
      Link: formData.link || "",
      Status: formData.status,
      Date: new Date().toISOString(),
      Bundling: [
        {
          SOW: formData.sow,
          Content: formData.content,
        },
      ],
    }

    if (editingItem?.id) {
      updateProject({ id: editingItem.id, data: payload })
    } else {
      createProject(payload)
    }

    handleCloseDialog()
  }

  const handleDeleteConfirm = () => {
    if (deleteItem?.id) {
      deleteProject(deleteItem.id)
      setDeleteItem(null)
    }
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: TableDataItem) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  const exportToExcel = () => {
    const exportData = filteredData.map((item) => ({
      No: item.no,
      Source: item.source,
      Division: item.division,
      Brand: item.brand,
      Category: item.category,
      Quarter: item.quarter,
      Platform: item.platform,
      SOW: item.sow,
      Content: item.content,
      Link: item.link,
      Status: item.status,
      Date: item.date,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campaigns")
    XLSX.writeFile(workbook, "campaign-data.xlsx")
  }

  const exportToCSV = () => {
    const exportData = filteredData.map((item) => ({
      No: item.no,
      Source: item.source,
      Division: item.division,
      Brand: item.brand,
      Category: item.category,
      Quarter: item.quarter,
      Platform: item.platform,
      SOW: item.sow,
      Content: item.content,
      Link: item.link,
      Status: item.status,
      Date: item.date,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "campaign-data.csv")
    link.click()
  }


  return (
    <div className="lg:col-span-2">
      <Card className="bg-white w-full">
        <CardHeader>
          <CardTitle>Placement Overview</CardTitle>
          {/* <CardDescription className="text-gray-900">
            Recent campaign activities and status ({data.length} total entries)
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4 items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Months</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {monthNames[month as keyof typeof monthNames]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>


              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Quarters</SelectItem>
                  {quarters.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Status</SelectItem>
                  {status.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <div className="flex gap-2 justify-center items-center">
              {/* Search */}
              <div className="relative flex gap-4 flex-wrap items-center">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search keyword..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full md:w-[300px]"
                />
              </div>

              {/* Export Dropdown dengan pembungkus tetap */}
              <div className="inline-block w-[120px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-white text-black cursor-pointer hover:bg-white border border-black border-r-4 border-b-4 hover:border transition-all duration-200"
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                      <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
                      Export as Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Add Data Button dengan pembungkus tetap */}
              <div className="inline-block w-[120px]">
                <Button
                  onClick={handleAddNew}
                  className="w-full mr-5 bg-white text-black cursor-pointer hover:bg-white border border-black border-r-4 border-b-4 hover:border transition-all duration-200"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Data
                </Button>
              </div>
            </div>


          </div>

          {/* Export Info */}
          {(selectedYear !== "__all__" || selectedQuarter !== "__all__" || selectedMonth !== "__all__") && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Export Info:</strong> Export will include {filteredData.length} filtered entries
                {selectedYear !== "__all__" && ` • Year: ${selectedYear}`}
                {selectedMonth !== "__all__" && ` • Month: ${selectedMonth}`}
                {selectedQuarter !== "__all__" && ` • Quarter: ${selectedQuarter}`}
                {selectedStatus !== "__all__" && ` • Status: ${selectedStatus}`}
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table className="border-none">
              <TableHeader>
                <TableRow className="border hover:bg-gray-200">
                  <TableHead>No</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quarter</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>SOW</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row) => (
                  <TableRow key={row.no}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.division}</TableCell>
                    <TableCell className="max-w-[150px] truncate overflow-hidden whitespace-nowrap font-medium">
                      {row.brand}
                    </TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.quarter}</TableCell>
                    <TableCell className="max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                      {row.platform}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate overflow-hidden whitespace-nowrap font-medium">
                      {row.sow}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate overflow-hidden whitespace-nowrap" title={row.content}>
                      {row.content}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate overflow-hidden whitespace-nowrap" title={row.link}>
                      {row.link ? (
                        <a
                          href={row.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Link
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setDetailItem(row)} className="cursor-pointer">
                            <FileTextIcon className="mr-2 h-4 w-4" />
                            Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(row)} className="cursor-pointer">
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteItem(row)} className="text-red-600 cursor-pointer">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {currentData.length} of {filteredData.length} entries
              {filteredData.length !== data.length && ` (filtered from ${data.length} total)`}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Campaign Data" : "Add New Campaign Data"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the campaign information below."
                : "Fill out the form below to add a new campaign record."}
            </DialogDescription>
          </DialogHeader>
          <AddDataForm
            onSubmit={handleFormSubmit}
            onClose={handleCloseDialog}
            //@ts-ignore
            initialData={editingItem}
            isEditing={!!editingItem}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign data for{" "}
              <strong>{deleteItem?.brand}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-black cursor-pointer hover:bg-white border border-black ">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 text-white cursor-pointer hover:bg-red-600 border border-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardDetailModal data={detailItem} onClose={() => setDetailItem(null)} />

    </div>
  )
}
