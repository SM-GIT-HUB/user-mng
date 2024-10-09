'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "../ui/button"
import { deleteUser, editUser } from "@/actions"

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
import { useEffect, useState } from "react"
import Joi from "joi"

const user = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required()
})

function UserCard({ user }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const formData = { firstName: user.firstName, lastName: user.lastName, email: user.email, address: user.address };
    const [form, setForm] = useState(formData);

    useEffect(() => {
        setForm(formData);
    }, [openDialog])

    async function handleSubmit()
    {
        if (!check(form))
        {
            console.log("Inavlid details");
            return;
        }

        try {
            setLoading(true);

            const response = await editUser(user._id, form, '/usermng');

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
            }, 300)
        }
    }

    async function handleDelete()
    {
        try {
            const response = await deleteUser(user._id, '/usermng');

            if (!response.success) {
                throw new Error(response.message);
            }

            console.log(response);
        }
        catch(err) {
            console.log(err.message);
        }
    }

  return (
    <div>
        <Card className='p-2 border border-green-600'>
            <CardHeader>
                <CardTitle className='mb-2'>
                    {user?.firstName} {user?.lastName}
                </CardTitle>
                <CardDescription>
                    {user?.email}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {user?.address}
            </CardContent>
            <CardFooter>
                <div className='flex items-center justify-around w-full'>
                    <Button className='w-[100px]' onClick={() => setOpenDialog(true)}>Edit</Button>
                    <Button className='w-[100px]' onClick={handleDelete}>Delete</Button>
                </div>
            </CardFooter>
        </Card>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            loading? "Waiting" :
                            "Edit user details"
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
                        value={form.firstName}
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
                        value={form.lastName}
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
                        value={form.email}
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
                        value={form.address}
                        onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                    </div>

                    <DialogFooter>
                        <Button type="submit">
                            {
                                loading? "Saving..." :
                                "Save"
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default UserCard

function check(form)
{
    const { error } = user.validate({ ...form });

    return !error;
}