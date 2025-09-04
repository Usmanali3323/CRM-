import React, { useState } from "react";
import { FileText, CheckCircle, Clock, XCircle, Plus } from "lucide-react";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const stats = {
    total: leaveRequests.length,
    approved: leaveRequests.filter(req => req.status === "Approved").length,
    pending: leaveRequests.filter(req => req.status === "Pending").length,
    rejected: leaveRequests.filter(req => req.status === "Rejected").length,
  };

  return (
    <div className="p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Leave Requests</h1>
          <p className="text-gray-500">
            Manage your leave applications and view history
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          <Plus size={18} /> Request Leave
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Leave History */}
      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-bold mb-4">Leave History</h2>

        {leaveRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-8">
            <FileText size={40} className="mb-3" />
            <p>No leave requests found</p>
            <p className="text-sm">
              Click <span className="font-medium">"Request Leave"</span> to submit your first request
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="p-3">Date</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{req.date}</td>
                  <td className="p-3">{req.reason}</td>
                  <td
                    className={`p-3 font-medium ${
                      req.status === "Approved"
                        ? "text-green-600"
                        : req.status === "Pending"
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
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
