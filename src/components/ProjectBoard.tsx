import React, { useEffect, useState } from "react";

// Interfaces
interface TeamMember {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
}

interface AssignedTo {
  _id: string;
  member: { _id: string; email: string; username: string };
  task: string;
  deadline: string;
  status: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  assignedTo: AssignedTo[];
}

// 🔹 Project Form Component (Create + Edit)
const ProjectForm: React.FC<{
  onSuccess: () => void;
  teams: TeamMember[];
  editProject?: Project | null;
  onCancelEdit?: () => void;
}> = ({ onSuccess, teams, editProject, onCancelEdit }) => {
  const [name, setName] = useState(editProject?.name || "");
  const [description, setDescription] = useState(
    editProject?.description || ""
  );
  const [tasks, setTasks] = useState<
    { member: string; task: string; deadline: string }[]
  >(
    editProject
      ? editProject.assignedTo.map((t) => ({
          member: t.member._id,
          task: t.task,
          deadline: t.deadline.split("T")[0],
        }))
      : [{ member: "", task: "", deadline: "" }]
  );

  const token = localStorage.getItem("token");
  // 🔹 Prefill when editProject changes
  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setDescription(editProject.description);
      setTasks(
        editProject.assignedTo.map((t) => ({
          member: t.member._id,
          task: t.task,
          deadline: t.deadline.split("T")[0],
        }))
      );
    }
  }, [editProject]);

  const handleTaskChange = (
    index: number,
    field: "member" | "task" | "deadline",
    value: string
  ) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description, assignedTo: tasks };

    try {
      const url = editProject
        ? `${process.env.REACT_APP_API_URL}/admin/projects/${editProject._id}`
        : `${process.env.REACT_APP_API_URL}/admin/projects`;

      const method = editProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        setName("");
        setDescription("");
        setTasks([{ member: "", task: "", deadline: "" }]);
        if (onCancelEdit) onCancelEdit();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{ width: "100%" }}
      className="w-full md:w-1/3 bg-white p-4 md:p-6 rounded-xl shadow-md h-fit mb-6 md:mb-0"
    >
      <h2 className="text-xl font-bold mb-4 text-blue-700">
        {editProject ? "Edit Project" : "Create Project"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {tasks.map((task, index) => (
          <div
            key={index}
            className="space-y-2 border p-2 rounded-lg bg-gray-50"
          >
            <select
              value={task.member}
              onChange={(e) =>
                handleTaskChange(index, "member", e.target.value)
              }
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Member</option>
              {teams.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.username} ({m.email})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Task"
              value={task.task}
              onChange={(e) => handleTaskChange(index, "task", e.target.value)}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="date"
              value={task.deadline}
              onChange={(e) =>
                handleTaskChange(index, "deadline", e.target.value)
              }
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded p-2 font-semibold"
        >
          {editProject ? "Update Project" : "Create Project"}
        </button>

        {editProject && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full bg-gray-400 hover:bg-gray-500 transition text-white rounded p-2 mt-2 font-semibold"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
};

// 🔹 Project Card (for delete + edit buttons)
const ProjectCard: React.FC<{
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (p: Project) => void;
}> = ({ project, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border mb-4 hover:shadow-lg transition">
      <div className="p-4 border rounded-lg shadow-md bg-gradient-to-br from-blue-50 to-white">
        {/* Project Info */}
        <h4 className="text-lg font-bold text-blue-800">{project.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{project.description}</p>

        {/* Assigned Members */}
        <h5 className="mt-4 font-semibold text-blue-700">Assigned To:</h5>
        <ul className="space-y-2 mt-2">
          {project.assignedTo.map((assignment) => (
            <li
              key={assignment._id}
              className="p-2 border rounded-md bg-gray-100"
            >
              <p className="text-sm">
                <span className="font-medium">Member:</span>{" "}
                {assignment.member.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Task:</span> {assignment.task}
              </p>
              <p className="text-sm">
                <span className="font-medium">Deadline:</span>{" "}
                {new Date(assignment.deadline).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    assignment.status === "complete"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {assignment.status === "complete" ? "DONE" : "In Progress"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => onEdit(project)}
          className="text-blue-500 text-xs hover:underline hover:text-blue-700 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="text-red-500 text-xs hover:underline hover:text-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// 🔹 Main Project Board
const ProjectBoard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const token = localStorage.getItem("token");

  // Fetch projects
  const fetchProjects = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setProjects(data.projects);
  };

  // Fetch teams
  const fetchTeams = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setTeams(data.teams);
  };

  useEffect(() => {
    fetchProjects();
    fetchTeams();
  }, []);

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    await fetch(`${process.env.REACT_APP_API_URL}/admin/projects/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects(); // ✅ refresh after delete
  };

  // Edit project
  const handleEditProject = (project: Project) => {
    setEditProject(project);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full px-2 md:px-8 py-4">
      {/* Sidebar form */}
      <div className="md:sticky md:top-6 md:self-start w-full md:w-2/5 md:max-w-lg">
        <ProjectForm
          onSuccess={fetchProjects}
          teams={teams}
          editProject={editProject}
          onCancelEdit={() => setEditProject(null)}
        />
      </div>

      {/* Projects list */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-4 overflow-y-auto max-h-[80vh]">
        <h2 className="font-bold text-lg mb-3 text-blue-700">All Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                onDelete={handleDeleteProject}
                onEdit={handleEditProject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBoard;
