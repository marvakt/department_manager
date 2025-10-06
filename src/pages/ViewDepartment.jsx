import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneDepartment } from "../api/employeeApi";

export default function ViewDepartment() {
  const { id } = useParams(); 
  const [department, setDepartment] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await getOneDepartment(id);
        setDepartment(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch department");
      }
    };
    fetchDepartment();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!department) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">{department.dept_name}</h1>
      <p className="text-gray-700 mb-4">{department.description}</p>
      <button
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
