const player = document.querySelector('.podcast__player');
const rewindButton = document.querySelector('.podcast__player-rewind');

/**
 * Выделяет из строки временные метки вида `00:14:30` или `14:30`.
 *
 * @param {string} string
 * @returns {string | null}
 */
function matchTimecode(string) {
    const match = string.match(/.+#(\d\d:\d\d(:\d\d)?)$/);
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
    window.addEventListener('hashchange', () => {
        handlePassedTimecode();
        playAudio();
    });
}

function playAudio() {
    if (player.paused) {
        player.play();
    }
}

if (player) {
    if (player.networkState === HTMLMediaElement.NETWORK_LOADING) {
        player.addEventListener('loadedmetadata', handlePassedTimecode);
    } else {
        handlePassedTimecode();
    }
    initAnchor();
}

rewindButton.addEventListener('click', () => {
    rewindAudio(-10);
});

/** Перемотка аудио назад на `seconds` секунд
 * @param seconds количество секунд
 */
function rewindAudio(seconds) {
    if (player.duration && !isNaN(player.duration)) {
        const currentTime = player.currentTime;
        const duration = player.duration;
        let targetTime = currentTime + seconds;

        if (targetTime > duration) {
            targetTime = duration;
        } else if (targetTime < 0) {
            targetTime = 0;
        }

        player.currentTime = targetTime;
    }
}
