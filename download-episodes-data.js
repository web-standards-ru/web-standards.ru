const path = require('path');
const fs = require('fs').promises;
const { Octokit } = require('@octokit/core');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const API_ENDPORINT = '/repos/{owner}/{repo}/contents/{path}';
const BASE_PARAMS = {
    owner: 'web-standards-ru',
    repo: 'podcast',
};

async function getEpisodesCount() {
    const response = await octokit.request({
        method: 'GET',
        url: API_ENDPORINT,
        ...BASE_PARAMS,
        path: 'src/episodes',
    });

    return response?.data?.length;
}

async function getEpisodeData(id) {
    const response = await octokit.request({
        method: 'GET',
        url: API_ENDPORINT,
        headers: {
            accept: 'application/vnd.github.v3.raw',
        },
        ...BASE_PARAMS,
        path: `src/episodes/${id}.md`,
    });

    return response?.data;
}

async function* getAllEpisodes() {
    const episodesCount = await getEpisodesCount();

    for (let episodeId = 1; episodeId <= episodesCount; episodeId++) {
        const episodeData = await getEpisodeData(episodeId);
        yield {
            episodeId,
            episodeData,
        };
    }
}

async function downloadEpisodesData() {
    for await (let { episodeId, episodeData } of getAllEpisodes()) {
        const filePath = path.join(__dirname, 'src', 'episodes', `${episodeId}.md`);
        await fs.writeFile(filePath, episodeData, 'utf-8');
        console.info(`episode ${episodeId} downloaded`);
    }
}

(async function() {
    await downloadEpisodesData();
})();
