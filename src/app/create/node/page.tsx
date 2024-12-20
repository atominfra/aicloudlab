'use client'

import React, { useState, useEffect } from 'react'
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
import { Switch } from "@/components/ui/switch"

// Types
interface OSOption {
  name: string
  version: string[]
}

interface Plan {
  id: string
  plan: string
  image: string
  cpu?: number
  cpu_type?: string
  ram?: number
  disk:string
  gpu_card_details?: {
    name?: string
  }
  price_per_hour?: number
}

interface NodeData {
  name: string
  os: string
  osVersion: string
  plan: string
  image: string
  planCommitment: string
  sshKeys: Array<{ key: string }>
  volumes: Array<{ name: string; size: string }>
  securityRules: Array<{ type: string; port: string; protocol: string; ipAddresses: string; allowed: boolean }>
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
    volumes: initialData?.volumes || [],
    securityRules: initialData?.securityRules || [],
  })

  const [osOptions, setOSOptions] = useState<OSOption[]>([])
  const [osVersions, setOSVersions] = useState<string[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingPlans, setLoadingPlans] = useState(false) // Added loadingPlans state
  const { auth } = useGlobalContext()
  const router = useRouter()
  const [error, setError] = useState('')
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

  const fetchAvailablePlans = async () => {
    if (!formState.os || !formState.osVersion) return
    setLoadingPlans(true) // Set loadingPlans to true before fetching
    try {
      const plansData = await fetchPlans(auth, formState.os, formState.osVersion)
      setPlans(plansData.data.plans)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    } finally {
      setLoadingPlans(false) // Set loadingPlans to false after fetching (success or failure)
    }
  }

  useEffect(() => {
    fetchAvailablePlans()
  }, [formState.os, formState.osVersion, auth])

  useEffect(() => {
    console.log("formState updated:", formState)
  }, [formState])

  const updateFormState = (field: keyof NodeData, value) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
     // Validate SSH keys
      const hasEmptySSHKeys = formState.sshKeys.some(key => key.key.trim() === '');
      if (hasEmptySSHKeys || formState.sshKeys.length === 0) {
        // alert("Please add at least one valid SSH key."); 
        setError("Please add at least one valid SSH key.")
        return;
      }
    const apiData = {
      name: formState.name,
      ssh_keys: formState.sshKeys.map(key => key.key),
      plan: formState.plan,
      image: formState.image,
      volumes: formState.volumes,
      security_rules: formState.securityRules
    }
    console.log("API Data:", JSON.stringify(apiData, null, 2))
    try {
      setLoading(true)
      const result = await createNode(auth, apiData)
      console.log('Node created successfully:', result)
      router.push('/dashboard/nodes')
    } catch (error) {
      console.error('Failed to create node:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false)
    }
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

  const addVolume = () => {
    setFormState(prev => ({
      ...prev,
      volumes: [...prev.volumes, { name: '', size: '' }]
    }))
  }

  const removeVolume = (index: number) => {
    setFormState(prev => ({
      ...prev,
      volumes: prev.volumes.filter((_, i) => i !== index)
    }))
  }

  const updateVolume = (index: number, field: 'name' | 'size', value: string) => {
    setFormState(prev => {
      const newVolumes = [...prev.volumes]
      newVolumes[index] = { ...newVolumes[index], [field]: value }
      return { ...prev, volumes: newVolumes }
    })
  }

  const addSecurityRule = () => {
    setFormState(prev => ({
      ...prev,
      securityRules: [...prev.securityRules, { type: 'inbound', port: '', protocol: 'tcp', ipAddresses: '', allowed: true }]
    }))
  }

  const removeSecurityRule = (index: number) => {
    setFormState(prev => ({
      ...prev,
      securityRules: prev.securityRules.filter((_, i) => i !== index)
    }))
  }

  const updateSecurityRule = (index: number, field: keyof NodeData['securityRules'][0], value) => {
    setFormState(prev => {
      const newRules = [...prev.securityRules]
      newRules[index] = { ...newRules[index], [field]: value }
      return { ...prev, securityRules: newRules }
    })
  }

  const calculateVolumeCost = (size: number) => {
    // This is a placeholder function. Replace with actual cost calculation logic.
    return size * 0.1 // Assuming $0.1 per GB
  }

  const formatPlanName = (plan: Plan) => {
    const parts = []
    
    if (plan.cpu && plan.cpu_type) {
      parts.push(`${plan.cpu} ${plan.cpu_type}`)
    }
    
    if (plan.ram) {
      parts.push(`${plan.ram} GB Memory`)
    }

    if (plan.disk && Object.keys(plan.disk).length > 0) {
      parts.push(plan?.disk || 'Disk')
    }
    
    
    if (plan.gpu_card_details && Object.keys(plan.gpu_card_details).length > 0) {
      parts.push(plan?.gpu_card_details?.name || 'GPU')
    }
    
    return parts.join(' • ')
    
  // return (
  //   <div className="flex justify-between items-center space-x-4">
  //     {parts.map((part, index) => (
  //       <div key={index} className="flex-1 text-center">
  //         {part+ " •"} 
  //       </div>
  //     ))}
  //   </div>
  // );
  }

  const renderPlanCommitmentOptions = () => {
    return PLAN_COMMITMENTS.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ));
  };

  return (
    <div className='lg:p-6 bg-neutral-100 lg:min-h-screen min-h-[84vh] flex justify-center items-start'>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto lg:mt-[10vh]">
        <Card className="bg-neutral-100 shadow-none border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-lg lg:text-2xl font-semibold ">{isEditMode ? 'Edit Node' : 'Create a New Node'}</CardTitle>
            {/* <CardDescription className="text-muted-foreground">
              {isEditMode ? 'Update your node details' : 'Fill in the details to create your node'}
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                placeholder="Enter node name" 
                required 
                value={formState.name}
                onChange={(e) => updateFormState('name', e.target.value)}
                className="max-w-full placeholder:text-black text-sm "
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  disabled={osOptions.length === 0} 
                >
                  <SelectTrigger id="os" className="max-w-full">
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
                  <SelectTrigger id="os-version" className="max-w-full">
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
                  disabled={plans.length === 0}
                  required
                >
                  <SelectTrigger id="plan" className="max-w-full">
                    {loadingPlans ? (
                      <div className="flex items-center">
                        <CircularProgress size={16} className="mr-2" />
                        Loading plans...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select plan" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>{formatPlanName(plan)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-commitment">Plan Commitment *</Label>
                <Select 
                  onValueChange={(value) => updateFormState('planCommitment', value)} 
                  value={formState.planCommitment} 
                  required
                  disabled={true}
                >
                  <SelectTrigger id="plan-commitment" className="max-w-full">
                    <SelectValue placeholder="Select commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    {renderPlanCommitmentOptions()}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full border rounded-md bg-white">
              <AccordionItem value="ssh-keys" className="border-b-0" >
                <AccordionTrigger className="px-4 py-2">SSH Keys* </AccordionTrigger>
                <AccordionContent className="px-4 py-2" >
                  <div className="space-y-4">
                    {formState.sshKeys.map((sshKey, index) => (
                      <div key={index} className='flex items-center'>
                        <Textarea
                          placeholder="Paste your SSH public key here"
                          value={sshKey.key}
                          onChange={(e) => updateSSHKey(index, e.target.value)}
                          className="flex-grow mr-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSSHKey(index)}
                          className="mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addSSHKey} className="mt-2">
                      Add SSH Key
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Volumes */}
              <AccordionItem value="volumes" disabled>
                <AccordionTrigger className="px-4 py-2 text-[#b5b5b5] font-normal hover:cursor-not-allowed">Volumes (Coming Soon)</AccordionTrigger>
                <AccordionContent className="px-4 py-2">
                  <div className="space-y-4">
                    {formState.volumes.map((volume, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <Input
                            placeholder="Volume Name"
                            value={volume.name}
                            onChange={(e) => updateVolume(index, 'name', e.target.value)}
                            className="flex-grow mr-2"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVolume(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Size (GB)"
                          value={volume.size}
                          onChange={(e) => updateVolume(index, 'size', e.target.value)}
                        />
                        {volume.size && (
                          <p className="text-sm text-muted-foreground">
                            Estimated cost: ${calculateVolumeCost(Number(volume.size)).toFixed(2)}/month
                          </p>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addVolume}>
                      Add Volume
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Security Rules */}
              <AccordionItem value="security-rules " disabled>
                <AccordionTrigger className="px-4 py-2 text-[#b5b5b5] font-normal hover:cursor-not-allowed">Security Rules (Coming Soon)</AccordionTrigger>
                <AccordionContent className="px-4 py-2">
                  <div className="space-y-4">
                    {formState.securityRules.map((rule, index) => (
                      <div key={index} className="p-4 border rounded-md space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2 flex-grow">
                            <Select
                              value={rule.type}
                              onValueChange={(value) => updateSecurityRule(index, 'type', value)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inbound">Inbound</SelectItem>
                                <SelectItem value="outbound">Outbound</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Port"
                              value={rule.port}
                              onChange={(e) => updateSecurityRule(index, 'port', e.target.value)}
                              className="w-20"
                            />
                            <Select
                              value={rule.protocol}
                              onValueChange={(value) => updateSecurityRule(index, 'protocol', value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tcp">TCP</SelectItem>
                                <SelectItem value="udp">UDP</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSecurityRule(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="IP Addresses (comma-separated)"
                            value={rule.ipAddresses}
                            onChange={(e) => updateSecurityRule(index, 'ipAddresses', e.target.value)}
                            className="flex-grow"
                          />
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={rule.allowed}
                              onCheckedChange={(checked) => updateSecurityRule(index, 'allowed', checked)}
                              id={`allow-rule-${index}`}
                            />
                            <Label htmlFor={`allow-rule-${index}`}>Allow</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addSecurityRule}>
                      Add Rule
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
              {error !== '' && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.push('/dashboard/nodes')}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className={`bg-[#1976D2] text-white ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Node'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

