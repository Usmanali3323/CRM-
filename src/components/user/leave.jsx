import React, { useContext, useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // form fields
  const [leaveType, setLeaveType] = useState("SICK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const { user } = useContext(UserInfoContext);

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // ✅ Fetch all leave requests for this employee
  const fetchLeaves = async () => {
    try {
      if (!user?.id) return;
      const res = await axios.get(`/api/leaves/${user.id}`);
      setLeaveRequests(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user?.id]);

  const stats = {
    total: leaveRequests.length,
    approved: leaveRequests.filter((req) => req.status === "APPROVED").length,
    pending: leaveRequests.filter((req) => req.status === "PENDING").length,
    rejected: leaveRequests.filter((req) => req.status === "REJECTED").length,
  };

  // ✅ Submit leave request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !reason) {
      alert("All fields are required!");
      return;
    }

    if (startDate < today || endDate < today) {
      alert("Dates must be today or later");
      return;
    }

    const newRequest = {
      employee: user.id,
      leaveType,
      startDate,
      endDate,
      reason,
    };

    try {
      await axios.post("/api/leaves/applyLeave", newRequest);
      setLeaveType("SICK");
      setStartDate("");
      setEndDate("");
      setReason("");
      setShowForm(false);

      // refresh list
      fetchLeaves();
    } catch (error) {
      alert(error?.response?.data?.message || error.message);
      console.error(error);
    }
  };

  return (
    <div className="p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Request Leave
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white">
          <FileText className="text-blue-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-lg font-semibold">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white">
          <CheckCircle className="text-green-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-lg font-semibold">{stats.approved}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white">
          <Clock className="text-yellow-500" size={28} />
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-lg font-semibold">{stats.pending}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white">
          <XCircle className="text-red-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-lg font-semibold">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Submit Leave Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="SICK">SICK</option>
                  <option value="CASUAL">CASUAL</option>
                  <option value="ANNUAL">ANNUAL</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Enter reason for leave..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave History */}
      <div className="p-6 border rounded-lg shadow-sm bg-white mt-6">
        <h2 className="text-xl font-bold mb-4">Leave History</h2>

        {leaveRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-8">
            <FileText size={40} className="mb-3" />
            <p>No leave requests found</p>
            <p className="text-sm">
              Click <span className="font-medium">"Request Leave"</span> to
              submit your first request
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="p-3">Applied On</th>
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">{req.leaveType}</td>
                    <td className="p-3">
                      {new Date(req.startDate).toLocaleDateString()} →{" "}
                      {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{req.reason}</td>
                    <td
                      className={`p-3 font-medium ${
                        req.status === "APPROVED"
                          ? "text-green-600"
                          : req.status === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {req.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
