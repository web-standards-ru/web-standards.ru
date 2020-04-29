// Navigation

(function () {
    const navigationButton = document.querySelector('.navigation__button');
    const pageBody = document.querySelector('.page__body');
    const pageContent = document.querySelector('.page__content');

    const isMenuHiddenCheck = () => {
        let attributeValue = navigationButton.getAttribute('aria-expanded');

        return attributeValue === 'true';
    };

    const handleNavigationMenuState = () => {
        const isMenuHidden = isMenuHiddenCheck();
        navigationButton.setAttribute('aria-expanded', !isMenuHidden);

        setTimeout(() => pageBody.classList.toggle('page__body--active'), 200);
    };

    const toggleNavigationMenu = () => {
        navigationButton.classList.toggle('navigation__button--active');
        pageContent.classList.toggle('page__content--active');
    };

    navigationButton.addEventListener('click', () => {
        handleNavigationMenuState();
        toggleNavigationMenu();
    });
}());

// Video

(function() {
    function findVideos() {
        let videos = document.querySelectorAll('.video');

        for (let i = 0; i < videos.length; i++) {
            setupVideo(videos[i]);
        }
    }

    function setupVideo(video) {
        let link = video.querySelector('.video__link');
        let button = video.querySelector('.video__button');
        let id = parseMediaURL(link);

        video.addEventListener('click', () => {
            let iframe = createIframe(id);

            link.remove();
            button.remove();
            video.appendChild(iframe);
        });

        link.removeAttribute('href');
        video.classList.add('video--enabled');
    }

    function parseMediaURL(link) {
        let regexp = /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/i;
        let url = link.href;
        console.log(url);
        let match = url.match(regexp);
        console.log(match);

        return match[1];
    }

    function createIframe(id) {
        let iframe = document.createElement('iframe');

        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'autoplay');
        iframe.setAttribute('src', generateURL(id));
        iframe.classList.add('video__media');

        return iframe;
    }

    function generateURL(id) {
        let query = '?rel=0&showinfo=0&autoplay=1';

        return 'https://www.youtube.com/embed/' + id + query;
    }

    findVideos();
}());
