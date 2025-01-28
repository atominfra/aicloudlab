import type React from "react"
import { useApp } from "@/context/AppContext"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  onClickHandler: () => Promise<void> | void
  customCss?: string
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClickHandler,
  customCss = "",
  disabled = false,
  ...props
}) => {
  const { setIsLoading } = useApp()

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setIsLoading(true)
      await onClickHandler()
    } catch (error) {
      console.error("Error in button click handler:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      disabled={disabled}
      className={`font-semibold font-poppins p-3 rounded-[15px] ${customCss}`}
      onClick={handleClick}
      style={{ textTransform: "none" }}
      {...props}
    >
      {text}
    </button>
  )
}

