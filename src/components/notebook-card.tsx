import { Book, MoreVertical, Play, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NotebookCardProps {
  name: string
  lastEdited: string
  status: "active" | "inactive"
}

export function NotebookCard({ name, lastEdited, status }: NotebookCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <Book className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="text-sm text-gray-500">
              Last edited: {lastEdited}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className={status === "active" ? "text-green-500" : "text-gray-400"}>
            <Play className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

