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
import { fetchOSOptions, fetchPlans, createNode } from '@/app/api/nodes/apis'
import { useGlobal } from '@/context/global-context'

interface NodeData {
  name: string
  os: string
  osVersion: string
  plan: string
  planCommitment: string
  ipReservation: 'new' | 'existing' | 'none'
  existingIp?: string
  sshKeys: Array<{ name: string; key: string; method: 'paste' | 'upload'; file: File | null }>
  volumes: Array<{ name: string; size: string }>
  securityRules: Array<{ type: string; port: string; protocol: string; ipAddresses: string; allowed: boolean }>
}

interface NodeCreationFormProps {
  initialData?: NodeData
  isEditMode?: boolean
}

export default function NodeCreationForm({ initialData, isEditMode = false }: NodeCreationFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [selectedOS, setSelectedOS] = useState(initialData?.os || '')
  const [osOptions, setOSOptions] = useState<Record<string, string[]>>({})
  const [osVersions, setOSVersions] = useState<string[]>([])
  const [selectedOSVersion, setSelectedOSVersion] = useState(initialData?.osVersion || '')
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(initialData?.plan || '')
  const [selectedPlanCommitment, setSelectedPlanCommitment] = useState(initialData?.planCommitment || '')
  const [ipReservation, setIpReservation] = useState<'new' | 'existing' | 'none'>(initialData?.ipReservation || 'none')
  const [existingIp, setExistingIp] = useState(initialData?.existingIp || '')
  const [securityRules, setSecurityRules] = useState(initialData?.securityRules || [
    { type: 'inbound', port: '', protocol: 'tcp', ipAddresses: '', allowed: true }
  ])
  const [volumes, setVolumes] = useState(initialData?.volumes || [{ name: '', size: '' }])
  const [sshKeys, setSSHKeys] = useState(initialData?.sshKeys || [{ name: '', key: '', method: 'paste' as 'paste' | 'upload', file: null as File | null }])
  const [existingReservedIPs, setExistingReservedIPs] = useState<string[]>([])
  const {auth} = useGlobal()
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const osData = await fetchOSOptions(auth);
        setOSOptions(osData);
        // setExistingReservedIPs(await fetchReservedIPs());
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedOS) {
      setOSVersions(osOptions[selectedOS] || [])
    }
  }, [selectedOS, osOptions])

  useEffect(() => {
    async function fetchAvailablePlans() {
      if (selectedOS && selectedOSVersion) {
        try {
          // const plansData = await fetchPlans(selectedOS, selectedOSVersion);
          // setPlans(plansData);
        } catch (error) {
          console.error('Failed to fetch plans:', error);
        }
      }
    }
    fetchAvailablePlans();
  }, [selectedOS, selectedOSVersion]);

  const handleOSChange = (os: string) => {
    setSelectedOS(os)
    setSelectedOSVersion('')
  }

  const addSecurityRule = () => {
    setSecurityRules([...securityRules, { type: 'inbound', port: '', protocol: 'tcp', ipAddresses: '', allowed: true }])
  }

  const removeSecurityRule = (index: number) => {
    setSecurityRules(securityRules.filter((_, i) => i !== index))
  }

  const addVolume = () => {
    setVolumes([...volumes, { name: '', size: '' }])
  }

  const removeVolume = (index: number) => {
    setVolumes(volumes.filter((_, i) => i !== index))
  }

  const addSSHKey = () => {
    setSSHKeys([...sshKeys, { name: '', key: '', method: 'paste', file: null }])
  }

  const removeSSHKey = (index: number) => {
    setSSHKeys(sshKeys.filter((_, i) => i !== index))
  }

  const updateSecurityRule = (index: number, field: string, value: string | boolean) => {
    const updatedRules = securityRules.map((rule, i) => {
      if (i === index) {
        return { ...rule, [field]: value }
      }
      return rule
    })
    setSecurityRules(updatedRules)
  }

  const updateVolume = (index: number, field: string, value: string) => {
    const updatedVolumes = volumes.map((volume, i) => {
      if (i === index) {
        return { ...volume, [field]: value }
      }
      return volume
    })
    setVolumes(updatedVolumes)
  }

  const updateSSHKey = (index: number, field: string, value: string | File | null) => {
    const updatedSSHKeys = sshKeys.map((sshKey, i) => {
      if (i === index) {
        return { ...sshKey, [field]: value }
      }
      return sshKey
    })
    setSSHKeys(updatedSSHKeys)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData: NodeData = {
      name,
      os: selectedOS,
      osVersion: selectedOSVersion,
      plan: selectedPlan,
      planCommitment: selectedPlanCommitment,
      ipReservation,
      existingIp: ipReservation === 'existing' ? existingIp : undefined,
      sshKeys,
      volumes,
      securityRules,
    }
    try {
      const result = await createNode(formData);
      console.log('Node created successfully:', result);
      // Handle successful creation (e.g., show a success message, redirect to node list)
    } catch (error) {
      console.error('Failed to create node:', error);
      // Handle error (e.g., show an error message)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (file) {
      updateSSHKey(index, 'file', file)
    }
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
          <CardDescription>{isEditMode ? 'Update your node details' : 'Fill in the details to create your node'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              placeholder="Enter node name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* System Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="os">Operating System *</Label>
              <Select onValueChange={handleOSChange} value={selectedOS} required>
                <SelectTrigger id="os">
                  <SelectValue placeholder="Select OS" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(osOptions).map((os) => (
                    <SelectItem key={os} value={os}>{os}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="os-version">OS Version *</Label>
              <Select onValueChange={setSelectedOSVersion} value={selectedOSVersion} required>
                <SelectTrigger id="os-version">
                  <SelectValue placeholder="Select Version" />
                </SelectTrigger>
                <SelectContent>
                  {osVersions.map((version) => (
                    <SelectItem key={version} value={version}>
                      {version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Plan *</Label>
              <Select onValueChange={setSelectedPlan} value={selectedPlan} required>
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-commitment">Plan Commitment *</Label>
              <Select onValueChange={setSelectedPlanCommitment} value={selectedPlanCommitment} required>
                <SelectTrigger id="plan-commitment">
                  <SelectValue placeholder="Select commitment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* IP Reservation */}
          <div className="space-y-2">
            <Label>IP Reservation</Label>
            <RadioGroup value={ipReservation} onValueChange={(value) => setIpReservation(value as 'new' | 'existing' | 'none')}>
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
            {ipReservation === 'existing' && (
              <Select onValueChange={setExistingIp} value={existingIp}>
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
              <AccordionTrigger>SSH Keys (Optional)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {sshKeys.map((sshKey, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <Input
                          placeholder="SSH Key Name"
                          value={sshKey.key}
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
                      <div className="flex space-x-2 mb-2">
                        <Button
                          type="button"
                          variant={sshKey.method === 'paste' ? 'default' : 'outline'}
                          onClick={() => updateSSHKey(index, 'method', 'paste')}
                        >
                          Paste
                        </Button>
                        <Button
                          type="button"
                          variant={sshKey.method === 'upload' ? 'default' : 'outline'}
                          onClick={() => updateSSHKey(index, 'method', 'upload')}
                        >
                          Upload
                        </Button>
                      </div>
                      {sshKey.method === 'paste' ? (
                        <Textarea
                          placeholder="Paste your SSH public key here"
                          value={sshKey.key}
                          onChange={(e) => updateSSHKey(index, 'key', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept=".pub"
                            onChange={(e) => handleFileChange(e, index)}
                          />
                          {sshKey.file && (
                            <p className="text-sm text-muted-foreground">
                              File selected: {sshKey.file.name}
                            </p>
                          )}
                        </div>
                      )}
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
                  {volumes.map((volume, index) => (
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
                  {securityRules.map((rule, index) => (
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
          <Button type="submit" className="w-full">{isEditMode ? 'Update Node' : 'Create Node'}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

