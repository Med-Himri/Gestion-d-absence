import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Layers, ChevronsUpDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { useFieldStore } from "@/store/field-store";
import { useGroupStore } from "@/store/groupe-store";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";


export function FormGroup() {
    const { addGroup } = useGroupStore();
    const { fields, loading: fieldsLoading, fetchFields } = useFieldStore()
    const [ouver, setOuver] = useState(false);
    const [selectedFields, setSelectedFields] = useState<string>("");

    const [form, setForm] = useState({
        name: "",
        year: "",
        number_student: "",
    });

    useEffect(() => {
        fetchFields()
    }, [fetchFields])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const selectField = (id: string) => {
        setSelectedFields(id); // just one
        setOuver(false); // close the popover after selection
    };

    const handleSubmit = async () => {
        if (!form.name || !form.year || !form.number_student || !selectedFields) {
            alert("Veuillez remplir tous les champs obligatoires !");
            return;
        }

        try {
            await addGroup({
                name: form.name,
                year: form.year,
                number_student: Number(form.number_student),
                field_id: selectedFields,
            });

            alert("Groupe ajouté avec succès !");
            setForm({ name: "", year: "", number_student: "" });
            setSelectedFields("");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout du groupe !");
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
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    placeholder="Nom du Groupe"
                                />
                            </div>

                        </div>
                        <div>
                            <Label htmlFor="year" className="text-sm dark:text-neutral-400 text-neutral-600">
                                Year *
                            </Label>
                            <Input
                                id="year"
                                name="year"
                                value={form.year}
                                onChange={handleInputChange}
                                placeholder="Année"
                            />
                        </div>
                        <div>
                            <Label htmlFor="Filiére" className="text-sm dark:text-neutral-400 text-neutral-600">
                                Filiére  *
                            </Label>
                            <Popover open={ouver} onOpenChange={setOuver}>
                                <PopoverTrigger asChild>
                                    <Button className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2">
                                        {selectedFields
                                            ? fields
                                                .find(c => c.id === selectedFields)?.name
                                            : fieldsLoading
                                                ? "Chargement des filiers..."
                                                : "Sélectionner un filiers..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[450px] p-0 dark:bg-neutral-950">
                                    <Command>
                                        <CommandInput className="bg-white" placeholder="Search course..." />
                                        <CommandEmpty>No Field found.</CommandEmpty>
                                        <CommandGroup>
                                            {fields.map((field) => (
                                                <CommandItem
                                                    key={field.id}
                                                    onSelect={() => selectField(field.id)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedFields === field.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {field.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label htmlFor="Total_des_Etudiants " className="text-sm dark:text-neutral-400 text-neutral-600">
                                Total des Etudiants *
                            </Label>
                            <Input
                                id="number_student"
                                name="number_student"
                                type="number"
                                value={form.number_student}
                                onChange={handleInputChange}
                                placeholder="Nombre d'étudiants"
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
