const player = document.querySelector('.podcast__player');
const timecode = document.querySelector('.podcast__timecode');

/**
 * Выделяет из строки временные метки вида `00:14:30` или `14:30`.
 *
 * @param {string} str
 * @returns {string | null}
 */
function matchTimecode(str) {
    const match = str.match(/.+#(\d\d:\d\d(:\d\d)?)$/);
    return match && match[1] ? match[1] : null;
}

/**
 * Преобразует временные метки вида `00:14:30` или `14:30` в количество секунд.
 *
 * @param {string} time
 * @returns {number}
 */
function parseTimecode(time) {
    return time.split(':').reduceRight((acc, item, index, items) => {
        return acc += parseFloat(item) * Math.pow(60, items.length - 1 - index);
    }, 0);
}

/**
 * @param {number} time
 * @returns {void}
 */
function setTime(time) {
    player.currentTime = time;
}

function handlePassedTimecode() {
    const passed = matchTimecode(document.URL);

    if (passed) {
        setTime(parseTimecode(passed));
    }
}

function initAnchor() {
    window.addEventListener('hashchange', handlePassedTimecode);
}

/**
 * @param {string} time
 * @returns {void}
 */
function setAnchor(time) {
    window.location.hash = `#${time}`;
}

function playAudio() {
    if (player.paused) {
        player.play();
    }
}

function initTimecode() {
    timecode.addEventListener('click', (event) => {
        const button = event.target.closest('.podcast__timecode-button');

        if (button) {
            setTime(parseFloat(button.value));
            setAnchor(button.innerText);
            playAudio();
        }
    });
}

if (timecode && player) {
    handlePassedTimecode();
    initAnchor();
    initTimecode();
}
