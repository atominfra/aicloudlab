'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2 } from 'lucide-react'
import { fetchOSOptions, fetchPlans, createNode } from '@/app/api/nodes/api'
import { useGlobalContext } from '@/context/GlobalContext'

// Types
interface OSOption {
  name: string
  version: string[]
}

interface NodeData {
  name: string
  os: string
  osVersion: string
  plan: string
  image: string
  planCommitment: string
  ipReservation: 'new' | 'existing' | 'none'
  existingIp?: string
  sshKeys: Array<{ name: string; key: string; }>
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
  // State Management
  const [formState, setFormState] = useState<NodeData>({
    name: initialData?.name || '',
    os: initialData?.os || '',
    osVersion: initialData?.osVersion || '',
    image: initialData?.image || '',
    plan: initialData?.plan || '',
    planCommitment: initialData?.planCommitment || '',
    ipReservation: initialData?.ipReservation || 'none',
    existingIp: initialData?.existingIp || '',
    sshKeys: initialData?.sshKeys || [{ name: '', key: ''}],
    volumes: initialData?.volumes || [{ name: '', size: '' }],
    securityRules: initialData?.securityRules || [
      { type: 'inbound', port: '', protocol: 'tcp', ipAddresses: '', allowed: true }
    ]
  })


  // Derived State
  const [osOptions, setOSOptions] = useState<OSOption[]>([])
  const [osVersions, setOSVersions] = useState<string[]>([])
  const [plans, setPlans] = useState([])
  const [existingReservedIPs, setExistingReservedIPs] = useState<string[]>([])
  const [selectedPlanCommitment, setSelectedPlanCommitment] = useState(initialData?.planCommitment || '')
  //const [ipReservation, setIpReservation] = useState<'new' | 'existing' | 'none'>(initialData?.ipReservation || 'none')
  //const [existingIp, setExistingIp] = useState(initialData?.existingIp || '')
  const [securityRules, setSecurityRules] = useState(initialData?.securityRules || [
    { type: 'inbound', port: '', protocol: 'tcp', ipAddresses: '', allowed: true }
  ])
  const [volumes, setVolumes] = useState(initialData?.volumes || [{ name: '', size: '' }])
  const [sshKeys, setSSHKeys] = useState(initialData?.sshKeys || [{ name: '', key: '' }])

  // Hooks
  const { auth } = useGlobalContext()

  // Fetch OS Options
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

  // Update Versions when OS Changes
  useEffect(() => {
    const selectedOSOption = osOptions.find(os => os.name === formState.os)
    setOSVersions(selectedOSOption?.version || [])
  }, [formState.os, osOptions])

