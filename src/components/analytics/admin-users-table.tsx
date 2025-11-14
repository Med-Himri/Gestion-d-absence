"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Plus } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "teacher" | "admin"
  classes?: string
  status: "active" | "inactive"
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@school.edu",
    role: "teacher",
    classes: "3A, 3B",
    status: "active",
  },
  {
    id: "2",
    name: "Marie Laurent",
    email: "marie.laurent@school.edu",
    role: "teacher",
    classes: "2C",
    status: "active",
  },
  {
    id: "3",
    name: "Pierre Martin",
    email: "pierre.martin@school.edu",
    role: "admin",
    status: "active",
  },
  {
    id: "4",
    name: "Sophie Bernard",
    email: "sophie.bernard@school.edu",
    role: "teacher",
    classes: "1A, 1B, 1C",
    status: "inactive",
  },
]

export function AdminUsersTable() {
  const [users] = useState<User[]>(mockUsers)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Utilisateurs</CardTitle>
        <Button className="gap-2" size="sm">
          <Plus className="w-4 h-4" />
          Ajouter utilisateur
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nom</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Rôle</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Classes</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-foreground">{user.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? "Administrateur" : "Enseignant"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{user.classes || "-"}</td>
                  <td className="py-3 px-4">
                    <Badge variant={user.status === "active" ? "default" : "destructive"}>
                      {user.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
