import ProfilesNavigation from '@/components/Navigations'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='h-full w-full'>
      <div className='h-20 w-full'>

      </div>
      <div className='h-[calc(100vh-5rem)] w-full flex p-8'>
        <div className='h-full w-3/12'>
          {/** sidebar */}
        </div>
        <div className='h-full w-9/12'>
          <ProfilesNavigation/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard