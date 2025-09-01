import React from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  ListChecks,
  CalendarCheck,
  FileBarChart,
  Shield,
  BarChart3,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Employee Records", icon: Users },
  { name: "Approvals", icon: ClipboardCheck },
  { name: "Tasks", icon: ListChecks },
  { name: "Attendance", icon: CalendarCheck },
  { name: "Leaves", icon: CalendarCheck },
  { name: "Reports", icon: FileBarChart },
  { name: "Roles & Access", icon: Shield },
  { name: "Analytics", icon: BarChart3 },
];

const Sidebar = ({ active, setActive }) => {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        HR Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition ${
              active === item.name
                ? "bg-blue-600"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
