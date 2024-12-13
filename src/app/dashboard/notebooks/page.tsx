import { Button } from "@/components/ui/button"
import { NotebookCard } from "@/components/notebook-card"

export default function NotebooksPage() {
  const notebooks = [
    {
      name: "Data Analysis",
      lastEdited: "2 hours ago",
      status: "active",
    },
    {
      name: "Machine Learning Model",
      lastEdited: "Yesterday",
      status: "inactive",
    },
    {
      name: "Visualization Project",
      lastEdited: "3 days ago",
      status: "active",
    },
  ] as const

  return (
      <div className="p-6 bg-neutral-100 h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Notebooks</h1>
          <Button className="bg-blue-600">
            <span className="mr-2">+</span>
            Create 
          </Button>
        </div>
        <div className="">
          {notebooks.map((notebook) => (
            <NotebookCard key={notebook.name} {...notebook} />
          ))}
        </div>
      </div>
  )
}

