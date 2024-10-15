import { AiOutlinePauseCircle } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { BiExport } from 'react-icons/bi'
import { Button, Typography, Box, CircularProgress } from '@mui/material';

export default function NotebookItem ({ name, version, isActive })  {
  console.log("name",name,version,isActive)
  return <Box className="flex items-center justify-between bg-gray-800 p-4 rounded-lg mb-2 w-full">
  <Box className="flex items-center space-x-4">
    <Typography variant="body1" className="text-white">{name}</Typography>
    <Typography variant="body2" className={isActive ? "text-green-400" : "text-gray-400"}>
      {isActive ? 'Active' : 'Inactive'}
    </Typography>
    <Typography variant="body2" className="text-gray-400">{version}</Typography>
  </Box>
  <Box className="flex items-center space-x-4">
    <Button startIcon={<AiOutlinePauseCircle />} className="text-gray-400 min-w-0">
      <span className="sr-only">Pause</span>
    </Button>
    <Button startIcon={<FiSettings />} className="text-gray-400 min-w-0">
      <span className="sr-only">FiSettings</span>
    </Button>
    <Button 
      startIcon={<BiExport />} 
      className="text-blue-400 hover:text-blue-300"
    >
      Go to notebook
    </Button>
  </Box>
</Box>
}