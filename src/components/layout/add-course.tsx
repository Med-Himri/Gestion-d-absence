import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BookOpenText } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { useCoursesStore } from "@/store/course-store"
export function FormCourse() {
    
    const [open, setOpen] = useState(false);
    const [courseName, setCourseName] = useState("");
    const addCourse = useCoursesStore((state) => state.addCourse);

    const handleSubmit = async () => {
        if (!courseName) {
            alert("Veuillez remplir le nom du cours.");
            return;
        }

        try {
            await addCourse({
                course_name: courseName
            });
            alert("Cours ajouté avec succès !");
            setCourseName("");
            setOpen(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout du cours.");
        }

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
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                placeholder="Entrez le nom du cours"
                                className="mt-1 dark:bg-neutral-700"
                            />
                        </div>

                    </div>
                
                    <hr />
                    <DialogFooter>
                        <span className="fixed text-xs left-6 text-gray-500">* Champes obligatoires</span>
                        <div className="flex space-x-2">
                            <DialogClose asChild>
                                <Button className="dark:hover:bg-neutral-100 dark:hover:text-neutral-950" variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleSubmit} type="submit" className="bg-teal-700 dark:hover:text-neutral-950 dark:text-neutral-300">Enregistrer</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>

            </Dialog>


        </div>
    );
}
