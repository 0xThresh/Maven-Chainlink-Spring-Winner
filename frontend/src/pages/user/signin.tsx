import ScreenWrapper from '@/components/ScreenWrapper'
import UserLensProfileCards from '@/components/UserLensProfileCards';
import UserLensProfileCardsWrapper from '@/components/UserLensProfileCardsWrapper';
import Router from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'

const Signin = () => {
  const [userLensProfileList, setUserLensProfileList] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<number>();

  const signin = (e:FormEvent) => {
    e.preventDefault()
    if(selectedProfile) Router.push('/user/'+userLensProfileList[selectedProfile])
  }

  const lensProfilesDummy = ["abc.lens", "xyz.lens", "naruto.lens", "kakashi.lens", "xyfsdfz.lens", "itachi.lens", "luffy.lens"]

  useEffect(() => {
    //fetch using connected address
    setUserLensProfileList(lensProfilesDummy)
  }, [])

  return (
    <ScreenWrapper>
      <form onSubmit={signin} className='flex flex-col'>
        <fieldset className='mt-6'>
          <legend className='mb-6'>Select Lens Profile</legend>
          <UserLensProfileCardsWrapper profileList={userLensProfileList} parentSetter={setSelectedProfile} />
        </fieldset>
        <fieldset className='mt-6'>
          <legend className='ml-2 translate-y-2 bg-bgColor px-1'>Primary Language</legend>
          <select className='w-96 h-10 outline-none border-[1px] border-black pl-2 bg-bgColor'>
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