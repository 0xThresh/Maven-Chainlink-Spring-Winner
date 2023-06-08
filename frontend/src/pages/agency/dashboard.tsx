import React, { FormEvent, useState } from 'react'
import ProfilesNavigation from '@/components/Navigations'
import { Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import DashboardSideBar from '@/components/DashboardSideBar';
import DashboardNavBar from '@/components/DashboardNavBar';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

type Post = {
  text:string 
  image: File | null
  video: File | null
}

const AgencyDashboard = () => {

  const [post, setPost] = useState<Post>({
    text:'',
    image:null,
    video:null
  })

  const postToLens = (e:FormEvent) => {
    e.preventDefault()
    console.log(post)
  }

  //@ts-ignore
  const data = {
    labels: ['Mirrors', 'Collects', 'Follows'],
    datasets: [
      {
        id: 1,
        label: 'Analytics',
        data: [5, 6,9],
        backgroundColor: [
          "#f38b4a",
          "#56d798",
          "#ff8397"
        ],
      }
    ],
  }

  return (
    <div className='h-full w-full'>
      <div className='h-10 w-full'>
        <DashboardNavBar/>
      </div>
      <div className='h-[calc(100vh-5rem)] w-full flex p-8'>
        <div className='h-full w-0 overflow-hidden lg:w-3/12'>
          <DashboardSideBar/>
        </div>
        <div className='h-full w-full lg:w-9/12'>
          <ProfilesNavigation/>
          <div className='sm:h-80 w-full flex flex-col sm:flex-row justify-between mt-6'>
            <div className='w-full Sm:w-7/12 bg-white self-start border-2 border-gray-500 rounded-xl overflow-hidden'>
              <form className='w-full flex flex-col items-center mt-4' onSubmit={postToLens}>
                <div className='flex w-full sm:h-3/4 justify-evenly sm:justify-between px-1 sm:px-10'>
                  <label htmlFor='video' className='sm:w-5/12 h-20 sm:h-40 text-sm px-2 sm:px-0 sm:text-lg flex items-center justify-center cursor-pointer bg-bgColor rounded-xl border-2 border-black'>
                    <p>{!post.video ? 'Upload video':'Video uploaded'}</p>
                    <input id='video' onChange={(e) => setPost({...post, video:e.target.files![0] })} accept='video/*' type="file" hidden />
                  </label>
                  <label htmlFor='image' className='sm:w-5/12 h-20 sm:h-40 text-sm px-2 sm:px-0 sm:text-lg flex items-center justify-center cursor-pointer bg-bgColor rounded-xl border-2 border-black'>
                    <p>{!post.image ? 'Upload image' : 'Image uploaded'}</p>
                    <input id='image' type="file" onChange={(e) => setPost({...post, image:e.target.files![0] })} accept='image/*' hidden />
                  </label> 
                </div>
                <div className='h-20 w-full flex items-center px-1 sm:px-4'>
                  <img src="" alt="" className='h-12 w-12 hidden sm:block rounded-[50%] bg-black' />
                  <div className='flex-1 flex items-center border-2 border-gray-500 h-8 sm:h-12 sm:ml-2 px-3 rounded-xl'>

                    <input type="text" onChange={(e) => setPost({...post, text:e.target.value })} className='flex-1 h-9 bg-transparent outline-none' />

                    <div className='mx-1 h-6 w-6'>
                      <img src="/assets/camera.svg" className='h-full w-full' alt="" />
                    </div>
                    <div className='mx-1 h-6 w-6'>
                    <img src="/assets/photo.svg" className='h-full w-full' alt="" />
                    </div>
                    <div className='mx-1 h-6 w-6'>
                    <img src="/assets/smiley.svg" className='h-full w-full' alt="" />
                    </div>
                  </div>
                </div>

              </form>
              </div>
              <div className='w-6/12 sm:w-4/12 my-2 sm:my-0 ml-[25%] sm:ml-4 bg-white self-start pb-4 border-2 border-gray-500 rounded-xl'>
              <h3 className='w-full px-4 py-2 bg-slate-100 border-b-2 border-slate-500 overflow-hidden rounded-xl'>Recent activities</h3>
              <ul className='ml-2 mt-4'>
                <li className='flex items-center justify-between w-11/12 text-xs mb-2'>
                  <span className='w-8/12'>12 people have mirrored the <b>“asdgasdg”</b> post</span> 
                  <span className='font-semibold'>45 minutes ago</span>
                </li>
                <li className='flex items-center justify-between w-11/12 text-xs mb-2'>
                  <span className='w-8/12'>12 people have mirrored the <b>“asdgasdg”</b> post</span>
                  <span className='font-bold text-left'>3minutes ago</span>
                </li>
                <li className='flex items-center justify-between w-11/12 text-xs mb-2'>
                  <span className='w-8/12'>12 people have mirrored the <b>“asdgasdg”</b> post</span>
                  <span className='font-bold'>35 minutes ago</span>
                </li>
              </ul>
          </div>
          </div>
          <div className='w-full flex justify-between items-center mt-2'>
            <div className='hidden md:block md:w-3/12 h-60 bg-white self-start pb-4 border-2 border-gray-500 rounded-xl'>
              <Doughnut data={data}/>
            </div>
            <div className='w-full md:w-8/12 h-60 bg-white self-start pb-4 border-2 border-gray-500 rounded-xl'>
              <Line datasetIdKey='id' data={data} className='h-full w-full'/>
            </div>
          </div>
        </div>
        </div>
      </div>
    
  )
}

export default AgencyDashboard