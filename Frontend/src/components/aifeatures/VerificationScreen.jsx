import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";
const patients = [
  { id: 1, name: "Kanishka  Pandey", license: "MED12345", hash: "0xafvf498dty455ign230" },
  { id: 2, name: "Ayush Gupta", license: "MED67890", hash: "852eb511f9a5c72e13c5" },
  { id: 3, name: "Rahul Verma", license: "MED11223", hash: "ac7f747bfe9e9a06bac7bf60238f24" },
  { id: 4, name: "Vaibhav Mandloi ", license: "MED99999", hash: "Not Found" },
  { id: 5, name: "Urvashi Marmat ", license: "MED88888", hash: "Not Found" },
];

export default function VerificationScreen() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
  };

  return (
    <div className="min-h-screen bg-dark flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="glass-card shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-white/10">

        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Medical Certificate Verification</h2>

        <ul className="mb-6 space-y-3">
          {patients.map((patient) => (
            <motion.li
              key={patient.id}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer p-4 border border-white/10 rounded-lg bg-surface shadow-md flex justify-between items-center transition-all hover:bg-white/10 hover:shadow-lg"
              onClick={() => {
                setSelectedPatient(patient);
                setVerified(false);
              }}
            >
              <span className={`font-semibold ${patient.hash === "Not Found" ? "text-red-400" : "text-primary"}`}>{patient.name}</span>
              <span className="text-gray-400">{patient.license}</span>
            </motion.li>
          ))}
        </ul>

        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`mt-4 p-6 border rounded-xl shadow-lg ${selectedPatient.hash === "Not Found" ? "bg-red-500/10 border-red-500/50" : "bg-primary/10 border-primary/50"}`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${selectedPatient.hash === "Not Found" ? "text-red-400" : "text-primary"}`}>Certificate Details</h3>
            <p><span className="font-medium text-gray-300">Patient:</span> <span className="text-white">{selectedPatient.name}</span></p>
            <p><span className="font-medium text-gray-300">License Number:</span> <span className="text-white">{selectedPatient.license}</span></p>
            <p className={`break-all font-medium ${selectedPatient.hash === "Not Found" ? "text-red-400" : "text-gray-400"}`}>
              <span className="text-gray-300">Blockchain Hash:</span> {selectedPatient.hash}
            </p>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`mt-4 w-full px-6 py-3 rounded-xl shadow-md transition-all ${selectedPatient.hash === "Not Found" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-primary hover:bg-primary/80 text-white"}`}
              onClick={handleVerify}
            >
              Verify
            </motion.button>

            {verified && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`mt-4 font-medium text-center ${selectedPatient.hash === "Not Found" ? "text-red-400" : "text-primary"}`}
              >
                {selectedPatient.hash === "Not Found"
                  ? "❌ Verification Failed: This certificate is not found on the blockchain."
                  : "✅ Verified: This certificate is issued by the platform and stored on the Polygon blockchain."}
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}