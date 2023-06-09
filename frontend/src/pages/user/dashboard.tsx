import ProfilesNavigation from "@/components/Navigations";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import React, { useEffect } from "react";
import { useProfile } from "@lens-protocol/react-web";
import { useRecoilValue } from "recoil";
import {profileHandlesState, selectedHandleState} from "@/store";
import Router from "next/router";
import DashboardNavBar from "@/components/DashboardNavBar";
import DashboardSideBar from "@/components/DashboardSideBar";
import Image from "next/image";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {

  const handleIndex = useRecoilValue(selectedHandleState);
  const handles = useRecoilValue(profileHandlesState);

  const { data:profile } = useProfile({handle:handles[handleIndex]});

  //@ts-ignore
  const data = {
    labels: ["Mirrors", "Collects", "Follows"],
    datasets: [
      {
        id: 1,
        label: "Analytics",
        data: [profile?.stats.mirrorsCount, profile?.stats.totalCollects, profile?.stats.totalFollowers],
        backgroundColor: [
          "#f38b4a",
          "#56d798",
          "#ff8397"
        ],
      }
    ],
  };


  useEffect(() => {
    if(handles[0] == "") {
      Router.replace("/");
    }
  }, [handles]);

  return (
    <div className="h-full w-full">
      <div className="h-10 w-full">
        <DashboardNavBar/>
      </div>
      <div className="h-[calc(100vh-5rem)] w-full flex p-8">
        <div className="h-full w-0 overflow-hidden lg:w-3/12">
          <DashboardSideBar/>
        </div>
        <div className="h-full w-full lg:w-9/12">
          <ProfilesNavigation isUserDashboard/>
          <div className="sm:h-80 w-full flex flex-col sm:flex-row justify-between mt-6">
            <div className="w-full sm:w-8/12 bg-white self-start pb-4 border-2 border-gray-500 rounded-lg overflow-hidden">
              <h3 className="w-full px-4 py-2 bg-slate-100 border-b-2 border-gray-500">Agencies</h3>
              <div className="w-full flex flex-col items-center mt-4">
                <AgencyInfo name="Social bits" image="https://rdsdigital.in/wp-content/uploads/2022/01/RDS-1-02-212.webp" timeLeft="30"/>
                <AgencyInfo name="Lens pro" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNasUijc70TWWihS3Y1VvD_hSk7fUj9uUK6ftc9F1cCboxPGfcDt6SH34-CrGHFUCd5_o&usqp=CAU" timeLeft="7"/>
              </div>
            </div>
            <div className="w-6/12 sm:w-3/12 my-2 sm:my-0 ml-[25%] sm:ml-0 bg-white self-start pb-4 border-2 border-gray-500 rounded-lg overflow-hidden">
              <h3 className="w-full px-4 py-2 bg-slate-100 border-b-2 border-slate-500">Agencies</h3>
              <ul className="ml-2 mt-4">
                <li>Mirrors: <span className="font-bold ml-2"><i>{profile?.stats.mirrorsCount}</i></span></li>
                <li>Collects:<span className="font-bold ml-2"><i>{profile?.stats.totalCollects}</i></span></li>
                <li>Folows:<span className="font-bold ml-2"><i>{profile?.stats.totalFollowers}</i></span></li>
              </ul>
            </div>
          </div>
          <div className="w-full flex justify-between items-center mt-2">
            <div className="hidden md:block md:w-3/12 h-60 bg-white self-start pb-4 border-2 border-gray-500 rounded-xl">
              <Doughnut data={data}/>
            </div>
            <div className="w-full md:w-8/12 h-60 bg-white self-start pb-4 border-2 border-gray-500 rounded-xl">
              <Line datasetIdKey="id" data={data} className="h-full w-full"/>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;



const AgencyInfo = ({image, name, timeLeft}:{image:string, name:string, timeLeft:string}) => {

  return(
    <div className="h-10 sm:h-14 w-11/12 flex justify-between items-center px-4 mb-4 rounded-xl shadow-lg">
      <Image height={50} width={50} src={image} alt="agency" className="h-8 w-8 sm:h-10 sm:w-10 rounded-[50%] bg-black" />
      <span className="w-5/12 truncate">{name} Agency</span>
      <progress max={30} value={timeLeft}></progress>
    </div>
  );
};