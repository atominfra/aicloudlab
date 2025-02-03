"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CustomButton } from "../ui-components/custom-button"
import { AlertCircle } from "lucide-react"

interface RedeployModalProps {
  open: boolean
  onConfirm: (tag: string) => void
  onCancel: () => void
  serviceName: string
  image_url: string
  isRedeploying: boolean
  error: string
}

const RedeployModal: React.FC<RedeployModalProps> = ({
  open,
  serviceName,
  image_url,
  onConfirm,
  onCancel,
  isRedeploying,
  error,
}) => {
  const [imageUrl, setImageUrl] = useState("")
  const [tag, setTag] = useState("latest")
  const [isTagEmpty, setIsTagEmpty] = useState(false)

  useEffect(() => {
    setImageUrl(image_url)
    setTag("latest")
    setIsTagEmpty(false)
  }, [image_url])

  const handleSubmit = () => {
    if (tag.trim() === "") {
      setIsTagEmpty(true)
    } else {
      setIsTagEmpty(false)
      onConfirm(tag.trim())
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="p-6 bg-white shadow-xl rounded-[10px] item-center lg:w-[588px] m-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Redeploy Service</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-100 p-4 rounded-lg flex gap-2 items-center ">
            <AlertCircle className="text-red-500 size-4" />
            <div>{error}</div>
          </div>
        )}
        <div className="py-4 space-y-6">
          <div
            className={`flex items-center space-x-2 font-medium border rounded-lg p-3 ${isTagEmpty ? "border-red-500" : ""}`}
          >
            <span className="text-gray-700 text-lg">
              {imageUrl} <span className="">:</span>
            </span>
            <input
              value={tag}
              onChange={(e) => {
                setTag(e.target.value)
                setIsTagEmpty(false)
              }}
              className="w-40 outline-none border-none"
              placeholder="Enter tag"
            />
          </div>
          {isTagEmpty && <p className="text-red-500 text-sm mt-1">Tag cannot be empty</p>}

          <div className="flex items-start gap-2 text-gray-600 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-white" fill="#FACC15" />
            <p>This action will trigger a new deployment of the selected build</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <CustomButton onClickHandler={onCancel} customCss="" text="Cancel" />

          <CustomButton
            onClickHandler={handleSubmit}
            disabled={isRedeploying}
            customCss="bg-[#2563EB] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            text={isRedeploying ? "Redeploying..." : "Redeploy"}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RedeployModal

