import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { useUserStore } from "@/store/user-store";




export function SignUp() {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"admin" | "ensiegnant">("ensiegnant");
    const signup = useUserStore((state) => state.signup);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting signup with:", { nom, prenom, email, password, role });
        try {   
            await signup(nom, prenom, email, password, role);
            alert("User created and logged in!");
        } catch (err: any) {
            console.error("Signup error:", err);
            alert(err.message);
        }
    };
    return (
        <Dialog>

            <DialogTrigger asChild>
                <Button variant="outline" className=" w-[400px] hover:bg-neutral-400">
                    S'inscrire
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Créer un compte</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Label>Nom *</Label>
                    <Input
                        type="text"
                        placeholder="Nom"
                        className="w-full border p-2 rounded-md"
                        value={nom} onChange={(e) => setNom(e.target.value)}
                    />
                    <Label>Prénom *</Label>
                    <Input
                        type="text"
                        placeholder="Prénom"
                        className="w-full border p-2 rounded-md"
                        value={prenom} onChange={(e) => setPrenom(e.target.value)}
                    />
                    <Label htmlFor="user">Type d'utilisateur *</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as "admin" | "ensiegnant")}>
                        <SelectTrigger className="w-[398px]">
                            <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup >
                                <SelectItem value="ensiegnant">Enseignant</SelectItem>
                                <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Label>Email *</Label>
                    <Input
                        type="email"
                        placeholder="Email"
                        className="w-full border p-2 rounded-md"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <Label>Mot de passe *</Label>
                    <Input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full border p-2 rounded-md"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <hr />
                    <DialogFooter>
                        <span className="fixed text-xs left-6 text-gray-500">* Champes obligatoires</span>

                        <Button type="submit" className="w-full mt-8">
                            S'inscrire
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
