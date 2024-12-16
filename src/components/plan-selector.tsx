'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { extractRamOptions, getCpuOptionsForRam, filterPlans } from '@/utils/planUtils'

export default function PlanSelector({planData, setPlan}) {
  const [selectedRam, setSelectedRam] = useState<string>('');
  const [selectedCpu, setSelectedCpu] = useState<number | null>(null);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [cpuOptions, setCpuOptions] = useState<number[]>([]);
  const ramOptions = extractRamOptions(planData);

  useEffect(()=>{
    if(filteredPlans[0]){
      console.log("filteredPlans",filteredPlans,filteredPlans[0])
      setPlan(filteredPlans[0])
    }
    },[filteredPlans])

  useEffect(() => {
    if (selectedRam) {
      const cpuOpts = getCpuOptionsForRam(planData, selectedRam);
      setCpuOptions(cpuOpts);
      setSelectedCpu(null);
      setFilteredPlans(filterPlans(planData, selectedRam, null));
    } else {
      setCpuOptions([]);
      setFilteredPlans([]);
    }
  }, [selectedRam]);

  useEffect(() => {
    if (selectedRam && selectedCpu !== null) {
      setFilteredPlans(filterPlans(planData, selectedRam, selectedCpu));
    }
  }, [selectedCpu]);

  const handleRamChange = (value: string) => {
    setSelectedRam(value);
    setSelectedCpu(null);
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Select Your Plan</h1> */}
      <div className="flex space-x-4 mb-4">
        <Select onValueChange={handleRamChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select RAM" />
          </SelectTrigger>
          <SelectContent>
            {ramOptions.map((ram) => (
              <SelectItem key={ram} value={ram}>{ram} GB</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          onValueChange={(value) => setSelectedCpu(Number(value))}
          disabled={!selectedRam}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select CPU" />
          </SelectTrigger>
          <SelectContent>
            {cpuOptions.map((cpu) => (
              <SelectItem key={cpu} value={cpu.toString()}>{cpu} vCPU</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.plan}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>RAM: {plan.ram} GB</p>
              <p>CPU: {plan.cpu} vCPU</p>
              <p>Price: ₹{plan.price_per_month}/month</p>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  )
}

