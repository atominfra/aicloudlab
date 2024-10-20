// components/MyButton.js
import Image from 'next/image'

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
    {/* <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div> */}
  <div className='bg-gray-300 animate-pulse'>
  <Image 
        src='https://res.cloudinary.com/dy8hx2xrj/image/upload/v1729452189/cloud_er4ydp.webp'
        width={1000}  
        height={1000}
        className=' w-[180px] h-[100px]'
        alt="AI Cloud Lab Logo" />
  </div>
        <span className='bg-white text-black ml-2'>Loading...</span> 
    
  </div>
  );
}
