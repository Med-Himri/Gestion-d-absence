"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, ChevronsUpDown, Check, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { useGroupStore } from "@/store/groupe-store"
import { useStudentStore } from "@/store/student-store"
import { cn } from "@/lib/utils"

interface EditStudentProps {
    student: any // You can replace this with your Teacher type if you want
}

export function EditStudent({ student }: EditStudentProps) {
    const [open, setOpen] = useState(false)
    const [selectedGroups, setSelectedGroups] = useState<string>("")
    const [form, setForm] = useState({
        name: "",
        massar_code: ""
    })

    const { groups, fetchGroups, loading } = useGroupStore()
    const { updateStudent } = useStudentStore()

    // 🧩 Fetch groups once
    useEffect(() => {
        fetchGroups()
    }, [fetchGroups])

    // 🧩 Pre-fill teacher data
    useEffect(() => {
        if (student) {
            setForm({
                name: student.name,
                massar_code: student.massar_code
            });

            if (student.group) {
                setSelectedGroups(student.group.id);
            }
        }
    }, [student]);

    // 🧩 Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // 🧩 Toggle group selection
    const toggleGroup = (group_id: string) => {
        setSelectedGroups(group_id)
        setOpen(false)
    }

    // 💾 Save changes
    const handleSave = async () => {
        try {
            await updateStudent(student.id, {
                name: form.name,
                massar_code: form.massar_code,
                group_ids: selectedGroups,
            })
            alert("✅ Field updated successfully!")
        } catch (err) {
            console.error("Error updating field:", err)
            alert("❌ Failed to update field")
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="px-3 py-1 text-blue-600 dark:text-blue-400">
                    Edit
                </button>
            </SheetTrigger>

            <SheetContent className="dark:bg-neutral-900">
                <SheetHeader>
                    <SheetTitle className="font-semibold text-xl flex items-center gap-2 mt-4">
                        <UserCheck className="w-5 h-5 text-blue-900" />
                        <span className="text-neutral-900 dark:text-neutral-300">
                            Informations Etudiant
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="space-y-4 mt-6">
                    {/* 🧍 Name */}
                    <div>
                        <Label className="text-sm font-semibold text-neutral-600">Name</Label>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-semibold text-neutral-600">Massar Code</Label>
                        <Input
                            name="massar_code"
                            value={form.massar_code}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                    {/* 🏫 Groups */}
                    <div>
                        <Label className="text-sm font-semibold text-neutral-600">
                            Groups assigned
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2">
                                    {selectedGroups
                                        ? groups
                                            .filter((g) => selectedGroups.includes(g.id))
                                            .map((g) => g.name)
                                            .join(", ")
                                        : loading
                                            ? "Chargement des groupes..."
                                            : "Sélectionner des groupes..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[450px] p-0 dark:bg-neutral-950">
                                <Command>
                                    <CommandInput
                                        className="bg-white"
                                        placeholder="Search group..."
                                    />
                                    <CommandEmpty>No group found.</CommandEmpty>
                                    <CommandGroup>
                                        {groups.map((group) => (
                                            <CommandItem
                                                key={group.id}
                                                onSelect={() => toggleGroup(group.id)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedGroups.includes(group.id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {group.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* 💾 Save Button */}
                <div className="mt-6">
                    <Button
                        onClick={handleSave}
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
