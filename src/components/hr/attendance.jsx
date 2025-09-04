import toast from "react-hot-toast";
import axios from "../../util/axiosInstance";
import React, { useEffect, useState } from "react";
import { TbGraph } from "react-icons/tb";
import { FaUserTimes, FaUserCheck, FaUserClock } from "react-icons/fa";

function Attendance() {
  const [records, setRecords] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    async function fetchRecordstate() {
      try {
        const res = await axios.get("/api/admin/attendance/state");
        if (res?.data?.success) {
          setRecords(res?.data?.stats);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      }
    }

    async function fetchEmployees() {
      try {
        const res = await axios.get("/api/admin/attendance/employees");
        if (res?.data?.success) {
          setEmployees(res?.data?.employees || []);
          setFilteredEmployees(res?.data?.employees || []);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      }
    }

    fetchRecordstate();
    fetchEmployees();
  }, []);

  // Filter employees by search + department
  useEffect(() => {
    let temp = employees;

    if (search.trim()) {
      temp = temp.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
          emp.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (department) {
      temp = temp.filter((emp) => emp.department === department);
    }

    setFilteredEmployees(temp);
  }, [search, department, employees]);

  // Get unique departments
  const departments = [...new Set(employees.map((e) => e.department))];

  // Update attendance
  const handleSave = async (empId, status) => {
    try {
      const res = await axios.put(`/api/attendance/admin/${empId}`, {
        status:status.toLowerCase(),
      });
      if (res?.data?.success) {
        toast.success("Attendance updated!");
        setEmployees((prev) =>
          prev.map((e) => (e._id === empId ? { ...e, status } : e))
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const handleView = (emp) => {
    alert(
      `Employee: ${emp.firstName} ${emp.lastName}\nEmail: ${emp.email}\nDepartment: ${emp.department}\nStatus: ${emp.status}`
    );
  };

  return (
    <div className="p-6">
      {/* Stats */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <li className="p-6 bg-blue-100 rounded-xl shadow flex flex-col items-center justify-center">
          <TbGraph className="text-blue-600 text-3xl mb-2" />
          <p className="text-lg font-semibold text-blue-700">{records.total}</p>
          <p className="text-sm text-gray-600">Total Employees</p>
        </li>

        <li className="p-6 bg-green-100 rounded-xl shadow flex flex-col items-center justify-center">
          <FaUserCheck className="text-green-600 text-3xl mb-2" />
          <p className="text-lg font-semibold text-green-700">
            {records.present}
          </p>
          <p className="text-sm text-gray-600">Present</p>
        </li>

        <li className="p-6 bg-yellow-100 rounded-xl shadow flex flex-col items-center justify-center">
          <FaUserClock className="text-yellow-600 text-3xl mb-2" />
          <p className="text-lg font-semibold text-yellow-700">{records.late}</p>
          <p className="text-sm text-gray-600">Late</p>
        </li>

        <li className="p-6 bg-red-100 rounded-xl shadow flex flex-col items-center justify-center">
          <FaUserTimes className="text-red-600 text-3xl mb-2" />
          <p className="text-lg font-semibold text-red-700">
            {records.absent}
          </p>
          <p className="text-sm text-gray-600">Absent</p>
        </li>
      </ul>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-md w-full sm:w-1/2"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-2 border rounded-md w-full sm:w-1/4"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Employees Table */}
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
                    <span className={`px-3 ${emp.status == "present" ? "text-green-400" : `${emp.status=="late" || "leave" || "half-day" ? "text-amber-400" : "text-red-500"}`}`}>{emp.status}</span>

                    <select
                      value={emp.status}
                      onChange={(e) =>
                        setEmployees((prev) =>
                          prev.map((el) =>
                            el._id === emp._id
                              ? { ...el, status: e.target.value }
                              : el
                          )
                        )
                      }
                      className="p-1 border rounded"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value={"leave"}>Leave</option>
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
                      onClick={() => handleView(emp)}
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
