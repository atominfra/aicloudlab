"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Pencil } from 'lucide-react'
import React, { useState } from 'react';


export default function ProjectSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState('Project Alpha');
  const [newProjectName, setNewProjectName] = useState(projectName);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSaveClick = async () => {
    try {
      const response = await fetch('/api/project/update-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newProjectName })
      });
      if (!response.ok) {
        throw new Error('Failed to update project name');
      }
      setProjectName(newProjectName);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleCancelClick = () => {
    setNewProjectName(projectName);
    setIsEditing(false);
  };
  return (
    <div className="min-h-[92dvh] lg:p-4 bg-background">
      <Card className="mx-auto max-w-2xl bg-background shadow-none border-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Project Settings</CardTitle>
            <Badge  className="bg-green-100 text-green-700 hover:bg-green-100">
              12 Services Running
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 bg-white border border-destructive/10 p-6 rounded-lg">
            <h3 className="text-base font-semibold">Project Information</h3>
            <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          {isEditing ? (
            <div className="flex-grow">
              <label className="text-sm font-medium text-[#6B7280]">Project Name</label>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="mt-1"
              />
            </div>
          ) : (
            <div className="w-full border-b pb-1 ">
              <label className="text-sm font-medium text-[#6B7280] ">Project Name</label>
              <h3 className="text-base ">{projectName}</h3>
            </div>
          )}
          {isEditing ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSaveClick}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelClick}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={handleEditClick}>
              <Pencil className="h-4 w-4" />
              <span className="ml-2">Rename</span>
            </Button>
          )}
        </div>
      </div>
          </div>

          <div className="rounded-lg border border-red-300 bg-white p-6 space-y-3">
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete a project, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" size="sm">
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

