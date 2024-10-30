'use client'

import { fetchUsers } from '@/actions'
import AddNewUser from '@/components/add-new-user'
import UserCard from '@/components/user-card'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

function UserMng() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      const response = await fetchUsers();
      setUsers(response.data);
    }

    fetchUsersData();

    // Initialize Pusher
    // Updated process.env usage
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    })


    // Subscribe to the channel
    const channel = pusher.subscribe('user-channel');

    // Bind to events
    channel.bind('user-added', (data) => {
      setUsers((prevUsers) => [data.user, ...prevUsers]);
    })

    channel.bind('user-updated', (data) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id.toString() == data.user._id.toString() ? data.user : user))
      )
    })

    channel.bind('user-deleted', (data) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== data.userId));
    })

    return () => {
      // Clean up the event listeners on unmount
      channel.unbind_all();
      pusher.unsubscribe('user-channel');
    }
  }, [])

  return (
    <div className='p-20'>
      <div  className='flex justify-between'>
          <h1>User Management System</h1>
          <AddNewUser/>
      </div>

      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {
          users? users?.map((user) => 
            <UserCard key={user._id} user={user} />
          ) :
          "No users found"
        }
      </div>
    </div>
  )
}

export default UserMng