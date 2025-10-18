import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Layers } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button";



export function FormGroup() {


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
                        Nouveau Groupe
                    </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-neutral-900 sm:max-w-[500px] max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex items-center text-neutral-900 dark:text-neutral-300 justify-between w-full">
                                <DialogTitle>Nouveau Groupe</DialogTitle>

                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-2  mb-1 mt-4">
                        <Layers className="w-5 h-5 text-blue-900" />
                        <span className="text-sx text-neutral-950 font-medium dark:text-neutral-300">Informations du groupe</span>
                    </div>

                    <div className="space-y-2">
                        {/* Name fields */}
                        <div className="grid gap-3">
                            <div>
                                <Label htmlFor="Name" className="text-sm dark:text-neutral-400 text-neutral-600">
                                    Nom de Groupe *
                                </Label>
                                <Input
                                    id="lastName"
                                />
                            </div>

                        </div>
                        <div>
                            <Label htmlFor="year" className="text-sm dark:text-neutral-400 text-neutral-600">
                                Year *
                            </Label>
                            <Input
                                id="year"
                                type="year"
                            />
                        </div>
                        <div>
                            <Label htmlFor="Filiére" className="text-sm dark:text-neutral-400 text-neutral-600">
                                Filiére  *
                            </Label>
                            <Input
                                id="Filiére"
                                type="text"
                            />
                        </div>
                        <div>
                            <Label htmlFor="Total_des_Etudiants " className="text-sm dark:text-neutral-400 text-neutral-600">
                                Total des Etudiants *
                            </Label>
                            <Input
                                id="Total_des_Etudiants "
                                type="number"
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
                            <Button type="submit" className="bg-teal-700 dark:hover:text-neutral-950 dark:text-neutral-300">Enregistrer</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>

            </Dialog>


        </div>
    );
}
