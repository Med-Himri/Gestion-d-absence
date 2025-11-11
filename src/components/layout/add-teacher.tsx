import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { useTeachersStore } from "@/store/teacher-store";
import { useGroupStore } from "@/store/groupe-store";
import {useCoursesStore} from "@/store/course-store";

export function FormTeacher() {
  const [open, setOpen] = useState(false);
  const [ouver, setOuver] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const addTeacher = useTeachersStore((state) => state.addTeacher);

  const { groups, fetchGroups, loading } = useGroupStore();
  const { courses, fetchCourses} = useCoursesStore()

    useEffect(() => {
      fetchGroups(),
      fetchCourses();
    }, [fetchGroups,fetchCourses]);

  const toggleGroup = (group_id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group_id) ? prev.filter((id) => id !== group_id) : [...prev, group_id]
    );
  };

  const selectCourse = (course_id: string) => {
  setSelectedCourse(course_id); // just one
  setOuver(false); // close the popover after selection
};

  const handleSubmit = async () => {
    if (!name || !email || !password || !selectedCourse || selectedGroups.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await addTeacher({
        name,
        email,
        password,
        group_ids: selectedGroups,
        course_id: selectedCourse,
      });

      alert("Enseignant ajouté avec succès !");
      setName("");
      setEmail("");
      setPassword("");
      setSelectedCourse("");
      setSelectedGroups([]);
      setOuver(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout de l'enseignant");
    }
  };

 

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-52 h-10 flex items-center justify-center rounded-xl 
           border-2 bg-teal-50 text-black 
           transition-all duration-200 
           hover:bg-blue-100 hover:shadow-glow dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-100">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Enseignant
          </Button>
        </DialogTrigger>

        <DialogContent className="dark:bg-neutral-900 sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Nouveau Enseignant</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mt-4">
            <div className="grid gap-3">
              <div>
                <Label htmlFor="name" className="text-sm dark:text-neutral-400 text-neutral-600">
                  Nom Complet *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom Complet"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm dark:text-neutral-400 text-neutral-600">
                Mot de passe *
              </Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
              />
            </div>

            <div>
              <Label htmlFor="Matiére" className="text-sm dark:text-neutral-400 text-neutral-600">
                Matiére *
              </Label>
              <Popover open={ouver} onOpenChange={setOuver}>
                <PopoverTrigger asChild>
                  <Button className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2">
                    {selectedCourse
                      ? courses
                         .find(c => c.course_id === selectedCourse)?.course_name
                      : loading
                        ? "Chargement des courses..."
                        : "Sélectionner un courses..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[450px] p-0 dark:bg-neutral-950">
                  <Command>
                    <CommandInput className="bg-white" placeholder="Search course..." />
                    <CommandEmpty>No Course found.</CommandEmpty>
                    <CommandGroup>
                      {courses.map((course) => (
                        <CommandItem
                          key={course.course_id}
                          onSelect={() => selectCourse(course.course_id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCourse === course.course_id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {course.course_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-sm font-semibold text-neutral-600">
                Groups assigned *
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2">
                    {selectedGroups.length > 0
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
            <div className="flex space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleSubmit} className="bg-teal-700 dark:text-neutral-300">
                Enregistrer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


