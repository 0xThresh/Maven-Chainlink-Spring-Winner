import DashboardSideBar from '@/components/DashboardSideBar'
import React from 'react'

const AgencyDashboard = () => {
  return (
    <>
      {/** header can go here */}
      <div className="flex">
        <DashboardSideBar />
        AgencyDashboard
      </div>
    </>
  )
}

export default AgencyDashboard