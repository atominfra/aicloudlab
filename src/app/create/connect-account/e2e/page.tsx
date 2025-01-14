'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCloudAccount } from '@/app/api/cloud/api';
import { useApp } from '@/context/AppContext';
import { ToggleableInput } from '@/components/ToggleableInput';

type FormData = {
  name: string;
  api_key: string;
  jwt_token: string;
};

export default function CloudProviderForm() {
  const { auth } = useApp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<FormData>({
    name: '',
    api_key: '',
    jwt_token: '',
  });

  const placeholderMap: Record<string, string> = {
    name: 'Enter name',
    api_key: 'Enter API key ',
    jwt_token: 'Enter  JWT token ',
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiData = {
        name: data.name,
        provider: 'e2e',
        providerText: 'E2E Networks',
        credentials: {
          api_key: data.api_key,
          jwt_token: data.jwt_token,
        },
      };

      const res = await createCloudAccount(auth, apiData);
      console.log('E2E Networks account connected:', res);

      router.push('/dashboard/accounts');
    } catch (error) {
      console.error('Error connecting account:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while connecting the account.'
      );
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
                {Object.entries(data).map(([field, value]) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {field
                        .replace('_', ' ')
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </Label>
                    {field === 'api_key' || field === 'jwt_token' ? (
                      <ToggleableInput
                        id={field}
                        name={field}
                        label={field
                          .replace('_', ' ')
                          .split(' ')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                        placeholder={placeholderMap[field]}
                        value={value}
                        onChange={handleDataChange}
                        required
                      />
                    ) : (
                      <Input
                        id={field}
                        name={field}
                        placeholder={placeholderMap[field]}
                        value={value}
                        onChange={handleDataChange}
                        required
                      />
                    )}
                  </div>
                ))}
                <div className="w-full text-end">
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
