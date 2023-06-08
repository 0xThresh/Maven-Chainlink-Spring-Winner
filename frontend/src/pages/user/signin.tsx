import ScreenWrapper from '@/components/ScreenWrapper'
import UserLensProfileCardsWrapper from '@/components/UserLensProfileCardsWrapper';
import Router from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import { useProfilesOwnedByMe } from '@lens-protocol/react-web';
import { useRecoilState } from 'recoil';
import { profileHandlesState, selectedHandleState } from '@/store';

const Signin = () => {
  const [selectedProfile, setSelectedProfile] = useState<number>(0);
  const [profiles, setProfiles] = useRecoilState(profileHandlesState);
  const [,setSelectedHandleState] = useRecoilState(selectedHandleState)
  const { data: profilesData, loading, hasMore, next } = useProfilesOwnedByMe({
    limit: 10
  });

  const signin = (e:FormEvent) => {
    e.preventDefault()
    setSelectedHandleState(selectedProfile)
    Router.push('/user/dashboard')
  }


  useEffect(() => {
    if(!loading) {
      let profilesHandles:string[] = []
      profilesData?.forEach((profile) => {
        profilesHandles.push(profile.handle)
      })
      setProfiles(profilesHandles)
    }
  }, [loading])

  return (
    <ScreenWrapper>
      <form onSubmit={signin} className='flex flex-col items-center'>
        <fieldset className='mt-6 w-[300px]'>
          <legend className='mb-6'>Select Lens Profile</legend>
          <UserLensProfileCardsWrapper profileList={profiles} parentSetter={setSelectedProfile} />
        </fieldset>
        <fieldset className='mt-6'>
          <legend className='ml-2 translate-y-2 bg-bgColor px-1'>Primary Language</legend>
          <select defaultValue={'English'} className='w-[300px] h-10 outline-none border-[1px] border-black pl-2 bg-bgColor'>
            <option value="French">FRENCH</option>
            <option value="English">ENGLISH</option>
            <option value="Spanish">SPANISH</option>
          </select>
        </fieldset>
        <button type="submit" className='h-10 w-[300px] mt-8 flex items-center justify-center bg-slate-800 text-white'>Submit</button>
      </form>
    </ScreenWrapper>
  )
}

export default Signin