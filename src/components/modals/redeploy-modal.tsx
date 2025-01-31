"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CustomButton } from "../ui-components/custom-button"
import { AlertCircle, CircleAlert } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface RedeployModalProps {
  open: boolean
  onConfirm: (tag: string) => void
  onCancel: () => void
  serviceName: string
  isRedeploying: boolean
  error:string
}

const RedeployModal: React.FC<RedeployModalProps> = ({ open, serviceName, onConfirm, onCancel, isRedeploying, error }) => {
  const [deploymentType, setDeploymentType] = useState("latest")
  const [tag, setTag] = useState("")

  const handleSubmit = () => {
    onConfirm(tag)
    setTag("")
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="p-6 bg-white shadow-xl rounded-[10px] item-center lg:w-[588px] m-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Redeploy Service</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-100 p-4 rounded-lg flex gap-2 items-center mb-4">
            <CircleAlert className="text-red-500 size-4" />
            <div>{error}</div>
          </div>
        )}
        <div className="py-4 space-y-6">
          <RadioGroup
            defaultValue="latest"
            value={deploymentType}
            onValueChange={setDeploymentType}
            className="space-y-4 text-gray-700" 
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="latest" id="latest" />
              <Label htmlFor="latest" className="text-gray-700">
                Redeploy the latest image
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tag" id="tag" />
              <Label htmlFor="tag" className="text-gray-700">
                Redeploy with tag
              </Label>
            </div>
          </RadioGroup>

          {deploymentType === "tag" && (
            <Input
              placeholder="Enter tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full mt-2"
            />
          )}

          <div className="flex items-start gap-2 text-gray-600 text-sm">
            <AlertCircle className="h-5 w-5  flex-shrink-0 text-white " fill="#FACC15"   />
            <p>This action will trigger a new deployment of the selected build</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <CustomButton onClickHandler={onCancel}  
          customCss=""
          text={'Cancel'}
          />
            
          <CustomButton
            onClickHandler={handleSubmit}
            disabled={deploymentType === "tag" && !tag.trim()}
            customCss="bg-[#2563EB] text-white "
            text= {isRedeploying ? "Redeploying..." : "Redeploy"}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RedeployModal

