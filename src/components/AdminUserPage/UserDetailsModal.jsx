


export const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md relative shadow-xl border border-gray-700 text-gray-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-cyan-300 mb-4">
          User Details
        </h2>

        {/* Avatar */}
        {user.avatar && (
          <div className="flex justify-center mb-4">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-20 h-20 rounded-full border border-gray-600"
            />
          </div>
        )}

        {/* Dynamic key-value display */}
        <div className="space-y-2 text-sm">
          {Object.entries(user).map(([key, value]) => (
            <p key={key}>
              <span className="font-semibold capitalize">{key}:</span>{" "}
              {typeof value === "string" && value.startsWith("http") ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline break-all"
                >
                  {value}
                </a>
              ) : key.toLowerCase().includes("date") ? (
                new Date(value).toLocaleString()
              ) : (
                String(value)
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
