const buttons = [...document.querySelectorAll('.article__copy-button')];

let timeout

function handleCopy(evt) {
    const tooltip = this.nextSibling
    const hash = this.getAttribute('data-href')

    evt.preventDefault()
    clearTimeout(clearTimeout)

    navigator.clipboard.writeText(`${window.location.href}${hash}`).then(() => {
        tooltip.innerText = 'Скопированно'
        tooltip.classList.add('tooltip--success')

        timeout = setTimeout(() => {
            tooltip.innerText = 'Скопировать ссылку'
            tooltip.classList.remove('tooltip--success')
        }, 5000)
    }).catch(() => {
        timeout = setTimeout(() => {
            tooltip.innerText = 'Не удалось скопировать'
            tooltip.classList.remove('tooltip--error')
        }, 5000)
    })
}

function handleMouseOut() {
    setTimeout(() => {
        this.blur()
    }, 1000)
}

buttons.forEach((button) => {
    button.addEventListener('click', handleCopy)
    button.addEventListener('mouseout', handleMouseOut)
})
