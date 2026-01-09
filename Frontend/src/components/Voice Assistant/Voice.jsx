import { ai_api } from '../../axios.config';

export default function Voice() {
  const [mode, setMode] = useState('voice'); // 'voice' or 'manual'
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // For manual booking
  const [step, setStep] = useState(1);
  const [doctorName, setDoctorName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Calls the voice command endpoint
  const handleVoiceCommand = async () => {
    setLoading(true);
    setStatus('Starting voice assistant…');
    try {
      const response = await ai_api.get('/voice-command');
      setStatus(response.data.message || 'Session ended.');
    } catch (error) {
      setStatus('Error connecting to voice assistant.');
    }
    setLoading(false);
  };

  // Handles manual booking submission.
  const handleManualSubmit = async () => {
    // For demonstration we log the input.
    // Note: Your Python endpoint currently does not accept manual input,
    // so this call is to the existing /book-appointment endpoint.
    setLoading(true);
    setStatus('Submitting your appointment…');
    try {
      // In a real scenario you'd send the collected data as POST body or query params.
      // Your backend function would need to be modified to use these values.
      const response = await ai_api.get('/book-appointment', {
        params: { doctor_name: doctorName, purpose, date, time },
      });
      setStatus(response.data.message || 'Appointment booked.');
    } catch (error) {
      setStatus('Error submitting appointment.');
    }
    setLoading(false);
  };

  // Render the manual form steps
  const renderManualStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p className="text-primary mb-2">Enter the Doctor's Name:</p>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full p-2 border border-white/20 rounded bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => doctorName && setStep(2)}
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded transition-colors"
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <p className="text-primary mb-2">Enter the Purpose of Appointment:</p>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2 border border-white/20 rounded bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => purpose && setStep(3)}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="text-primary mb-2">Enter the Appointment Date (YYYY-MM-DD):</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-white/20 rounded bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => date && setStep(4)}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="text-primary mb-2">Enter the Appointment Time (e.g., 02:30 PM):</p>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g., 02:30 PM"
              className="w-full p-2 border border-white/20 rounded bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleManualSubmit}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded transition-colors"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Appointment'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-primary mb-6">Health Mitra</h1>

      {/* Mode Toggle */}
      <div className="mb-6 glass-card p-1 rounded-lg border border-white/10">
        <button
          onClick={() => {
            setMode('voice');
            setStatus('');
          }}
          className={`px-4 py-2 rounded-lg transition-all ${mode === 'voice' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Voice Assistant
        </button>
        <button
          onClick={() => {
            setMode('manual');
            setStatus('');
            setStep(1);
          }}
          className={`px-4 py-2 rounded-lg transition-all ${mode === 'manual' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Manual Booking
        </button>
      </div>

      {mode === 'voice' ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-300 mb-4 text-center max-w-md">
            Use your voice to interact with Health Mitra for booking appointments and applying for leave.
          </p>
          <button
            onClick={handleVoiceCommand}
            disabled={loading}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${loading
              ? 'bg-gray-600 cursor-not-allowed text-gray-400'
              : 'bg-primary hover:bg-primary/80 text-white hover:shadow-primary/50'
              }`}
          >
            {loading ? 'Listening...' : 'Start Voice Assistant'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md glass-card p-6 rounded-xl border border-white/10">
          <h2 className="text-2xl font-semibold text-primary mb-4">Manual Booking</h2>
          {renderManualStep()}
        </div>
      )}

      {status && (
        <div className="mt-6 bg-surface border border-white/10 rounded-xl p-4 w-full max-w-md text-center shadow-sm">
          <p className="text-primary font-medium">{status}</p>
        </div>
      )}
    </div>
  );
}
