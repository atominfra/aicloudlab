'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCloudAccount } from '@/app/(PrivateRoutes)/api/cloud/api';
import { useApp } from '@/context/AppContext';
import { ToggleableInput } from '@/components/ToggleableInput';

export default function AzurePage() {
  const { auth } = useApp();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apiData = {
        name,
        provider: 'azure',
        credentials: {
          tenant_id: tenantId,
          client_id: clientId,
          client_secret: clientSecret,
          subscription_id: subscriptionId,
        },
      };

      const res = await createCloudAccount(auth, apiData);

      console.log('Azure account connected:', res);
      router.push('/dashboard/accounts');
    } catch (error) {
      console.error(error);
      setError('An error occurred while creating the cluster');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='lg:p-6 bg-neutral-100 lg:h-screen flex justify-center h-[92dvh]'>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full">
        <div className="text-center mb-8 relative">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">Microsoft Azure</h1>
        </div>

        <Card className="border-none shadow-none">
          <CardContent>
            <div className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenant_id">Tenant ID</Label>
                  <ToggleableInput
                    id="tenant_id"
                    name="tenant_id"
                    placeholder="Enter Tenant ID"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_id">Client ID</Label>
                  <ToggleableInput
                    id="client_id"
                    name="client_id"
                    placeholder="Enter Client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_secret">Client Secret</Label>
                  <ToggleableInput
                    id="client_secret"
                    name="client_secret"
                    placeholder="Enter Client Secret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subscription_id">Subscription ID</Label>
                  <ToggleableInput
                    id="subscription_id"
                    name="subscription_id"
                    placeholder="Enter Subscription ID"
                    value={subscriptionId}
                    onChange={(e) => setSubscriptionId(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className='w-full text-end'>
                  <Button type="submit" className="bg-[#2563EB]" disabled={isLoading}>
                    {isLoading ? 'Connecting...' : 'Connect Account'}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
