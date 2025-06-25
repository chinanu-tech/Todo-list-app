window.addEventListener('load', () => {
    const form = document.querySelector('#task-form');
    const input = document.querySelector('#task-input');
    const list_element = document.querySelector('#list-of-task');
    const celebration = document.getElementById('celebration');
    const counter = document.getElementById('task-counter');
    let confettiFired = false;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateCounter() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        counter.textContent = `Total: ${total} | Completed: ${completed}`;
    }

    function renderTasks() {
        list_element.innerHTML = '';
        tasks.forEach((task, index) => createTaskElement(task.text, task.completed, index));
        updateCounter();
        checkAllTasksCompleted();
    }

    function createTaskElement(text, isCompleted, index) {
        const task_element = document.createElement('div');
        task_element.classList.add('task');

        const task_content_element = document.createElement('div');
        task_content_element.classList.add('content');

        const task_input_element = document.createElement('input');
        task_input_element.classList.add('text');
        task_input_element.type = 'text';
        task_input_element.value = text;
        task_input_element.setAttribute('readonly', 'readonly');
        if (isCompleted) task_input_element.classList.add('completed');

        task_content_element.appendChild(task_input_element);
        task_element.appendChild(task_content_element);

        const task_button_element = document.createElement('div');
        task_button_element.classList.add('action');

        const edit_button = document.createElement('button');
        edit_button.classList.add('edit');
        edit_button.innerText = 'Edit';

        const delete_button = document.createElement('button');
        delete_button.classList.add('delete');
        delete_button.innerText = 'Delete';

        const done_button = document.createElement('button');
        done_button.classList.add('done');
        done_button.innerText = 'Done';

        task_button_element.appendChild(edit_button);
        task_button_element.appendChild(delete_button);
        task_button_element.appendChild(done_button);
        task_element.appendChild(task_button_element);
        list_element.appendChild(task_element);

        // Edit task
        edit_button.addEventListener('click', () => {
            if (edit_button.innerText.toLowerCase() === 'edit') {
                task_input_element.removeAttribute('readonly');
                task_input_element.focus();
                edit_button.innerText = 'Save';
            } else {
                task_input_element.setAttribute('readonly', 'readonly');
                tasks[index].text = task_input_element.value;
                edit_button.innerText = 'Edit';
                saveTasks();
            }
        });

        // Delete task
        delete_button.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        // Mark as done
        done_button.addEventListener('click', () => {
            task_input_element.classList.toggle('completed');
            tasks[index].completed = task_input_element.classList.contains('completed');
            saveTasks();
            updateCounter();
            checkAllTasksCompleted();
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = input.value.trim();
        if (!taskText) {
            alert('Please add task');
            return;
        }
        tasks.push({ text: taskText, completed: false });
        saveTasks();
        renderTasks();
        input.value = '';
    });

    function checkAllTasksCompleted() {
        const allCompleted = tasks.length > 0 && tasks.every(task => task.completed);
        if (allCompleted) {
            celebration.style.display = 'block';
            if (!confettiFired) {
                fireConfetti();
                confettiFired = true;
            }
        } else {
            celebration.style.display = 'none';
            confettiFired = false;
        }
    }

    function fireConfetti() {
        const duration = 2 * 1000;
        const end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    }

    // Load tasks on page load
    renderTasks();
});




















