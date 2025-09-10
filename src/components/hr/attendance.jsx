import React, { useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import toast from "react-hot-toast";

import { TbGraph } from "react-icons/tb";
import { FaUserTimes, FaUserCheck, FaUserClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ✅ Utility to format date (yyyy-mm-dd)
const formatDate = (date = new Date()) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

// ✅ Stat Card Component
const StatCard = ({ icon: Icon, color, label, value }) => (
  <li
    className={`p-6 ${color.bg} rounded-xl shadow flex flex-col items-center justify-center`}
  >
    <Icon className={`${color.icon} text-3xl mb-2`} />
    <p className={`text-lg font-semibold ${color.text}`}>{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </li>
);

function Attendance() {
  const [records, setRecords] = useState({});
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch attendance summary & employees
  useEffect(() => {
    const loadData = async () => {
      try {
        const today = formatDate();

        const [summaryRes, employeesRes] = await Promise.all([
          axios.get(`/api/attendance/summary/daily?date=${today}`),
          axios.get("/api/attendance/getAttendance"),
        ]);

        // filter employees for today
        const employeesToday =
          employeesRes.data?.data?.filter((record) => {
            const recordDate = formatDate(new Date(record.date));
            return recordDate === today;
          }) || [];

        setEmployees(employeesToday);
        setFilteredEmployees(employeesToday);

        setRecords(summaryRes.data.summary);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    };

    loadData();
  }, []);

  // ✅ Filter employees by search
  useEffect(() => {
    let temp = [...employees];

    if (search.trim()) {
      const query = search.toLowerCase();
      temp = temp.filter(
        (emp) =>
          emp.employeeId.firstName?.toLowerCase().includes(query) ||
          emp.employeeId.lastName?.toLowerCase().includes(query) ||
          emp.employeeId.email?.toLowerCase().includes(query)
      );
    }

    setFilteredEmployees(temp);
  }, [search, employees]);

  // ✅ Save updated attendance
  const handleSave = async (empId, status) => {
    try {
      const res = await axios.put(`/api/attendance/${empId}`, {
        status: status.toLowerCase(),
      });

      if (res.data.success) {
        toast.success("Attendance updated!");
        setEmployees((prev) =>
          prev.map((e) => (e._id === empId ? { ...e, status } : e))
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6">
      {/* ✅ Stats Section */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaUserCheck}
          color={{ bg: "bg-green-100", icon: "text-green-600", text: "text-green-700" }}
          label="Present"
          value={records.present}
        />
        <StatCard
          icon={FaUserClock}
          color={{ bg: "bg-yellow-100", icon: "text-yellow-600", text: "text-yellow-700" }}
          label="Late"
          value={records.late}
        />
        <StatCard
          icon={FaUserTimes}
          color={{ bg: "bg-yellow-50", icon: "text-yellow-400", text: "text-yellow-400" }}
          label="Half-day"
          value={records?.["half-day"]}
        />
        <StatCard
          icon={FaUserTimes}
          color={{ bg: "bg-red-100", icon: "text-red-600", text: "text-red-700" }}
          label="Absent"
          value={records.absent}
        />
      </ul>

      {/* ✅ Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-md w-full sm:w-1/2"
        />
      </div>

      {/* ✅ Employees Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg shadow bg-white">
          <thead>
            <tr className="bg-gray-100 text-left text-sm uppercase">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    {emp.employeeId.firstName} {emp.employeeId.lastName}
                  </td>
                  <td className="p-3 border">{emp.employeeId.email}</td>
                  <td className="p-3 border">{emp.employeeId.department}</td>
                  <td className="p-3 border">
                    <select
                      value={emp.status}
                      onChange={(e) =>
                        setEmployees((prev) =>
                          prev.map((el) =>
                            el._id === emp._id ? { ...el, status: e.target.value } : el
                          )
                        )
                      }
                      className="p-1 border rounded"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="leave">Leave</option>
                      <option value="half-day">Half-Day</option>
                    </select>
                  </td>
                  <td className="p-3 border flex gap-2">
                    <button
                      onClick={() => handleSave(emp._id, emp.status)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/hr/attendance/${emp.employeeId._id}`)
                      }
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 border text-center" colSpan="5">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;
