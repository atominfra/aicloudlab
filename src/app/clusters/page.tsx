import Link from 'next/link'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ClustersPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clusters</h1>
        <Button asChild>
          <Link href="/create/cluster">
            <Plus className="w-4 h-4 mr-2" />
            Create Cluster
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Default Cluster</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">System default cluster</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

