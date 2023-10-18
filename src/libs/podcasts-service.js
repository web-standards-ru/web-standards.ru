const https = require('https');
const { once } = require('events');

const NodeXMLStream = require('node-xml-stream');
const { parseHTML } = require('linkedom');

const RSS_URL = 'https://web-standards.ru/podcast/feed/';

async function getEpisodesData() {
    const [response] = await once(https.get(RSS_URL), 'response');

    response.setEncoding('utf8');

    return new Promise((resolve, reject) => {
        const XMLParser = new NodeXMLStream();

        // список полей для парсинга
        const fields = new Set([
            'item',
            'title',
            'pubDate',
            'description',
            'guid',
            'itunes:episode',
            'itunes:author',
        ]);

        let currentItem = null;
        let currentField = null;
        const items = [];

        XMLParser.on('opentag', (name) => {
            if (!fields.has(name)) {
                return;
            }

            if (name === 'item') {
                currentItem = {};
                return;
            }

            if (!currentItem) {
                return;
            }

            currentField = name;
        });

        XMLParser.on('closetag', (name) => {
            if (name === 'item') {
                const DOM = parseHTML(currentItem.description);

                const titles = Array.from(DOM.document.querySelectorAll('h2'));

                const titlesTextToElementMap = titles.reduce((map, titleElement) => {
                    map[titleElement.textContent] = titleElement;
                    return map;
                }, {});

                // удаляем раздел с ведущими из контента
                const hostsTitle = titles.filter(title => title.textContent === 'Ведущие' || title.textContent === 'Hosts')[0];
                if (hostsTitle) {
                    const hostsList = hostsTitle.nextElementSibling;
                    hostsList && hostsList.remove();
                    hostsTitle.remove();
                }

                // парсим раздел с темами с таймкодами и удаляем его из контента
                let chapters;
                const chaptersTitle = titles.filter(title => title.textContent === 'Темы' || title.textContent === 'Topics')[0];
                if (chaptersTitle) {
                    const chaptersList = chaptersTitle.nextElementSibling;
                    if (chaptersList && chaptersList.tagName === 'UL') {
                        chapters = Array.from(chaptersList.children)
                            .map(listItem => {
                                const [time, ...textItems] = listItem.textContent.split(' ');
                                return {
                                    time,
                                    title: textItems.join(' '),
                                };
                            });
                        chaptersList.remove();
                    }
                    chaptersTitle.remove();
                }

                for (const chapter of (chapters || [])) {
                    const titleElement = titlesTextToElementMap[chapter.title];
                    titleElement?.setAttribute('id', chapter.time);
                }

                items.push({
                    episode: currentItem['itunes:episode'],
                    title: currentItem.title.replace(currentItem['itunes:episode'] + '. ', ''),
                    date: new Date(currentItem.pubDate),
                    chapters,
                    content: DOM.document.toString(),
                    hosts: currentItem['itunes:author'].split(',').map(v => v.trim()),
                    audio: currentItem.guid,
                });
                currentItem = null;
            }

            if (name === currentField) {
                currentField = null;
            }
        });

        XMLParser.on('text', text => {
            if (currentItem && currentField && currentField !== 'description') {
                currentItem[currentField] = text;
            }
        });

        XMLParser.on('cdata', cdata => {
            if (currentItem && currentField) {
                currentItem[currentField] = cdata;
            }
        });

        XMLParser.on('error', err => {
            reject(err);
        });

        XMLParser.on('finish', () => {
            resolve(items);
        });

        response.pipe(XMLParser);
    });
}


function withCache(operation) {
    let cache = null;

    return function() {
        if (!cache) {
            cache = operation();
        }
        return cache;
    };
}

module.exports = {
    getEpisodesData: withCache(getEpisodesData),
};
