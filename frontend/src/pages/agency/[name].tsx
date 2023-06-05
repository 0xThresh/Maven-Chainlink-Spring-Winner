import DashboardSideBar from '@/components/DashboardSideBar'
import DashboardNavBar from '@/components/DashboardNavBar'
import React from 'react'

const AgencyDashboard = () => {
  return (
    <>
      <DashboardNavBar />
      {/** header can go here */}
      <div className="flex">
        <DashboardSideBar />
        AgencyDashboard
      </div>
    </>
  )
}

export default AgencyDashboard