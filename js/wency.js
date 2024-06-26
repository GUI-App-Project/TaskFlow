document.addEventListener('DOMContentLoaded', function () {
  const taskPrioritySelect = document.getElementById('tskPriority');
  const taskModal = document.getElementById('taskModal');

  // Set initial background color based on selected priority
  setPriorityColor(taskPrioritySelect.value);

  taskPrioritySelect.addEventListener('change', function () {
    setPriorityColor(this.value);
  });

  function setPriorityColor(priority) {
    taskModal.classList.remove('low-priority', 'medium-priority', 'high-priority');

    switch (priority) {
      case 'Low':
        taskModal.classList.add('low-priority');
        break;
      case 'Medium':
        taskModal.classList.add('medium-priority');
        break;
      case 'High':
        taskModal.classList.add('high-priority');
        break;
    }
  }
});

(function pageLoad() {
  drawTaskPanel();
}());

// open 'add task' modal when user clicks on the 'add task' button
function openModal(mode, index) {
  let buttonMarkup;
  $('#tskDueDate').attr('min', new Date().toJSON().split('T')[0]);
  // check if user is adding a new task or editing an existing one
  if (mode === 'add') {
    setModalData(null);
    $('.modal-title').text('Add Task');
    buttonMarkup = '<button class="btn btn-primary" id="tskSaveBtn" onclick="addTask()">Add Task</button>';
  } else {
    let data = JSON.parse(localStorage.getItem("taskListObject"))[index];
    setModalData(data);
    $('.modal-title').text('Edit Task');
    buttonMarkup = '<button class="btn btn-primary" id="tskSaveBtn" onclick="editTask(' + index + ')">Edit Task</button>';
  }
  $('.modal-footer').empty().append(buttonMarkup);
  $("#taskModal").modal('toggle');
  validate(); // call to enable/disable save button
}

// retrieve data from all the fields of the modal
function getModalData() {
  return {
    title: $('#tskTitle').val(),
    dueDate: $('#tskDueDate').val(),
    status: $('#tskStatus').val(),
    priority: $('#tskPriority').val(),
    createdDate: new Date(),
    content: $('#tskContent').val(),
    isComplete: $('#tskCompletedChk').prop('checked')
  };
}

/* Sets the values of all modal fields before opening. Empties all fields in case of adding new task and sets all stored values
in case of task edit */
function setModalData(data) {
  if (!data) {
    $('#tskTitle').val('');
    $('#tskDueDate').val('');
    $('#tskStatus').val("Didn't Start Yet");
    $('#tskPriority').val('Low');
    $('#tskContent').val('');
    $('#tskCompletedChk').prop('checked', false);
  } else {
    $('#tskTitle').val(data.title);
    $('#tskDueDate').val(data.dueDate);
    $('#tskStatus').val(data.status);
    $('#tskPriority').val(data.priority);
    $('#tskContent').val(data.content);
    $('#tskCompletedChk').prop('checked', data.isComplete);
  }
}

//when 'add task' button is clicked from modal
function addTask() {
  let taskDetail = getModalData();
  saveTaskObject(null, taskDetail);
  drawTaskPanel();
  $("#taskModal").modal('toggle');
}

//when 'edit task' button is clicked from modal(when existing task is edited)
function editTask(index) {
  let taskDetail = getModalData();
  saveTaskObject(index, taskDetail);
  drawTaskPanel();
  $("#taskModal").modal('toggle');
}

//index is null when adding a new task and a valid integer when editing a task
function saveTaskObject(index, taskDetail) {
  if (index === null) {
    index = $(".panel").length;
  }
  (localStorage.getItem("taskListObject")) || localStorage.setItem("taskListObject", "[]");
  let x = JSON.parse(localStorage.getItem("taskListObject"));
  x[index] = taskDetail;
  localStorage.setItem("taskListObject", JSON.stringify(x));
}

function drawTaskPanel() {
  // || applied to make empty array if there are no existing tasks
  let taskDetail = JSON.parse(localStorage.getItem("taskListObject")) || [];
  // emptying the task list before redrawing
  $('#taskListContainer').empty();
  // showing a message when no task exists
  if (taskDetail.length == 0) {
    let taskItemMarkup = `<div class="row"><div class="col-xs-12">No tasks created</div></div>`;
    $('#taskListContainer').append(taskItemMarkup);
  }
  // loop through stored tasks to draw panels 
  for (let i = 0; i < taskDetail.length; i++) {
    let taskItemMarkup = `<div class="row">
                            <div class="col-xs-12">
                              <div class="panel panel-primary ${getPriorityClass(taskDetail[i].priority)}">
                                <div class="panel-heading">
                                  <span class="title" id="taskTitle">${taskDetail[i].title}</span> (Priority: ${taskDetail[i].priority})
                                  <div style="float: right;">
                                    <span onclick="openModal('edit', ${i})" class="glyphicon glyphicon-pencil edit-delete-icon"></span>
                                    <span onclick="deleteTask(${i})" class="glyphicon glyphicon-trash edit-delete-icon"></span>
                                  </div>
                                </div>
                                <div class="panel-body">
                                  <div class="container-fluid bg-2 text-center">
                                    <h3 class="margin title">Task Details: ${taskDetail[i].content}.</h
                                    3>
                                    <h4 class="margin title">This is a ${taskDetail[i].priority} priority task, the due date for the task is ${taskDetail[i].dueDate} and the status is ${taskDetail[i].status}.
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>`;
                                    $('#taskListContainer').append(taskItemMarkup);
                                    }
                                    }
                                    
                                    function getPriorityClass(priority) {
                                    switch (priority) {
                                    case 'Low':
                                    return 'low-priority';
                                    case 'Medium':
                                    return 'medium-priority';
                                    case 'High':
                                    return 'high-priority';
                                    default:
                                    return '';
                                    }
                                    }
                                    
                                    // delete a task
                                    function deleteTask(index) {
                                    let x = JSON.parse(localStorage.getItem("taskListObject"));
                                    x.splice(index, 1);
                                    localStorage.setItem('taskListObject', JSON.stringify(x));
                                    drawTaskPanel();
                                    }
