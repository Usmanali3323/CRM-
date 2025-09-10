import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import axios from "../util/axiosInstance";

export default function EmployeeAttendance() {
  const { empId } = useParams();
  const navigate = useNavigate(); // ✅ hook for navigation
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [employee, setEmployee] = useState(null);

  // ✅ Fetch raw attendance (all records for employee)
  useEffect(() => {
    if (!empId) return;

    const fetchAllAttendance = async () => {
      try {
        const res = await axios.get(`/api/attendance/${empId}`);
        setAttendance(res.data.data || []);

        if (res.data.data?.length > 0) {
          setEmployee(res.data.data[0].employeeId);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchAllAttendance();
  }, [empId]);

  // ✅ Fetch monthly summary (present, absent, late, half-day)
  useEffect(() => {
    if (!empId) return;

    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `/api/attendance/summary/monthly?employeeId=${empId}&year=${year}&month=${month}`
        );
        setSummary(res.data.summary || {});
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchSummary();
  }, [empId, year, month]);

  // ✅ Filter raw records for selected month/year
  const filteredRecords = attendance.filter((rec) => {
    const d = new Date(rec.date);
    return d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month);
  });

  return (
    <div className="p-6">
      {/* 🔹 Back button */}
      <button
        onClick={() => navigate("/hr/attendance")}
        className="mb-4 flex items-center text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Employee Attendance</h2>

      {/* Employee Info */}
      {employee && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <p className="font-medium">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-sm text-gray-600">{employee.email}</p>
        </div>
      )}

      {/* Month & Year Selector */}
      <div className="flex gap-4 mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded p-2"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded p-2"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded">Present: {summary.present || 0}</div>
        <div className="p-4 bg-red-100 rounded">Absent: {summary.absent || 0}</div>
        <div className="p-4 bg-yellow-100 rounded">Late: {summary.late || 0}</div>
        <div className="p-4 bg-blue-100 rounded">Half-Day: {summary["half-day"] || 0}</div>
      </div>

      {/* Attendance Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Check-In</th>
            <th className="border p-2">Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((rec) => (
              <tr key={rec._id}>
                <td className="border p-2">
                  {new Date(rec.date).toLocaleDateString()}
                </td>
                <td className="border p-2">{rec.status}</td>
                <td className="border p-2">
                  {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : "—"}
                </td>
                <td className="border p-2">
                  {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : "—"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2 text-center" colSpan="4">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
