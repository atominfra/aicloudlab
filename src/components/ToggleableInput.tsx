'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


export function ToggleableInput({...props }) {
  const [showInput, setShowInput] = useState(false)

  return (
    <div className="relative">
      <Input
        autoComplete='new-password'
        {...props}
        type={showInput ? 'text' : 'password'}
        className={`${props.className} "pr-10"`}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowInput(!showInput)}
        aria-label={showInput ? 'Hide input' : 'Show input'}
      >
        {showInput ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

