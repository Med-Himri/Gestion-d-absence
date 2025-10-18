import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BookOpenText, ChevronsUpDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
//import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
//import { useCoursesStore } from "@/store/course-store"
import { useTeachersStore } from "@/store/teacher-store";
import { useEffect, useState, useMemo } from "react";
//import { cn } from "@/lib/utils";


export function FormCourse() {
    const [open, setOpen] = useState(false);
    const { teachers,loading, fetchTeachers } = useTeachersStore();
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
    const [search, setSearch] = useState(""); // new

    // filtered list (memoized)
    const filteredTeachers = useMemo(() => {
        if (!search.trim()) return teachers || [];
        const q = search.toLowerCase();
        return (teachers || []).filter(
            (t) => (t.name || "").toLowerCase().includes(q) || (t.email || "").toLowerCase().includes(q)
        );
    }, [teachers, search]);


    // ✅ Fetch teachers on mount
    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const toggleTeacher = (teacherId: string) => {
  setSelectedTeachers((prev) => (prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]));
};

    return (
        <div  >
            {/* Nouveau Client Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-52 h-10 flex items-center justify-center rounded-xl 
           border-2 bg-teal-50 text-black 
           transition-all duration-200 
           hover:bg-blue-100 hover:shadow-glow dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-100"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau Course
                    </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-neutral-900 sm:max-w-[440px] max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex items-center text-neutral-900 dark:text-neutral-300 justify-between w-full">
                                <DialogTitle>Nouveau Course</DialogTitle>

                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-2  mb-1 mt-4">
                        <BookOpenText className="w-5 h-5 text-blue-900" />
                        <span className="text-sx text-neutral-950 font-medium dark:text-neutral-300">Informations du matiére</span>
                    </div>


                    <div className="grid gap-3">
                        <div>
                            <Label htmlFor="Name" className="text-sm dark:text-neutral-400 text-neutral-600">
                                Nom de Course *
                            </Label>
                            <Input
                                id="lastName"
                            />
                        </div>

                    </div>
                    <div>
                        <Label className="text-sm dark:text-neutral-400 text-neutral-600">
                            Teachers assigned *
                        </Label>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2"
                                >
                                    {loading
                                        ? "Chargement des enseignants..."
                                        : selectedTeachers.length > 0
                                            ? teachers
                                                .filter((t) => selectedTeachers.includes(t.user_id))
                                                .map((t) => t.name)
                                                .join(", ")
                                            : "Sélectionner des enseignants..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                align="start"
                                side="bottom"
                                className="w-[420px] p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md z-50"
                            >
                                {/* Search input */}
                                <div className="px-2 py-2">
                                    <input
                                        type="text"
                                        placeholder="Rechercher un enseignant..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-md border px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>

                                {/* List */}
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredTeachers.length === 0 ? (
                                        <div className="p-3 text-sm text-gray-500 dark:text-neutral-400">Aucun enseignant trouvé.</div>
                                    ) : (
                                        filteredTeachers.map((teacher) => (
                                            <div
                                                key={teacher.user_id}
                                                onClick={() => toggleTeacher(teacher.user_id)}
                                                className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 ${selectedTeachers.includes(teacher.user_id) ? "bg-neutral-100 dark:bg-neutral-800" : ""
                                                    }`}
                                                role="option"
                                                aria-selected={selectedTeachers.includes(teacher.user_id)}
                                            >
                                                <Check
                                                    className={`h-4 w-4 ${selectedTeachers.includes(teacher.user_id) ? "opacity-100 text-teal-600" : "opacity-0"
                                                        }`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium">{teacher.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">{teacher.email}</div>
                                                </div>
                                                <div className="text-xs text-gray-400">{teacher.role}</div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Debug small footer (optional) */}
                                <div className="px-3 py-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-gray-500">
                                    Selected: {selectedTeachers.length}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>



                    <hr />
                    <DialogFooter>
                        <span className="fixed text-xs left-6 text-gray-500">* Champes obligatoires</span>
                        <div className="flex space-x-2">
                            <DialogClose asChild>
                                <Button className="dark:hover:bg-neutral-100 dark:hover:text-neutral-950" variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button type="submit" className="bg-teal-700 dark:hover:text-neutral-950 dark:text-neutral-300">Enregistrer</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>

            </Dialog>


        </div>
    );
}
