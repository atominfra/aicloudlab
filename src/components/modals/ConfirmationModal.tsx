import React, { useState } from 'react';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import CustomButton from '../button';

interface ConfirmationModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  account: {
    id: number
    name:string
    icon: string
  }
  isRevoking: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, account, onConfirm, onCancel, isRevoking }) => {
  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      className="w-full h-full justify-items-center content-center"
    >
      <Box className="p-8 bg-white shadow-xl rounded-2xl flex flex-col items-start justify-start lg:w-[35vw] m-4 gap-4">
        <Typography className="text-black font-poppins font-semibold text-[19px] lg:text-2xl">
          Are you sure?
        </Typography>
        <Typography className="text-gray-600 font-poppins text-[15px] lg:text-lg ">
        Disconnecting {account?.name} will revoke its access to your account.
        </Typography>
        <Box className="flex w-full justify-between gap-4 pt-4">
          <CustomButton
            text="Cancel"
            onclickhandler={onCancel}
            customCss="w-[50%] bg-[#e3e3e3] text-black shadow-none text-[15px] lg:text-[18px]"
          />
          <CustomButton
            text={isRevoking=== true ? <>
              <CircularProgress className="text-white" size={18}/> 
              </>:
              <>Confirm</>}  
            onclickhandler={onConfirm}
            customCss="w-[50%] bg-[#2563EB] text-white text-[15px] lg:text-[16px]"
          />
        </Box>

      </Box>

    </Modal>
  );
};

export default ConfirmationModal;
