import { fetchUsers } from '@/actions'
import AddNewUser from '@/components/add-new-user'
import UserCard from '@/components/user-card'

export const revalidate = 0;

async function UserMng() {
  const response = await fetchUsers();
  const users = response.data;

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