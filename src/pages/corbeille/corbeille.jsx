import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getTrash, restoreTask, deleteTaskPermanent } from "../../../Api";
import { confirmDelete } from "../../compenents/Confirm/Confirm";
import Navbar from "../../compenents/Navbar/Navbar";
import "./corbeille.css";

export default function Corbeille() {
  const [trash, setTrash] = useState([]);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("Toutes");
  const [trashCount, setTrashCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  const loadTrash = async () => {
    try {
      const data = await getTrash();
      setTrash(data || []);
      setTrashCount((data || []).length);
    } catch (error) {
      console.error("Erreur lors du chargement de la corbeille", error);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const updateTrashCount = async () => {
    try {
      const data = await getTrash();
      setTrashCount((data || []).length);
    } catch (error) {
      console.error("Erreur compteur corbeille", error);
    }
  };

  const handleDeletePermanently = (id) => {
    confirmDelete(
      "🗑️ ⚠️ ATTENTION ⚠️\n\nÊtes-vous sûr de vouloir supprimer définitivement cette tâche ?\n\nCette action est IRRÉVERSIBLE et la tâche ne pourra pas être récupérée.",
      async () => {
        try {
          await deleteTaskPermanent(id);
          toast.success("Tâche supprimée définitivement");
          await loadTrash();
          await updateTrashCount();
        } catch (error) {
          toast.error("Erreur lors de la suppression définitive");
        }
      }
    );
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const filteredTrash = trash.filter((t) => {
    const matchesSearch = `${t.title} ${t.description}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesPriority =
      priority === "Toutes" || t.priority === priority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgente":
        return "#ff4757";
      case "moyenne":
        return "#ffa502";
      case "basse":
        return "#26de81";
      default:
        return "#747d8c";
    }
  };

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        trashCount={trashCount}
        onLogout={() => {
          localStorage.removeItem("isAuthenticated");
          setIsAuthenticated(false);
          window.location.href = "/login";
        }}
      />
      <div className="corbeille-page">
        <h1 className="title"> 🗑️ Corbeille</h1>

        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Rechercher une tâche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Toutes</option>
            <option>Urgente</option>
            <option>Moyenne</option>
            <option>Basse</option>
          </select>
        </div>

        <div className="cards">
          {filteredTrash.map((task) => (
            <div className="card" key={task.id}>
              <div className="card-header">
                <h3>{task.title}</h3>

                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority.toUpperCase()}
                </span>
              </div>

              <p className="desc">{task.description}</p>

              <div className="status">
                Statut :
                <span className="state">
                  {task.status === "done"
                    ? "Terminé"
                    : task.status === "inprogress"
                    ? "En cours"
                    : task.status === "review"
                    ? "Review"
                    : "A faire"}
                </span>
              </div>

              <div className="btns">
                <button
                  className="restore"
                  onClick={async () => {
                    try {
                      await restoreTask(task);
                      await loadTrash();
                      await updateTrashCount();
                      toast.success("Tâche restaurée");
                    } catch (e) {
                      toast.error("Erreur lors de la restauration");
                    }
                  }}
                >
                  ♻ Restaurer
                </button>

                <button
                  className="delete"
                  onClick={() => handleDeletePermanently(task.id)}
                >
                  🗑 Supprimer définitivement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
