import { useEffect, useState } from "react";
import { getTrash} from "../../../Api";
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


      
    </div>
  );
}
