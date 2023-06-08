import { profileHandlesState, selectedHandleState } from '@/store'
import { formatPicture } from '@/utils'
import { useProfile } from '@lens-protocol/react-web'
import { useRecoilState, useRecoilValue } from 'recoil'

type NavigationBoardProps = {
  dashboardName: string
  profileName:string 
  connected: boolean
}

const Navigations = ({isUserDashboard}:{isUserDashboard?:boolean}) => {

  const [handleIndex, setHandleIndex] = useRecoilState(selectedHandleState)
  const handles = useRecoilValue(profileHandlesState)

  const { data:profile } = useProfile({handle:handles[handleIndex]})

  const moveToPreviousHandle = () => {
    if(handleIndex <= 0) {
      return
    }
    setHandleIndex(handleIndex-1)

  }

  const moveToNextHandle = () => {
    if(handleIndex >= handles.length) {
      return
    }
    setHandleIndex(handleIndex+1)
  }

  return (
    <>
    <NavigationBoard dashboardName={isUserDashboard ? 'User' : 'Agency'} profileName='Vitalik.lens' connected={profile?.ownedByMe ? true : false}/>
    <div className='w-full h-14 flex items-center bg-neutralGray rounded-lg border-2 border-gray-600'>
        <div className='h-full flex items-center mx-16'>
        {
          profile?.picture?.__typename === 'MediaSet' && (
            <img
              alt={profile.handle}
              className='h-10 w-10 mr-6 rounded-full'
              src={formatPicture(profile.picture)}
            />
          )
        }
          <h2>{profile?.handle}</h2>  
        </div>
        <div className='flex'>
            <button onClick={moveToPreviousHandle}><img src="/assets/arrowLeft.svg" className='h-5 mr-5' alt="" /></button>
            <button onClick={moveToNextHandle}><img src="/assets/arrowRight.svg" className='h-5' alt="" /></button>
        </div>
    </div>
    </>
  )
}

const NavigationBoard = ({dashboardName, profileName, connected}:NavigationBoardProps) => {
  return (
    <div className='w-full h-14 flex items-center bg-neutralGray rounded-lg border-2 my-4 border-gray-600'>
      <div className='w-8/12 h-full flex items-center justify-between'>
        <div className='h-full flex items-center mx-12'>
          <img className='h-5 w-5 mr-4 rounded-full' src="/assets/homeIcon.svg" alt=""/>
          <h2>{dashboardName} Dashboard</h2>  
        </div>
        <div className='flex items-center'>
          <div className='mr-3 bg-gray-800 text-white py-1 px-4'>In Progress</div>
          <div className='mr-3'>Completed</div>
          <div>All</div>
        </div>
        
      </div>
        
      <div className='flex justify-end w-4/12 mr-16'>
        <span className='mr-4'>{profileName}</span>
        <button className='text-sm text-gray-500'><i>{connected ? 'Connected' : 'Not connected'}</i></button>
      </div>
    </div>
  )
}

export default Navigations