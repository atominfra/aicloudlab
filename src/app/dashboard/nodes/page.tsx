import { Button } from "@/components/ui/button"
import { NodeCard } from "@/components/node-card"

export default function NodesPage() {
  const nodes = [
    {
      name: "Node 1",
      status: "running",
      ip: "192.168.1.100",
      specs: {
        cpu: "2vCPU",
        memory: "16GB",
        storage: "100GB",
        gpu: "NVIDIA T4",
      },
    },
    {
      name: "Node 2",
      status: "running",
      ip: "192.168.1.101",
      specs: {
        cpu: "2vCPU",
        memory: "16GB",
        storage: "100GB",
        gpu: "NVIDIA T4",
      },
    },
  ] as const

  return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Nodes</h1>
          <Button>
            <span className="mr-2">+</span>
            Create
          </Button>
        </div>
        <div className="space-y-4">
          {nodes.map((node) => (
            <NodeCard key={node.name} {...node} />
          ))}
        </div>
      </div>
  )
}

