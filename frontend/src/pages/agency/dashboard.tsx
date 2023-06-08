import React, { FormEvent, useState } from 'react'
import ProfilesNavigation from '@/components/Navigations'
import { Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

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

      </div>
      <div className='h-[calc(100vh-5rem)] w-full flex p-8'>
        <div className='h-full w-3/12'>
          {/** sidebar */}
        </div>
        <div className='h-full w-9/12'>
          <ProfilesNavigation/>
          <div className='h-80 w-full flex justify-between mt-6'>
            <div className='w-7/12 bg-white self-start border-2 border-gray-500 rounded-xl'>
              <form className='w-full flex flex-col items-center mt-4' onSubmit={postToLens}>
                <div className='flex w-full h-3/4 justify-between px-10'>
                  <label htmlFor='video' className='w-5/12 h-40 flex items-center justify-center cursor-pointer bg-bgColor rounded-xl border-2 border-black'>
                    <p>{!post.video ? 'Upload video':'Video uploaded'}</p>
                    <input id='video' onChange={(e) => setPost({...post, video:e.target.files[0] })} accept='video/*' type="file" hidden />
                  </label>
                  <label htmlFor='image' className='w-5/12 h-40 flex items-center justify-center cursor-pointer bg-bgColor rounded-xl border-2 border-black'>
                    <p>{!post.image ? 'Upload image' : 'Image uploaded'}</p>
                    <input id='image' type="file" onChange={(e) => setPost({...post, image:e.target.files[0] })} accept='image/*' hidden />
                  </label>
                  
                </div>
                <div className='h-20 w-full flex items-center px-4'>
                  <img src="" alt="" className='h-12 w-12 rounded-[50%] bg-black' />
                  <div className='flex-1 flex items-center border-2 border-gray-500 h-12 ml-2 px-3 rounded-xl'>

                    <input type="text" onChange={(e) => setPost({...post, text:e.target.value })} className='flex-1 h-9 bg-transparen outline-none' />

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
              <div className='w-4/12 bg-white self-start pb-4 border-2 border-gray-500 rounded-xl'>
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
            <div className='w-3/12 h-60 bg-white self-start pb-4 border-2 border-gray-500 rounded-xl'>
              <Doughnut data={data}/>
            </div>
            <div className='w-8/12 h-60 bg-white self-start pb-4 border-2 border-gray-500 rounded-xl'>
              <Line datasetIdKey='id' data={data} className='h-full w-full'/>
            </div>
          </div>
        </div>
        </div>
      </div>
    
  )
}

export default AgencyDashboard