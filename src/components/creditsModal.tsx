import { Box, Modal, Typography } from "@mui/material";
import CustomButton from "./ui/button";
import toast, { Toaster } from "react-hot-toast";
export default function CreditsModal({ showModal, onClose }:{
  showModal: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={showModal}
      onClose={onClose}
      className="w-full h-full justify-items-center content-center"
    >
      <Box className="p-8 bg-white shadow-xl rounded-2xl flex flex-col items-start justify-start w-[35vw] gap-4">
        <Typography className="text-black font-poppins font-semibold text-2xl">
          You are on free plan
        </Typography>
        <Typography className="text-gray-600 font-poppins text-lg ">
          Upgrade to Pro to create more notebooks
        </Typography>
        <Box className="flex w-full justify-between gap-4">
          <CustomButton
            text="Maybe later"
            onclickhandler={onClose}
            customCss="w-[50%] bg-[#e3e3e3] text-black shadow-none"
          />
          <CustomButton
            text="Upgrade"
            onclickhandler={() => toast.success('Comming Soon')}
            customCss="w-[50%] bg-[#1976D2]"
          />
        </Box>
    <Toaster />

      </Box>

    </Modal>
    
  );
}
