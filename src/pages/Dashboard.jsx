import { useEffect, useState } from "react";
import { Building2, Plus, Trash2, Eye, X, LogOut, Briefcase, FileText, Search, AlertCircle, CheckCircle } from "lucide-react";

const API_BASE = "https://employee-react.onrender.com/emp";

const getDepartments = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  console.log("Token being used:", token); 
  console.log("Token length:", token.length); 

  
  const res = await fetch(`${API_BASE}/departments`, {
    headers: { 
      Authorization: token, 
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error("Error response:", errData); 
    if (res.status === 400) {
      throw new Error(errData.Error || errData.message || "Invalid token. Please login again.");
    }
    if (res.status === 401) {
      throw new Error("Unauthorized. Please login again.");
    }
    throw new Error(errData.Error || errData.message || `Failed to fetch departments (${res.status})`);
  }

  return res.json();
};

const addDepartment = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login first.");

  console.log("Adding department with token:", token); 
  console.log("Department data:", data); 

  const res = await fetch(`${API_BASE}/add-department`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token, 
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error("Add department error:", errData); 
    if (res.status === 400) {
      throw new Error(errData.Error || errData.message || "Invalid token or data. Please login again.");
    }
    if (res.status === 401) {
      throw new Error("Unauthorized. Please login again.");
    }
    throw new Error(errData.Error || errData.message || `Failed to add department (${res.status})`);
  }

  return res.json();
};

const deleteDepartment = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login first.");

  const res = await fetch(`${API_BASE}/delete-department/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }, 
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 400) {
      throw new Error("Unauthorized or invalid token. Please login again.");
    }
    throw new Error(errData.Error || errData.message || `Failed to delete department (${res.status})`);
  }

  return res.json();
};

const getOneDepartment = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login first.");

  const res = await fetch(`${API_BASE}/department/${id}`, {
    headers: { Authorization: token }, 
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 400) {
      throw new Error("Unauthorized or invalid token. Please login again.");
    }
    throw new Error(errData.Error || errData.message || `Failed to fetch department (${res.status})`);
  }

  return res.json();
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`} style={{
      animation: 'slideIn 0.3s ease-out'
    }}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function Dashboard() {
  const [departments, setDepartments] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isLoadingDept, setIsLoadingDept] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data.data || data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async () => {
    if (!deptName.trim() || !description.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDepartment({ name: deptName, description });
      setDeptName("");
      setDescription("");
      fetchDepartments();
      showToast('Department added successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
      showToast('Department deleted successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleView = async (id) => {
    setIsModalOpen(true);
    setIsLoadingDept(true);
    try {
      const data = await getOneDepartment(id);
      setSelectedDept(data.data || data);
    } catch (err) {
      showToast(err.message, 'error');
      setIsModalOpen(false);
    } finally {
      setIsLoadingDept(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDept(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth"; // or use navigate("/auth") if using React Router
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleAdd();
    }
  };

  const filteredDepartments = departments.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <header className="bg-white backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                Department Manager
              </h1>
              <p className="text-sm text-gray-600">Manage your departments efficiently</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:shadow-md transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Departments</p>
                <p className="text-3xl font-bold mt-1">{departments.length}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Search Results</p>
                <p className="text-3xl font-bold mt-1">{filteredDepartments.length}</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Status</p>
                <p className="text-xl font-bold mt-1">Active</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Add New Department</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Department Name"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex-1 relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
                disabled={isSubmitting}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 hover:shadow-lg transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Add Department
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Search departments by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white backdrop-blur-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 shadow-sm transition-all"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading departments...</p>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="bg-white backdrop-blur-lg rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No departments found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search query" : "Start by adding your first department"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <div 
                key={dept._id} 
                className="bg-white backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{dept.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{dept.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(dept._id)}
                    className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition-all font-medium"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl flex justify-center items-center gap-2 hover:bg-red-100 transition-all font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-8" style={{ animation: 'scaleIn 0.2s ease-out' }}>
            {isLoadingDept ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading details...</p>
              </div>
            ) : selectedDept ? (
              <>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">{selectedDept.name}</h2>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedDept.description}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                >
                  Close
                </button>
              </>
            ) : null}
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}