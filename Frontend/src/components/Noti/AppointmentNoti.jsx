import React from "react";
import { Bell } from "lucide-react";

const AppointmentNoti = ({ notification }) => {
  return (
    <div className="glass-card border border-white/10 shadow-lg rounded-2xl p-4 w-96 flex items-center gap-4">
      <div className="bg-primary/20 p-3 rounded-full">
        <Bell className="text-primary" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">
          Appointment Reminder
        </h3>
        <p className="text-sm text-gray-300">
          {notification.student} has an appointment with Dr.{" "}
          {notification.doctor} on {notification.date} at {notification.time}.
        </p>
        <button className="mt-2 bg-primary text-white hover:bg-primary/80 rounded-lg px-4 py-2 text-sm transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default AppointmentNoti;
