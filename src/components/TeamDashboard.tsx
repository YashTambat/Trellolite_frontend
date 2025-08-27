import React, { useEffect, useState } from "react";
import axios from "axios";

interface AssignedTask {
  _id: string;
  task: string;
  deadline: string;
  status: "incomplete" | "complete";
  issues: string[];
  member: { _id: string; email: string };
}

interface Project {
  _id: string;
  name: string;
  description: string;
  assignedTo: AssignedTask[];
}

const TeamDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch projects assigned to this team member
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/team/my-projects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects(res.data.projects || []);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Toggle status
  const toggleStatus = async (projectId: string, taskId: string) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/team/change-status/${projectId}/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProjects(); // refresh UI
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📌 My Tasks</h1>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            className="mb-6 border border-gray-200 p-5 rounded-xl shadow-md bg-white"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-700">
              {project.name}
            </h2>
            <p className="text-gray-600 mb-4">{project.description}</p>

            {project.assignedTo.map((task) => (
              <div
                key={task._id}
                className="p-4 mb-3 bg-gray-50 rounded-lg border flex justify-between items-center"
              >
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Task:</span> {task.task}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Deadline:</span>{" "}
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={
                        task.status === "complete"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {task.status === "complete" ? "DONE" : "In Progress"}
                    </span>
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => toggleStatus(project._id, task._id)}
                    className={`px-4 py-2 rounded-lg text-white shadow transition ${
                      task.status === "complete"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {task.status === "complete"
                      ? "Change status to inprogress"
                      : "Change status to Done"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default TeamDashboard;
