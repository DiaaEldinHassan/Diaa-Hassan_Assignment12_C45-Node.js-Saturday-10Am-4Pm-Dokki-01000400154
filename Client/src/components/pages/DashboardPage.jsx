import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user.userName || "User"}
        </h1>
        <button 
          onClick={logout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <img
              src={user.profileImage || "https://ui-avatars.com/api/?name=" + user.userName}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50"
            />
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Account Info</p>
              <h2 className="text-xl font-bold text-gray-800">{user.email}</h2>
              <p className="text-indigo-600 font-medium capitalize">{user.role || "Member"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Phone Numbers</h3>
          {user.phone && user.phone.length > 0 ? (
            <ul className="space-y-2">
              {user.phone.map((p, idx) => (
                p && (
                  <li key={idx} className="bg-gray-50 p-3 rounded-xl text-gray-700 border border-gray-100">
                    {typeof p === 'string' ? p : p.number || 'N/A'}
                  </li>
                )
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No numbers added.</p>
          )}
        </div>
      </div>
    </div>
  );
}