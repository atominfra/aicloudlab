import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import ConfirmationModal from "./modals/ConfirmationModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/GlobalContext";
const AccountButton = ({ account , userName, api}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchUserDetails, } = useGlobalContext();

  const router = useRouter()

  const handleConnect = async () => {
    setIsConnecting(true);
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${api}/connect`)
  };

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${api}/revoke`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!response.ok) {
        // Attempt to parse the error body if possible
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to revoke Google user');
      }
  
      const responseData = await response.json();
      console.log('responseData', responseData);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error revoking Google user:', error.message);
        toast.error(error.message);
      } else {
        console.error('Unknown error occurred:', error);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsRevoking(false);
      fetchUserDetails()
    }
  };

  const handleDeleteConfirmation = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 lg:mb-8 ">
      
      <div className="flex items-center justify-between bg-white lg:bg-neutral-100 p-2 lg:p-0 rounded-[8px] border lg:border-none ">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 flex justify-center items-center">
                    <Image src={account.icon} alt={account.icon} className="w-[20px] h-[20px] lg:w-[32px] lg:h-[32px]" />
                  </div>
                <div>
                <p className="font-medium text-sm lg:text:base">{account.name}</p>
              {/* @ts-expect-error  error*/}
              <p className="text-xs font-normal text-[#6B7280] ">{userName || 'Not connected'}</p>
                </div>
              </div>
              {/* @ts-expect-error  error*/}
              
              {userName?
                <Button 
                disabled={isRevoking}
                variant="ghost" 
                className={`text-blue-600 hover:text-blue-700  `}
                onClick={handleDeleteConfirmation}
                style={{ textTransform: 'none' }}

              >
                  Disconnect
                </Button>
              :<>
                <Button 
                disabled={isConnecting}
                variant="ghost" 
                className={`text-blue-600   `}
                onClick={handleConnect}
                style={{ textTransform: 'none' }}

              >
                  {isConnecting?
                   <CircularProgress className="text-black" size={18}/> 
                    :"Connect"}
                </Button>
              </>}
              
            </div>

      <ConfirmationModal 
        open={isModalOpen} 
        onCancel={() => {
          setIsModalOpen(false)
          setIsRevoking(false)
        }} 
        account={account} 
        onConfirm={handleRevoke}
        isRevoking={isRevoking}/>
    </div>
  );
};

export default AccountButton;
