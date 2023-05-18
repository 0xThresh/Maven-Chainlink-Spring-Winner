import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import ScreenWrapper from '@/components/ScreenWrapper'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <ScreenWrapper>
      <div className='w-3/12 flex justify-between'>
        <span className='flex items-center justify-center py-2 px-4 w-40 text-lg rounded-[26px] bg-slate-800 text-white hover:text-slate-800 hover:bg-white hover:border-[1px] hover:border-slate-800'>
          <Link href={'/agency/signin'}>Agency Login</Link>
        </span>
        <span className='flex items-center justify-center py-2 px-4 w-40 text-lg rounded-[26px] border-[1px] border-slate-800 bg-[#E9E8E4] hover:bg-slate-800 hover:text-white'>
          <Link href={'/user/signin'}>User Login</Link>
        </span>  
      </div>
    </ScreenWrapper>
  )
}
