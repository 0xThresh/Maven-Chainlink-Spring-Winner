import ScreenWrapper from '@/components/ScreenWrapper'
import Router from 'next/router'
import React, { FormEvent } from 'react'

const Signin = () => {

  const signin = (e:FormEvent) => {
    e.preventDefault()
    Router.push('/agency/:name')
  }

  return (
    <ScreenWrapper>
      <form onSubmit={signin} className='flex flex-col items-center'>
        <img src="/assets/imageplaceholder.svg" alt="placeholder image" className='h-24 mb-2' />
        <label htmlFor="profile" className='w-[100px] flex items-center justify-center bg-slate-800 text-white py-1 rounded-md text-sm'>Upload</label>
        <input type="file" id="profile" hidden />
        <fieldset className='mt-6'>
          <legend className='ml-2 translate-y-2'>Agency Name</legend>
          <input type="text" className='w-96 h-10 outline-none border-[1px] border-black pl-2' />
        </fieldset>
        <fieldset className='mt-6'>
          <legend className='ml-2 translate-y-2 '>Agency Name</legend>
          <select className='w-96 h-10 outline-none border-[1px] border-black pl-2'>
            <option value="French">FRENCH</option>
            <option value="English" selected>ENGLISH</option>
            <option value="Spanish">SPANISH</option>
          </select>
        </fieldset>
        <button type="submit" className='h-10 w-96 mt-8 flex items-center justify-center bg-slate-800 text-white'>Submit</button>
      </form>
    </ScreenWrapper>
  )
}

export default Signin