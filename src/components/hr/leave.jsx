import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import axios from "../../util/axiosInstance";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null); // ✅ For modal

  // ✅ Fetch all leave requests
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/leaves");
      setLeaves(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ Update leave status
  const updateStatus = async (id, status) => {
    try {
      if (status === "Approved") {
        await axios.put(`/api/leaves/approve/${id}`);
      } else if (status === "Rejected") {
        await axios.put(`/api/leaves/reject/${id}`);
      }

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id ? { ...leave, status: status.toUpperCase() } : leave
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ✅ Stats
  const stats = {
    total: leaves.length,
    approved: leaves.filter((l) => l.status === "APPROVED").length,
    pending: leaves.filter((l) => l.status === "PENDING").length,
    rejected: leaves.filter((l) => l.status === "REJECTED").length,
  };

  // ✅ Sort leaves (Pending → Approved → Rejected)
  const sortedLeaves = [...leaves].sort((a, b) => {
    const order = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leave Management</h1>
        <p className="text-gray-500">View and manage all employee leaves</p>
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

      {/* Leave Table */}
      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-bold mb-4">All Leave Requests</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : sortedLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 py-8">
            <FileText size={40} className="mb-3" />
            <p>No leave requests available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Days</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className={`border-b hover:bg-gray-50 ${
                      leave.status === "PENDING" ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="p-3">
                      {leave.employee?.firstName} {leave.employee?.lastName}
                    </td>
                    <td className="p-3">{leave.leaveType}</td>
                    <td className="p-3">
                      {new Date(leave.startDate).toLocaleDateString()} →{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{leave.reason}</td>
                    <td className="p-3">{leave.days}</td>
                    <td
                      className={`p-3 font-medium ${
                        leave.status === "APPROVED"
                          ? "text-green-600"
                          : leave.status === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {leave.status}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => setSelectedLeave(leave)} // ✅ open modal
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => updateStatus(leave._id, "Approved")}
                        disabled={leave.status === "APPROVED"}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(leave._id, "Rejected")}
                        disabled={leave.status === "REJECTED"}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Leave Details</h3>
            <p>
              <strong>Employee:</strong>{" "}
              {selectedLeave.employee?.firstName} {selectedLeave.employee?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedLeave.employee?.email}
            </p>
            <p>
              <strong>Leave Type:</strong> {selectedLeave.leaveType}
            </p>
            <p>
              <strong>Period:</strong>{" "}
              {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
              {new Date(selectedLeave.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Days:</strong> {selectedLeave.days}
            </p>
            <p>
              <strong>Reason:</strong> {selectedLeave.reason}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  selectedLeave.status === "APPROVED"
                    ? "text-green-600"
                    : selectedLeave.status === "PENDING"
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {selectedLeave.status}
              </span>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedLeave.createdAt).toLocaleString()}
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedLeave(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              {selectedLeave.status !== "APPROVED" && (
                <button
                  onClick={() => {
                    updateStatus(selectedLeave._id, "Approved");
                    setSelectedLeave(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              )}
              {selectedLeave.status !== "REJECTED" && (
                <button
                  onClick={() => {
                    updateStatus(selectedLeave._id, "Rejected");
                    setSelectedLeave(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
