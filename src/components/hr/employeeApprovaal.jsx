import toast from "react-hot-toast";
import axios from "./../../util/axiosInstance";
import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { User2Icon } from "lucide-react";
import { FcDepartment } from "react-icons/fc";

function EmployeeApproval() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");

  useEffect(() => {
    async function employees() {
      try {
        const res = await axios.get("/api/users");
        if (!res?.data?.success) {
          toast.error("Error Fetching Users Records");
        }
        setUsers(res?.data?.users || []);
        setFilteredUsers(res?.data?.users || []);
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      }
    }
    employees();
  }, []);

  // Handle Approve
  const handleAccept = async (userId) => {
    try {
      const res = await axios.post(`/api/users/approve/${userId}`);
      if (res.data.success) {
        toast.success(res?.data?.message);
        // Update UI instantly
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, status: "APPROVED" } : u
          )
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  // Filter Logic
  useEffect(() => {
    let temp = users;

    if (search.trim() !== "") {
      temp = temp.filter(
        (u) =>
          u.firstName.toLowerCase().includes(search.toLowerCase()) ||
          u.lastName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (positionFilter !== "All") {
      temp = temp.filter((u) => u.position === positionFilter);
    }

    setFilteredUsers(temp);
  }, [search, positionFilter, users]);

  // Extract unique positions for dropdown
  const positions = ["All", ...new Set(users.map((u) => u.position))];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Employee Approvals</h2>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border rounded px-3 py-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          {positions.map((pos, idx) => (
            <option key={idx} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {filteredUsers.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No employees found
          </p>
        ) : (
          filteredUsers.map((user) => (
            <ul
              key={user._id}
              className="p-3 shadow rounded border border-gray-200"
            >
              <li className="flex items-center">
                <User2Icon color="green" className="mr-2" />
                {user.firstName + " " + user.lastName}
              </li>
              <li className="flex items-center">
                <MdEmail color="green" />
                <span className="ml-2">{user.email}</span>
              </li>
              <li className="flex items-center">
                <FcDepartment className="mr-2" />
                {user.position}
              </li>
              <li>Experience: {user.experience} yrs</li>
              <li className="text-green-500">{user.status}</li>
              <li className="flex justify-end">
                {user.status === "PENDING" && (
                  <button
                    className="my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm cursor-pointer"
                    onClick={() => handleAccept(user._id)}
                  >
                    Accept
                  </button>
                )}
              </li>
            </ul>
          ))
        )}
      </div>
    </div>
  );
}

export default EmployeeApproval;
