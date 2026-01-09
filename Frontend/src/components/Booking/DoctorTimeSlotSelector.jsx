import React, { useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { api } from '../../axios.config.js';

const DoctorTimeSlotSelector = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const timeSlotOptions = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  // Date selection handler - moved to form submission to prevent multiple triggers
  const handleDateSelect = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();
      const selectedDate = e.target.value;
      if (selectedDate && !selectedDates.includes(selectedDate)) {
        setSelectedDates([...selectedDates, selectedDate]);
        setTimeSlots({
          ...timeSlots,
          [selectedDate]: []
        });
        // Clear the input field after selection
        e.target.value = '';
      }
    }
  };

  // Remove a selected date
  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
    const updatedTimeSlots = { ...timeSlots };
    delete updatedTimeSlots[dateToRemove];
    setTimeSlots(updatedTimeSlots);
  };

  // Toggle time slot selection for a specific date
  const toggleTimeSlot = (date, slot) => {
    const currentSlots = timeSlots[date] || [];
    if (currentSlots.includes(slot)) {
      setTimeSlots({
        ...timeSlots,
        [date]: currentSlots.filter(s => s !== slot)
      });
    } else {
      setTimeSlots({
        ...timeSlots,
        [date]: [...currentSlots, slot]
      });
    }
  };

  // Format data for API submission
  const formatSlotsForSubmission = () => {
    const formattedSlots = [];
    Object.keys(timeSlots).forEach(date => {
      timeSlots[date].forEach(time => {
        const [timeValue, period] = time.split(' ');
        let [hours, minutes] = timeValue.split(':');
        // Convert to 24-hour format
        if (period === 'PM' && hours !== '12') {
          hours = parseInt(hours) + 12;
        } else if (period === 'AM' && hours === '12') {
          hours = '00';
        }
        const dateTime = new Date(`${date}T${hours}:${minutes}:00`);
        formattedSlots.push({
          dateTime,
          isBooked: false
        });
      });
    });
    return formattedSlots;
  };

  // Handle add date button click
  const handleAddDate = () => {
    const dateInput = document.getElementById('dateInput');
    if (dateInput && dateInput.value) {
      const selectedDate = dateInput.value;
      if (!selectedDates.includes(selectedDate)) {
        setSelectedDates([...selectedDates, selectedDate]);
        setTimeSlots({
          ...timeSlots,
          [selectedDate]: []
        });
        // Clear the input field
        dateInput.value = '';
      }
    }
  };

  // Submit time slots to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const formattedSlots = formatSlotsForSubmission();
      if (formattedSlots.length === 0) {
        setMessage({ text: 'Please select at least one time slot', type: 'error' });
        setLoading(false);
        return;
      }
      await api.patch('doctor/slots/update', { slots: formattedSlots });
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      setSelectedDates([]);
      setTimeSlots({});
    } catch (error) {
      console.error('Error updating slots:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to update time slots',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-24 p-4 md:p-8 glass-card animate-fade-in">
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 p-4">
          <div className="glass-card p-6 w-full max-w-md animate-fade-in">
            <div className="flex flex-col items-center">
              <CheckCircle className="text-primary w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-300 text-center mb-4">
                Your time slots have been added successfully.
              </p>
              <button
                className="btn-animated bg-gradient-to-r from-primary to-secondary text-white py-2 px-6 rounded-lg"
                onClick={() => setShowSuccessPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center mb-6">
        <Calendar className="mr-2 text-primary" />
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Add Available Time Slots</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">Select Date</label>
          <div className="flex space-x-2">
            <input
              id="dateInput"
              type="date"
              className="w-full p-3 border border-white/20 rounded-lg bg-surface/50 text-white focus:outline-none focus:border-primary transition-all duration-300"
              onKeyDown={(e) => e.key === 'Enter' && handleAddDate()}
              min={new Date().toISOString().split('T')[0]}
            />
            <button
              type="button"
              className="btn-animated bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg whitespace-nowrap"
              onClick={handleAddDate}
            >
              Add Date
            </button>
          </div>
        </div>

        {selectedDates.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Selected Dates</h3>
            <div className="space-y-4">
              {selectedDates.map(date => (
                <div key={date} className="border border-white/10 rounded-lg p-4 bg-surface/30">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-white">
                      {new Date(date).toLocaleDateString()}
                    </h4>
                    <button
                      type="button"
                      className="text-red-400 hover:text-red-300 transition-colors"
                      onClick={() => handleRemoveDate(date)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {timeSlotOptions.map(slot => (
                      <button
                        key={`${date}-${slot}`}
                        type="button"
                        className={`py-2 px-3 rounded-lg text-sm transition-all duration-200 ${timeSlots[date]?.includes(slot)
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-surface/50 text-gray-300 border border-white/20 hover:bg-white/5 hover:border-primary'
                          }`}
                        onClick={() => toggleTimeSlot(date, slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {message.text && message.type === 'error' && (
          <div className="p-4 rounded-lg mb-4 bg-red-500/20 text-red-400 border border-red-500/50">
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-animated bg-gradient-to-r from-primary to-secondary text-white py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || selectedDates.length === 0}
          >
            {loading ? 'Saving...' : 'Save Time Slots'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorTimeSlotSelector;