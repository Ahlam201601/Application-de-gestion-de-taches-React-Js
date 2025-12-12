import { useEffect, useState } from "react";
import { getTrash, restoreTask, deletePermanently } from "../../../Api";
import { confirmDelete } from "../../compenents/Confirm/Confirm";
import Navbar from "../../compenents/Navbar/Navbar";
import "./Corbeille.css";

export default function Corbeille() {
  const [trash, setTrash] = useState([]);
  const [search, setSearch] = useState("");
  const [trashCount, setTrashCount] = useState(0);
  const [priority, setPriority] = useState("Toutes");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const loadTrash = async () => {
    const data = await getTrash();
    setTrash(data);
  };

  useEffect(() => {
    loadTrash();
  }, []);

  useEffect(() => {
    setTrashCount(trash.length);
  }, [trash, search, priority]);

  const updateTrashCount = async () => {
    try {
      const data = await getTrash();
      setTrashCount(data.length);
    } catch (error) {
      console.error("Erreur compteur corbeille", error);
    }
  };

  const handleDeletePermanently = async (id) => {
    confirmDelete(
      "🗑️ ⚠️ ATTENTION ⚠️\n\nÊtes-vous sûr de vouloir supprimer définitivement cette tâche ?\n\nCette action est IRRÉVERSIBLE et la tâche ne pourra pas être récupérée.",
      async () => {
        try {
          await deletePermanently(id);
          toast.success("Tâche supprimée définitivement");
          loadTrash();
          updateTrashCount();
        } catch (error) {
          toast.error("Erreur lors de la suppression définitive");
        }
      }
    );
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Filter
  const filteredTrash = trash.filter((t) => {
    const matchText = t.title.toLowerCase().includes(search.toLowerCase());

    const matchPriority =
      priority === "Toutes" ? true : t.priority === priority.toLowerCase();

    return matchText && matchPriority;
  });

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        trashCount={trashCount}
        onLogout={() => {
          localStorage.removeItem("isAuthenticated");
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

                <span className={`badge ${task.priority}`}>
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
                    : "À faire"}
                </span>
              </div>

              <div className="btns">
                <button
                  className="restore"
                  onClick={async () => {
                    await restoreTask(task);
                    loadTrash();
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
