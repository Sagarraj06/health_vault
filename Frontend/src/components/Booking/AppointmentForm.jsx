import React, { useState, useEffect } from "react";
import { api } from "../../axios.config.js";
import { CalendarCheck, Clock, User, ArrowRight } from "lucide-react";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    slotId: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      const slotIdNum = parseInt(formData.slotId, 10);
      const selectedSlot = availableSlots.find((slot) => slot.id === slotIdNum);
      if (!selectedSlot) throw new Error("Selected time slot not found.");

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

      const slotDateTimeStr = `${dateStr}T${time24h}:00.000Z`;
      const appointmentData = { doctorId: formData.doctorId, slotDateTime: slotDateTimeStr };

      await api.post("/appointment", appointmentData);
      setSuccess("Appointment booked successfully!");
      setFormData({ doctorId: "", date: "", slotId: "" });
      setAvailableSlots([]);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];
  const today = formatDate(new Date());

  const selectClass =
    "w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none";

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text font-[Space_Grotesk]">
                Book Your Appointment
              </h2>
              <p className="text-xs text-text-light">
                Schedule easily with our doctors.
              </p>
            </div>
          </div>

          {success && (
            <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600 text-sm mb-4">
              {success}
            </div>
          )}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5">
                <User className="w-4 h-4 text-text-light" />
                Select Doctor
              </label>
              <select
                name="doctorId"
                className={selectClass}
                onChange={handleChange}
                value={formData.doctorId}
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5">
                <CalendarCheck className="w-4 h-4 text-text-light" />
                Select Date
              </label>
              <input
                type="date"
                name="date"
                min={today}
                className={selectClass}
                onChange={handleChange}
                value={formData.date}
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text mb-1.5">
                <Clock className="w-4 h-4 text-text-light" />
                Select Time Slot
              </label>
              <select
                name="slotId"
                className={selectClass}
                onChange={handleChange}
                value={formData.slotId}
                required
              >
                <option value="">Choose a time slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.time}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-card text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 mt-2"
              disabled={!formData.slotId || loading}
            >
              {loading ? "Processing..." : "Book Appointment"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
