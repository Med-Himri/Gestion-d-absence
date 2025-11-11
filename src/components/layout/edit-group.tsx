"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, ChevronsUpDown, Check, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { useGroupStore } from "@/store/groupe-store"
import { useFieldStore } from "@/store/field-store"
import { cn } from "@/lib/utils"

interface EditGroupProps {
  group: any // Replace with your Group type if needed
}

export function EditGroup({ group }: EditGroupProps) {
  const [open, setOpen] = useState(false)
  const [selectedField, setSelectedField] = useState<string>("")
  const [form, setForm] = useState({
    name: "",
    year: "",
    number_student: 0,
  })

  const { fields, fetchFields } = useFieldStore()
  const { updateGroup } = useGroupStore()
  const { loading } = useFieldStore()

  // Fetch fields for selection
  useEffect(() => {
    fetchFields()
  }, [fetchFields])

  // Pre-fill group data
  useEffect(() => {
    if (group) {
      setForm({
        name: group.name,
        year: group.year,
        number_student: group.number_student || 0,
      })
      setSelectedField(group.field_id || "")
    }
  }, [group])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Select field
  const selectField = (id: string) => {
    setSelectedField(id)
    setOpen(false)
  }

  // Save changes
  const handleSave = async () => {
    try {
      await updateGroup(group.id, {
        ...form,
        field_id: selectedField || undefined,
      })
      alert("✅ Group updated successfully!")
    } catch (err) {
      console.error("Error updating group:", err)
      alert("❌ Failed to update group")
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="px-3 py-1 text-blue-600 dark:text-blue-400">Edit</button>
      </SheetTrigger>

      <SheetContent className="dark:bg-neutral-900">
        <SheetHeader>
          <SheetTitle className="font-semibold text-xl flex items-center gap-2 mt-4">
            <Layers className="w-5 h-5 text-blue-900" />
            <span className="text-neutral-900 dark:text-neutral-300">
              Edit Group
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Name */}
          <div>
            <Label className="text-sm font-semibold text-neutral-600">Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Year */}
          <div>
            <Label className="text-sm font-semibold text-neutral-600">Year</Label>
            <Input
              name="year"
              value={form.year}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Number of Students */}
          <div>
            <Label className="text-sm font-semibold text-neutral-600">Number of Students</Label>
            <Input
              name="number_student"
              type="number"
              value={form.number_student}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Field selection */}
          <div>
            <Label className="text-sm font-semibold text-neutral-600">Filiére</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2">
                  {selectedField
                    ? fields.find(f => f.id === selectedField)?.name
                    : loading
                    ? "Loading fields..."
                    : "Select a field..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[450px] p-0 dark:bg-neutral-950">
                <Command>
                  <CommandInput className="bg-white" placeholder="Search field..." />
                  <CommandEmpty>No field found.</CommandEmpty>
                  <CommandGroup>
                    {fields.map((field) => (
                      <CommandItem key={field.id} onSelect={() => selectField(field.id)}>
                        <Check className={cn("mr-2 h-4 w-4", selectedField === field.id ? "opacity-100" : "opacity-0")} />
                        {field.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-teal-600 dark:text-neutral-300"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
