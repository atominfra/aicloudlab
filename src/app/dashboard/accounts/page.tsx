"use client"
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Eye, Plus, Unplug, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import azureIcon from "@/assets/azure.svg";
import gcpIcon from "@/assets/gcp.svg";
import awsIcon from "@/assets/aws.svg";
import { useRouter } from 'next/navigation';
import { fetchAllCloudAccounts, deleteCloudAccount } from '@/app/api/cloud/api';
import { useApp } from '@/context/AppContext';

const CloudAccounts = () => {
  const [selectedProvider, setSelectedProvider] = useState('all');
  const router = useRouter();
  const { auth } = useApp();
  const [accounts, setAccounts] = useState([]);

  const providerOptions = [
    { value: 'all', label: 'All Providers' },
    { value: 'gcp', label: 'Google Cloud Platform' },
    { value: 'aws', label: 'Amazon Web Services' },
    { value: 'azure', label: 'Microsoft Azure' },
  ];

  async function fetchAccounts() {
    if (auth) {
      const accounts = await fetchAllCloudAccounts(auth);
      setAccounts(accounts?.data?.cloud_accounts);
    }
  }
  useEffect(() => {
    fetchAccounts();
  }, [auth]);

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

  const getProviderName = (provider) => {
    switch (provider.toLowerCase()) {
      case 'azure':
        return 'Microsoft Azure';
      case 'gcp':
        return 'Google Cloud Platform';
      case 'aws':
        return 'Amazon Web Services';
      case 'e2e':
        return 'E2E Network';
      default:
        return provider;
    }
  };

  const handleDeleteAccount = async (id)=>{
    if (auth) {
      const resp = await deleteCloudAccount(auth, id);
      if(resp){
        fetchAccounts()
      }
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Cloud Accounts</h1>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 py-4">
                <Filter className="h-4 w-4" />
                {providerOptions.find(option => option.value === selectedProvider)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[250px]">
              {providerOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={selectedProvider === option.value}
                  onCheckedChange={() => setSelectedProvider(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-600/90" 
            onClick={() => router.push('/create/connect-account')}
          >
            <Plus className="mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {accounts && accounts.map((account) => (
          <Card key={account.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {getProviderIcon(account.provider) && (
                    <Image
                      src={getProviderIcon(account.provider)}
                      alt={account.provider}
                      width={40}
                      height={40}
                      className="w-6 h-6"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{account.name}</h3>
                  <p className="text-sm text-gray-500">{getProviderName(account.provider)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-gray-600"
                  onClick={() => router.push(`/dashboard/accounts/${account.id}/nodes`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Nodes
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-50"
                  onClick={()=>handleDeleteAccount(account.id)}
                >
                  <Unplug className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CloudAccounts;