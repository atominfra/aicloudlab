import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import ConfirmationModal from "./modals/ConfirmationModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGlobal } from "@/context/global-context"
const AccountButton = ({ account , userName, api}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchUserDetails, } = useGlobal();

  const router = useRouter()

  const handleConnect = async () => {
    setIsConnecting(true);
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${api}/connect`)
  };

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${api}/revoke`, {
        method: 'GET',
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
    <div style={{ marginBottom: "1rem" }}>
      <Box className="flex items-center justify-between p-3 border rounded-[10px] h-[70px]">
              <Box className="flex items-center space-x-2">
                <Image 
                src={account.icon}
                alt="github Icon"
                width={24}
                height={24}
                />
                <Box>
                <Typography className='text-[16px]'>{account.name}</Typography>
              {/* @ts-expect-error  error*/}
                {userName && <Typography className="text-[12px] text-[rgb(17,24,39,0.6)]">{String(userName)}</Typography>}
                </Box>
              </Box>
              {/* @ts-expect-error  error*/}
              {userName?
                <button
                disabled={isRevoking}
                className={`h-[39px]  w-[121px] font-semibold text-black text-[15px] ${isRevoking?'bg-[rgba(17,24,39,0.32)]':'bg-white border-[2px] border-[rgb(17,24,39,0.8)]'}  rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={handleDeleteConfirmation}
                >
               Remove
              </button>
              :<>
                <Button
                disabled={isConnecting}
                className={`h-[39px]  w-[121px] font-semibold text-white text-[15px] ${isConnecting ?`bg-[rgba(17,24,39,0.32)]`:`bg-[#1976D2]`} rounded-[10px]`}
                style={{ textTransform: 'none' }}
                onClick={handleConnect}
                >
                {isConnecting?
                   <CircularProgress className="text-white" size={18}/> 
                    :"Connect"}
              </Button>
                </>}
              
            </Box>

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
