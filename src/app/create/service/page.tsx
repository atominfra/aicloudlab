'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Eye, EyeOff, Trash2, GalleryVerticalEnd, Router, RefreshCw, Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface EnvVariable {
  key: string
  value: string
  isVisible: boolean
}

interface RegistryCredential {
  id: number;
  name: string;
}

interface CreateServiceProps {
  serviceId?: string;
}

const CreateService: React.FC<CreateServiceProps> = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const serviceId = searchParams.get('id')

  const { auth } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    target_port:'',
    memoryLimit: '',
    cluster: '',
    cpuLimit: '',
    registryCredential: '',
    replicas: '',
    env_variables: [{ key: '', value: '', isVisible: false }] as EnvVariable[]
  })
  const [registries, setRegistries] = useState<RegistryCredential[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [isNameTouched, setIsNameTouched] = useState(false)  
  const [customMemoryLimit, setCustomMemoryLimit] = useState('')
  const [customCpuLimit, setCustomCpuLimit] = useState('')
  const [customReplicas, setCustomReplicas] = useState('')
  const [clusters, setClusters] = useState([{name:'default (AWS)'}]);

  useEffect(() => {
    if (serviceId) {
      // Fetch existing service details
      const fetchServiceDetails = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/deployment/${serviceId}`,{
            method:  'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Assuming you have a token in auth
            },
            // body: JSON.stringify(deploymentData)
          });
          const res =  await response.json();
          const data = res.data.deployment
          console.log("Data",data)
          setFormData({
            name: data.name,
            cluster: data.cluster,
            image: data.image_url,
            target_port: data.target_port,
            memoryLimit: data.mem_limit,
            cpuLimit: data.cpu_limit,
            registryCredential: data.registry_credential_id,
            replicas: data.replicas.toString(),
            env_variables: Object.keys(data.env_variables).map(key => ({
              key,
              value: data.env_variables[key],
              isVisible: false,
            })),
          });
        } catch (error) {
          setError('Failed to fetch service details');
        }
      };

      fetchServiceDetails();
    }

  }, [serviceId]);

  useEffect(() => {
     const fetchRegistries = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/registry/credential`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setRegistries(responseData.data.credentials);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch registries');
        }
      } catch (err) {
        setError('An error occurred while fetching registries');
      }
    };

    fetchRegistries();
  },[])

  
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'name' && value.trim() !== '') {
      setIsNameTouched(true)
      setError(null) 
    }
  }

  const handleEnvVariableChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const newEnvVariables = [...prev.env_variables]
      newEnvVariables[index][field] = value
      return { ...prev, env_variables: newEnvVariables }
    })
  }

  const addEnvVariable = () => {
    setFormData(prev => ({
      ...prev,
      env_variables: [...prev.env_variables, { key: '', value: '', isVisible: false }]
    }))
  }

  const removeEnvVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      env_variables: prev.env_variables.filter((_, i) => i !== index)
    }))
  }

  const handleCustomInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  const handleCustomMemoryLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d+(Mi|Gi|M|G)?$/; 
    if (value === '' || regex.test(value)) {
      setCustomMemoryLimit(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsNameTouched(true);
    setError(null);
    setIsLoading(true);
  
    if (formData.name === '') {
      setError('Please enter a name');
      setIsLoading(false);
      return;
    }

    if (formData.image === '') {
      setError('Please enter a Image');
      setIsLoading(false);
      return;
    }

    if (formData.target_port === '') {
      setError('Please enter a Port');
      setIsLoading(false);
      return;
    }

    if (formData.memoryLimit === '') {
      setError('Please enter Memory Limit');
      setIsLoading(false);
      return;
    }

    if (formData.cpuLimit === '') {
      setError('Please enter Cpu Limit');
      setIsLoading(false);
      return;
    }

    if (formData.replicas === '') {
      setError('Please enter Replicas');
      setIsLoading(false);
      return;
    }
  
  
  
    const memoryLimit = formData.memoryLimit === 'custom' ? customMemoryLimit : formData.memoryLimit;
    const memoryLimitRegex = /^\d+(Mi|Gi)$/;
  
    if (!memoryLimitRegex.test(memoryLimit)) {
      setError('Memory limit must be an integer followed by "Mi" or "Gi"');
      setIsLoading(false);
      return;
    }
  
    const deploymentData = {
      name: formData.name,
      image_url: formData.image,
      target_port: formData.target_port,
      mem_limit: memoryLimit,
      cpu_limit: formData.cpuLimit === 'custom' ? customCpuLimit : formData.cpuLimit,
      env_variables: {},
    };


    function removeEmptyStringKeys(obj) {
      if(typeof obj !== 'string') return {};
      return Object.fromEntries(
          Object.entries(obj).filter(([key]) => key !== "")

      );
  }
  
    if (formData.registryCredential) {
      // @ts-expect-error build error
      deploymentData.registry_credential_id = formData.registryCredential; 
    }
    if (formData.replicas) {
            // @ts-expect-error build error
      deploymentData.replicas = formData.replicas === 'custom' ? parseInt(customReplicas, 10) : parseInt(formData.replicas, 10)
      }
      if (formData.env_variables) {
         const newob = removeEmptyStringKeys(formData.env_variables)
        deploymentData.env_variables = newob
       }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/deployment${serviceId ? `/${serviceId}` : ''}`, {
        method: serviceId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Assuming you have a token in auth
        },
        body: JSON.stringify(deploymentData)
      });
  
      if (response.ok) {
        router.push('/dashboard/services');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create service');
      }
    } catch (err) {
      setError('An error occurred while creating the service');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      env_variables: prev.env_variables.map((variable, i) => 
        i === index ? { ...variable, isVisible: !variable.isVisible } : variable
      )
    }));
  };

  const handleAddNewCluster = () =>{
    localStorage.setItem('createServiceFormData', JSON.stringify(formData));
    window.open ('/create/cluster', '_ blank');
  }

  const handleAddNewRegistry = () => {
    localStorage.setItem('createServiceFormData', JSON.stringify(formData));
    window.open ('/create/registry', '_ blank');
  }

  const refreshRegistries = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/registry/credential`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setRegistries(responseData.data.credentials);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch registries');
      }
    } catch (err) {
      setError('An error occurred while fetching registries');
    } finally {
      setIsRefreshing(false);
    }
  };

  async function fetchClusters() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clusters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch clusters');
      }
      const data = await response.json();
      return data.clusters;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  useEffect(() => {
    async function loadClusters() {
      const fetchedClusters = await fetchClusters();
      setClusters(fetchedClusters);
    }
    loadClusters();
  }, []);

  return (
    <div className='bg-neutral-100  py-12 sm:px-6 lg:px-8  '>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full mt-4">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">{serviceId ? 'Edit Service' : 'Create New Service'}</h1>
        </div>
      </div>

      <form className="space-y-6 max-w-2xl mx-auto pb-6" onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="service-name" className="text-sm pl-2 font-medium text-[#374151]">
            Service Name*
          </label>
          <div className="relative">
            <Input
              id="service-name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter service name"
              className="max-w-full"
            />
            <div className='flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5'>
              <Router size={18} />
            </div>
          </div>
          {isNameTouched && (formData.name.includes(' ')) && (
            <p className="text-red-500 text-sm">Name can`no`t contain an underscore (_) or spaces.</p>
          )}
        </div>

        <div>
          <label htmlFor="cluster" className="pl-2 text-sm font-medium text-[#374151]">
            Select Cluster*
          </label>
        <div className='flex gap-2'>
        <Select 
            value={formData.cluster}
            onValueChange={(value) => {
              if (value === 'create_cluster') {
                handleAddNewCluster();
              } else {
                handleChange('cluster', value)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Cluster" />
            </SelectTrigger>
            <SelectContent>
              {/* {clusters.map((cluster) => (
                <SelectItem key={cluster.name} value={cluster.name}>{cluster.name}</SelectItem>
              ))} */}
              <SelectItem value="aws">Default (AWS)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
                variant="outline" 
                size="icon" 
                asChild
                className="flex-shrink-0"
              >
                <div onClick={handleAddNewCluster}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Connect Account</span>
                </div>
              </Button>
        </div>
        </div>

        <div>
          <label htmlFor="image" className="pl-2 text-sm font-medium text-[#374151]">
            Image*
          </label>
          <div className="relative">
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="Enter image link"
              className=""
            />
            <div className='flex justify-center items-center bg-white w-[30px] h-[22px] absolute right-3 top-2.5'>
              <GalleryVerticalEnd size={18} className="bg-muted" />
            </div>
          </div>
        </div>

        <div className="">
          <label htmlFor="target_port" className="pl-2 text-sm font-medium text-[#374151]">
            Port*
          </label>
          <Input
            id="target_port"
            name="target_port"
            value={formData.target_port}
            onChange={(e) => handleChange('target_port', e.target.value)}
            placeholder="Enter port"
            className=""
          />
        </div>

        <div className="">
          <label htmlFor="memory-limit" className="pl-2 text-sm font-medium text-[#374151]">
            Memory Limit(Mi/Gi)*
          </label>
          <Select 
            value={formData.memoryLimit} 
            onValueChange={(value) => {
                handleChange('memoryLimit', value)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select memory limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="512Mi">512 Mi</SelectItem>
              <SelectItem value="1024Gi">1 Gi</SelectItem>
              <SelectItem value="2048Gi">2 Gi</SelectItem>
              <SelectItem value="4096Gi">4 Gi</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {formData.memoryLimit === 'custom' && (
            <Input
              type="text"
              placeholder="Enter Custom Memory Limit (e.g., 128Mi, 1Gi)"
              value={customMemoryLimit}
              onChange={handleCustomMemoryLimitChange}
              className="mt-2"
            />
          )}
        </div>

        <div className="">
          <label htmlFor="cpu-limit" className="pl-2 text-sm font-medium text-[#374151]">
            CPU Limit*
          </label>
          <Select 
            value={formData.cpuLimit} 
            onValueChange={(value) => {
                handleChange('cpuLimit', value)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select CPU limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5 </SelectItem>
              <SelectItem value="1">1 </SelectItem>
              <SelectItem value="2">2 </SelectItem>
              <SelectItem value="4">4 </SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {formData.cpuLimit === 'custom' && (
            <Input
              type="text"
              placeholder="Enter Custom CPU Limit (e.g., 1, 2)"
              value={customCpuLimit}
              onChange={handleCustomInputChange(setCustomCpuLimit)}
              className="mt-2"
            />
          )}
        </div>

        <div className="">
          <label htmlFor="registry-credential" className="pl-2 text-sm font-medium text-[#374151]">
            Registry Credential
          </label>
          <div className="flex items-center gap-2">
            <Select 
              value={formData.registryCredential} 
              onValueChange={(value) => {
                if (value === 'add_new') {
                  handleAddNewRegistry();
                } else {
                  handleChange('registryCredential', value);
                }
              }}
              disabled={isRefreshing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select registry" />
              </SelectTrigger>
              <SelectContent>
                {registries.map((registry) => (
                  <SelectItem key={registry.id} value={registry.id.toString()}>
                    {registry.name}
                  </SelectItem>
                ))}
                <SelectItem value="add_new">Add New</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              onClick={refreshRegistries} 
              disabled={isRefreshing}
              className="p-2"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>

        <div>
          <label htmlFor="replicas" className="pl-2 text-sm font-medium text-[#374151]">
            Replicas*
          </label>
          <Select 
            value={formData.replicas} 
            onValueChange={(value) => {
                handleChange('replicas', value)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select replicas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {formData.replicas === 'custom' && (
            <Input
              type="text"
              placeholder="Enter Custom Replicas (e.g., 10, 20)"
              value={customReplicas}
              onChange={handleCustomInputChange(setCustomReplicas)}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="pl-2 text-sm font-medium text-[#374151]">
              Environment Variables
            </label>
          </div>
          <>
            {formData.env_variables.map((variable, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  placeholder="Key"
                  value={variable.key}
                  onChange={(e) => handleEnvVariableChange(index, 'key', e.target.value)}
                />
                <Input
                  type={variable.isVisible ? "text" : "password"}
                  placeholder="Value"
                  value={variable.value}
                  onChange={(e) => handleEnvVariableChange(index, 'value', e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => toggleVisibility(index)}
                  className="p-2"
                >
                  {variable.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => removeEnvVariable(index)}
                  className="p-2"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEnvVariable} className="mt-2">
              Add Variable
            </Button>
          </>
        </div>

        {error && isNameTouched && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" className="text-[14px]" onClick={() => router.push('/dashboard/services')}>Cancel</Button>
          <Button type="submit" disabled={isLoading} className="bg-[#2563EB] text-[14px]">
            {isLoading ? 'Saving...' : serviceId ? 'Update Service' : 'Deploy Service'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateService;

