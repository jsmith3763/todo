const todosContainer = document.getElementByClassName("todos-column");

async function createTask() {
    const task = document.getElementById('textbox');
    const newTask = {
        task: task
    }
    try {
        const response = await fetch("http://localhost:3000/api/todo/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        })
    } catch (error) {
        console.error(error);
    }
}