interface Plan {
  id: string;
  ram: string;
  cpu: number;
  plan: string;
  price_per_month: number;
}

export function extractRamOptions(plans: Plan[]): string[] {
  return Array.from(new Set(plans.map(plan => plan.ram)))
    .sort((a, b) => parseFloat(a) - parseFloat(b));
}

export function getCpuOptionsForRam(plans: Plan[], selectedRam: string): number[] {
  return Array.from(new Set(plans
    .filter(plan => plan.ram === selectedRam)
    .map(plan => plan.cpu)))
    .sort((a, b) => a - b);
}

export function filterPlans(plans: Plan[], selectedRam: string, selectedCpu: number | null): Plan[] {
  return plans.filter(plan => 
    plan.ram === selectedRam && 
    (selectedCpu === null || plan.cpu === selectedCpu)
  );
}
