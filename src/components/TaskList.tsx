import React, { useEffect, useState } from 'react';
import { query } from '../dataService';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchedTasks = query('SELECT * FROM tasks');
    setTasks(fetchedTasks);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <ul>
        {tasks.map((task: any) => (
          <li key={task[0]}>
            {task[1]} - {task[2] === 1 ? 'Completed' : 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
