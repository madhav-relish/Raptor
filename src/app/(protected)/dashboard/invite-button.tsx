import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogTitle,DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import React, { useState } from 'react'
import { toast } from 'sonner'

const InviteButton = () => {
  const { projectId } = useProject()
  const [open, setOpen] = useState(false)
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>

      <DialogHeader>
        <DialogTitle>
          Invite Team Members!
        </DialogTitle>
      </DialogHeader>
      <p>Send this link to you team members. Click on the link to copy</p>
      <Input readOnly className='mt-4' 
      onClick={()=>{navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`)
    toast.success("Coppied to clipboard!")
    }
    }
      value={`${window.location.origin}/join/${projectId}`}

      />
      </DialogContent>
    </Dialog>
    <Button size={'sm'} variant={'outline'} onClick={()=> setOpen(true)}>Invite Members</Button>
    </>
  )
}

export default InviteButton