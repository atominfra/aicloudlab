"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Eye, Plus, Unplug, Filter, AlertTriangle, Cloud } from 'lucide-react';
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
import { fetchAllCloudAccounts, deleteCloudAccount } from '@/app/(PrivateRoutes)/api/cloud/api';
import { useApp } from '@/context/AppContext';
import { CircularProgress, Modal, Typography } from '@mui/material';
import Link from 'next/link';
import Loader from "@/components/loader"
import e2eIcon from "@/assets/e2elogo.webp"
const CloudAccounts = () => {
  const [selectedProvider, setSelectedProvider] = useState('all');
  const router = useRouter();
  const { auth } = useApp();
  const [accounts, setAccounts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const providerOptions = [
    { value: 'all', label: 'All Providers' },
    { value: 'gcp', label: 'Google Cloud Platform' },
    { value: 'aws', label: 'Amazon Web Services' },
    { value: 'azure', label: 'Microsoft Azure' },
  ];

  async function fetchAccounts() {
    if (auth) {
      setIsLoading(true);
      try {
        const accounts = await fetchAllCloudAccounts(auth);
        setAccounts(accounts?.data?.cloud_accounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setIsLoading(false);
      }
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
        return e2eIcon;
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

  const openDeleteModal = (account) => {
    setAccountToDelete(account);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAccountToDelete(null);
    setDeleteConfirmation('');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation === accountToDelete?.name) {
      setIsDeleting(true);
      try {
        await deleteCloudAccount(auth, accountToDelete.id);
        await fetchAccounts();
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting account:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="container bg-neutral-100 h-screen  mx-auto px-4 sm:px-6  pt-6 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Cloud Accounts</h1>
        <div className="flex items-center gap-2">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"  className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4">
                <Filter className="h-4 w-4 " />
                <span className="hidden sm:inline">
                  {providerOptions.find(option => option.value === selectedProvider)?.label}
                </span>
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
          </DropdownMenu> */}
          <Button 
            variant="default" 
            className="h-10 w-10 sm:h-auto sm:w-auto sm:px-4 bg-blue-600 hover:bg-blue-600/90" 
            onClick={() => router.push('/create/connect-account')}
          >
            <Plus className="h-4 w-4 " />
            <span className="hidden sm:inline">Add Account</span>
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        {isLoading ? (
          // <div className="flex justify-center items-center h-[60vh]">
            <Loader />
          // </div>
        ) : accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <Card key={account.id} className="p-4 hover:shadow-md transition-shadow"  >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link href={`/dashboard/accounts/${account.id}/nodes?accountName=${account.name.toString()}&accountProvider=${account.provider.toString()}`} className="w-full">
                  <div className="flex items-center space-x-4 w-full ">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                      {getProviderIcon(account.provider) && (
                        <Image
                          src={getProviderIcon(account.provider) || "/placeholder.svg"}
                          alt={account.provider}
                          width={40}
                          height={40}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{account.name}</h3>
                      <p className="text-sm text-gray-500">{getProviderName(account.provider)}</p>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  {/* <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-gray-600 w-full sm:w-auto"
                    onClick={() => router.push(`/dashboard/accounts/${account.id}/nodes`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Nodes
                  </Button> */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-50 w-full sm:w-auto"
                    onClick={() => openDeleteModal(account)}
                  >
                    <Unplug className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center h-[80vh] w-full">
            <Cloud className="w-16 h-16 text-neutral-200 mb-4" />
            <Typography variant="body1" className="text-gray-400 text-center">
              No accounts connected
            </Typography>
          </div>
        )}
      </div>

      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal} className="flex items-center justify-center">
        <div className="p-4 sm:p-6 bg-white shadow-xl rounded-[10px] w-full max-w-[588px] mx-4">
          <p className="flex gap-2 items-center pb-4 text-[20px] font-semibold text-[#111827]">
            <AlertTriangle className="text-red-500" />
            <span>Disconnect Account</span>
          </p>
          <p className="pb-4 text-[#374151] text-base">
            This action cannot be undone. Please type the account name to confirm disconnection:
          </p>
          <div className='mb-4 p-4 border-2 rounded-[4px] bg-[#F9FAFB] border-[#E5E7EB]'>
            <div className='text-[#4B5563] text-sm'>Account name:</div>
            <div className='font-medium text-[#111827] text-base'>{accountToDelete?.name}</div>
          </div>
          <Input 
            placeholder="Type account name to confirm" 
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            className="max-w-full placeholder:text-[#9CA3AF] text-sm mb-4"
          />
          <div className="flex justify-end gap-4">
            <Button variant="outline" className='bg-[#F3F4F6] text-[#374151]' onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== accountToDelete?.name || isDeleting}
            >
              {isDeleting ? (
                <>
                  <CircularProgress size={16} color="inherit" className="mr-2" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect Account'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CloudAccounts;

