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


const groups = [
    { value: "groupA", label: "Group A" },
    { value: "groupB", label: "Group B" },
    { value: "groupC", label: "Group C" },
    { value: "groupD", label: "Group D" },
    { value: "groupE", label: "Group E" },
    { value: "groupF", label: "Group F" },
]


export function FormStudent() {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<string[]>([])

    const toggleGroup = (value: string) => {
        setSelected((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        )
    }

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
                        <span className="text-sx text-neutral-950 font-medium dark:text-neutral-300">Informations du ensiegnant</span>
                    </div>

                    <div className="space-y-2">
                        {/* Name fields */}
                        <div className="grid gap-3">
                            <div>
                                <Label htmlFor="lastName" className="text-sm dark:text-neutral-400 text-neutral-600">
                                    Nom Complet *
                                </Label>
                                <Input
                                    id="lastName"
                                />
                            </div>

                        </div>
                        <div>
                            <Label htmlFor="email" className="text-sm dark:text-neutral-400 text-neutral-600">
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="Numero_de_piece" className="text-sm dark:text-neutral-400 text-neutral-600">
                                Mot de passe *
                            </Label>
                            <Input
                                id="Numero_de_piece"
                            />
                        </div>
                        <div>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[450px] justify-between"
                                    >
                                        {selected.length > 0
                                            ? groups
                                                .filter((g) => selected.includes(g.value))
                                                .map((g) => g.label)
                                                .join(", ")
                                            : "Select groups..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[450px] p-0 dark:bg-neutral-950">
                                    <Command>
                                        <CommandInput placeholder="Search group..." />
                                        <CommandEmpty>No group found.</CommandEmpty>
                                        <CommandGroup>
                                            {groups.map((group) => (
                                                <CommandItem
                                                    key={group.value}
                                                    onSelect={() => toggleGroup(group.value)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selected.includes(group.value) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {group.label}
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
                            <Button type="submit" className="bg-teal-700 dark:hover:text-neutral-950 dark:text-neutral-300">Enregistrer</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>

            </Dialog>


        </div>
    );
}
