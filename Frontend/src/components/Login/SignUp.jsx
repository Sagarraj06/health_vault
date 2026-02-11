import React, { useContext, useState } from "react";
import { api } from "../../axios.config.js";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignUp() {
  const { login } = useContext(UserContext);
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");
  const [extra, setExtra] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = { role, name, email, password, phone, dateOfBirth, gender };
    if (role === "doctor") formData.specialization = extra;

    try {
      const response = await api.post("user/signup", formData, {
        withCredentials: true,
      });
      if (response.status === 201) navigate("/login");
    } catch (error) {
      if (error.response) setError(error.response.data.message || "Signup failed");
      else console.log("Error Message:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-7 h-7 text-card" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text font-[Space_Grotesk]">
            Create your account
          </h1>
          <p className="text-sm text-text-light mt-1">
            Join HealthVault and manage your health
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                I am a
              </label>
              <div className="flex gap-2 p-1 bg-surface rounded-lg border border-border">
                {["student", "doctor", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                      role === r
                        ? "bg-primary text-card shadow-sm"
                        : "text-text-light hover:text-text"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputClass}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {role === "doctor" && (
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. General Physician, Cardiologist"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            )}

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-card text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-light mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
