import React from "react";
import { Calendar } from "lucide-react";

const LeaveNoti = ({ student, reason, startDate, endDate }) => {
  return (
    <div className="glass-card border border-white/10 shadow-lg rounded-2xl p-4 w-96 flex items-center gap-4">
      <div className="bg-primary/20 p-3 rounded-full">
        <Calendar className="text-primary" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">
          Medical Leave Request
        </h3>
        <p className="text-sm text-gray-300">
          {student} has applied for medical leave from {startDate} to {endDate} due to {reason}.
        </p>
        <button className="mt-2 bg-primary text-white hover:bg-primary/80 rounded-lg px-4 py-2 text-sm transition-colors">
          Approve Request
        </button>
      </div>
    </div>
  );
};

export default LeaveNoti;