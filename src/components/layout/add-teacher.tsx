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
import { Button } from "@/components/ui/button";
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
import { useCoursesStore } from "@/store/course-store";

export function FormTeacher() {
  const [openGroups, setOpenGroups] = useState(false);  // For groups popover
  const [openCourses, setOpenCourses] = useState(false);  // For courses popover
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);  // Changed to array
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addTeacher = useTeachersStore((state) => state.addTeacher);

  const { groups, fetchGroups, loading: loadingGroups } = useGroupStore();
  const { courses, fetchCourses, loading: loadingCourses } = useCoursesStore();

  useEffect(() => {
    fetchGroups();
    fetchCourses();
  }, [fetchGroups, fetchCourses]);

  // Toggle group selection (multi-select)
  const toggleGroup = (group_id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group_id) ? prev.filter((id) => id !== group_id) : [...prev, group_id]
    );
  };

  // Toggle course selection (multi-select)
  const toggleCourse = (course_id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(course_id) ? prev.filter((id) => id !== course_id) : [...prev, course_id]
    );
  };

  const handleSubmit = async () => {
    if (!name || !email || !password || selectedCourses.length === 0) {  // Check array length
      alert("Veuillez remplir tous les champs obligatoires et sélectionner au moins un cours");
      return;
    }

    try {
      await addTeacher({
        name,
        email,
        password,
        course_ids: selectedCourses,  // Pass array
        group_ids: selectedGroups,    // Pass array
      });

      alert("Enseignant ajouté avec succès !");
      setName("");
      setEmail("");
      setPassword("");
      setSelectedGroups([]);
      setSelectedCourses([]);  // Reset array
      setOpenGroups(false);
      setOpenCourses(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout de l'enseignant");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-52 h-10 flex items-center justify-center rounded-xl border-2 bg-teal-50 text-black transition-all duration-200 hover:bg-blue-100 hover:shadow-glow dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-100">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Enseignant
          </Button>
        </DialogTrigger>

        <DialogContent aria-describedby="dialog-description" className="dark:bg-neutral-900 sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Nouveau Enseignant</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mt-4">
            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Courses (multi-select) */}
            <div>
              <Label className="text-sm dark:text-neutral-400 text-neutral-600">
                Matières enseignées *
              </Label>
              <Popover open={openCourses} onOpenChange={setOpenCourses}>
                <PopoverTrigger asChild>
                  <Button className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2">
                    {selectedCourses.length > 0
                      ? courses
                          .filter((c) => selectedCourses.includes(c.id))
                          .map((c) => c.name)
                          .join(", ")
                      : loadingCourses
                        ? "Chargement des cours..."
                        : "Sélectionner des cours..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[450px] p-0 dark:bg-neutral-950">
                  <Command>
                    <CommandInput placeholder="Rechercher un cours..." className="bg-white" />
                    <CommandEmpty>Aucun cours trouvé.</CommandEmpty>
                    <CommandGroup>
                      {courses.map((course) => (
                        <CommandItem key={course.id} onSelect={() => toggleCourse(course.id)}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCourses.includes(course.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {course.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Groups (multi-select) */}
            <div>
              <Label className="text-sm font-semibold text-neutral-600">
                Groups assignés
              </Label>
              <Popover open={openGroups} onOpenChange={setOpenGroups}>
                <PopoverTrigger asChild>
                  <Button className="w-full justify-between font-normal dark:text-neutral-400 text-neutral-600 hover:bg-neutral-100 bg-white border-2">
                    {selectedGroups.length > 0
                      ? groups
                          .filter((g) => selectedGroups.includes(g.id))
                          .map((g) => g.name)
                          .join(", ")
                      : loadingGroups
                        ? "Chargement des groupes..."
                        : "Sélectionner des groupes..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[450px] p-0 dark:bg-neutral-950">
                  <Command>
                    <CommandEmpty>Aucun groupe trouvé.</CommandEmpty>
                    <CommandGroup>
                      {groups.map((group) => (
                        <CommandItem key={group.id} onSelect={() => toggleGroup(group.id)}>
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
