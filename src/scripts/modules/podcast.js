const player = document.querySelector('.podcast__player');
const timecode = document.querySelector('.podcast__timecode');

if (timecode && player) {
    timecode.addEventListener('click', event => {
        const button = event.target.closest('.podcast__timecode-button');

        if (!button) {
            return;
        }

        const time = parseFloat(button.value);
        player.currentTime = time;
        if (player.paused) {
            player.play();
        }
    });
}
