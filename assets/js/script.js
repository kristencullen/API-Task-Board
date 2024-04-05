// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    return "<article class='card mb-3' id='task-" + task.id + "'>" +
    "<section class='card-body'>" +
      "<h5 class='card-title'>" + task.title + "</h5>" +
      "<p class='card-text'>" + task.description + "</p>" +
      "<p class='card-text'>Deadline: " + task.deadline + "</p>" +
      "<button class='btn btn-danger delete-btn'>Delete</button>" +
    "</section>" +
  "</article>";
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
  
    taskList.forEach(task => {
      let card = createTaskCard(task);
      $(`#${task.status}-cards`).append(card);
    });
  
    $('.card').draggable({
      containment: '.lane',
      revert: 'invalid',
      cursor: 'move'
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let task = {
        id: generateTaskId(),
        title: $('#taskTitle').val(),
        description: $('#taskDescription').val(),
        deadline: $('#taskDeadline').val(),
        status: 'todo'
    };
    taskList.push(task);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextId));
    renderTaskList();
    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(event.target).closest('.card').attr('id').split('-')[1];
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr('id').split('-')[1];
    let newStatus = $(event.target).closest('.lane').attr('id').split('-')[0];
    taskList.forEach(task => {
        if (task.id === parseInt(taskId)) {
            task.status = newStatus;
            ui.draggable.detach().appendTo($(event.target).closest('.lane').find('.card-body'));
        }
    });
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $('#addTaskForm').on('submit', handleAddTask);
    $(document).on('click', '.delete-btn', handleDeleteTask);
    $('.lane').droppable({
        accept: '.card',
        drop: handleDrop
    });    
});