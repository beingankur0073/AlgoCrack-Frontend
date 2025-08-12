import React from "react";

const AdminDashboardCard = ({ onClick, Icon, iconColor, hoverBg, title, titleColor, description }) => {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer bg-gray-900/90 ${hoverBg} border border-gray-700 rounded-lg p-8 flex-1 text-center shadow-xl transition-all duration-200`}
    >
      <Icon
        size={40}
        className={`mx-auto mb-4 ${iconColor} group-hover:scale-110 transition`}
      />
      <h2 className={`text-2xl font-semibold ${titleColor} mb-2`}>
        {title}
      </h2>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};

export default AdminDashboardCard
