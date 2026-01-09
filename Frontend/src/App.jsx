import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "../src/components/Navbar/Navbar";
import pusher from "./pusher";
import { showAlert } from "./components/alert-system.js";


import HomePage from "./Pages/HomePage";
import PatientForm from "./Pages/PatientForm";
import Aibot from "./Pages/Aibot";
import Booking from "./Pages/Booking";
import Contact from "./Pages/Contact";
import VideoCall from "./Pages/VideoCall";
import DoctorsDashboard from "./Pages/DoctorsDashboard";
import Dashboard from "./components/StudentDashboard/Dashboard";
import SignUp from "./components/Login/SignUp";
import Certificates from "./components/medicalcertificate/Certificates";
import Login from "./components/Login/Login";
import MedicalLeave from "./Pages/MedicalLeave";
import ErrorBoundary from "./context/ErrorBoundary";
import MedicalAI from "./components/aifeatures/medicalai";
import MedicalCertificateGenerator from "./components/aifeatures/MedicalCertificateGenerator";
import VerificationScreen from "./components/aifeatures/VerificationScreen";
import Certificate from "./Pages/Certificate";
import AdminDashboard from "./components/StudentDashboard/Admindashboard";
import DocDash from "./components/StudentDashboard/DocDash";
import Predictionchat from "./components/aitanissa/Predictionchat";
import Leavechat from "./components/aitanissa/Leavechat";
import HealthRecordForm from "./components/Healthrecordform/HealthRecordForm";
import DoctorInsightsChat from "./components/aitanissa/DoctorInsightsChat";
import DoctorTimeSlotSelector from "./components/Booking/DoctorTimeSlotSelector";
import PrescriptionGenerator from "./components/aitanissa/PrescriptionGenerator";
import Healthchat from "./components/aitanissa/Healthchat";
import Noti from "./Pages/Noti";
import Payments from "./components/Payments/payment";
import NotiScreen from "./components/Noti/NotiScreen";
import Voice from "./components/Voice Assistant/Voice";
import Notibell from "./components/Noti/Notibell";
import GlobalBackground from "./components/Layout/GlobalBackground";

const Home = () => <div className="text-center mt-10">🏠 Welcome to Home</div>;
const AIBot = () => <div className="text-center mt-10">🤖 AI Bot Page</div>;

const Appointment = () => <div className="text-center mt-10">📅 Appointment Page</div>;

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Decode token to get user ID (simple decode, ideally use a library or context)
    // Decode token to get user ID (simple decode, ideally use a library or context)
    try {
      if (token && token.split('.').length === 3) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        if (pusher) {
          const channel = pusher.subscribe(`user-${userId}`);

          channel.bind("newAppointment", (data) => {
            console.log("New Appointment Notification:", data);
            showAlert(`Patient ${data.appointment.studentId.name} has requested an appointment!`, "custom", 5000);
          });

          channel.bind("appointmentUpdate", (data) => {
            console.log("Appointment Update:", data);
            const doctorName = data.appointment?.doctorName;
            showAlert(`Dr. ${doctorName} has ${data.appointment.status} your appointment.`, "custom", 5000);
          });

          channel.bind("newLeaveNotification", (data) => {
            console.log("New Leave Notification:", data);
            showAlert(data.notification.message, "custom", 5000);
          });

          channel.bind("newNotification", (data) => {
            console.log("New Notification:", data);
            showAlert(data.notification.message, "custom", 5000);
          });

          return () => {
            channel.unbind_all();
            channel.unsubscribe();
          }
        }
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
    }

  }, []);

  return (
    <ErrorBoundary>
      <UserProvider>
        <GlobalBackground>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ai-bot" element={<Aibot />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Dashboard />} />
              <Route path="/appointment" element={<Booking />} />
              <Route path="/video-call" element={<VideoCall />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/patient" element={<PatientForm />} />
              {/* <Route path="/video-call" element={<VideoCall />} /> */}
              <Route path="/doctor" element={<DocDash />} />
              <Route path="/leave" element={<MedicalLeave />} />
              <Route path="/certificate" element={<Certificate />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/health-record-concern" element={<Healthchat />} />
              <Route path="/ai-diagnosis" element={<Predictionchat />} />
              <Route path="/leave-concern" element={<Leavechat />} />
              <Route path="/recordform" element={<HealthRecordForm />} />
              <Route path="/ai-assistant" element={<DoctorInsightsChat />} />
              <Route path="/slots" element={<DoctorTimeSlotSelector />} />
              <Route path="/prescriptions" element={<PrescriptionGenerator />} />
              <Route path="/noti" element={<Noti />} />
              <Route path="/payment" element={<Payments />} />
              <Route path="/notiscreen" element={<NotiScreen />} />
              <Route path="/voice" element={<Voice />} />
            </Routes>
          </Router>
        </GlobalBackground>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
