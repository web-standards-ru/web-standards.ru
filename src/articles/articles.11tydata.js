function filterPeople(peopleList, filterList) {
    return peopleList
        .filter((person) => {
            // Иногда filterList это строка, а не массив, поэтому всегда делаем массив
            const filterListNormalized = [].concat(filterList);

            return filterListNormalized.includes(person.fileSlug);
        })
        .map((person) => {
            return person.data;
        });
}

module.exports = {
    layout: 'article.njk',

    eleventyComputed: {
        authorData: function(data) {
            return filterPeople(data.collections.people, data.author)
        },

        translatorsData: function(data) {
            return filterPeople(data.collections.people, data.translators)
        },

        editorsData: function(data) {
            return filterPeople(data.collections.people, data.editors)
        }
    }
}
