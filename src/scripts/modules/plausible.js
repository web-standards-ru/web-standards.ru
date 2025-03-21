import Plausible from 'plausible-tracker';

const plausible = Plausible({
    domain: 'web-standards.ru',
});

plausible.enableAutoPageviews();

export default plausible;
