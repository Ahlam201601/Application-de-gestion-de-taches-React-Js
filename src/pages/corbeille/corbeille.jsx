import { useEffect, useState } from "react";
import { getTrash, restoreTask, deleteTask } from "../../../Api";
import "./Corbeille.css";

export default function Corbeille() {
  const [trash, setTrash] = useState([]);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("Toutes");

  const loadTrash = async () => {
    const data = await getTrash();
    setTrash(data);
  };

  useEffect(() => {
    loadTrash();
  }, []);

  // Filter
  const filteredTrash = trash.filter((t) => {
    const matchText = t.title.toLowerCase().includes(search.toLowerCase());

    const matchPriority =
      priority === "Toutes" ? true : t.priority === priority.toLowerCase();

    return matchText && matchPriority;
  });

  return (
    <div className="corbeille-page">
      <h1 className="title"> 🗑️ Corbeille</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Rechercher une tâche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
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
                onClick={async () => {
                  await deleteTask(task.id);
                  loadTrash();
                }}
              >
                🗑 Supprimer définitivement
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