  // Fetch Plans when OS and Version are Selected
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
  }, [formState.os, formState.osVersion])

  // Update Handlers
  const updateFormState = <K extends keyof NodeData>(
    field: K, 
    value ,
    index?: number
  ) => {
    if (index !== undefined && Array.isArray(formState[field])) {
      const updatedArray = [...(formState[field] )]
      updatedArray[index] = { ...updatedArray[index], ...value }
      setFormState(prev => ({ ...prev, [field]: updatedArray }))
    } else {
      setFormState(prev => ({ ...prev, [field]: value }))
    }
  }

  // Submission Handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Form Data:", JSON.stringify(formState, null, 2))
       try {
      const result = await createNode(auth,formState)
      console.log('Node created successfully:', result)
      // Handle successful creation 
    } catch (error) {
      console.error('Failed to create node:', error)
      // Handle error
    }
  }

  // Render Helpers
  const renderOSOptions = () => 
    osOptions.map((os) => (
      <SelectItem key={os.name} value={os.name}>{os.name}</SelectItem>
    ))

  const renderOSVersionOptions = () => 
    osVersions.map((version) => (
      <SelectItem key={version} value={version}>{version}</SelectItem>
    ))

  const renderPlanCommitmentOptions = () => 
    PLAN_COMMITMENTS.map((commitment) => (
      <SelectItem key={commitment.value} value={commitment.value}>
        {commitment.label}
      </SelectItem>
    ))



  const addSecurityRule = () => {
    updateFormState('securityRules', [...formState.securityRules, { type: 'inbound', port: '', protocol: 'tcp', ipAddresses: '', allowed: true }])
  }

  const removeSecurityRule = (index: number) => {
    updateFormState('securityRules', formState.securityRules.filter((_, i) => i !== index))
  }

  const addVolume = () => {
    updateFormState('volumes', [...formState.volumes, { name: '', size: '' }])
  }

  const removeVolume = (index: number) => {
    updateFormState('volumes', formState.volumes.filter((_, i) => i !== index))
  }

  const addSSHKey = () => {
    updateFormState('sshKeys', [...formState.sshKeys, { name: '', key: '' }])
  }

  const removeSSHKey = (index: number) => {
    updateFormState('sshKeys', formState.sshKeys.filter((_, i) => i !== index))
  }

  const updateSecurityRule = (index: number, field: string, value: string | boolean) => {
    updateFormState('securityRules', { [field]: value }, index)
  }

  const updateVolume = (index: number, field: string, value: string) => {
    updateFormState('volumes', { [field]: value }, index)
  }

  const updateSSHKey = (index: number, field: string, value: string) => {
    updateFormState('sshKeys', { [field]: value }, index)
  }

  // Mock function to calculate volume cost
  const calculateVolumeCost = (size: number) => {
    const costPerGB = 0.10 // $0.10 per GB per month
    return size * costPerGB
  }


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Node' : 'Create a New Node'}</CardTitle>
          <CardDescription>
            {isEditMode ? 'Update your node details' : 'Fill in the details to create your node'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
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

          {/* System Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="os">Operating System *</Label>
              <Select 
                onValueChange={(value) => {
                  updateFormState('os', value)
                  updateFormState('osVersion', '')
                  updateFormState('plan', '')
                }} 
                value={formState.os} 
                required
              >
                <SelectTrigger id="os">
                  <SelectValue placeholder="Select OS" />
                </SelectTrigger>
                <SelectContent>
                  {renderOSOptions()}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="os-version">OS Version *</Label>
              <Select 
                onValueChange={(value) => {
                  updateFormState('osVersion', value)
                  updateFormState('plan', '')
                }} 
                value={formState.osVersion} 
                required
                disabled={!formState.os}
              >
                <SelectTrigger id="os-version">
                  <SelectValue placeholder="Select Version" />
                </SelectTrigger>
                <SelectContent>
                  {renderOSVersionOptions()}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan *</Label>
              <Select 
                onValueChange={(value) => updateFormState('plan', value)} 
                value={formState.plan} 
                required
                disabled={plans.length === 0}
              >
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan?.id} value={plan?.id}>{plan?.plan_name}</SelectItem>
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
                <SelectTrigger id="plan-commitment">
                  <SelectValue placeholder="Select commitment" />
                </SelectTrigger>
                <SelectContent>
                  {renderPlanCommitmentOptions()}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>IP Reservation</Label>
            <RadioGroup 
              value={formState.ipReservation} 
              onValueChange={(value) => updateFormState('ipReservation', value as 'new' | 'existing' | 'none')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="ip-none" />
                <Label htmlFor="ip-none">No IP reservation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="ip-new" />
                <Label htmlFor="ip-new">Reserve new IP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="ip-existing" />
                <Label htmlFor="ip-existing">Use existing reserved IP</Label>
              </div>
            </RadioGroup>
            {formState.ipReservation === 'existing' && (
              <Select 
                onValueChange={(value) => updateFormState('existingIp', value)} 
                value={formState.existingIp}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select existing IP" />
                </SelectTrigger>
                <SelectContent>
                  {existingReservedIPs.map((ip) => (
                    <SelectItem key={ip} value={ip}>
                      {ip}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Optional Sections */}
          <Accordion type="single" collapsible className="w-full">
            {/* SSH Keys */}
            <AccordionItem value="ssh-keys">
              <AccordionTrigger>SSH Keys</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {formState.sshKeys.map((sshKey, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <Input
                          placeholder="SSH Key Name"
                          value={sshKey.name}
                          onChange={(e) => updateSSHKey(index, 'name', e.target.value)}
                          className="flex-grow mr-2"
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
                      <Textarea
                        placeholder="Paste your SSH public key here"
                        value={sshKey.key}
                        onChange={(e) => updateSSHKey(index, 'key', e.target.value)}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addSSHKey}>
                    Add SSH Key
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Volumes */}
            <AccordionItem value="volumes">
              <AccordionTrigger>Volumes (Optional)</AccordionTrigger>
              <AccordionContent>
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
            <AccordionItem value="security-rules">
              <AccordionTrigger>Security Rules (Optional)</AccordionTrigger>
              <AccordionContent>
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
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {isEditMode ? 'Update Node' : 'Create Node'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

