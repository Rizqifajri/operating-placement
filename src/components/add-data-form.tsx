"use client"

import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  source: z.string().min(1, "Source is required"),
  division: z.string().min(1, "Division is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  platform: z.string().min(1, "Platform is required"),
  quarter: z.string().min(1, "Quarter is required"),
  sow: z.string().min(1, "SOW is required"),
  content: z.string().min(1, "Content is required"),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  status: z.string().min(1, "Status is required"),
})

type FormData = z.infer<typeof formSchema>

interface AddDataFormProps {
  onSubmit: (data: FormData) => void
  onClose?: () => void
}

export default function AddDataForm({ onSubmit, onClose }: AddDataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "",
      division: "",
      brand: "",
      category: "",
      platform: "",
      quarter: "",
      sow: "",
      content: "",
      link: "",
      status: "",
    },
  })

  async function handleSubmit(values: FormData) {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      form.reset()
      onClose?.()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    form.reset()
    form.clearErrors()
  }

  const formFields = [
    {
      name: "source" as const,
      label: "Source",
      options: ["Inbound", "Outbound"],
      gridClass: "col-span-1",
    },
    {
      name: "division" as const,
      label: "Division",
      options: ["Marketing", "Community"],
      gridClass: "col-span-1",
    },
    {
      name: "brand" as const,
      label: "Brand",
      type: "text",
      gridClass: "col-span-1",
    },
    {
      name: "category" as const,
      label: "Category",
      type: "text",
      gridClass: "col-span-1",
    },
    {
      name: "platform" as const,
      label: "Platform",
      options: ["Instagram", "TikTok", "Website", "YouTube", "Facebook", "Twitter"],
      gridClass: "col-span-1",
    },
    {
      name: "quarter" as const,
      label: "Quarter",
      options: ["Q1", "Q2", "Q3", "Q4"],
      gridClass: "col-span-1",
    },
    {
      name: "sow" as const,
      label: "SOW",
      type: "text",
      gridClass: "col-span-full",
    },
    {
      name: "content" as const,
      label: "Content",
      type: "textarea",
      gridClass: "col-span-full",
    },
    {
      name: "link" as const,
      label: "Link",
      type: "url",
      gridClass: "col-span-full",
    },
    {
      name: "status" as const,
      label: "Status",
      options: ["Development", "Content proposed", "Editing", "Delivered", "On Going", "Published"],
      gridClass: "col-span-1",
    },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {formFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: controller }) => (
                <FormItem className={field.gridClass}>
                  <FormLabel className="text-sm font-medium">{field.label}</FormLabel>
                  <FormControl>
                    {field.options ? (
                      <Select value={controller.value} onValueChange={controller.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <Textarea
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="min-h-[80px]"
                        {...controller}
                      />
                    ) : (
                      <Input
                        type={field.type || "text"}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        {...controller}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button type="submit" className="flex-1 bg-purple-500 hover:bg-purple-600" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Data"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1 bg-transparent"
            disabled={isSubmitting}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </Form>
  )
}
