'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Eye, EyeOff, FolderOpen, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { fetchOSOptions, fetchPlans, createNode, fetchPrice } from '@/app/(ProtectedRoutes)/api/nodes/api'
import { getAllProjects } from '@/app/(ProtectedRoutes)/api/projects/api'
import { fetchAllCloudAccounts } from '@/app/(ProtectedRoutes)/api/cloud/api'
import { useApp } from '@/context/AppContext'
import { CircularProgress } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { Switch } from "@/components/ui/switch"
import Link from 'next/link'
import { getOneProject } from '@/app/(ProtectedRoutes)/api/projects/api'
import azureIcon from "@/assets/azure.svg";
import gcpIcon from "@/assets/gcp.svg";
import awsIcon from "@/assets/aws.svg";
import Image from 'next/image'
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
  disk_space: string
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
  sshKeys: { key: string; isVisible: boolean }[]
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
  const [projectData, setProjectData] = useState([])
  const [loadingProject, setLoadingProject] = useState(true)
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
  const [accounts, setAccounts] = useState([])
  const [projects, setProjects] = useState([])
  const [locations, setLocations] = useState([
    { id: "Delhi", name: "Delhi", provider: "e2e" },
    { id: "Mumbai", name: "Mumbai", provider: "e2e" },
    { id: "centralindia", name: "Central India", provider: "azure" }
  ])
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  const nodeID = searchParams.get('node-id')
  const [filteredLocations, setFilteredLocations] = useState([])
  const { auth } = useApp()
  const router = useRouter()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof NodeData]: boolean }>({
    projects_id: false,
    location: false,
    name: false,
    cloud_account_id: false,
    os: false,
    osVersion: false,
    plan: false,
    image: false,
    commitmment: false,
    sshKeys: false,
    volumes: false,
    securityRules: false,
  })


  const areAllRequiredFieldsFilled = () => {
    return (
      formState.name !== '' &&
      // formState.projects_id !== '' &&
      formState.cloud_account_id !== '' &&
      formState.location !== '' &&
      formState.os !== '' &&
      formState.osVersion !== '' &&
      formState.plan !== '' &&
      // formState.commitmment !== '' &&
      formState.sshKeys.length > 0 &&
      formState.sshKeys.every(key => key.key.trim() !== '')
    )
  }

  function capitalizeFirstCharacter(provider: string) {
    if (provider === "e2e") {
      return provider
    }
    return provider
      .split('')
      .map((char, index) => (index === 0 ? char.toUpperCase() : char))
      .join('')
  }

  useEffect(() => {
    console.log("formState", formState)
  }, [formState])

  useEffect(() => {
    const fetchData = async () => {
      if (!auth) return
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
  }, [auth])

  useEffect(() => {
    const fetchData = async () => {
      if (!auth) return
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
  }, [formState.location])

  useEffect(() => {
    console.log("plans", plans)
  }, [plans])

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
    if (!formState.os || !formState.osVersion || !formState.location || !formState.plan) return
    setLoadingPrice(true)
    try {
      const plansData = await fetchPrice(auth, formState.os, formState.osVersion, formState.location, formState.cloud_account_id, formState.plan)
      setPrice(plansData.data.price)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    } finally {
      setLoadingPrice(false)
    }
  }

  useEffect(() => {
    fetchPriceData()
  }, [formState.plan])

  useEffect(() => {
    console.log("Cloud Accounts:", accounts)
  }, [accounts])

  useEffect(() => {
    async function loadCloudAccounts() {
      try {
        setLoadingAccounts(true)
        const accounts = await fetchAllCloudAccounts(auth)
        setAccounts(accounts?.data?.cloud_accounts)
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      } finally {
        setLoadingAccounts(false)
      }
    }
    console.log("auth", auth)
    if (auth) {
      loadCloudAccounts()
    }
  }, [auth])

  const updateFormState = (field: keyof NodeData, value) => {
    setFormState(prev => ({ ...prev, [field]: value }))
    setFieldErrors(prev => ({ ...prev, [field]: false }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
      // Validate all fields
      const newFieldErrors = { ...fieldErrors }
      let hasError = false

      Object.keys(formState).forEach((key) => {
        const field = key as keyof NodeData
        if (field === 'sshKeys') {
          newFieldErrors[field] = formState[field].length === 0 || formState[field].some(key => key.key.trim() === '')
        } else if (field === 'volumes' || field === 'securityRules' || field === 'commitmment' || field === 'projects_id') {
          // These fields are optional, so we don't validate them
          newFieldErrors[field] = false
        } else {
          newFieldErrors[field] = formState[field] === ''
        }
        if (newFieldErrors[field]) hasError = true
      })

      setFieldErrors(newFieldErrors)

      if (hasError) {
        setError("Please fill in all required fields.")
        return
      }

      const apiData = {
        name: formState.name,
        project_id: projectId,
        ssh_keys: formState.sshKeys.map(key => key.key),
        plan: formState.plan,
        image: formState.image,
        volumes: formState.volumes,
        security_rules: formState.securityRules,
        location: formState.location,
        cloud_account_id: formState.cloud_account_id
      }

      const provider = accounts && accounts.find((p) => p.id === formState.cloud_account_id)?.provider || ""
      apiData.image = provider === "azure" ? formState.osVersion : formState.image

      console.log("API Data:", JSON.stringify(apiData, null, 2))
      try {
        setLoading(true)
        const result = await createNode(auth, apiData)
        console.log('Node created successfully:', result)
        router.push(`/project/${projectId}?viewType=nodes`)
      } catch (error) {
        console.error('Failed to create node:', error)
        setError('Failed to create node. Please try again.')
      } finally {
        setLoading(false)
      }
    // }
  }

  const findplan = (plans: Plan[], value: string) => {
    return plans.find((plan) => plan.id === value)
  }

  const addSSHKey = () => {
    setFormState(prev => ({ ...prev, sshKeys: [...prev.sshKeys, { key: '', isVisible: false }] }))
  }

  const removeSSHKey = (index: number) => {
    setFormState(prev => ({ ...prev, sshKeys: prev.sshKeys.filter((_, i) => i !== index) }))
  }

  const updateSSHKey = (index: number, value: string) => {
    setFormState(prev => {
      const newSSHKeys = [...prev.sshKeys]
      newSSHKeys[index] = { ...newSSHKeys[index], key: value }
      return { ...prev, sshKeys: newSSHKeys }
    })
    setFieldErrors(prev => ({ ...prev, sshKeys: false }))
  }

    const fethcProjectData = async () => {
      if (!auth) return
      try {
        setLoadingProject(true)
        const data = await getOneProject(auth,projectId)
        setProjectData(data.data)
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      }
      setLoadingProject(false)
    }
  
    useEffect(() => {
      if(projectId)
        fethcProjectData()
    }, [auth])


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
    return size * 0.1 // Assuming $0.1 per GB
  }

  const formatPlanName = (plan: Plan) => {
    return (
      <div className="items-center justify-center gap-2 w-[full]">
        {plan.cpu && plan.cpu_type && (
          <span className="inline-flex items-center min-w-[80px] px-2.5 py-0.5 rounded-full text-xs font-medium">
            {plan.cpu} {plan.cpu_type}
          </span>
        )}
        {plan.ram && (
          <span className="inline-flex items-center px-2.5 min-w-[140px] py-0.5 rounded-full text-xs font-medium">
            {plan.ram} GB Memory
          </span>
        )}
        {plan.disk_space && (
          <span className="inline-flex items-center px-2.5 min-w-[70px] py-0.5 rounded-full text-xs font-medium">
            {plan.disk_space} GB
          </span>
        )}
        {plan.plan && (
          <span className="inline-flex items-center min-w-[200px] px-2.5 py-0.5 rounded-full text-xs font-medium">
            {plan.plan}
          </span>
        )}
        {plan.gpu_card_details && Object.keys(plan.gpu_card_details).length > 0 && plan.gpu_card_details.name && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {plan.gpu_card_details.name}
          </span>
        )}
      </div>
    )
  }

  const formatPrice = (price) => {
    if (!price?.currency || !price?.price || !price?.unit) {
      return ''
    }

    const unitDisplay = price.unit === 'hour' ? 'hourly' :
                        price.unit === 'year' ? 'yearly' :
                        price.unit === 'month' ? 'monthly' :
                        price.unit

    return `${price.price} ${price.currency} (${unitDisplay})`
  }

  useEffect(() => {
    console.log("accountsssss", formState.cloud_account_id)
    if (formState.cloud_account_id) {
      const selectedAccount = accounts && accounts.find((cloud_account) => cloud_account.id === formState.cloud_account_id)
      console.log("selectedAccount", selectedAccount)
      if (selectedAccount) {
        const filtered = locations.filter(location => location.provider === selectedAccount.provider)
        setFilteredLocations(filtered)
      } else {
        setFilteredLocations([])
      }
    }
  }, [formState.cloud_account_id])

  const handleAccountChange = (value: string) => {
    const accountId = accounts.find((p) => p.name === value)?.id || ""
    setFormState(prev => ({
      ...prev,
      cloud_account_id: accountId,
      location: '',
      os: "",
      osVersion: "",
      plan: "",
      commitmment: ""
    }))
    setOSOptions([])
    setPlans([])
    setOSVersions([])
    setPrice([])
    setFieldErrors(prev => ({ ...prev, cloud_account_id: false }))
  }

  const handleProjectChange = (value: string) => {
    const projects_id = projects.find((p) => p.name === value)?.id || ""
    setFormState(prev => ({
      ...prev,
      projects_id: projects_id,
    }))
    setFieldErrors(prev => ({ ...prev, projects_id: false }))
  }

  const handleLocationChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      location: value,
      os: "",
      osVersion: "",
      plan: "",
      commitmment: ""
    }))
    setOSOptions([])
    setPlans([])
    setOSVersions([])
    setPrice([])
    setFieldErrors(prev => ({ ...prev, location: false }))
  }

  const handleOsOptionsChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      os: value,
      osVersion: "",
      plan: "",
      commitmment: ""
    }))
    setPlans([])
    setOSVersions([])
    setPrice([])
    setFieldErrors(prev => ({ ...prev, os: false }))
  }

  const handleOsVersionChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      osVersion: value,
      plan: "",
      commitmment: ""
    }))
    setPlans([])
    setPrice([])
    setFieldErrors(prev => ({ ...prev, osVersion: false }))
  }

  const handlePlanChange = (value: string) => {
    const selectedPlan = findplan(plans, value)
    if (selectedPlan) {
      setFormState(prev => ({
        ...prev,
        plan: selectedPlan.plan,
        image: selectedPlan.image,
        commitmment: ""
      }))
      setPrice([])
    }
    setFieldErrors(prev => ({ ...prev, plan: false }))
  }

  const toggleVisibility = (index: number) => {
    setFormState(prev => ({
      ...prev,
      sshKeys: prev.sshKeys.map((key, i) =>
        i === index ? { ...key, isVisible: !key.isVisible } : key
      )
    }))
  }

  const handleAddAccount = () => {
    window.open('/create/connect-account', '_ blank')
  }

  const handleAddProject = () => {
    window.open('/create/project', '_ blank')
  }

  const refreshAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const accounts = await fetchAllCloudAccounts(auth)
      setAccounts(accounts?.data?.cloud_accounts)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoadingAccounts(false)
    }
  }

  const refreshProjects = async () => {
    try {
      setLoadingProjects(true)
      const projectsData = await getAllProjects(auth)
      setProjects(projectsData?.data?.projects)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  const getProviderIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case 'azure':
        return azureIcon;
      case 'gcp':
        return gcpIcon;
      case 'aws':
        return awsIcon;
      case 'e2e':
        return 'https://res.cloudinary.com/dy8hx2xrj/image/upload/v1736699109/e2eicon_oulyzm.png';
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log("accounts", accounts)
  }, [accounts])

  useEffect(() => {
    router.prefetch('/dashboard/projects')
    router.prefetch(`/project/${projectId}?viewType=nodes`)
  }, [router])

  return (
    <div className='bg-neutral-100 lg:min-h-screen min-h-[92dvh] flex justify-center'>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto lg:mt-[5vh]">
        <Card className="bg-neutral-100 shadow-none border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-lg lg:text-2xl font-semibold">{isEditMode ? 'Edit Node' : 'Create a New Node'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
         {projectId &&  <div className="">
          <label htmlFor="service-name" className="text-sm pl-2 font-medium text-[#374151]">
             Project*
          </label>
          {!loadingProject ? 
          <div className="relative">
            <Input
              disabled={true}
              id="service-name"
              name="name"
              // @ts-expect-error build
              value={projectData.name}
              // onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter service name"
              className="max-w-full"
            />
            <div className='flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5'>
              <FolderOpen size={18} />
            </div>
          </div>
          : <div className="flex items-center border bg-white p-2 rounded-md text-sm text-gray-500">
              <CircularProgress size={16} className="mr-2 " />
              Loading Project Details..
            </div> }
        </div>}

            {!projectId && <div className='space-y-2'>
              <label htmlFor="project-id" className="pl-2 text-sm font-medium">
                Select Project *
              </label>
              <div className='flex gap-2'>
                <Select
                  value={projects && projects.find((p) => p.id === formState.projects_id)?.name || ""}
                  onValueChange={handleProjectChange}
                >
                  <SelectTrigger className={fieldErrors.projects_id ? 'border-red-500' : ''}>
                    {loadingProjects ? (
                      <div className="flex items-center">
                        <CircularProgress size={16} className="mr-2" />
                        Loading Projects...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select Project" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {projects && projects.length > 0 ? projects.map((project) => (
                      <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                    )) : <SelectItem value="no-project-available">No projects Available</SelectItem>}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={handleAddProject}
                >
                  <div>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add project</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={refreshProjects}
                  className="p-2"
                >
                  <RefreshCw size={16} />
                </Button>
              </div>
            </div>}

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter node name"
                required
                value={formState.name}
                onChange={(e) => updateFormState('name', e.target.value)}
                className={`max-w-full placeholder:text-black text-sm ${fieldErrors.name ? 'border-red-500' : ''}`}
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor="cloud_account" className="pl-2 text-sm font-medium">
                Select Cloud Account *
              </label>
              <div className='flex gap-2'>
                <Select
                  value={accounts && accounts.find((p) => p.id === formState.cloud_account_id)?.name || ""}
                  onValueChange={handleAccountChange}
                >
                  <SelectTrigger className={fieldErrors.cloud_account_id ? 'border-red-500' : ''}>
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
                    {accounts && accounts.length > 0 ? accounts.map((cloud_account) => (
                      <SelectItem key={cloud_account.name} value={cloud_account.name}>
                        <div className='flex gap-3 items-center'>
                          {getProviderIcon(cloud_account.provider) && (
                              <Image
                                src={getProviderIcon(cloud_account.provider)}
                                alt={cloud_account.provider}
                                width={40}
                                height={40}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                        {`${cloud_account.name}`}
                        </div>
                        </SelectItem>
                    )) : <SelectItem value="no-account-available">No Account Available</SelectItem>}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={handleAddAccount}
                >
                  <div>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Connect Account</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={refreshAccounts}
                  className="p-2"
                >
                  <RefreshCw size={16} />
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <label htmlFor="cloud_account" className="pl-2 text-sm font-medium">
                Select Location *
              </label>
              <div className='flex gap-2'>
                <Select
                  value={formState.location}
                  onValueChange={handleLocationChange}
                  disabled={!formState.cloud_account_id}
                >
                  <SelectTrigger className={fieldErrors.location ? 'border-red-500' : ''}>
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
                  <SelectTrigger id="os" className={`max-w-full ${fieldErrors.os ? 'border-red-500' : ''}`}>
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
                    {osOptions.length > 0 ? osOptions.map((os) => (
                      <SelectItem key={os.name} value={os.name}>{os.name}</SelectItem>
                    )) : <SelectItem value="no-osOption-available">No Os Options Available</SelectItem>}
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
                  <SelectTrigger id="os-version" className={`max-w-full ${fieldErrors.osVersion ? 'border-red-500' : ''}`}>
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
                  <SelectTrigger id="plan" className={`max-w-full ${fieldErrors.plan ? 'border-red-500' : ''}`}>
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
                    {plans.length > 0 ? plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id} className='flex border-b'>{formatPlanName(plan)}</SelectItem>
                    )) : <SelectItem value="no-plan-available">No Plans Available</SelectItem>}
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
                  <SelectTrigger id="plan-commitment" className={`max-w-full ${fieldErrors.commitmment ? 'border-red-500' : ''}`}>
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
                    )) : <SelectItem value="no-price-available">No Price Plans Available</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full border rounded-md bg-white">
              <AccordionItem value="ssh-keys" className="border-b-0">
                <AccordionTrigger className="px-4 py-2">SSH Keys* </AccordionTrigger>
                <AccordionContent className="px-4 py-2">
                  <div className="space-y-4">
                    {formState.sshKeys.map((sshKey, index) => (
                      <div key={index} className='flex items-center'>
                        <Input
                          autoComplete='new-password'
                          type={sshKey.isVisible ? "text" : "password"}
                          placeholder="Paste your SSH public key here"
                          value={sshKey.key}
                          onChange={(e) => updateSSHKey(index, e.target.value)}
                          className={`flex-grow mr-2 no-scrollbar ${fieldErrors.sshKeys ? 'border-red-500' : ''}`}
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
                    <Button type="button" variant="outline" onClick={addVolume} className="mt-2">
                      Add Volume
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Security Rules */}
            <Accordion type="single" collapsible className="w-full border rounded-md bg-white">
              <AccordionItem value="security-rules" disabled>
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
              type="submit"
              disabled={loading || !areAllRequiredFieldsFilled()} 
              className={`bg-[#2563EB] text-white ${loading || !areAllRequiredFieldsFilled() ? 'opacity-50' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Node'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

