'use client';
import React, { useState } from 'react';
import { Typography, Box, TextField, Select, MenuItem, ButtonBase } from '@mui/material';
import { useRouter } from 'next/navigation';
import { RiArrowDropDownLine } from "react-icons/ri";
import Navbar from '../../components/navbar';
import { useTheme } from 'next-themes';
import { useGlobalContext } from '@/context/GlobalContext';
import CustomButton from '@/components/ui/button';

export default function CreateNotebook() {
  const router = useRouter();
  const { notebooks, setNotebooks } = useGlobalContext();
  const [formData, setFormData] = useState({
    name: '',
    githubURL: '',
    pythonVersion: '3.7',
    packages: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { resolvedTheme } = useTheme();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      python_version: formData.pythonVersion,
      packages: formData.packages.split(',').map(pkg => pkg.trim()),
      github_url: formData.githubURL || ''
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        const newNotebook = {
          id: responseData.id,
          name: formData.name,
          version: formData.pythonVersion,
          packages: formData.packages,
          status: 'running'
        };

        setNotebooks(prev => [...prev, newNotebook]);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create notebook');
      }
    } catch (err) {
      setError('An error occurred while creating the notebook');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white p-6">
      <Navbar />
      
      <Box className="w-full max-w-md">
        <Typography variant="h4" className="text-center text-3xl mb-10 font-poppins">
          Create Notebook
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ButtonBase title='Name'>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              required
              InputProps={{
                className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
              }}
              InputLabelProps={{
                sx: {
                  color: resolvedTheme === "dark" ? 'white' : 'black',
                  fontFamily: 'poppins',
                  '&.Mui-focused': { color: resolvedTheme === "dark" ? 'white' : 'black' }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' },
                  '&:hover fieldset': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' },
                  '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' }
                }
              }}
            />
          </ButtonBase>
          <ButtonBase title= 'Coming Soon'>
          <TextField
          disabled
            fullWidth
            label="Github URL "
            name="githubURL"
            value={formData.githubURL}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
            }}
            InputLabelProps={{
              sx: {
                color: resolvedTheme === "dark"?'white':'black',
                fontFamily: 'poppins',
                '&.Mui-focused': { color: resolvedTheme === "dark"?'white':'black' }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                '&:hover fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
                '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' }
              }
            }}
          />
          </ButtonBase>

          <ButtonBase title='Python Version'>
            <Select
              fullWidth
              name="pythonVersion"
              value={formData.pythonVersion}
              onChange={handleChange}
              displayEmpty
              variant="outlined"
              className="bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-poppins rounded-[10px]"
              IconComponent={(props) => (
                <RiArrowDropDownLine {...props} style={{ color: resolvedTheme === "dark" ? 'white' : 'black', fontSize: '30px' }} />
              )}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark" ? 'white' : 'black' }
              }}
            >
              <MenuItem value="3.7">Python 3.7</MenuItem>
              <MenuItem value="3.8">Python 3.8</MenuItem>
              <MenuItem value="3.9">Python 3.9</MenuItem>
              <MenuItem value="3.10">Python 3.10</MenuItem>
            </Select>
          </ButtonBase>

          <ButtonBase title='Coming Soon'>
          <Select
          disabled
            fullWidth
            name="packages"
            value={formData.packages}
            onChange={handleChange}
            displayEmpty
            variant="outlined"
            className="bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-poppins rounded-[10px]"
            IconComponent={(props) => (
              <RiArrowDropDownLine {...props} style={{ color: resolvedTheme === "dark"?'white':'black', fontSize: '30px' }} />
            )}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' }
            }}
          >
            <MenuItem disabled value="">Select Packages</MenuItem>
            <MenuItem value="numpy">Numpy</MenuItem>
            <MenuItem value="pandas">Pandas</MenuItem>
            <MenuItem value="scikit-learn">Scikit-Learn</MenuItem>
            <MenuItem value="matplotlib">Matplotlib</MenuItem>
          </Select>
          </ButtonBase>

          <CustomButton 
            text={'Create Notebook'} 
            customCss={'mt-6'} 
            onclickhandler={handleSubmit}
            type="submit" 
            disabled={isSubmitting || !formData.name}
          />

          {error && (
            <Typography variant="body1" className="text-red-500 mt-4">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}


// 'use client';
// import React, { useState } from 'react';
// import { Typography, Box, TextField, Select, MenuItem, ButtonBase } from '@mui/material';
// import { useRouter } from 'next/navigation';
// // import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import { RiArrowDropDownLine } from "react-icons/ri";
// import Navbar from '../../components/navbar';
// import { useTheme } from 'next-themes';
// import { useGlobalContext } from '@/context/GlobalContext';
// import CustomButton from '@/components/ui/button';
// export default function CreateNotebook() {
//   const router = useRouter();
//   const { notebooks, setNotebooks } = useGlobalContext();

//   const [formData, setFormData] = useState({
//     name: '',
//     githubURL: '',
//     pythonVersion: '3.7',
//     packages: ''
//   });

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };



