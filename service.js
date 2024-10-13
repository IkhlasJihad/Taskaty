// load tasks from storage
document.addEventListener('DOMContentLoaded', loadTasks);
// Load the stored task-input value
document.addEventListener('DOMContentLoaded', loadInputValue);

// Save the input value to storageas it changes
document.getElementById('task-input').addEventListener('input', function() {
    const inputValue = this.value;
    chrome.storage.sync.set({ taskInput: inputValue });
});

document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function loadInputValue() {
    chrome.storage.sync.get('taskInput', ({ taskInput }) => {
        if (taskInput) {
            document.getElementById('task-input').value = taskInput;
        }
    });
}

function loadTasks() {
    const taskList = document.getElementById('task-list');
    chrome.storage.sync.get('tasks', ({ tasks }) => {
        if (tasks) {
            tasks.forEach(task => {
                addTaskToDOM(task);
            });
        }
    });
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const task = taskInput.value.trim();
    if (task) {
        const li = addTaskToDOM(task);
        // Set green background color to highlight the newely add task for 1 sec
        li.style.backgroundColor = '#79e901';   
        setTimeout(() => {
            li.style.backgroundColor = ''; // Reset background color
        }, 1000); 

        saveTask(task);
        taskInput.value = '';
        chrome.storage.sync.remove('taskInput'); 
    }
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');

    const taskText = document.createElement('div');
    taskText.textContent = task; // Set the task text
    taskText.className = "task-text";
    
    // Create a clickable image for deletion
    const deleteImage = document.createElement('img');
    deleteImage.src = 'images/remove.png'; 
    deleteImage.alt = 'Delete';
    deleteImage.className = "clickable-img"
    
    deleteImage.onclick = () => {
        taskList.removeChild(li);
        removeTask(task);
    };
    li.appendChild(taskText);
    li.appendChild(deleteImage);
    taskList.appendChild(li);
    return li
}

function saveTask(task) {
    chrome.storage.sync.get('tasks', ({ tasks }) => {
        tasks = tasks || [];
        tasks.push(task);
        chrome.storage.sync.set({ tasks });
    });
}

function removeTask(task) {
    chrome.storage.sync.get('tasks', ({ tasks }) => {
        tasks = tasks.filter(t => t !== task);
        chrome.storage.sync.set({ tasks });
    });
}
