import Image from 'next/image';
import loader from '@/assets/LoaderAtomInfra.gif';

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image 
        src={loader} 
        alt="Loading..." 
        width={50} // Adjust width based on your design
        height={50} // Adjust height based on your design
        priority={true} // Ensures the loader is prioritized for loading
      />
    </div>
  );
}
