'use client'

import { addNewUser } from '@/actions'
import { Button } from '../ui/button'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState } from "react"
import Joi from "joi"

const user = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required()
})

function AddNewUser() {
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const formData = { firstName: "", lastName: "", email: "", address: "" };
    const [form, setForm] = useState(formData);

    async function handleSubmit()
    {
        try {
            if (!check(form))
            {
                console.log("Inavlid details");
                return;
            }
            
            const response = await addNewUser(form, '/usermng');       

            if (!response.success) {
                throw new Error(response.message);
            }
        }
        catch(err) {
            console.log(err.message);
        }
        finally {
            setTimeout(() => {
                setLoading(false);
                setOpenDialog(false);

                setForm(formData);
            }, 300)
        }
    }

  return (
    <div>
        <Button onClick={() => setOpenDialog(true)}>
            Add new user
        </Button>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            loading? "Waiting" :
                            "Add new user"
                        }
                    </DialogTitle>
                    <DialogDescription>
                        Write user details here. Click create when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        First name
                    </Label>
                    <Input
                        name="firstName"
                        id="firstName"
                        placeholder="First name"
                        className="col-span-3"
                        onChange={(e) => setForm({...form, firstName: e.target.value})}
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Last name
                    </Label>
                    <Input
                        name='lastName'
                        id="lastName"
                        placeholder="Last name"
                        className="col-span-3"
                        onChange={(e) => setForm({...form, lastName: e.target.value})}
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Email
                    </Label>
                    <Input
                        name='email'
                        id="email"
                        placeholder="Email"
                        className="col-span-3"
                        onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Address
                    </Label>
                    <Input
                        name="address"
                        id="address"
                        placeholder="Address"
                        className="col-span-3"
                        onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                    </div>

                    <DialogFooter>
                        <Button type="submit" onClick={() => setLoading(true)}>
                            {
                                loading? "Saving..." :
                                "Create"
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewUser

function check(form)
{
    const { error } = user.validate({ ...form });

    return !error;
}