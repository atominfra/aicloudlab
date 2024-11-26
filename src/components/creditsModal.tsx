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
      <Box className="py-6 px-8 bg-white shadow-xl rounded-3xl flex flex-col items-start justify-start lg:w-[42.2vw] m-2 gap-2">
        <Typography className="text-black font-poppins font-semibold text-[19px] lg:text-[22px]">
          You are on free plan
        </Typography>
        <Typography className="text-gray-500 font-poppins text-[15px] lg:text-[16px] ">
          Upgrade to Pro to create more notebooks
        </Typography>
        <Box className='my-4 w-full flex justify-between gap-6'>
          <div className="bg-[#F5F6F6] w-[48%] rounded-lg px-4 py-[15px]">
            <div className="flex items-center justify-between">
            <Typography className="font-semibold font-poppins lg:text-[20px] text-black">
              Free
            </Typography>
            <div className="font-poppins font-semibold text-[6px] lg:text-[8px] border-black border-[1px] py-[2px] px-[4px] rounded-full text-black">Current Plan</div>
            </div>
            <Typography className="my-2 text-[18px] lg:text-[25px] font-poppins pb-4 text-black">
            ₹0 <span className="text-[10px] text-gray-600">/month</span>
            </Typography>
            <ul className="list-disc pl-5 font-poppins lg:text-[16px] text-[13px] text-black">
              <li>
                Access 1 notebook
              </li>
            </ul>
          </div>
          <div className="bg-[#E8F1FB] w-[48%] rounded-lg px-4 py-[15px]">
            <div>
            <Typography className="font-semibold font-poppins lg:text-[20px] text-black">
              Pro
            </Typography>
            </div>
            <Typography className="my-2 text-[18px] lg:text-[25px] font-poppins pb-4 text-black">
            ₹1000 <span className="text-[10px] text-gray-600">/month</span>
            </Typography>
            <ul className="list-disc pl-5 font-poppins lg:text-[16px] text-[13px] text-black">
              <li>Access up to 5 notebooks</li>
            </ul>
          </div>
        </Box>
        <Box className="flex w-full justify-between gap-4 pt-4">
          <CustomButton
            text="Upgrade"
            onclickhandler={() => toast.success('Coming Soon')}
            customCss="w-[100%] bg-gradient-to-b from-[#1976D2] to-[#0D3D6C] text-white text-[15px] lg:text-[16px] p-2"
          />
        </Box>
      <Toaster position="bottom-right" />
      </Box>
    </Modal>   
  );
}