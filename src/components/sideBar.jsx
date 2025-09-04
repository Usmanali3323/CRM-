import React, { useState, useEffect, useContext } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  BarChart2,
  LogOut,
  File,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserInfoContext } from "../context/contextApi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useContext(UserInfoContext)
  const [role, setRole] = useState(null);
  const location = useLocation();

useEffect(()=>{
    setRole(user?.role)
})
  

  // Menus for different roles
  const menus = {
    admin: [
      { name: "Dashboard", icon: Home, link: "/admin/dashboard" },
      { name: "Employees", icon: Users, link: "/admin/employees" },
      { name: "Attendance", icon: Calendar, link: "/admin/attendance" },
      { name: "Leave Requests", icon: ClipboardList, link: "/admin/leave-requests" },
      { name: "Tasks", icon: FileText, link: "/admin/tasks" },
      { name: "Reports", icon: BarChart2, link: "/admin/reports" },
      { name: "Logout", icon: LogOut, link: "/logout" },
    ],
    HR: [
      { name: "Dashboard", icon: Home, link: "/hr/dashboard" },
      { name: "Attendance", icon: Calendar, link: "/hr/attendance" },
      { name: "Leave Requests", icon: ClipboardList, link: "/hr/leave-requests" },
        { name: "Employee Approvals", icon: Calendar, link: "/hr/employee-approval" },
      { name: "Reports", icon: BarChart2, link: "/hr/reports" },
      { name: "Logout", icon: LogOut, link: "/logout" },
    ],
    Employee: [
      { name: "Dashboard", icon: Home, link: "/employee/dashboard" },
      { name: "Attendance", icon: Calendar, link: "/employee/attendance" },
      { name: "Leave Requests", icon: ClipboardList, link: "/employee/leave-requests" },
      { name: "My Tasks", icon: FileText, link: "/employee/tasks" },
      { name: "Documents", icon: File, link: "/employee/documents" },
      { name: "Profile", icon: User, link: "/employee/profile" },
      { name: "Logout", icon: LogOut, link: "/logout" },
    ],
  };

  const currentMenu = menus[role] || [];

  return (
    <>
      {/* 🔹 Toggle Button fixed at top-left for small devices */}
      <button
        aria-label="Toggle Sidebar"
        className="fixed top-4 left-4 z-50 p-2 text-white bg-blue-600 rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 z-40`}
      >
        <div className="p-4 text-lg font-bold text-blue-600 border-b capitalize">
          {role ? `${role} Portal` : "Loading..."}
        </div>

        <ul className="space-y-1 p-4">
          {currentMenu.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.link;
            return (
              <li key={index}>
                <Link
                  to={item.link}
                  onClick={() => setIsOpen(false)} // close sidebar on mobile
                  className={`flex items-center gap-3 p-2 rounded-lg transition
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      </>
  );
};

export default Sidebar;
