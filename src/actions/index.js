'use server'

import dbConnect from "@/db"
import userModel from "@/db/models/user.model"
import pusher from "@/pusher"
import Joi from "joi"
import { revalidatePath } from "next/cache"

const user = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required()
})

async function addNewUser(form, pathToRevalidate)
{
    await dbConnect();

    let response = {};

    try {
        const { error } = user.validate({ ...form });

        if (error)
        {
            response = { success: false, message: "Please provide valid details" };
            return;
        }

        let newUser = await userModel.create(form);

        if (!newUser)
        {
            response = { success: false, message: "Couldn't add user" };
            return;
        }

        // newUser = newUser.toObject();

        // newUser._id = newUser._id.toString();
        // delete newUser.__v;

        pusher.trigger('user-channel', 'user-added', {
            user: newUser
        })

        response = { data: JSON.parse(JSON.stringify(newUser)) };;
        // revalidatePath(pathToRevalidate);
    }
    catch(err) {
        console.log(err.message);
        response = { success: false, message: "Something went wrong" };
    }
    finally {
        return response;
    }
}

async function fetchUsers()
{
    await dbConnect();

    let response = {};

    try {
        let users = await userModel.find().sort({ _id: -1 });
        
        if (!users)
        {
            response = { success: false, message: "Couldn't find users", data: "" };
            return;
        }

        response = { success: true, data: JSON.parse(JSON.stringify(users)) };
    }
    catch(err) {
        console.log(err.message);
        response = { success: false, message: "Something went wrong", data: "" }
    }
    finally {
        return response;
    }
}

async function deleteUser(id, pathToRevalidate)
{
    await dbConnect();

    let response = {};

    try {
        const user = await userModel.findByIdAndDelete(id);

        if (!user)
        {
            response = { success: false, message: "User not found" };
            return;
        }

        pusher.trigger('user-channel', 'user-deleted', {
            userId: id
        })

        response = { success: true, message: "User deleted" };
        // revalidatePath(pathToRevalidate);
    }
    catch(err) {
        console.log(err.message);
        response = { success: false, message: "Something went wrong" };
    }
    finally {
        return response;
    }
}

async function editUser(id, form, pathToRevalidate)
{
    await dbConnect();

    let response = {};

    try {
        const { error } = user.validate({ ...form });

        if (error)
        {
            response = { success: false, message: "Please porvide valid details" };
            return;
        }

        const userr = await userModel.findByIdAndUpdate(id, form);

        if (!userr)
        {
            response = { success: false, message: "User not found" };
            return;
        }

        const updatedUser = await userModel.findById(id);

        pusher.trigger('user-channel', 'user-updated', {
            user: updatedUser
        })

        response = { success: true, message: "User details updated" };
        // revalidatePath(pathToRevalidate);
    }
    catch(err) {
        console.log(err.message);
        response = { success: false, message: "Something went wrong" };
    }
    finally {
        return response;
    }
}


export { addNewUser, fetchUsers, deleteUser, editUser }