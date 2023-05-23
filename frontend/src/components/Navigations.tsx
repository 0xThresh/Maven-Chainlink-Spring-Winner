import React from 'react'

const Navigations = () => {
  return (
    <>
    <NavigationBoard/>
    <div className='w-full h-14 flex items-center bg-neutralGray rounded-lg border-2 border-gray-600'>
        <div className='h-full flex items-center mx-16'>
          <img className='h-12 w-12 mr-6 rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5DMh11jSfdQJ7ogMhIhGb-ubIvFxhgiPj5KhP9hx7j1Ftuiy_kthuIXKIojgnbvBdtWU&usqp=CAU" alt=""/>
          <h2>Vitalik.lens</h2>  
        </div>
        <div className='flex'>
            <img src="/assets/arrowLeft.svg" className='h-5 mr-5' alt="" />
            <img src="/assets/arrowRight.svg" className='h-5' alt="" />
        </div>
    </div>
    </>
  )
}

const NavigationBoard = () => {
  return (
    <div className='w-full h-14 flex items-center bg-neutralGray rounded-lg border-2 my-4 border-gray-600'>
      <div className='w-8/12 h-full flex items-center justify-between'>
        <div className='h-full flex items-center mx-12'>
          <img className='h-5 w-5 mr-4 rounded-full' src="/assets/homeIcon.svg" alt=""/>
          <h2>User Dashboard</h2>  
        </div>
        <div className='flex items-center'>
          <div className='mr-3 bg-gray-800 text-white py-1 px-4'>In Progress</div>
          <div className='mr-3'>Completed</div>
          <div>All</div>
        </div>
        
      </div>
        
      <div className='flex justify-end w-4/12 mr-16'>
        <span className='mr-4'>Vitalik.lens</span>
        <button className='text-sm text-gray-500'><i>Connected</i></button>
      </div>
    </div>
  )
}

export default Navigations