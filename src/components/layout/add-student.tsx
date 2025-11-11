import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, User, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button";
import * as React from "react"

import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import { useGroupStore } from "@/store/groupe-store"
import { useState, useEffect } from "react"
import { useStudentStore } from "@/store/student-store";


export function FormStudent() {
    const { addStudent, fetchStudents } = useStudentStore();
    const [open, setOpen] = React.useState(false)
    const [selectedGroups, setSelectedGroups] = useState<string>("");
    const { groups, fetchGroups, loading: fieldsLoading } = useGroupStore();

    const [form, setForm] = useState({
        name: "",
        massar_code: ""
    });

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleGroup = (group_id: string) => {
        setSelectedGroups(group_id);
        setOpen(false)
    };
    const handleSave = async () => {
        if (!form.name || !form.massar_code || selectedGroups.length === 0) {
            alert("Please fill all fields and select at least one group.");
            return;
        }

        try {
            await addStudent({
                name: form.name,
                massar_code: form.massar_code,
                group_ids: selectedGroups,
            });
            alert("Etudiant ajouté avec succès !");
            setForm({ name: "", massar_code: "" });
            setSelectedGroups("");
            fetchStudents(); // refresh list
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout du Etudiant !");
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
                        Nouveau Etudiant
                    </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-neutral-900 sm:max-w-[500px] max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex items-center text-neutral-900 dark:text-neutral-300 justify-between w-full">
                                <DialogTitle>Nouveau Ensiegnant</DialogTitle>

                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-2  mb-1 mt-4">
                        <User className="w-5 h-5 text-blue-900" />
                        <span className="text-sx text-neutral-950 font-medium dark:text-neutral-300">Informations du etudiant</span>
                    </div>

                    <div className="space-y-2">
                        {/* Name fields */}
                        <div className="grid gap-3">
                            <div>
                                <Label htmlFor="lastName" className="text-sm dark:text-neutral-400 text-neutral-600">
                                    Nom Complet *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    placeholder="Nom du Complet"
                                />
                            </div>

                        </div>
                        <div>
                            <Label htmlFor="Code" className="text-sm dark:text-neutral-400 text-neutral-600">
                                Massar Code *
                            </Label>
                            <Input
                                id="Code_massar"
                                name="massar_code"
                                value={form.massar_code}
                                placeholder="Massar Number"
                                type="Code_massar"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-neutral-600">
                                Groups *
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2">
                                        {selectedGroups.length > 0
                                            ? groups
                                                .filter((g) => selectedGroups.includes(g.id))
                                                .map((g) => g.name)
                                                .join(", ")
                                            : fieldsLoading
                                                ? "Chargement des groupes..."
                                                : "Sélectionner des groupes..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[450px] p-0 dark:bg-neutral-950">
                                    <Command>
                                        <CommandInput className="bg-white" placeholder="Search group..." />
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
                                                            selectedGroups.includes(group.id) ? "opacity-100" : "opacity-0"
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
                    <hr />
                    <DialogFooter>
                        <span className="fixed text-xs left-6 text-gray-500">* Champes obligatoires</span>
                        <div className="flex space-x-2">
                            <DialogClose asChild>
                                <Button className="dark:hover:bg-neutral-100 dark:hover:text-neutral-950" variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button onClick={handleSave} type="submit" className="bg-teal-700 dark:hover:text-neutral-950 dark:text-neutral-300">Enregistrer</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>

            </Dialog>


        </div>
    );
}