//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const newNotebook = {
//       id: Date.now(),
//       name: formData.name,
//       version: formData.pythonVersion,
//       packages:formData.packages,
//       isActive: 'true'
//     };

//     setNotebooks(notebooks=>[...notebooks,newNotebook])

//     notebooks.push(newNotebook);
//     router.push({
//       pathname: '/dashboard',
//     });
//   };

//   const handleCreateClick = () => {
//     router.push('/dashboard');
//   };

//   const { resolvedTheme } = useTheme();

//   return (
//     <Box className="flex flex-col items-center gap-8 min-h-screen bg-white dark:bg-gray-900 text-[#111827] dark:text-white p-6">
//       <Navbar/>
      
//       <Box className="w-full max-w-md">
//         <Typography variant="h4" className=" text-center text-3xl mb-10 font-poppins">
//           Create Notebook
//         </Typography>
        
//         <Box component="form" onSubmit={handleSubmit} className="flex flex-col  gap-4">
//         <ButtonBase title= 'Name'>
//           <TextField
//             fullWidth
//             label="Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             variant="outlined"
//             InputProps={{
//               className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
//             }}
//             InputLabelProps={{
//               sx: {
//                 color: resolvedTheme === "dark"?'white':'black',
//                 fontFamily: 'poppins',
//                 '&.Mui-focused': { color: resolvedTheme === "dark"?'white':'black' }
//               }
//             }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
//                 '&:hover fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
//                 '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' }
//               }
//             }}
//           />
//           </ButtonBase>
//         <ButtonBase title= 'Coming Soon'>
//           <TextField
//           disabled
//             fullWidth
//             label="Github URL "
//             name="githubURL"
//             value={formData.githubURL}
//             onChange={handleChange}
//             variant="outlined"
//             InputProps={{
//               className: 'bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]'
//             }}
//             InputLabelProps={{
//               sx: {
//                 color: resolvedTheme === "dark"?'white':'black',
//                 fontFamily: 'poppins',
//                 '&.Mui-focused': { color: resolvedTheme === "dark"?'white':'black' }
//               }
//             }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
//                 '&:hover fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' },
//                 '&.Mui-focused fieldset': { borderColor: resolvedTheme === "dark"?'white':'black' }
//               }
//             }}
//           />
//           </ButtonBase>
//           <ButtonBase title='Python Version'>
//           <Select
//             fullWidth
//             name="pythonVersion"
//             value={formData.pythonVersion}
//             onChange={handleChange}
//             displayEmpty
//             variant="outlined"
//             className="bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-poppins rounded-[10px]"
//             IconComponent={(props) => (
//               <RiArrowDropDownLine {...props} style={{ color: resolvedTheme === "dark"?'white':'black', fontSize: '30px' }} />
//             )}
//             sx={{
//               '& .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
//               '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' }
//             }}
//           >
//             <MenuItem value="3.7">Python 3.7</MenuItem>
//             <MenuItem value="3.8">Python 3.8</MenuItem>
//             <MenuItem value="3.9">Python 3.9</MenuItem>
//             <MenuItem value="3.10">Python 3.10</MenuItem>
//           </Select>
//           </ButtonBase>
//           <ButtonBase title='Coming Soon'>
//           <Select
//           disabled
//             fullWidth
//             name="packages"
//             value={formData.packages}
//             onChange={handleChange}
//             displayEmpty
//             variant="outlined"
//             className="bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-poppins rounded-[10px]"
//             IconComponent={(props) => (
//               <RiArrowDropDownLine {...props} style={{ color: resolvedTheme === "dark"?'white':'black', fontSize: '30px' }} />
//             )}
//             sx={{
//               '& .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
//               '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: resolvedTheme === "dark"?'white':'black' }
//             }}
//           >
//             <MenuItem disabled value="">Select Packages</MenuItem>
//             <MenuItem value="numpy">Numpy</MenuItem>
//             <MenuItem value="pandas">Pandas</MenuItem>
//             <MenuItem value="scikit-learn">Scikit-Learn</MenuItem>
//             <MenuItem value="matplotlib">Matplotlib</MenuItem>
//           </Select>
//           </ButtonBase>
//         <CustomButton text={'Create Notebook'} onclickhandler={handleCreateClick} customCss={'mt-6'}/>
//         </Box>
//       </Box>
      
//       {/* <Box className="absolute bottom-8 right-8">
//         <Image 
//           src="/wrench-icon.png"
//           width={80}
//           height={80}
//           alt="Wrench Icon"
//         />
//       </Box> */}
//     </Box>
//   );
// }
