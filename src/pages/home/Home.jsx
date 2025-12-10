import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTasks, deleteTask, updateTask, getTrash } from '../../../Api';
import Add from '../../compenents/Add/Add';
import Edit from '../../compenents/Edit/Edit';
import ToDo from '../../compenents/ToDo/ToDo';
import Doing from '../../compenents/Doing/Doing';
import Done from '../../compenents/Done/Done';
import toast from 'react-hot-toast';
// import Navbar from '../../compenents/Navbar/Navbar';
// import { confirmDelete } from '../../compenents/Confirm/Confirm';
// import Login from '../Login/Login';
import './Home.css';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  const [tasks, setTasks] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [trashCount, setTrashCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Référence pour éviter les appels multiples lors du drag and drop
  const moveRef = useRef({ dragId: null, hoverId: null });

  useEffect(() => {
    loadTasks();
    updateTrashCount();
    const interval = setInterval(updateTrashCount, 3000);
    return () => clearInterval(interval);
  }, []);

  // Force redirection si on tente d'aller ailleurs sans être connecté
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const updateTrashCount = async () => {
    try {
      const trash = await getTrash();
      setTrashCount(trash.length);
    } catch (error) {
      console.error('Erreur compteur corbeille', error);
    }
  };

  const handleLogin = (email, password) => {
    if (email === 'tasks@gmail.com' && password === '12345678') {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      navigate('/', { replace: true });
      return true;
    }
    return false;
  };
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour supprimer une tâche');
      return;
    }
    confirmDelete(
      '⚠️ Êtes-vous sûr de vouloir supprimer cette tâche ?\n\nLa tâche sera déplacée vers la corbeille.',
      async () => {
        try {
          await deleteTask(id);
          toast.success('Tâche déplacée vers la corbeille');
          loadTasks();
          if (updateTrashCount) updateTrashCount();
        } catch (error) {
          toast.error('Erreur lors de la suppression');
        }
      }
    );
  };

  // Fonction appelée quand on dépose une tâche dans une colonne (drag and drop)
  const handleDrop = async (taskId, newStatus) => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour modifier une tâche');
      return;
    }
    try {
      const task = tasks.find((t) => t.id === taskId);
      // Si la tâche existe et que le statut change
      if (task && task.status !== newStatus) {
        // Compter les tâches dans la nouvelle colonne pour définir l'ordre
        const tasksInNewStatus = tasks.filter((t) => t.status === newStatus);
        const maxOrder = tasksInNewStatus.length > 0
          ? Math.max(...tasksInNewStatus.map((t) => t.order || 0))
          : -1;
        
        // Mettre à jour la tâche avec le nouveau statut
        await updateTask(taskId, {
          ...task,
          status: newStatus,
          order: maxOrder + 1,
        });
        toast.success('Tâche déplacée !');
        loadTasks();
      }
    } catch (error) {
      toast.error('Erreur lors du déplacement');
    }
  };

  // Fonction appelée quand on réorganise les tâches dans la même colonne
  const handleMoveWithinColumn = (dragId, hoverId, status) => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour réorganiser les tâches');
      return;
    }
    
    // Éviter les appels multiples pour la même combinaison
    if (moveRef.current.dragId === dragId && moveRef.current.hoverId === hoverId) {
      return;
    }
    moveRef.current = { dragId, hoverId };

    const dragTask = tasks.find((t) => t.id === dragId);
    const hoverTask = tasks.find((t) => t.id === hoverId);

    // Vérifier que les tâches existent et sont dans la même colonne
    if (!dragTask || !hoverTask || dragTask.status !== status || dragId === hoverId) return;

    // Trier les tâches de la colonne par ordre
    const tasksInColumn = tasks
      .filter((t) => t.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const dragIndex = tasksInColumn.findIndex((t) => t.id === dragId);
    const hoverIndex = tasksInColumn.findIndex((t) => t.id === hoverId);

    if (dragIndex === hoverIndex || dragIndex === -1 || hoverIndex === -1) return;

    // Réorganiser les tâches localement
    const reorderedTasks = [...tasksInColumn];
    const [draggedTask] = reorderedTasks.splice(dragIndex, 1);
    reorderedTasks.splice(hoverIndex, 0, draggedTask);

    // Mettre à jour l'ordre de chaque tâche
    const updatePromises = reorderedTasks.map((task, newIndex) => {
      const oldOrder = task.order || 0;
      const newOrder = newIndex;
      if (oldOrder !== newOrder) {
        return updateTask(task.id, { ...task, order: newOrder });
      }
      return Promise.resolve();
    });

    Promise.all(updatePromises)
      .then(() => {
        loadTasks();
      })
      .catch(() => {
        toast.error('Erreur lors du réordonnement');
      });
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} trashCount={trashCount} onLogout={handleLogout} />

      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="home-container">
          <div className="home-header">
            <h1>Tableau de bord</h1>
            <button className="btn-add-task" onClick={handleAddClick}>
              <span className="plus-icon">+</span> Add Task
            </button>
          </div>

          <div className="columns-container">
            <ToDo
              tasks={tasks.filter((t) => t.status === 'todo')}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onDrop={handleDrop}
              onMoveWithinColumn={handleMoveWithinColumn}
              isAuthenticated={isAuthenticated}
            />
            <Doing
              tasks={tasks.filter((t) => t.status === 'inprogress')}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onDrop={handleDrop}
              onMoveWithinColumn={handleMoveWithinColumn}
              isAuthenticated={isAuthenticated}
            />
            <Done
              tasks={tasks.filter((t) => t.status === 'done')}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onDrop={handleDrop}
              onMoveWithinColumn={handleMoveWithinColumn}
              isAuthenticated={isAuthenticated}
            />
          </div>

          <Add
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onTaskAdded={() => {
              loadTasks();
              updateTrashCount();
            }}
            isAuthenticated={isAuthenticated}
          />

          <Edit
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setSelectedTask(null);
            }}
            task={selectedTask}
            onTaskUpdated={loadTasks}
            isAuthenticated={isAuthenticated}
          />
        </div>
      )}
    </>
  );
};

export default Home;

