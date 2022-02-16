const player = document.querySelector('.podcast__player');
const timecode = document.querySelector('.podcast__timecode');

/**
 * Преобразует временные метки вида `00:14:30` или `14:30` в количество секунд.
 *
 * @param {string} value
 * @returns {number}
 */
function parseTimecode(value) {
    return value.split(':').reduceRight((acc, item, index, items) => {
        return acc += parseFloat(item) * Math.pow(60, items.length - 1 - index);
    }, 0);
}

/**
 * @param {string} url
 * @returns {string | null}
 */
function getPassedTimecode(url) {
    const match = url.match(/.+#(\d\d:\d\d(:\d\d)?)$/);
    return match && match[1] ? match[1] : null;
}

/**
 * @param {number} time
 * @returns {void}
 */
function setCurrentTime(time) {
    player.currentTime = time;
}

function playPodcast() {
    if (player.paused) {
        player.play();
    }
}

/**
 * @param {string} time
 * @returns {void}
 */
function updateAnchor(time) {
    window.location.hash = `#${time}`;
}

function initPassedTimecode() {
    const passed = getPassedTimecode(document.URL);

    if (passed) {
        setCurrentTime(parseTimecode(passed));
    }
}

function initTimecode() {
    timecode.addEventListener('click', (event) => {
        const button = event.target.closest('.podcast__timecode-button');

        if (button) {
            setCurrentTime(parseFloat(button.value));
            updateAnchor(button.innerText);
            playPodcast();
        }
    });
}

if (timecode && player) {
    initPassedTimecode();
    initTimecode();
}
