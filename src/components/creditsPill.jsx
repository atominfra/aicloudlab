import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CreditsPill(){
  const router = useRouter()
  return <>
    <div className='text-black border-2 text-[16px] rounded-[12px] flex p-2 hover:cursor-pointer hover:bg-gray-200'
    onClick={()=> router.push('/credits')}>
      Credits :
      <span className='  text-black font-semibold flex  items-center  '>
        <span className='font-serif px-1'>₹</span>
        1940
        </span>
    </div>
  </>
}