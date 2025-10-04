// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Element Selections ---
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const filterBtn = document.getElementById('filter-btn');
    const noTasksMsg = document.getElementById('no-tasks-msg');

    // --- State Management ---
    // Get tasks from local storage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; // can be 'all', 'completed', 'incomplete'

    // --- Functions ---

    /**
     * Toggles the visibility of the "No task found" message.
     */
    const checkTasksUI = () => {
        if (tasks.length === 0) {
            noTasksMsg.classList.remove('hidden');
            taskList.classList.add('hidden');
        } else {
            noTasksMsg.classList.add('hidden');
            taskList.classList.remove('hidden');
        }
    };

    /**
     * Saves the current tasks array to local storage.
     */
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    /**
     * Renders the tasks to the screen based on the current filter.
     */
    const renderTasks = () => {
        // Clear the current list
        taskList.innerHTML = '';

        // Filter tasks based on the current filter state
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'completed') return task.completed;
            if (currentFilter === 'incomplete') return !task.completed;
            return true; // 'all'
        });

        // Create and append list items for each filtered task
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <span class="task-due-date">${task.date}</span>
                <span class="task-status">${task.completed ? 'Completed' : 'Pending'}</span>
                <div class="task-actions">
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
        
        checkTasksUI();
    };
    
    /**
     * Adds a new task.
     */
    const addTask = (e) => {
        e.preventDefault(); // Prevent form from submitting and reloading the page

        const taskText = taskInput.value.trim();
        const dueDate = taskDate.value;

        // --- Input Validation ---
        if (taskText === '') {
            alert('Please add a task description.');
            return;
        }
        if (dueDate === '') {
            alert('Please select a due date.');
            return;
        }

        // Create a new task object
        const newTask = {
            id: Date.now(), // Unique ID based on timestamp
            text: taskText,
            date: dueDate,
            completed: false
        };

        // Add the new task to the tasks array
        tasks.push(newTask);

        // Save and re-render
        saveTasks();
        renderTasks();

        // Clear the input fields
        taskInput.value = '';
        taskDate.value = '';
    };

    /**
     * Handles clicks on the task list for completing or deleting tasks.
     */
    const handleTaskListClick = (e) => {
        const target = e.target;
        const parentLi = target.closest('.task-item');
        if (!parentLi) return;

        const taskId = Number(parentLi.dataset.id);

        // --- Complete/Undo Task ---
        if (target.classList.contains('complete-btn')) {
            tasks = tasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );
        }

        // --- Delete Task ---
        if (target.classList.contains('delete-btn')) {
            tasks = tasks.filter(task => task.id !== taskId);
        }
        
        saveTasks();
        renderTasks();
    };

    /**
     * Deletes all tasks.
     */
    const deleteAllTasks = () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    };
    
    /**
     * Cycles through the filter options.
     */
    const filterTasks = () => {
        if (currentFilter === 'all') {
            currentFilter = 'incomplete';
            filterBtn.textContent = 'Filter: Pending';
        } else if (currentFilter === 'incomplete') {
            currentFilter = 'completed';
            filterBtn.textContent = 'Filter: Completed';
        } else {
            currentFilter = 'all';
            filterBtn.textContent = 'Filter: All';
        }
        renderTasks();
    };


    // --- Event Listeners ---
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskListClick);
    deleteAllBtn.addEventListener('click', deleteAllTasks);
    filterBtn.addEventListener('click', filterTasks);

    // --- Initial Render ---
    renderTasks();
});