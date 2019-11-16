---
title: 'Сite и blockquote: перезагрузка'
date: 2013-11-11
author: steve-faulkner
source:
    title: 'Cite and blockquote — reloaded'
    url: 'https://html5doctor.com/cite-and-blockquote-reloaded/'
translators:
  - natasha-arefyeva
editors:
  - yuliya-bukhvalova
  - vadim-makeev
  - olga-aleksashenko
layout: article.njk
tags:
  - article
  - html
---

Недавно в [спецификации HTML](http://www.w3.org/html/wg/drafts/html/master/) было изменено определение элементов `<blockquote>` и `<cite>`. В статье рассказывается, что это значит для разработчиков.

## Изменения в определении `<blockquote>`

<blockquote>
    <p>Элемент <code>&lt;blockquote&gt;</code> представляет контент, являющийся цитатой из другого источника, <strong>возможно</strong>, включающим упоминание этого источника, которое <strong>должно быть</strong> размещено внутри элементов <code>&lt;footer&gt;</code> или <code>&lt;cite&gt;</code>, и, <strong>возможно</strong>, содержащий примечания и сокращения.</p>
    <p>Контент внутри элемента <code>&lt;blockquote&gt;</code>, за исключением отсылки к источнику и изменений в тексте, <strong>должен быть</strong> точной цитатой из другого источника, адрес которого, если таковой имеется, <strong>может быть</strong> указан в атрибуте <code>cite</code>.</p>
    <footer>
        <cite>
            <a href="http://www.w3.org/html/wg/drafts/html/master/grouping-content.html#the-blockquote-element">4.51 the Blockquote element</a>, Роберт Бержон и соавторы, 2013.
        </cite>
    </footer>
</blockquote>

_Выделение в цитате авторское, прим. редактора._

### Что изменения в `<blockquote>` значат для разработчиков

[Прежде в HTML5](http://www.w3.org/TR/html5/) не было принято включать упоминание источника внутрь элемента `<blockquote>`. Сейчас ситуация изменилась, при условии, что упоминание источника находится внутри элемента `<cite>` или `<footer>`. Упоминание источника внутри цитаты — распространенный кейс (данные показывают, что приблизительно в [60% случаев `<blockquote>`](http://lists.w3.org/Archives/Public/public-html/2013Aug/0100.html) содержит упоминание источника), изменения в [спецификации HTML](http://www.w3.org/html/wg/drafts/html/master/grouping-content.html#the-blockquote-element) подтверждают это и обеспечивают семантический механизм дифференциации контента цитаты от упоминания ее источника.

Пример использования элементов `<footer>` и `<cite>` внутри `<blockquote>`:

```html
<blockquote>
    <p>
        As my fellow HTML5 Doctor, Oli Studholme has showed,
        people seldom quote exactly – so sacrosanctity of the quoted
        text isn’t a useful ideal – and in print etc, citations almost
        always appear as part of the quotation –
        it’s highly conventional.
    </p>
    <footer>
        — <cite><a href="http://brucelawson.co.uk/2013/on-citing-
        quotations-again/">Bruce Lawson</a></cite>
    </footer>
</blockquote>
```

Пример выше показывает, что авторы спецификации, вместо того, чтобы следовать [теоретической чистоте](http://www.w3.org/TR/html-design-principles/#priority-of-constituencies), которая, в данном случае, не имеет практического смысла, предпочли изменить определение, чтобы [решить реальную проблему](http://www.w3.org/TR/html-design-principles/#solve-real-problems) используя существующие возможности HTML, а не [изобретать колесо](http://www.w3.org/TR/html-design-principles/#do-not-reinvent-the-wheel).

### Редкий случай

Один из аргументов против использования cite и footer внутри blockquote для указания источника цитат состоит в том, что цитируемый контент сам по себе может содержать цитаты и ссылки на источники. Мы можем отбросить этот аргумент по той причине, что такие случаи крайне редки. Отказ от использования `<cite>` и `<footer>` ради такого редкого кейса — другой пример [теоретической чистоты](http://ln.hixie.ch/?start=1154950069&count=1), которая не будет служить практическим целям.

Но если у вас возник такой случай, в настоящее время [спецификация HTML](http://www.w3.org/html/wg/drafts/html/master/grouping-content.html#the-blockquote-element) предлагает вам просто закомментировать указание источника в коде цитаты. (Вопрос все еще [открыт](https://www.w3.org/Bugs/Public/show_bug.cgi?id=23175) и этот совет может измениться):

_(Добавлено 6.11.13, прим. редактора.)_ В ответ на отзывы, мы решили изменить наше предложение для спецификации так, чтобы использовать атрибут `class` (который [может использоваться для расширения](http://www.w3.org/html/wg/drafts/html/master/infrastructure.html#extensibility)) элемента `<cite>` для обозначения, что это часть источника цитаты.

```html
<blockquote>
    <p>
        My favorite book is
        <cite class="from-quote">At Swim-Two-Birds</cite>
    </p>
    <footer>
        — <cite>Mike[tm]Smith</cite>
    </footer>
</blockquote>
```

## Изменения в определении `<cite>`

<blockquote>
    <p><a href="http://www.w3.org/html/wg/drafts/html/master/text-level-semantics.html#the-cite-element">Элемент <code>&lt;cite&gt;</code></a> <a href="http://www.w3.org/html/wg/drafts/html/master/dom.html#represents">представляет</a> отсылку к оригинальной работе. Он <strong>должен</strong> включать название работы или имя автора (персоналию, группу лиц или организацию), или ссылку, которые <strong>могут быть</strong> в представлены сокращенном виде в соответствии с соглашениями, принятыми при цитировании.</p>
    <footer>
        <cite>
            <a href="http://www.w3.org/html/wg/drafts/html/master/text-level-semantics.html#the-cite-element">4.51 the Cite element</a>, Роберт Бержон и соавторы, 2013.
        </cite>
    </footer>
</blockquote>

### Что изменения в `<cite>` значат для разработчиков

[Ранее в HTML5](http://www.w3.org/TR/html5/) не было принято упоминать автора источника по имени или заключать другую информацию об источнике в элемент `<cite>`. Применение `<cite>` было зарезервировано (теоретически) для названия источника. Это было попыткой пересмотреть определение элемента, [не менявшееся 14 лет](http://www.w3.org/TR/REC-html40/).

Разработчики выступали против изменений в определении:

<blockquote>
    <p>Присоединяйтесь к кампании гражданского неповиновения против излишне ограничительных, обратно-несовместимых изменений элемента <code>&lt;cite&gt;</code>. Начните использовать HTML5, но начните использовать его разумно. Давайте посмотрим, как плохой совет канет в лету.</p>
    <footer>
        <cite>
            <a href="http://24ways.org/2009/incite-a-riot/">Джереми Кит, 2009</a>.
        </cite>
    </footer>
</blockquote>

Они также приводили [абстрактные](http://wiki.whatwg.org/wiki/Cite_element) и [реальные примеры](http://oli.jp/example/blockquote-metadata/) указания источника. Сейчас, в результате [исследований](https://dl.dropboxusercontent.com/u/377471/cite1.html), [анализа данных](http://lists.w3.org/Archives/Public/public-html/2013Aug/0100.html) и [дискуссий](http://www.w3.org/Search/Mail/Public/search?keywords=%3Cblockquote%3E+%3Ccite%3E&hdr-1-name=subject&hdr-1-query=&index-grp=Public_FULL&index-type=t&type-index=public-html), разработчики могут вновь использовать `<cite>` для того, чтобы разными способами сослаться на источник: например, указать <q>название работы, имя автора или ссылку на источник</q>. Мы теряем в теоретической чистоте, но выигрываем в удобстве использования:

<blockquote>
    <p>Сколько раз в день тег <code>&lt;cite&gt;</code>, содержащий гиперссылку, опубликуется на веб-страницах? По меньшей мере, 70 миллиардов раз, т.е. примерно в 10 ссылках на странице результатов поиска Google. Одна из причин, почему элемент <code>&lt;cite&gt;</code> теперь можно использовать для гиперссылок (даже не упоминая про идентичную ситуацию с Bing).</p>
    <footer>
        <cite>
            Стив Фолкнер, <a href="https://twitter.com/stevefaulkner/statuses/392645777874370560">22 октября 2013</a>
        </cite>
    </footer>
</blockquote>

### Что вы думаете?

Пожалуйста, прочитайте определения в спецификации HTML 5.1, нам интересно ваше мнение!

- [4.6.6 Элемент `<cite>`](http://www.w3.org/html/wg/drafts/html/master/text-level-semantics.html#the-cite-element)
- [4.5.4 Элемент `<blockquote>`](http://www.w3.org/html/wg/drafts/html/master/grouping-content.html#the-blockquote-element)

Огромное спасибо «доктору» Оли, чье [исследование](http://oli.jp/2011/blockquote/) помогло подготовить изменения, произошедшие с элементами `<cite>` и `<blockquote>`. И «доктору» Брюсу за то, что [настаивал](http://www.brucelawson.co.uk/2013/on-citing-quotations-again/) на своем праве цитировать свою маму.
