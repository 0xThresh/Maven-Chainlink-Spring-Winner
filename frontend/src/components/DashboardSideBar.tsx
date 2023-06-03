const DashboardSideBar = () => {
  return (
    <div className=" w-72 bg-bgColor h-[90vh] border-r-2 border-[#2A2538] flex flex-col mt-20">
      <div className=" border-b-2 border-[#91ACB0] pl-6 py-3 text-xl cursor-pointer  flex items-center">
        <img src="/assets/smileySideNavBar.svg" alt="" className='h-18 w-18 mr-3' />
        Clients
      </div>

      <div className=" border-b-2 border-[#91ACB0] pl-6 py-3 text-xl cursor-pointer flex items-center">
        <img src="/assets/plot.svg" alt="" className='h-18 w-18 mr-3' />
        Overall Analytics
      </div>

      <div className="pl-8 mt-10 space-y-2">
          <ul>Today</ul>
          <ul>Weekly</ul>
          <ul>Monthly</ul>
          <ul>All time</ul>
      </div>

      <div className="flex-grow flex flex-col justify-end">
        <div className="flex pl-6 cursor-pointer border-b-2 border-[#91ACB0]">
          Notification <img src="/assets/upArrow.svg" alt="" className='h-18 w-18 ml-3' />
        </div>

        <div className="flex items-center justify-center px-6 py-4 text-sm">
          {/** Recent notificaions */}
          BooBooBear12 just posted
        </div>
      </div>

    </div>
  )
}

export default DashboardSideBar

