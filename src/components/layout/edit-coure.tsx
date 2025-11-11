"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoursesStore } from "@/store/course-store"

interface EditCourseProps {
    course: any // You can replace this with your Teacher type if you want
}

export function EditCourse({ course }: EditCourseProps) {
    const [form, setForm] = useState({
        name: "",
    })
    const { updateCourse } = useCoursesStore()

    // 🧩 Pre-fill teacher data
    useEffect(() => {
        if (course) {
            setForm({ name: course.course_name });
        }
    }, [course]);

    // 🧩 Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }


    // 💾 Save changes
    const handleSave = async () => {
        try {
            await updateCourse(course.course_id, {
                course_name: form.name,
            });
            alert("✅ Course updated successfully!")
        } catch (err) {
            console.error("Error updating course:", err)
            alert("❌ Failed to update course")
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
                            Informations du Coure
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
