const player = document.querySelector('.podcast__player');
const timeline = document.querySelector('.podcast__timeline');

if (timeline && player) {
    timeline.addEventListener('click', event => {
        const button = event.target.closest('.podcast__timeline-button');

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
