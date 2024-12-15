import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { GiHamburgerMenu } from "react-icons/gi";
import { Typography } from '@mui/material';
import CustomButton from '../button';
import { SiJupyter } from "react-icons/si";



export default function AnchorTemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };


  return (
    <div>
        <Button onClick={toggleDrawer(true)}>
          <GiHamburgerMenu className='text-black ' size={20}/>
        </Button>
      <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
       <div className="h-full m-4 w-[150px]">
       <Box>
          <Typography>Deploy model</Typography>
          <CustomButton text="Deploy" onclickhandler={()=>{}}  customCss={'text-[15px] lg:text-[16px]'}/>
        </Box>
        <Box>
          <Typography>Sync Model</Typography>
          <CustomButton text="Sync" onclickhandler={()=>{}}  customCss={'text-[15px] lg:text-[16px]'}/>
        </Box>
       </div>
      </Drawer>
    </div>
  );
}
