const closeBtn= document.querySelector("[data-close-modal]")
const modal= document.querySelector("[data-modal]")
const openBtn= document.querySelector("[data-open-modal]")
openBtn.addEventListener('click', () => {
  modal.showModal()
})
closeBtn.addEventListener('click', () => {
  modal.close()
})