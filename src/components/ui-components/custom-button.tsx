import type React from "react"
import { useApp } from "@/context/AppContext"
import { Button } from "../ui/button";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  onClickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  customCss?: string
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClickHandler,
  customCss = "",
  disabled = false,
  ...props
}) => {

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClickHandler(event)
  }

  return (
    <Button
      variant="outline"
      disabled={disabled}
      className={` font-poppins  ${customCss}`}
      onClick={handleClick}
      style={{ textTransform: "none" }}
      {...props}
    >
      {text}
    </Button>
  )
}

