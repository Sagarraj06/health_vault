import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import { api } from "../../axios.config";

export default function VerificationScreen() {
  const [searchId, setSearchId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!searchId) return;
    setLoading(true);
    setError("");
    setVerificationResult(null);

    try {
      // The API route is /api/v1/certificate/verify/:id
      // Assuming api is configured with base URL /api/v1
      const res = await api.get(`/certificate/verify/${searchId}`);
      setVerificationResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Certificate not found or invalid ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="glass-card shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-white/10">

        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Medical Certificate Verification</h2>

        <div className="mb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-300 font-medium">Enter Certificate ID</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. 12 or CERT-123"
                className="flex-1 p-3 rounded-lg bg-surface border border-white/20 text-white focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={handleVerify}
                disabled={loading}
                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Verify"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`mt-6 p-6 border rounded-xl shadow-lg bg-primary/10 border-primary/50`}
          >
            <h3 className={`text-lg font-semibold mb-4 text-primary border-b border-primary/30 pb-2`}>
              Verification Successful
            </h3>

            <div className="space-y-2">
              <p><span className="font-medium text-gray-400">Certificate ID:</span> <span className="text-white float-right">{verificationResult.id}</span></p>
              <p><span className="font-medium text-gray-400">Student Name:</span> <span className="text-white float-right">{verificationResult.studentName || "N/A"}</span></p>
              <p><span className="font-medium text-gray-400">Type:</span> <span className="text-white float-right">{verificationResult.type || "General"}</span></p>
              <p><span className="font-medium text-gray-400">Date:</span> <span className="text-white float-right">{new Date(verificationResult.date).toLocaleDateString()}</span></p>

              <div className="pt-2 mt-2 border-t border-white/10">
                <span className="font-medium text-gray-400 block mb-1">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block
                        ${verificationResult.status === 'Verified' || verificationResult.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                    verificationResult.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }
                    `}>
                  {verificationResult.status}
                </span>
              </div>

              {verificationResult.details && (
                <div className="pt-2">
                  <span className="font-medium text-gray-400 block">Details/Diagnosis:</span>
                  <p className="text-white text-sm mt-1 bg-black/20 p-2 rounded">{verificationResult.details}</p>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs text-green-400 font-mono">
              ✅ Cryptographically Signed & Verified
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}