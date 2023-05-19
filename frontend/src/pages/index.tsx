import { Inter } from 'next/font/google'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const connectWallet = async () => {}

  const handleSignIn = async (userType: "agency" | "user") => {
    try {
      await connectWallet()

      if(userType === "agency") {
        router.push("/agency/signin")
      } else {
        router.push("/user/signin")
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <ScreenWrapper>
      <div className='w-3/12 flex justify-between'>
        <button className=' btn-primary-color-changing py-2 px-4 w-40 text-lg rounded-[26px]' onClick={() => handleSignIn("agency")}>
          Agency Login
        </button>

        <button className='btn-secondary-color-changing py-2 px-4 w-40 text-lg  rounded-[26px]' onClick={() => handleSignIn("user")}>
          User Login
        </button>  
      </div>
    </ScreenWrapper>
  )
}
