import {
  Button,
  Typography,
  Box,
  ButtonBase,
  dialogActionsClasses,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { GoLinkExternal } from "react-icons/go";
import { IoMdPause } from "react-icons/io";
import { MdSettings } from "react-icons/md";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";

export default function NotebookItem({
  id,
  name,
  version,
  status,
  notebook_url,
  onOperation,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputValue, setInputValue] = useState("");
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsError(value !== name); // Set error if input doesn't match the name
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If inputValue matches name, proceed with deletion
    if (inputValue === name) {
      onOperation(id, "delete");
      handleClose();
    } else {
      setIsError(true); // Set error if input doesn't match the name
    }
  };

  // isRunning =
  useEffect(() => {
    setIsRunning(status);
  }, []);

  const handleToggle = async () => {
    const operationName = isRunning ? "stop" : "start";

    setLoading(true);

    try {
      console.log("operationName in notebook", operationName);
      await onOperation(id, operationName);
    } catch (error) {
      console.error("Operation failed:", error);
    } finally {
      setLoading(false);
      setIsRunning(!isRunning);
    }
  };
  return (
    <Box className="flex items-center justify-between bg-white dark:bg-gray-800 text-[#111827] dark:text-white p-4 rounded-lg mb-2 w-[90%] border-2 border-[#111827] dark:border-0">
      <Box className="w-[16%]">
        <Typography variant="body1" className="font-poppins">
          {name}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        className={`text-[#111827] font-poppins capitalize font-bold`}
      >
        {status}
      </Typography>
      <Typography
        variant="body2"
        className="text-[#111827] dark:text-white font-poppins"
      >
        Python {version}
      </Typography>
      <Box className="flex items-center justify-evenly font-poppins gap-10 w-[34%]">
        <ButtonBase
          title={isRunning ? "Pause" : "Start"}
          className={`text-gray-400 min-w-0 dark:hover:text-yellow-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleToggle}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress color="inherit" />
          ) : isRunning ? (
            <IoMdPause className="dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white" />
          ) : (
            <FaPlay className="dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white" />
          )}
        </ButtonBase>
        <button
          title="Delete"
          className="text-red-600 hover:text-white hover:ease-in duration-100 font-bold min-w-0 border border-2 border-red-600 px-2 py-2 rounded-2xl hover:bg-red-600"
          onClick={handleOpen}
        >
          {/* <MdDelete className='dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white' /> */}{" "}
          Delete
        </button>

        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="w-full h-full justify-items-center content-center"
        >
          <div
            class="block"
            className=" p-8 bg-white shadow-xl rounded-2xl item-center"
          >
            <p className="pr-10 pb-4 font-bold">You are deleting '{name}'</p>
            <p className="pb-4 ">If you're sure, type '{name}' to confirm.</p>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Confirm Name"
                value={inputValue}
                onChange={handleInputChange}
                variant="outlined"
                required
                error={isError} // Show error if input doesn't match
                helperText={
                  isError ? "Entered text does not match the name." : ""
                } // Display error message
                InputProps={{
                  className:
                    "bg-white dark:bg-gray-800 text-[#111827] dark:text-white rounded-[10px]",
                }}
                InputLabelProps={{
                  sx: {
                    color: "black",
                    fontFamily: "poppins",
                    "&.Mui-focused": { color: "black" },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
              />
              <div className="block space-x-8 p-4 pl-0">
                <button
                  onClick={handleClose}
                  className="text-[#111827] hover:ease-in duration-100 font-bold min-w-0 px-8 py-1.5 rounded-xl border border-2 border-[#111827]"
                >
                  No, cancel.
                </button>
                <button
                  type="submit"
                  className="text-white bg-red-600 hover:ease-in duration-100 font-bold min-w-0 px-2 py-2 rounded-xl"
                >
                  Delete Notebook
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <ButtonBase
          title="Coming Soon"
          className="text-gray-400 min-w-0 dark:hover:text-yellow-500"
        >
          <MdSettings className="dark:hover:text-yellow-500 text-2xl text-[#111827] dark:text-white" />
        </ButtonBase>

        <Link href={notebook_url} target="_blank">
          <Button
            endIcon={
              <GoLinkExternal className="dark:hover:text-yellow-500 text-xl" />
            }
            className="dark:hover:text-yellow-500 font-poppins text-[#111827] dark:text-white underline capitalize"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Go to notebook
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
