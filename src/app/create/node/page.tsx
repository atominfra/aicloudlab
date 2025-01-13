'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { fetchOSOptions, fetchPlans, createNode, fetchPrice } from '@/app/api/nodes/api'
import { getAllProjects } from '@/app/api/projects/api'
import {fetchAllCloudAccounts, } from '@/app/api/cloud/api'
import { useApp } from '@/context/AppContext'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Switch } from "@/components/ui/switch"
import Link from 'next/link'
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
  disk_space:string
  gpu_card_details?: {
    name?: string
  }
  price_per_hour?: number
}

interface NodeData {
  projects_id: string
  location: string
  name: string
  cloud_account_id: string
  os: string
  osVersion: string
  plan: string
  image: string
  commitmment: string
  sshKeys: { key: string; isVisible: boolean }[];
  volumes: Array<{ name: string; size: string }>
  securityRules: Array<{ type: string; port: string; protocol: string; ipAddresses: string; allowed: boolean }>
}

interface NodeCreationFormProps {
  initialData?: NodeData
  isEditMode?: boolean
}

export default function NodeCreationForm({ initialData, isEditMode = false }: NodeCreationFormProps) {
  const [formState, setFormState] = useState<NodeData>({
    projects_id: initialData?.projects_id || '',
    location: initialData?.location || '',
    cloud_account_id: initialData?.cloud_account_id || '',
    name: initialData?.name || '',
    os: initialData?.os || '',
    osVersion: initialData?.osVersion || '',
    plan: initialData?.plan || '',
    image: initialData?.image || '',
    commitmment: initialData?.commitmment || '',
    sshKeys: initialData?.sshKeys || [{ key: '', isVisible: false }],
    volumes: initialData?.volumes || [],
    securityRules: initialData?.securityRules || [],
  })

  const [osOptions, setOSOptions] = useState<OSOption[]>([])
  const [osVersions, setOSVersions] = useState<string[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(false) 
  const [loadingAccounts, setLoadingAccounts] = useState(false) 
  const [loadingOs, setLoadingOs] = useState(false) 
  const [loadingPlans, setLoadingPlans] = useState(false) 
  const [loadingPrice, setLoadingPrice] = useState(false) 
  const [price, setPrice] = useState([]) 
  const [accounts, setAccounts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([{id:"Delhi", name:"Delhi", provider:"e2e"},{id:"Mumbai", name:"Mumbai", provider:"e2e"},{id:"centralindia", name:"Central India", provider:"azure"}]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const { auth,node_page_status } = useApp()
  const router = useRouter()
  const [error, setError] = useState('')

  function capitalizeFirstCharacter(provider) {
    if (provider === "e2e") {
      return provider;
    }
  
    return provider
      .split('')
      .map((char, index) => (index === 0 ? char.toUpperCase() : char))
      .join('');
  }

  useEffect(()=>{
    console.log("formState",formState)
  },[formState])

  useEffect(()=>{
    const fetchData = async () => {
      if (!auth ) return
      try {
        setLoadingProjects(true)
        const data = await getAllProjects(auth)
        setProjects(data.data.projects)
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      }
      setLoadingProjects(false)
    }
    fetchData()
  },[auth])

  useEffect(() => {
    const fetchData = async () => {
      if (!auth ) return
      try {
        setLoadingOs(true)
        const data = await fetchOSOptions(auth, formState.cloud_account_id, formState.location)
        setOSOptions(data)
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      }
      setLoadingOs(false)
    }
    fetchData()
  }, [ formState.location])
  
  useEffect(()=>{
    console.log("plans",plans)
  },[plans])

  useEffect(() => {
    const selectedOSOption = osOptions.find(os => os.name === formState.os)
    setOSVersions(selectedOSOption?.version || [])
  }, [formState.os, osOptions])

  const fetchAvailablePlans = async () => {
    if (!formState.os || !formState.osVersion || !formState.location || !formState.cloud_account_id) return
    setLoadingPlans(true) 
    try {
      const plansData = await fetchPlans(auth, formState.os, formState.osVersion, formState.location, formState.cloud_account_id)
      setPlans(plansData.data.plans)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    } finally {
      setLoadingPlans(false) 
    }
  }

  useEffect(() => {
    fetchAvailablePlans()
}, [formState.os, formState.osVersion, auth])

  const fetchPriceData = async () => {
    if (!formState.os || !formState.osVersion || !formState.osVersion || !formState.plan) return
    setLoadingPrice(true) 
    try {
      const plansData = await fetchPrice(auth, formState.os, formState.osVersion, formState.location, formState.cloud_account_id,formState.plan)
      setPrice(plansData.data.price)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    } finally {
      setLoadingPrice(false) 
    }
  }
  
  useEffect(() => {
    fetchPriceData()
}, [ formState.plan])

  useEffect(() => {
    console.log("formState updated:", formState)
  }, [formState])


    
  useEffect(() => {
    console.log("Cloud Acounts:", accounts)
  }, [accounts])


  useEffect(() => {
    async function loadCloudAccounts() {     
      try {
        setLoadingAccounts(true)
        const accounts = await fetchAllCloudAccounts(auth);
        setAccounts(accounts?.data?.cloud_accounts);
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      } finally {
        setLoadingAccounts(false)
      }
    }
    console.log("auth",auth)
    if(auth){
      loadCloudAccounts();
    }
  }, [auth]);
  

  const updateFormState = (field: keyof NodeData, value) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {

    console.log('node_page_status' ,node_page_status)
    if(node_page_status !== false){

    
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
      project_id: formState.projects_id.toString(),
      ssh_keys: formState.sshKeys.map(key => key.key),
      plan: formState.plan,
      image: formState.image,
      volumes: formState.volumes,
      security_rules: formState.securityRules,
      location:formState.location,
      cloud_account_id:formState.cloud_account_id
    }

    const provider = accounts && accounts.find((p)=>p.id === formState.cloud_account_id)?.provider || ""
    apiData.image = provider === "azure" ? formState.osVersion : formState.image;
    console.log("API Data:", JSON.stringify(apiData, null, 2))
    try {
      setLoading(true)
      const result = await createNode(auth, apiData)
      console.log('Node created successfully:', result)
      router.push('/dashboard/projects')
    } catch (error) {
      console.error('Failed to create node:', error)
    } finally {
      setLoading(false)
    }

  }
  }

  const findplan = (plans: Plan[], value: string) => {
    return plans.find((plan) => plan.id === value)
  }

  const addSSHKey = () => {
    setFormState(prev => ({ ...prev, sshKeys: [...prev.sshKeys, { key: '', isVisible: false }] }));
  };

  const removeSSHKey = (index: number) => {
    setFormState(prev => ({ ...prev, sshKeys: prev.sshKeys.filter((_, i) => i !== index) }));
  };

  const updateSSHKey = (index: number, value: string) => {
    setFormState(prev => {
      const newSSHKeys = [...prev.sshKeys];
      newSSHKeys[index] = { ...newSSHKeys[index], key: value };
      return { ...prev, sshKeys: newSSHKeys };
    });
  };

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
    return (
      <div className=" items-center justify-center gap-2  w-[full] ">

        {plan.cpu && plan.cpu_type && (
          <span className="inline-flex items-center min-w-[80px] px-2.5 py-0.5 rounded-full text-xs font-medium ">
            {plan.cpu} {plan.cpu_type}
          </span>
        )}

      
        {plan.ram && (
          <span className="inline-flex items-center px-2.5 min-w-[140px]  py-0.5 rounded-full text-xs font-medium ">
            {plan.ram} GB Memory
          </span>
        )}
        
  
        {plan.disk_space && (
          <span className="inline-flex items-center px-2.5 min-w-[70px] py-0.5 rounded-full text-xs font-medium ">
            {plan.disk_space} GB
          </span>
        )}

        {plan.plan && plan.plan && (
          <span className="inline-flex items-center min-w-[200px] px-2.5 py-0.5 rounded-full text-xs font-medium ">
            {plan.plan}
          </span>
        )}
        
        {plan.gpu_card_details && Object.keys(plan.gpu_card_details).length > 0 && plan.gpu_card_details.name && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
            {plan.gpu_card_details.name}
          </span>
        )}
      </div>
    );
  };
  
  
  
  const formatPrice = (price) => {
    if (!price?.currency || !price?.price || !price?.unit) {
      return '';
    }
  
    const unitDisplay = price.unit === 'hour' ? 'hourly' : 
                        price.unit === 'year' ? 'yearly' : 
                        price.unit === 'month' ? 'monthly' : 
                        price.unit;
  
    return `${price.price} ${price.currency} (${unitDisplay})`;
  };
  


  useEffect(() => {
    console.log("accountsssss",formState.cloud_account_id )
    if(formState.cloud_account_id){
    const selectedAccount = accounts && accounts.find(cloud_account_id => cloud_account_id.id === formState.cloud_account_id);
    console.log("selectedAccount",selectedAccount)
    if (selectedAccount) {
      const filtered = locations.filter(location => location.provider === selectedAccount.provider);
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }

  }, [formState.cloud_account_id]);

  const handleAccountChange = (value) => {
    const accountId= accounts.find((p)=>p.name === value).id || ""
    setFormState(prev => ({
      ...prev,
      cloud_account_id: accountId,
      location: '' ,
      os:"",
      osVersion:"",
      plan:"",
      commitmment:""
    }));
    setOSOptions([])
    setPlans([])
    setOSVersions([])
    setPrice([])
  };

  const handleProjectChange = (value) => {
    const projects_id= projects.find((p)=>p.name === value).id || ""
    const projectName = projects.find((p)=>p.id === projects_id).name || ""
    console.log("projectName found",{value:value,id:projects_id,accounts:accounts, accountName: projectName})
    setFormState(prev => ({
      ...prev,
      projects_id: projects_id,
    }));
  };

  const handleLocationChange = (value) => {
    setFormState(prev => ({
      ...prev,
      location: value,
      os:"",
      osVersion:"",
      plan:"",
      commitmment:""
    }));
    setOSOptions([])
    setPlans([])
    setOSVersions([])
    setPrice([])
  };

  const handleOsOptionsChange = (value) => {
    setFormState(prev => ({
      ...prev,
      os: value,
      osVersion:"",
      plan:"",
      commitmment:""
    }));
    setPlans([])
    setOSVersions([])
    setPrice([])
  };


  const handleOsVersionChange = (value) => {
    setFormState(prev => ({
      ...prev,
      osVersion:value,
      plan:"",
      commitmment:""
    }));
    setPlans([])
    setPrice([])
  };

  const handlePlanChange = (value: string) => {
    const selectedPlan = findplan(plans, value)
    if (selectedPlan) {
      setFormState(prev => ({
        ...prev,
        plan: selectedPlan.plan,
        image: selectedPlan.image,
        commitmment:""
      }))
      setPrice([])
    }
  }

  const toggleVisibility = (index: number) => {
    setFormState(prev => ({
      ...prev,
      sshKeys: prev.sshKeys.map((key, i) => 
        i === index ? { ...key, isVisible: !key.isVisible } : key
      )
    }));
  };
  useEffect(() => {
    console.log("accounts",accounts)
  }, [accounts]);

    // prefetch routes for faster navigation
    useEffect(() => {
      router.prefetch('/dashboard/nodes');
    }, [router]);

  return (
    <div className=' bg-neutral-100 lg:min-h-screen min-h-[92dvh]   flex justify-center '>
      <form   className="w-full max-w-2xl mx-auto lg:mt-[5vh]">
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

            <div className='space-y-2'>
                <label htmlFor="project-id" className="pl-2 text-sm font-medium ">
                  Select Project *
                </label>
              <div className='flex gap-2'>
              <Select 
                  value={projects && projects.find((p)=>p.id === formState.projects_id)?.name || ""}
                  onValueChange={handleProjectChange}
                >
                  <SelectTrigger>
                  {loadingProjects ? (
                      <div className="flex items-center">
                        <CircularProgress size={16} className="mr-2" />
                        Loading Projects...
                      </div>
                    ) : (
                    <SelectValue placeholder="Select Project " />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {projects && projects.length > 0 ? projects.map((project) => (
                      <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                    )): <SelectItem value="no-project-available">No projects Available</SelectItem>}
                  </SelectContent>
                </Select>
                <Button 
                variant="outline" 
                size="icon" 
                asChild
                className="flex-shrink-0"
              >
                <Link href="/create/project">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add project</span>
                </Link>
              </Button>
              </div>
              </div>

            <div className='space-y-2'>
                <label htmlFor="cloud_account" className="pl-2 text-sm font-medium ">
                  Select Cloud Account*
                </label>
              <div className='flex gap-2'>
                
              <Select 
                value={accounts && accounts.find((p)=>p.id === formState.cloud_account_id)?.name || ""}
                onValueChange={handleAccountChange}
              >
                <SelectTrigger>
                {loadingAccounts ? (
                      <div className="flex items-center">
                        <CircularProgress size={16} className="mr-2" />
                        Loading Accounts...
                      </div>
                    ) : (
                  <SelectValue placeholder="Select Cloud Account" />
                    )}
                </SelectTrigger>
                <SelectContent>
                  {accounts && accounts.length >0 ? accounts.map((cloud_account_id) => (
                    <SelectItem key={cloud_account_id.name} value={cloud_account_id.name}>{cloud_account_id.name} - {capitalizeFirstCharacter(cloud_account_id.provider)}</SelectItem>
                  )):<SelectItem value="no-account-available">No Account Available</SelectItem>}
                </SelectContent>
              </Select>
                <Button 
                variant="outline" 
                size="icon" 
                asChild
                className="flex-shrink-0"
              >
                <Link href="/create/connect-account">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Connect Account</span>
                </Link>
              </Button>
              </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor="cloud_account" className="pl-2 text-sm font-medium ">
                  Select Location*
                </label>
              <div className='flex gap-2'>
              <Select 
                value={formState.location}
                onValueChange={handleLocationChange}
                disabled={!formState.cloud_account_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {filteredLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="os">Operating System *</Label>
                <Select 
                  onValueChange={handleOsOptionsChange} 
                  value={formState.os} 
                  required
                  disabled={osOptions && osOptions.length === 0} 
                >
                  <SelectTrigger id="os" className="max-w-full">
                  {loadingOs ? (
                      <div className="flex items-center">
                        <CircularProgress size={16} className="mr-2" />
                        Loading Os Options ...
                      </div>
                    ) : (
                    <SelectValue placeholder="Select OS" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {osOptions.length >0 ?osOptions.map((os) => (
                      <SelectItem key={os.name} value={os.name}>{os.name}</SelectItem>
                    )): <SelectItem value="no-osOption-available">No Os Options Available</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="os-version">OS Version *</Label>
                <Select 
                  onValueChange={handleOsVersionChange} 
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
                  disabled={plans && plans.length === 0}
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
                    {plans.length>0 ? plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id} className='flex  border-b'>{formatPlanName(plan)}</SelectItem>
                    )): <SelectItem value="no-plan-available">No Plans Available</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-commitment">Reservation *</Label>
                <Select 
                  onValueChange={(value) => updateFormState('commitmment', value)} 
                  value={formState.commitmment} 
                  required
                  disabled={price && price.length === 0}
                >
                  <SelectTrigger id="plan-commitment" className="max-w-full">
                  {loadingPrice ? (
                      <div className="flex items-center">
                        <CircularProgress size={16} className="mr-2" />
                        Loading Price Options ...
                      </div>
                    ) : (
                    <SelectValue placeholder="Select commitment" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {price && price.length > 0 ? price.map((price) => (
                        <SelectItem key={price.unit} value={price.unit}>{formatPrice(price)}</SelectItem>
                      )): <SelectItem value="no-price-available">No Price Plans Available</SelectItem>}
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
                        <Input
                          autoComplete='new-password'
                          type={sshKey.isVisible ? "text" : "password"}
                          placeholder="Paste your SSH public key here"
                          value={sshKey.key}
                          onChange={(e) => updateSSHKey(index, e.target.value)}
                          className="flex-grow mr-2 no-scrollbar"
                        />
                       <div className='flex gap-1 items-center'>
                       <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => toggleVisibility(index)}
                          className="p-2 mr-2"
                        >
                          {sshKey.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeSSHKey(index)}
                          className="p-2 mr-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                       </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addSSHKey} className="mt-2">
                      Add SSH Key
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              </Accordion>

              {/* Volumes */}
              <Accordion type="single" collapsible className="w-full border rounded-md bg-white">

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
              </Accordion>

              {/* Security Rules */}
              <Accordion type="single" collapsible className="w-full border rounded-md bg-white">

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
            <Button variant="outline" onClick={() => router.push('/dashboard/projects')}>Cancel</Button>
            <Button 
              disabled={loading} 
              className={`bg-[#2563EB] text-white ${loading ? 'opacity-50' : ''}`}
              onClick={handleSubmit}
            >
              {loading ? 'Creating...' : 'Create Node'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

