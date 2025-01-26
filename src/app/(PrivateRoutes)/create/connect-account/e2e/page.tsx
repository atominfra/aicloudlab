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
import { E2ENetworksInstructions } from '@/components/e2edocs';

export default function CloudProviderForm() {
  const { auth } = useApp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [jwtToken, setJwtToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiData = {
        name,
        provider: 'e2e',
        providerText: 'E2E Networks',
        credentials: {
          api_key: apiKey,
          jwt_token: jwtToken,
        },
      };

      const res = await createCloudAccount(auth, apiData);
      console.log('E2E Networks account connected:', res);

      router.push('/dashboard/accounts');
    } catch (error) {
      console.error('Error connecting account:', error);
      setError('An error occurred while creating the cluster');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:p-6 bg-neutral-100 lg:h-screen flex justify-center h-[92vh]">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 w-full">
        <div className="text-center mb-8">
          <h1 className="lg:text-2xl text-lg font-semibold mb-2">E2E Networks</h1>
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
                  <Label htmlFor="api_key">API Key</Label>
                  <ToggleableInput
                    id="api_key"
                    name="api_key"
                    placeholder="Enter API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jwt_token">JWT Token</Label>
                  <ToggleableInput
                    id="jwt_token"
                    name="jwt_token"
                    placeholder="Enter JWT token"
                    value={jwtToken}
                    onChange={(e) => setJwtToken(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="w-full text-end">
                  <Button type="submit" className="bg-[#2563EB]" disabled={isLoading}>
                    {isLoading ? 'Connecting...' : 'Connect Account'}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
        <div className="py-4">
          <E2ENetworksInstructions/>
          </div>
      </div>
        
    </div>
  );
}
