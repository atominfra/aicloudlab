'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2 } from 'lucide-react'
import { fetchOSOptions, fetchPlans, createNode } from '@/app/api/nodes/api'
import { useGlobalContext } from '@/context/GlobalContext'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'

// Types
interface OSOption {
  name: string
  version: string[]
}

interface Plan {
  id: string
  plan: string
  image: string
}

interface NodeData {
  name: string
  os: string
  osVersion: string
  plan: string
  image: string
  planCommitment: string
  sshKeys: Array<{ key: string }>
}

interface NodeCreationFormProps {
  initialData?: NodeData
  isEditMode?: boolean
}

// Constants
const PLAN_COMMITMENTS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
]

export default function NodeCreationForm({ initialData, isEditMode = false }: NodeCreationFormProps) {
  const [formState, setFormState] = useState<NodeData>({
    name: initialData?.name || '',
    os: initialData?.os || '',
    osVersion: initialData?.osVersion || '',
    plan: initialData?.plan || '',
    image: initialData?.image || '',
    planCommitment: initialData?.planCommitment || '',
    sshKeys: initialData?.sshKeys || [{ key: '' }],
  })

  const [osOptions, setOSOptions] = useState<OSOption[]>([])
  const [osVersions, setOSVersions] = useState<string[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const { auth } = useGlobalContext()
  const router = useRouter()
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!auth) return
      try {
        const osData = await fetchOSOptions(auth)
        setOSOptions(osData.data.os)
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      }
    }
    fetchInitialData()
  }, [auth])

  useEffect(() => {
    const selectedOSOption = osOptions.find(os => os.name === formState.os)
    setOSVersions(selectedOSOption?.version || [])
  }, [formState.os, osOptions])

  useEffect(() => {
    const fetchAvailablePlans = async () => {
      if (!formState.os || !formState.osVersion) return
      try {
        const plansData = await fetchPlans(auth, formState.os, formState.osVersion)
        setPlans(plansData.data.plans)
      } catch (error) {
        console.error('Failed to fetch plans:', error)
      }
    }
    fetchAvailablePlans()
  }, [formState.os, formState.osVersion, auth])

  useEffect(() => {
    console.log("formState updated:", formState)
  }, [formState])

  const updateFormState = (field: keyof NodeData, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const apiData = {
      name: formState.name,
      ssh_keys: formState.sshKeys.map(key => key.key),
      plan: formState.plan,
      image: formState.image
    }
    console.log("API Data:", JSON.stringify(apiData, null, 2))
    try {
      setLoading(true)

      const result = await createNode(auth, apiData)
      console.log('Node created successfully:', result)
      // Handle successful creation 
    } catch (error) {
      console.error('Failed to create node:', error)
      // Handle error
    }
    setLoading(false)
    router.push('/dashboard/nodes')
  }

  const findplan = (plans: Plan[], value: string) => {
    return plans.find((plan) => plan.id === value)
  }
  const handlePlanChange = (value: string) => {
    const selectedPlan = findplan(plans, value)
    if (selectedPlan) {
      setFormState(prev => ({
        ...prev,
        plan: selectedPlan.plan,
        image: selectedPlan.image
      }))
    }
  }

  const addSSHKey = () => {
    setFormState(prev => ({
      ...prev,
      sshKeys: [...prev.sshKeys, { key: '' }]
    }))
  }

  const removeSSHKey = (index: number) => {
    setFormState(prev => ({
      ...prev,
      sshKeys: prev.sshKeys.filter((_, i) => i !== index)
    }))
  }

  const updateSSHKey = (index: number, value: string) => {
    setFormState(prev => {
      const newSSHKeys = [...prev.sshKeys]
      newSSHKeys[index] = { key: value }
      return { ...prev, sshKeys: newSSHKeys }
    })
  }
  const formatPlanName = (plan: any) => {
    const parts = []
    
    // Add CPU info
    if (plan.cpu && plan.cpu_type) {
      parts.push(`${plan.cpu} ${plan.cpu_type}`)
    }
    
    // Add RAM info
    if (plan.ram) {
      parts.push(`${plan.ram} GB Memory`)
    }
    
    // Add GPU info if present
    if (plan.gpu_card_details && Object.keys(plan.gpu_card_details).length > 0) {
      parts.push(plan.gpu_card_details.name || 'GPU')
    }
    
    // Add price per hour
    if (plan.price_per_hour) {
      parts.push(`₹${plan.price_per_hour} per hour`)
    }
    
    return parts.join(' • ')
  }
  return (
    <div className='h-full w-full flex justify-center mt-[20vh]'>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Node' : 'Create a New Node'}</CardTitle>
            <CardDescription>
              {isEditMode ? 'Update your node details' : 'Fill in the details to create your node'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                placeholder="Enter node name" 
                required 
                value={formState.name}
                onChange={(e) => updateFormState('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="os">Operating System *</Label>
                <Select 
                  onValueChange={(value) => {
                    updateFormState('os', value)
                    updateFormState('osVersion', '')
                    updateFormState('plan', '')
                    updateFormState('image', '')
                  }} 
                  value={formState.os} 
                  required
                >
                  <SelectTrigger id="os">
                    <SelectValue placeholder="Select OS" />
                  </SelectTrigger>
                  <SelectContent>
                    {osOptions.map((os) => (
                      <SelectItem key={os.name} value={os.name}>{os.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="os-version">OS Version *</Label>
                <Select 
                  onValueChange={(value) => {
                    updateFormState('osVersion', value)
                    updateFormState('plan', '')
                    updateFormState('image', '')
                  }} 
                  value={formState.osVersion} 
                  required
                  disabled={!formState.os}
                >
                  <SelectTrigger id="os-version">
                    <SelectValue placeholder="Select Version" />
                  </SelectTrigger>
                  <SelectContent>
                    {osVersions.map((version) => (
                      <SelectItem key={version} value={version}>{version}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plan *</Label>
                <Select 
                  onValueChange={handlePlanChange} 
                  value={plans.find(p => p.plan === formState.plan)?.id || ''}
                  required
                  disabled={plans.length === 0}
                >
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>{formatPlanName(plan)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="plan-commitment">Plan Commitment *</Label>
                <Select 
                  onValueChange={(value) => updateFormState('planCommitment', value)} 
                  value={formState.planCommitment} 
                  required
                >
                  <SelectTrigger id="plan-commitment">
                    <SelectValue placeholder="Select commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_COMMITMENTS.map((commitment) => (
                      <SelectItem key={commitment.value} value={commitment.value}>
                        {commitment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ssh-keys">
                <AccordionTrigger>SSH Keys (Optional)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {formState.sshKeys.map((sshKey, index) => (
                      <div key={index} className='flex'>
                        <Textarea
                          placeholder="Paste your SSH public key here"
                          value={sshKey.key}
                          onChange={(e) => updateSSHKey(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSSHKey(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addSSHKey}>
                      Add SSH Key
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button                        
             disabled={loading}
              type="submit" className={`w-full ${loading===true ? 'bg-[rgba(17,24,39,0.32)]':'bg-black'}`}>
              {loading=== true ? <>
                        <CircularProgress className="text-white" size={30}/> 
                        </>:
                        <>Create Node</>}
            </Button>
            {/* <CustomButton 
                        disabled={isLoading}
                        text={isLoading=== true ? <>
                        <CircularProgress className="text-white" size={30}/> 
                        </>:
                        <>Create Notebook</>} 
                        customCss={`mt-6 ${isLoading===true ? 'bg-[rgba(17,24,39,0.32)]':'bg-[#1976D2]'} text-white text-[15px] lg:text-[16px]`} 
                        onclickhandler={handleSubmit}
                      /> */}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

