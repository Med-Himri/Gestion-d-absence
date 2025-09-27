import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignUp } from "@/app/auth/sign-up-page"
import { useState } from "react";
import { useUserStore } from "@/store/user-store";




export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"enseignant" | "admin">("enseignant");
    const [loading, setLoading] = useState(false);


    const login = useUserStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password, role);
            alert("Logged in successfully!");
        } catch (err: any) {
            console.error("Login error:", err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center  min-h-screen"
            onSubmit={handleSubmit}>
            <form
                onSubmit={handleSubmit}
                >
                <Card className="w-[450px]">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex justify-center text-xl font-semibold">Connexion</div>
                        </CardTitle>
                        <CardDescription className="flex justify-center">
                            Accédez a la platforme de gestion des absences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="user">Type d'utilisateur</Label>
                                    <Select value={role} onValueChange={(value) => setRole(value as "enseignant" | "admin")}>
                                        <SelectTrigger className="w-[398px]">
                                            <SelectValue placeholder="Select User" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="enseignant">Enseignant</SelectItem>
                                                <SelectItem value="admin">Administrateur</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Mot de passe</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-neutral-500 font-semibold inline-block text-xs underline-offset-4 hover:underline"
                                        >
                                            Mot de passe oublié?
                                        </a>
                                    </div>
                                    <Input id="password"
                                        type="password"
                                        required
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full bg-blue-700 hover:bg-neutral-400 hover:text-neutral-900">
                            {loading ? "Connexion..." : "Se connecter"}
                        </Button>
                        <SignUp />
                    </CardFooter>
                </Card>

            </form>
        </div>
    )
}
