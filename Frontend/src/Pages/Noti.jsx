import React from 'react'
import AppointmentNoti from '../components/Noti/AppointmentNoti'
import LeaveNoti from '../components/Noti/LeaveNoti'
const Noti = () => {
  return (
    <div className="bg-dark min-h-screen">


      <div className="flex justify-center items-center py-10">
        <AppointmentNoti
          notification={{
            student: "John Doe",
            doctor: "Smith",
            date: "March 30, 2025",
            time: "10:00 AM"
          }}
        />
      </div>


      <div className="flex justify-center items-center py-10">
        <LeaveNoti
          student="John Doe"
          reason="Health Issues"
          startDate="April 5, 2025"
          endDate="April 10, 2025"
        />
      </div>
    </div>
  )
}

export default Noti