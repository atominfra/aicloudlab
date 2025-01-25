"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Developer"
  avatar?: string
}
const initialUsers: User[] = [
  {
    id: "1",
    name: "Karun Agarwal",
    email: "karun@atominfra.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Shryansh Chaudhary",
    email: "shryansh@atominfra.com",
    role: "Developer",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [newEmail, setNewEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState<"Admin" | "Developer">("Developer")

  const addUser = () => {
    if (newEmail) {
      const newUser: User = {
        id: Date.now().toString(),
        name: newEmail.split("@")[0],
        email: newEmail,
        role: selectedRole,
      }
      setUsers([...users, newUser])
      setNewEmail("")
    }
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const updateUserRole = (id: string, newRole: "Admin" | "Developer") => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <Input
            placeholder="Enter email"
            className="flex-1"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as "Admin" | "Developer")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addUser} className="bg-blue-600">+ <span className="hidden lg:block">Add User</span></Button>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col lg:flex-row gap-3  justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
                <Select
                  value={user.role.toLowerCase()}
                  onValueChange={(value) => updateUserRole(user.id, value as "Admin" | "Developer")}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

