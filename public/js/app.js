console.log("its loaded successfully")

const statusSelect = document.querySelector('#statusSelect')
const projectId = document.querySelector('#projectId')
const taskId = document.querySelector('#taskId')
const assigneeSelect = document.querySelector('#assigneeSelect')


statusSelect.addEventListener('change', (e) => {
  e.preventDefault()
  const status = e.target.value
console.log(`/projects/${projectId.value}tasks/${taskId.value}status?status=${status}`)
  fetch(`/projects/${projectId.value}tasks/${taskId.value}status?status=${status}`,{
    method: 'PATCH',
  }).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else
      {
        console.log(data)
      }
    })
  })
})

assigneeSelect.addEventListener('change', (e) => {
  e.preventDefault()
  const assignee = e.target.value
console.log(`/projects/${projectId.value}tasks/${taskId.value}assignee?assignee=${assignee}`)
  fetch(`/projects/${projectId.value}tasks/${taskId.value}assignee?assignee=${assignee}`,{
    method: 'PATCH',
  }).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else
      {
        console.log(data)
      }
    })
  })
})
