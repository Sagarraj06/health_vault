import React, { useState, useEffect } from "react";
import { api } from "../../axios.config.js"; // Import API instance

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    slotId: "", // Changed from timeSlot to slotId
  });
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch available doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/user/doctors");
        setDoctors(response.data);
      } catch (error) {
        setError("Failed to load doctors. Please try again.");
        console.error("Error fetching doctors:", error.response?.data || error.message);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setAvailableSlots([]);
      setFormData((prev) => ({ ...prev, slotId: "" }));
      if (!formData.doctorId || !formData.date) return;
      setLoading(true);
      setError("");
      try {
        const response = await api.get(
          `/user/doctor/${formData.doctorId}/available-slots?date=${formData.date}`
        );
        setAvailableSlots(response.data);
        if (response.data.length === 0) {
          setError("No available slots for this date. Please try another date.");
        }
      } catch (error) {
        setError("Failed to load available time slots. Please try again.");
        console.error("Error fetching slots:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableSlots();
  }, [formData.doctorId, formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Convert slotId to number for comparison (select returns string, DB has integer)
      const slotIdNum = parseInt(formData.slotId, 10);
      const selectedSlot = availableSlots.find((slot) => slot.id === slotIdNum);
      if (!selectedSlot) {
        throw new Error("Selected time slot not found. Please try again.");
      }
      const dateStr = formData.date;
      const timeStr = selectedSlot.time;
      let time24h = timeStr;
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        const [hourMin, period] = timeStr.split(" ");
        let [hours, minutes] = hourMin.split(":").map(Number);
        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        time24h = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      }

      // Create UTC datetime string directly (no timezone conversion)
      // This matches the format stored in the database
      const slotDateTimeStr = `${dateStr}T${time24h}:00.000Z`;

      const appointmentData = {
        doctorId: formData.doctorId,
        slotDateTime: slotDateTimeStr,
      };

      const response = await api.post("/appointment", appointmentData);
      setSuccess("Appointment booked successfully!");
      setFormData({ doctorId: "", date: "", slotId: "" });
      setAvailableSlots([]);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];
  const today = formatDate(new Date());

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-dark p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="glass-card rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-lg md:max-w-xl lg:w-1/2 mb-8 md:mb-0 border border-white/10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary text-center">Book Your Appointment</h2>
        <p className="text-gray-300 text-center mt-2 text-sm sm:text-base">Schedule your appointment easily with our doctors.</p>

        {success && <div className="bg-green-500/10 border-l-4 border-green-500 text-green-400 p-2 sm:p-3 my-3 sm:my-4 text-sm sm:text-base">{success}</div>}
        {error && <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-2 sm:p-3 my-3 sm:my-4 text-sm sm:text-base">{error}</div>}

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 text-sm sm:text-base mb-1">Select Doctor</label>
            <select
              name="doctorId"
              className="w-full border border-white/20 rounded-md p-2 text-sm sm:text-base bg-surface text-white focus:outline-none focus:border-primary"
              onChange={handleChange}
              value={formData.doctorId}
              required
            >
              <option value="" className="bg-dark">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id} className="bg-dark">{doctor.name} - {doctor.specialization}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm sm:text-base mb-1">Select Date</label>
            <input
              type="date"
              name="date"
              min={today}
              className="w-full border border-white/20 rounded-md p-2 text-sm sm:text-base bg-surface text-white focus:outline-none focus:border-primary"
              onChange={handleChange}
              value={formData.date}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm sm:text-base mb-1">Select Time Slot</label>
            <select
              name="slotId"
              className="w-full border border-white/20 rounded-md p-2 text-sm sm:text-base bg-surface text-white focus:outline-none focus:border-primary"
              onChange={handleChange}
              value={formData.slotId}
              required
            >
              <option value="" className="bg-dark">Select Time Slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id} className="bg-dark">{slot.time}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-primary/80 disabled:bg-gray-600 text-sm sm:text-base transition-colors"
            disabled={!formData.slotId}
          >
            {loading ? "Processing..." : "Book Appointment"}
          </button>
        </form>
      </div>

      <div className="hidden md:block md:w-1/2 lg:flex lg:w-1/2 justify-center items-center">
        <img
          src="../src/assets/patientform.png"
          alt="Doctor Consultation"
          className="w-full max-w-sm lg:max-w-md rounded-lg drop-shadow-2xl opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
  );
};

export default AppointmentForm;