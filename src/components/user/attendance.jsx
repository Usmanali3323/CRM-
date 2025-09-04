import React, { useContext, useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import { Calendar } from "lucide-react";
import { UserInfoContext } from "../../context/contextApi";
import toast from "react-hot-toast";

const Attendance = () => {
  const [status, setStatus] = useState("Not clocked in");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [stats, setStats] = useState({
    attendanceRate: 0,
    presentDays: 0,
    lateDays: 0,
    absentDays: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserInfoContext);

  // ✅ Month & Year Selectors
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  // ✅ Fetch attendance stats + recent records
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const [statsRes, recentRes] = await Promise.all([
          axios.post(`/api/attendance/stats/${user._id}`, { month, year }),
          axios.post(`/api/attendance/recent/${user._id}`, { month, year }),
        ]);

        setStats(statsRes.data?.data || {});
        setRecent(recentRes?.data?.data || []);

        console.log(recentRes.data.data);
        
        // ✅ Check today's attendance
        const todayDate = new Date().toISOString().split("T")[0];
        const todayRecord = recentRes?.data?.data?.find(
          (r) => new Date(r.date).toISOString().split("T")[0] === todayDate
        );

        if (todayRecord) {
            console.log(todayRecord);
            
          setStatus(todayRecord.status);
          setIsClockedIn(todayRecord.status === "Clocked in");
        } else {
          setStatus("Not clocked in");
          setIsClockedIn(false);
        }
      } catch (err) {
        console.error("Error fetching attendance", err);
        toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchAttendance();
  }, [user, month, year]);

  // ✅ Clock In/Out Handler
  const handleClock = async () => {
    try {
      let res;

      if (isClockedIn) {
        res = await axios.post(`/api/attendance/checkout/${user._id}`, { userId: user._id });
        setIsClockedIn(false);
      } else {
        res = await axios.post(`/api/attendance/checkin/${user._id}`, { userId: user._id });
        setIsClockedIn(true);
      }

      setStatus(res.data?.attendance?.status || "Not clocked in");

      // Refresh stats + recent
      const [statsRes, recentRes] = await Promise.all([
        axios.post(`/api/attendance/stats/${user._id}`, { month, year }),
        axios.post(`/api/attendance/recent/${user._id}`, { month, year }),
      ]);
      setStats(statsRes.data?.data || {});
      console.log(stats);
      
      setRecent(recentRes?.data?.data || []);
    } catch (err) {
      console.error("Clock In/Out failed", err);
      toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading attendance...</p>;
  }

  // ✅ Generate month/year dropdown options
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const years = Array.from({ length: 6 }, (_, i) => today.getFullYear() - 2 + i);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Attendance</h2>
        <p className="text-gray-500 text-sm">{today.toDateString()}</p>
      </div>
      <p className="text-gray-600">Track your daily attendance and view history</p>

      {/* Clock In/Out */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Clock In/Out
          </h3>
          <p className="text-sm text-gray-500">Current Status</p>
          <p className={`font-medium ${isClockedIn ? "text-green-600" : "text-red-500"}`}>
            {status}
          </p>
        </div>
        <button
          onClick={handleClock}
          className={`px-4 py-2 rounded-lg font-medium ${
            isClockedIn
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isClockedIn ? "Clock Out" : "Clock In"}
        </button>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <p className="text-xl font-semibold text-green-600">
            {stats.attendanceRate || 0}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Present Days</p>
          <p className="text-xl font-semibold">{stats.presentDays+stats.lateDays || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Late Days</p>
          <p className="text-xl font-semibold text-yellow-600">{stats.lateDays || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Absent Days</p>
          <p className="text-xl font-semibold text-red-600">{stats.absentDays || 0}</p>
        </div>
      </div>

      {/* Calendar + Recent Attendance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Calendar View
            </h3>

            {/* Month & Year Selectors */}
            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border rounded-md px-2 py-1 text-sm"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border rounded-md px-2 py-1 text-sm"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {months[month - 1]} {year}
          </p>

          <div className="mt-4 flex gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> Present
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Late
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Absent
            </span>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-4">Recent Attendance</h3>
          {recent?.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {recent.map((day, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span>{new Date(day.date).toDateString()}</span>
                  <span
                    className={`${
                      day.status === "present"
                        ? "text-green-600"
                        : day.status === "late"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {day.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No attendance records found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
