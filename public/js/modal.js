console.log("modal.js loaded successfully")
const projectButton = document.querySelector('#projectBtn')
const taskButton = document.querySelector('#taskBtn')
const projectForm = document.querySelector('#projectForm')
const taskForm = document.querySelector('#taskForm')
const managerSelect = document.querySelector('#managerSelect')
const projectSelect = document.querySelector('#projectSelect')
const usersSelect = document.querySelector('#usersSelect')

window.addEventListener('load', (e) => {
  console.log("loaded")
  e.preventDefault()

  fetch(`/managers`,{
  }).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else
      {
        data.managers.forEach(manager=> managerSelect.add(new Option(manager.name,manager._id)));
        console.log(data)
      }
    })
  })

  fetch(`/projects`,{
  }).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else
      {
        data.projects.forEach(project=> projectSelect.add(new Option(project.name,project._id)));
        console.log(data)
      }
    })
  })

  fetch(`/users`,{
  }).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else
      {
        data.users.forEach(user=> usersSelect.add(new Option(user.name,user._id)));
        console.log(data)
      }
    })
  })
})

projectButton.addEventListener('click', (e) => {
  e.preventDefault()

  taskForm.setAttribute("hidden", "hidden");
  taskButton.classList.remove("active");
  projectForm.removeAttribute("hidden");
  projectButton.classList.add("active");
})

taskButton.addEventListener('click', (e) => {
  e.preventDefault()

  projectForm.setAttribute("hidden", "hidden");
  projectButton.classList.remove("active");
  taskForm.removeAttribute("hidden");
  taskButton.classList.add("active");
})
