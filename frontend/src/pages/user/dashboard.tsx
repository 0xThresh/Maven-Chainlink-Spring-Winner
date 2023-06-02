import ProfilesNavigation from '@/components/Navigations'
import { Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import React from 'react'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {

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
          <ProfilesNavigation isUserDashboard/>
          <div className='h-80 w-full flex justify-between mt-6'>
            <div className='w-8/12 bg-white self-start pb-4 border-2 border-gray-500'>
              <h3 className='w-full px-4 py-2 bg-slate-100 border-b-2 border-gray-500'>Agencies</h3>
              <div className='w-full flex flex-col items-center mt-4'>

                <AgencyInfo name='RandomAgency' image='/hh' timeLeft='30'/>
                <AgencyInfo name='RandomAgency' image='/hh' timeLeft='5'/>
                <AgencyInfo name='RandomAgency' image='/hh' timeLeft='30'/>

              </div>
            </div>
            <div className='w-3/12 bg-white self-start pb-4 border-2 border-gray-500'>
              <h3 className='w-full px-4 py-2 bg-slate-100 border-b-2 border-slate-500'>Agencies</h3>
              <ul className='ml-2 mt-4'>
                <li>Mirrors: <span className='font-bold ml-2'><i>45</i></span></li>
                <li>Collects:<span className='font-bold ml-2'><i>85</i></span></li>
                <li>Folows:<span className='font-bold ml-2'><i>35</i></span></li>
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

export default Dashboard



const AgencyInfo = ({image, name, timeLeft}:{image:string, name:string, timeLeft:string}) => {

  return(
    <div className='h-14 w-11/12 flex justify-between items-center px-4 mb-4 rounded-xl shadow-lg'>
      <img src={image} alt="agency" className='h-10 w-10 rounded-[50%] bg-black' />
      <span>Random or weird agency name</span>
      <progress max={30} value={timeLeft}></progress>
    </div>
  )
}