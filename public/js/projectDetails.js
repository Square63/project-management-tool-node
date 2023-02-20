console.log("its loaded successfully")

const projectStatus = document.querySelector('#projectStatus')
const projectManager = document.querySelector('#projectManager')
const projectId = document.querySelector('#projectId')

projectManager.addEventListener('change', (e) => {
  e.preventDefault()
  const manager = e.target.value
  console.log(`/projects/${projectId.value}manager?manager=${manager}`)
  fetch(`/projects/${projectId.value}manager?manager=${manager}`,{
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

projectStatus.addEventListener('change', (e) => {
  e.preventDefault()
  const status = e.target.value
  console.log(`/projects/${projectId.value}status?status=${status}`)
  fetch(`/projects/${projectId.value}status?status=${status}`,{
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
