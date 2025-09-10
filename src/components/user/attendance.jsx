import React, { useContext, useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import { Calendar } from "lucide-react";
import { UserInfoContext } from "../../context/contextApi";
import toast from "react-hot-toast";

const Attendance = () => {
  const [status, setStatus] = useState("Not clocked in");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [stats, setStats] = useState({
    present: 0,
    late: 0,
    halfDay: 0,
    absent: 0,
    attendanceRate: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(UserInfoContext);

  // ✅ Month & Year Selectors
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  // ✅ Fetch All Attendance Records
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/attendance/${user.id}`);
        const allRecords = res?.data?.data || [];

        // ✅ Filter by selected month & year
        const filtered = allRecords.filter((rec) => {
          const d = new Date(rec.date);
          return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        setRecent(filtered);

        // ✅ Calculate Stats
        const present = filtered.filter((r) => r.status === "present").length;
        const late = filtered.filter((r) => r.status === "late").length;
        const halfDay = filtered.filter((r) => r.status === "half-day").length;
        const absent = filtered.filter((r) => r.status === "absent").length;

        const totalDays = present + late + halfDay + absent;
        const attendanceRate =
          totalDays > 0 ? ((present + late + halfDay) / totalDays) * 100 : 0;

        setStats({ present, late, halfDay, absent, attendanceRate });

        // ✅ Today’s Attendance
        const todayDate = new Date().toISOString().split("T")[0];
        const todayRecord = filtered.find(
          (r) => new Date(r.date).toISOString().split("T")[0] === todayDate
        );

        if (todayRecord) {
          setStatus(todayRecord.status);
          setIsClockedIn(!todayRecord.checkOut); // still clocked in if no checkout
        } else {
          setStatus("Not clocked in");
          setIsClockedIn(false);
        }
      } catch (err) {
        console.error("Error fetching attendance", err);
        toast.error(
          err?.response?.data?.message || err?.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchAttendance();
  }, [user, month, year]);

  // ✅ Clock In/Out
  const handleClock = async () => {
    try {
      let res;

      if (isClockedIn) {
        res = await axios.post(`/api/attendance/checkout/${user.id}`, {
          userId: user.id,
        });
        setIsClockedIn(false);
      } else {
        res = await axios.post(`/api/attendance/checkin/${user.id}`, {
          userId: user.id,
        });
        setIsClockedIn(true);
      }

      setStatus(res.data?.attendance?.status || "Not clocked in");
    } catch (err) {
      console.error("Clock In/Out failed", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Something went wrong"
      );
    }
  };

  // ✅ Month/Year Options
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const years = Array.from({ length: 6 }, (_, i) => today.getFullYear() - 2 + i);

  return (
    <div className="p-6 space-y-6">

      {/* Clock In/Out */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Clock In/Out
          </h3>
          <p className="text-sm text-gray-500">Current Status</p>
          <p
            className={`font-medium ${
              isClockedIn ? "text-green-600" : "text-red-500"
            }`}
          >
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <p className="text-xl font-semibold text-green-600">
            {stats.attendanceRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Present Days</p>
          <p className="text-xl font-semibold">{stats.present}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Late Days</p>
          <p className="text-xl font-semibold text-yellow-600">{stats.late}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Half-Days</p>
          <p className="text-xl font-semibold text-blue-600">{stats.halfDay}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Absent Days</p>
          <p className="text-xl font-semibold text-red-600">{stats.absent}</p>
        </div>
      </div>

      {/* Calendar + Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Calendar View
            </h3>
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
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Half-Day
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
                        : day.status === "half-day"
                        ? "text-blue-600"
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
