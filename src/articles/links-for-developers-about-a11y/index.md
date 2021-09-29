---
title: 'Подборка ссылок для знакомства с доступной разработкой'
date: 2021-09-22
author: tatiana-fokina
editors:
    - vadim-makeev
    - vasiliy-dudin
tags:
    - a11y
preview: 'Полезные ссылки на ресурсы о доступности для разработчиков, которые только начинают знакомиться с этой темой.'
hero:
    src: images/cover.png
    cover: true
---

Когда изучаешь новую тему, сложно сразу понять, с чего начать. Особенно, если это активно развивающиеся технологии и подходы. Например, веб-доступность.

Здесь собраны ссылки на ресурсы по доступности, которые пригодятся веб-разработчикам. Они помогут сориентироваться в море информации в начале погружения в эту тему.

Отбирала их по нескольким критериям:

- о них часто упоминают другие разработчики;
- в текстах есть важная или актуальная информация;
- эти источники помогли мне самой в изучении доступности.

Постаралась собрать здесь и ресурсы на русском языке, но пока их больше на английском. Как и с другими веб-технологиями, многие специалисты по доступности из англоговорящих стран.

## Навигация
- [Основы основ](#section-2)
    - [Про веб-доступность в общем](#section-3)
    - [Гайдлайны и стандарты](#section-9)
    - [Accessibility API](#section-13)
    - [Вспомогательные технологии](#section-16)
- [Пользователи](#section-17)
- [Законы](#section-18)
- [Чеклисты](#section-19)
- [Пишем доступный код](#section-20)
    - [Официальные тьюториалы W3C](#section-21)
    - [Другие тьюториалы](#section-22)
    - [Библиотеки доступных компонентов](#section-23)
    - [Доступные CSS и JavaScript](#section-24)
- [Дизайн](#section-25)
    - [Инклюзивный дизайн](#section-26)
    - [Советы по дизайну](#section-27)
- [Тестирование](#section-28)
- [Курсы](#section-29)
- [Быть в курсе](#section-30)
    - [Сообщества](#section-31)
    - [Подкасты и стримы](#section-32)
    - [Конференции и митапы](#section-33)
    - [Персональные блоги](#section-34)
    - [Рассылка](#section-35)
- [Другие подборки ссылок](#section-36)

## Основы основ

### Про веб-доступность в общем

#### Ресурсы WAI W3C

Один из главных двигателей доступности — W3C WAI (W3C Web Accessibility Initiative). Это специальная рабочая группа W3C. У неё много базовых материалов по этой теме. Например, [обзор основ доступности](https://www.w3.org/WAI/fundamentals/). В нём разобраны основные понятия, категории пользователей, которым критически важна доступность, как они пользуются сайтами, принципы доступности и другие важные вещи.

#### MDN

На MDN есть отдельный [раздел про доступность](https://developer.mozilla.org/en-US/docs/Web/Accessibility) и [вводный тьюториал](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/What_is_accessibility). Многие материалы переведены на русский.

#### Google Web Fundamentals

Google тоже писала [вводные статьи про доступность](https://developers.google.com/web/fundamentals/accessibility). Например, о важности семантической вёрстки, про доступные стили и управление фокусом.

#### WebAIM

Это некоммерческая американская организация при Университете штата Юта. Проводит аудит компаний, сертификацию и обучает другие команды доступности.

На её сайте тоже много [базовых материалов](https://webaim.org/articles/). Ещё WebAIM каждый год проводит [исследования пользователей с особыми потребностями](https://webaim.org/projects/). Например, из них можно узнать о распространённых проблемах в вебе или рейтинге скринридеров и операционных систем.

#### A Little Book of Accessibility

[Сборник советов и принципов доступности](https://www.ab11y.com/articles/a-little-book-of-accessibility/), которые повлияли на стратегию BBC.

### Гайдлайны и стандарты

У W3C WAI есть [краткий обзор стандартов по доступности](https://www.w3.org/WAI/standards-guidelines/). Самые важные — спецификация HTML, WCAG и WAI ARIA.

#### HTML

Во многих статьях, постах и руководствах встретите идею о том, что доступность начинается с семантики. А где самая полная информация об HTML-тегах и атрибутах? Конечно в [стандарте HTML](https://www.w3.org/TR/html52/).

Не призываю читать её от начала до конца, но туда стоит заглядывать в любой непонятной ситуации с разметкой.

Другие полезные ссылки:

- [HTML: A good basis for accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML) с MDN.
- [Периодическая таблица HTML-тегов](https://madebymike.github.io/html5-periodic-table/).
- [HTML5 Doctor](http://html5doctor.com). На сайте есть список всех HTML-элементов и их краткое описание, а ещё статьи о хороших практиках.
- [HTML5 Accessibility](https://www.html5accessibility.com). Доступность фич HTML5 в популярных браузерах.
- [HTMHell](https://www.htmhell.dev). Проект, который собирает примеры плохой и хорошей разметки из реальных проектов.

#### WCAG

WCAG (Web Content Accessibility Guidelines) — Руководства по обеспечению доступности веб-контента. Содержат основные рекомендации о том, как сделать любой цифровой продукт доступным.

Может показаться, что это слишком сложно для начала. Но, поверьте, большинство статей и других гайдлайнов ссылается на WCAG, а автоматические инструменты генерируют отчёты на основе их критериев успешности.

У руководств несколько версий:

- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) (есть в [переводе на русский](https://ifap.ru/ictdis/wcag.htm)). Актуальна на момент выхода статьи.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Будет принята до конца 2021.

Ещё пара полезных ресурсов:

- [How to Meet WCAG](https://www.w3.org/WAI/WCAG21/quickref/). Справочник по критериям успешности и техникам WCAG. Поможет разобраться, что конкретно от вас хотят в руководствах.
- [WCAG Guide](https://guia-wcag.com/en/). Наглядные карточки с критериями успешности.
- [Тьюториал «Understanding the Web Content Accessibility Guidelines»](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG) на MDN.

#### WAI ARIA

WAI-ARIA (WAI Accessible Rich Internet Applications Suite) — рекомендации, которые описывают вспомогательные техники создания более доступного контента для скринридеров (программ чтения с экрана). Расширяет возможности HTML с помощью специальных атрибутов и ролей. В 2021 действует [WAI-ARIA 1.1](https://www.w3.org/TR/wai-aria-1.1/).

Дополнительные ссылки:

- [Обзор WAI-ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) на MDN.
- [Тьюториал про основы ARIA](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics) с MDN.
- [Периодическая таблица ролей ARIA 1.1](https://dylanb.github.io/periodic-aria11-roles.html).
- Серия из трёх статей «ARIA Spec for the Uninitiated» в блоге Deque. В [первой части](https://www.deque.com/blog/aria-spec-for-the-uninitiated-part-1/) объясняется, что такое ARIA, как устроен стандарт и какие правила в нём есть ([перевод на русский](https://web-standards.ru/articles/five-rules-of-aria/)).

Небольшая справка: Deque — американская компания, которая проводит аудиты, разрабатывает инструменты для тестирования доступности и занимается обучением.

### Accessibility API

Для большего понимания того, что происходит под капотом у браузеров, полезно копнуть чуть глубже в сторону Accessibility API.

Больше всего технических подробностей содержится в рекомендациях [W3C Core Accessibility API Mappings 1.1](https://www.w3.org/TR/core-aam-1.1/).

#### Дерево доступности

Дерево доступности (accessibility tree) похоже на DOM-дерево, только вместо HTML-элементов в него попадают их доступные роли и имена. Именно с ним взаимодействуют скринридеры, когда им нужно прочитать контент страницы.

- [«The Accessibility Tree»](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree). Водная статья Google.
- [«Accessibility APIs: A Key To Web Accessibility»](https://www.smashingmagazine.com/2015/03/web-accessibility-with-accessibility-api/). Одна из самых подробных и популярных статей с разбором того, как работает доступность в браузерах.
- [«Accessibility API и доступность»](https://medium.com/@fokinatatiana/accessibility-api-%D0%B8-%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%BD%D0%BE%D1%81%D1%82%D1%8C-5a0a93931397). Статья на русском, в которой тоже разбирается дерево доступности.
- [Список доступных имён и ролей HTML-элементов в дереве доступности Chrome](https://russmaxdesign.github.io/html-elements-names/).

#### AOM

Если интересно, то дополнительно можно почитать про AOM (Accessibility Object Model, Объектная модель доступности). Она похожа на DOM, только нужна для доступа JavaScript к дереву доступности. Пока что это экспериментальный JavaScript API.

Информацию из первых рук найдёте в [репозитории рабочей группы](https://wicg.github.io/aom/), которая разрабатывает этот API.

### Вспомогательные технологии

Это аппаратное или программное обеспечение, которое упрощает взаимодействие пользователей с контентом. Например, экранные лупы, увеличивающие размер интерфейса, выносные кнопки, специальные мышки или скринридеры.

- [Список и обзор вспомогательных устройств для людей с глухотой и особенностями речи](https://www.nidcd.nih.gov/health/assistive-devices-people-hearing-voice-speech-or-language-disorders) на сайте американской NIDCD (The National Institute on Deafness and Other Communication Disorders).
- [Список вспомогательных технологий для людей со слепотой и сниженным зрением](https://www.afb.org/blindness-and-low-vision/using-technology/assistive-technology-products) на сайте AFB (The American Foundation for the Blind).

В веб-доступности много внимания уделяется скринридерам. Это одна из самых популярных вспомогательных технологий, которой пользуются люди со слепотой, сниженным зрением и, на самом деле, не только они. Из статьи [«What is a screen reader?»](https://axesslab.com/what-is-a-screen-reader/) можно больше про них узнать.

У скринридеров есть особенности поддержки HTM-тегов, атрибутов и ARIA. Ссылки по этой теме собраны дальше в разделе про тестирование.

## Пользователи

Полезно не только знать о доступности в теории, но и понимать, каким пользователям она нужна больше всего. Это поможет лучше разобраться в барьерах и том, как именно они мешают реальным людям.

- [Фильм «Inclusive design in action» из гайда Microsoft](https://www.microsoft.com/design/inclusive/#inclusivethefilm).
- [Раздел о пользователях из гайда по доступности Сбербанка](https://www.sberbank.ru/common/img/uploaded/redirected/person/digital_guideline2/assets/designer.html#users).
- [Web Accessibility Perspectives Videos](https://www.w3.org/WAI/perspective-videos/). Видео с пользователями в разных ситуациях на сайте W3C.
- [Videos of people with disabilities using tech](https://axesslab.com/tech-youtubers/). Ещё одна подборка видео про пользователей вспомогательных технологий на Axess Lab.

## Законы

В какой-то момент на вас начнут со всех сторон наступать странные слова и аббревиатуры. ADA, Section 508, EN 301 549. Это всё связано с законами, которые регулируют доступность.

- [Раздел про законы в статье о доступности на Википедии](https://en.wikipedia.org/wiki/Web_accessibility#Web_accessibility_legislation). Краткий разбор законодательства о доступности в разных странах.
- [Доступность и закон](https://web-standards.ru/articles/a11y-and-law/). Статья на Веб-стандартах с обзором основных европейских, американских и российских законов в области доступности. Обновление: в 2020 в России был принят новый [ГОСТ Р 52872-2019](https://docs.cntd.ru/document/1200167693).

## Чеклисты

Они пригодятся для тестирования, аудита доступности или для быстрой проверки требований. Только помните, что такие списки не заменяют WCAG. Так что не полагайтесь только на них.

Самые популярные чеклисты:

- [Чеклист The A11Y Project.](https://www.a11yproject.com/checklist/)
- [Чеклист WCAG 2 WebAIM](https://webaim.org/standards/wcag/checklist).
- [Чеклисты Deque](https://dequeuniversity.com/checklists/web/). Критерии сгруппированы по элементам. Например, для таблиц, изображений, видео и аудио, анимации.

## Пишем доступный код

### Официальные тьюториалы W3C

- [Обзор полезных ресурсов для разработчиков](https://www.w3.org/WAI/roles/developers/). Базовые советы и подсказки по доступной разработке.
- [Тьюториал по доступности на W3C Schools](https://www.w3schools.com/accessibility/). Краткие советы о доступной разметке. Например, про ориентиры, заголовки, ссылки, кнопки и формы.
- [Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/). Больше подробностей про то, как сделать доступные меню, изображения, таблицы, формы, карусели и структуру страниц.
- [Index of ARIA Design Pattern Examples](https://www.w3.org/TR/wai-aria-practices-1.1/examples/). Примеры правильного использования ARIA в компонентах.

### Другие тьюториалы

- [A11ycasts](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g). Серия коротких видео Роба Додсона из Google про основы технической доступности.
- [A Complete Guide To Accessible Front-End Components](https://www.smashingmagazine.com/2021/03/complete-guide-accessible-front-end-components/). Серия коротких постов на Smashing Magazine. Разобраны полезные техники и инструменты для создания доступных компонентов.
- [Accessibility for front-end developers](https://accessibility.digital.gov/front-end/getting-started/) из гайда американской Администрация общих служб. Небольшой чеклист с базовыми советами для разработчиков.
- [Accessible to all](https://web.dev/accessible/). Советы по доступной разработке на web.dev.
- [Гайдлайн Сбербанка о доступности для веб-разработчиков](https://www.sberbank.ru/common/img/uploaded/redirected/person/digital_guideline2/assets/dev_web.html).
- [Веблайнд](https://weblind.ru). Рекомендации на русском о доступной разработке для людей с нарушениями зрения.
- [101 Digital Accessibility (a11y) tips and tricks](https://dev.to/inhuofficial/101-digital-accessibility-tips-and-tricks-4728). Пост с DEV Community. Много практических советов о доступной разработке.
- [Inclusive Components](https://inclusive-components.design). Серия статей Хейдона Пикеринга. Подробный разбор того, как правильно сверстать и задизайнить карточки, переключатели тем, тултипы, слайдеры, оповещения, таблицы, выпадающие секции, вкладки, меню и списки дел. На Веб-стандартах есть переводы части статей.

### Библиотеки доступных компонентов

- [A11Y Style Guide](https://a11y-style-guide.com/style-guide/). Оупенсорсная библиотека доступных паттернов. Собраны примеры разметки и демки доступных карточек, форм, навигации, заголовков, списков, ссылок «Читать дальше».
- [Библиотека кода Deque](https://dequeuniversity.com/library/). Примеры доступных компонентов. Например, вкладок, слайдеров, каруселей и чекбоксов. Пока в бете.
- [Компоненты из дизайн-системы GOV.UK](https://design-system.service.gov.uk/components/).
- [Компоненты из дизайн-системы правительства Новой Зеландии](https://design-system-alpha.digital.govt.nz/components/). Можно выбрать формат сниппетов. Например, HTML, Handlebars, React JavaScript или TypeScript. 
- [Компоненты из проекта «No Style Design System»](https://nostyle.herokuapp.com/components). Это реализованная дизайн-система из [книги «Form Design Patterns»](https://www.smashingmagazine.com/printed-books/form-design-patterns/) Адама Сильвера. Можно посмотреть, как сделать доступно автозаполнение, поле для пароля с возможностью его показа или выбор даты.
- [Accessible Components](https://github.com/scottaohara/accessible_components). Репозиторий Скотта О’Хары на GitHub. Есть аккордеон, вкладки, переключатели, тултип, модальное окно, хлебные крошки, формы.
- [Vuetensils](https://vuetensils.stegosource.com/introduction.html). Библиотека доступных Vue-компонентов.
- [Chakra](https://chakra-ui.com/docs/getting-started). Библиотека доступных React-компонентов.
- [Angular Material](https://material.angular.io). Доступные Angular-компоненты от Google.

### Доступные CSS и JavaScript

В основном в тьюториалах, гайдах и библиотеках компонентов упор делается на HTML. Это логично, но CSS и JS тоже могут влиять на доступность.

- [CSS and JavaScript accessibility best practices](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/CSS_and_JavaScript). Тьюториал на MDN.
- [CSS Can Influence Screenreaders](https://benmyers.dev/blog/css-can-influence-screenreaders/). Пост из блога Бена Майерса. Рассмотрены все возможные ситуации, когда CSS может повлиять на скринридеры.
- [The effect of CSS on screen readers](https://uselessdivs.com/blog/the-effect-of-css-on-screen-readers). Пост из блога Use Less Div. Это дополнение к посту Бена Майерса. Проверка того, изменилась ли в 2021 году ситуация с доступностью CSS в браузерах.
- [Modern CSS Upgrades To Improve Accessibility](https://moderncss.dev/modern-css-upgrades-to-improve-accessibility/). Пост из блога Modern CSS Solutions for Old CSS Problems. Разобрано то, как CSS помогает улучшить доступность.

## Дизайн

Всегда можно правильно сверстать компонент, но без хорошего дизайна он не будет доступным. В этом разделе найдёте несколько ссылок о доступности в дизайне.

### Инклюзивный дизайн

Это практика проектирования продуктов или услуг таким образом, чтобы ими могло пользоваться как можно больше людей.

- [Accessibility, Usability, and Inclusion](https://www.w3.org/WAI/fundamentals/accessibility-usability-inclusion/). Статья W3C про разницу между доступностью, юзабилити и инклюзией.
- [Inclusive Design Principles](https://inclusivedesignprinciples.org). Общие принципы инклюзивного веб-дизайна.
- [Гайд по инклюзивному дизайну Microsoft](https://www.microsoft.com/design/inclusive/).

### Советы по дизайну

- [Постеры про доступность](https://accessibility.blog.gov.uk/2016/09/02/dos-and-donts-on-designing-for-accessibility/). Проект команды по доступности сайта британского правительства GOV.UK. Проиллюстрированы советы о том, как можно и как нельзя дизайнить для людей со сниженным зрением, глухотой, расстройствами аутистического спектра, дислексией, моторными и физическими особенностями и для пользователей скринридеров.
- [Раздел с дизайн-паттернами на Smashing Magazine](https://www.smashingmagazine.com/category/design-patterns/). Статьи про паттерны инклюзивного дизайна: кнопки, слайдеры, аккордеоны, фильтры и много чего ещё.
- [The Mental Health Patterns Library](https://designpatternsformentalhealth.org). Библиотека доступных принципов и паттернов для людей с особенностями ментального здоровья.
- [Манифест о доступности для людей с цветовой слепотой](https://colorblindaccessibilitymanifesto.com). Базовые правила для доступного интерфейса с точки зрения цвета.
- [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/). Рабочие записки специальной группы Coga TF (Cognitive and Learning Disabilities Accessibility Task Force) из W3C о том, как сделать интерфейс доступным для людей с когнитивными особенностями.
- [Гайдлайн «Доступность в дизайне»](https://teletype.in/@romanshamin/a11y-for-designers) (есть [перевод на английский](https://evilmartians.com/chronicles/accessible-design-from-the-get-go)). Составлен Романом Шаминым, арт-директором Evil Martians. В нём много деталей и подробностей о том, как создать доступную дизайн-систему.

## Тестирование

Тестирование тоже важная часть доступной разработки, о которой полезно иметь общее представление.

- [Accessibility best practices for screenreader testing](https://sheribyrnehaber.medium.com/accessibility-best-practices-for-screenreader-testing-e35c5df9cecb). Статья Шери Бирн-Хабер на Medium с кратким описанием основных принципов тестировании доступности.
- [Web Accessibility Evaluation Tools List](https://www.w3.org/WAI/ER/tools/). Список W3C WAI со всеми одобренными ей инструментами для оценки доступности.
- [A Complete Guide To Accessibility Tooling](https://www.smashingmagazine.com/2021/06/complete-guide-accessibility-tooling/). Статья Ник Чан на Smashing Magazine. Разобраны самые популярные инструменты для автоматического тестирования, проверки контрастности, линтеры и другие полезные тестерские штуки.
- [Accessibility Support](http://a11ysupport.io). Аналог Can I Use в мире доступности. Можно проверить поддержку ARIA-атрибутов и ролей, а также HTML-элементов и атрибутов в разных скринридерах.
- [База поддержки HTML-элементов PowerMapper Software](https://www.powermapper.com/tests/screen-readers/elements/). Ещё на сайте есть такие же базы по атрибутам, ARIA и WCAG.
- [Гайдлайн BBC по тестированию в скринридерах](https://bbc.github.io/accessibility-news-and-you/assistive-technology/testing.html). Поэтапно описано, как проводить тестирование скринридеров на разных платформах.
- [Шорткаты и жесты в скринридерах](https://dequeuniversity.com/screenreaders/) на сайте Deque. Есть JAWS, NVDA, Narrator, VoiceOver и TalkBack.

## Курсы

Здесь собрала только пару популярных курсов, о которых часто упоминают. Больше ссылок на платные и бесплатные англоязычные курсы найдёте на [Digital a11y](https://www.digitala11y.com/digital-accessibility-courses-roundup/).

- [Introduction to Web Accessibility](https://www.edx.org/course/web-accessibility-introduction). Курс W3C. Есть возможность пройти бесплатно с некоторыми ограничениями.
- [Бесплатный курс по доступности от Google](https://www.udacity.com/course/web-accessibility--ud891).
- [Платный курс про цифровую доступность Валерии Курмак](https://accessibilityunity.com).

## Быть в курсе

Если хотите быть в курсе событий из мира доступности и узнать об этом ещё больше, то вам могут помочь сообщества, подкасты, конференции, митапы и блоги.

### Сообщества

- [Статьи и посты о доступности на CSS-Tricks](https://css-tricks.com/tag/accessibility/).
- [Категория «Accessibility» на Smashing Magazine](https://www.smashingmagazine.com/category/accessibility/).
- [Блог The A11Y Project](https://www.a11yproject.com/posts/). Оупенсорсный проект, посвящённый всем аспектам веб-доступности.
- [Посты по тегу «a11y» на DEV Community](https://dev.to/t/a11y).
- [Статьи Веб-стандартов по тегу «a11y»](https://web-standards.ru/articles/tags/a11y/). Есть авторские статьи и переводы. Да вы и сами знаете.
- [Хаб про доступность на Хабре](https://habr.com/ru/hub/accessibility/). Тоже собраны авторские посты и переводы статей про доступную разработку.

### Подкасты и стримы

- [A11y Rules Podcast](https://a11yrules.com).
- [13 Letters](https://www.bemyeyes.com/podcasts-show/13-letters). Подкаст об универсальном дизайне, законодательстве и лучших практиках цифровой доступности со специалистами из разных стран.
- [Подскаст Веб-стандарты](https://web-standards.ru/podcast/). Не специализируется на доступной разработке, но новости и события из мира доступности обсуждаются почти в каждом выпуске.
- [Accessibility Talks](https://www.youtube.com/c/accessibilitytalks). Стримы о доступности.
- [Стримы Some Antics на Twitch](https://www.twitch.tv/SomeAnticsDev) и [их записи на YouTube](https://www.youtube.com/playlist?list=PLZluKlEc91YzYor_ItAax4d2iXTXbFAFF). Проект Бена Майерса о доступной разработке в формате дискуссий с разработчиками, тестировщиками, дизайнерами и всеми, кто занимается доступностью.
- [Technica11y](https://technica11y.org/). Cтримы про проблемы и хитрости, связанные с технической доступностью.
- [Список других подкастов](https://www.a11yproject.com/resources/#podcasts) с The A11Y Project.

### Конференции и митапы

В мире проводится много конференций и митапов про доступность. Перечислю несколько мероприятий, которые можно посмотреть бесплатно онлайн.

- [Inclusive Design 24](https://inclusivedesign24.org/). 24-часовая онлайн-конференция об инклюзивном дизайне и доступности.
- [Axe-con](https://www.deque.com/axe-con/). Конференция о доступности для разработчиков, дизайнеров, менеджеров и всех неравнодушных. Проводится Deque.
- [#a11yTO Conf](https://conf.a11yto.com). Трёхдневная онлайн-конференция, состоящая из тщательно отобранного «плейлиста» из лекций, демо и лайтнинг толков.
- [Accessibility Club Minsk](https://a11yminsk.space). Русскоязычный митап о доступности. Часть международной коммьюнити Accessibility Club. [Записи митапов на YouTube](https://www.youtube.com/channel/UCfNsXZX9SOvdcKX2o6tjVhw).
- [Pitera11y_meetup](https://github.com/pitercss/a11y_docs). Петербургский митап о доступности. [Плейлист записей докладов на YouTube](https://www.youtube.com/playlist?list=PLTdS5E3zupkGg0FoMoWB5FD2tlBrSWUQB).
- [Список других событий](https://www.a11yproject.com/resources/#groups-and-organizations) на The A11Y Project.

### Персональные блоги

Много технический деталей прячется в персональных блогах.

- [Tink](http://tink.uk). Блог Леони Уотсон, директора TetraLogical, члена W3C Advisory Board и BIMA Inclusive Design Council, а также сопредседателя W3C Web Applications Working Group.
- [Блог Скотта О’Хары](https://www.scottohara.me/writing/), бывшего дизайнера, который сейчас специализируется на доступной разработке и UX.
- [Блог Бена Майерса](https://benmyers.dev), веб-разработчика и адвоката доступности.
- [Accessabilly](https://accessabilly.com/). Блог Мартина Менгеле, фронтенд-разработчика и консультанта по доступности.
- [Блог Сары Суайдан](https://www.sarasoueidan.com/blog/), разработчицы пользовательских интерфейсов и дизайн-систем, автора статей и спикера. Он не полностью посвящён доступности, но в нём периодически появляются подробные посты про неё.
- [Блог Эрика Бэйли](https://ericwbailey.design/writing/), адвоката доступности и инклюзивного дизайна, мэйтейнера The A11Y Project.
- [HTML Accessibility](https://html5accessibility.com/stuff/category/htmlaccessibility/). Блог Стива Фолкнера, технического директора TPGi, ведущего разработчика Web Accessibility Toolbar, члена W3C Web Platforms Working Group и W3C ARIA Working Group.
- [Блог Адриана Розелли](https://adrianroselli.com/tag/accessibility), консультанта, автора статей, спикера, члена нескольких рабочих групп W3C. Например, W3C HTML Accessibility Task Force и W3C Accessible Rich Internet Applications Working Group.

Конечно, не обязательно начинать с этих блогов. Можете сами попробовать найти в Твиттере интересных вам разработчиков и следить за их блогами через RSS, рассылку или другим удобным способом.

### Рассылка

Здесь собраны рассылки, на которые я подписана. Другие можете поискать у [The A11Y Project](https://www.a11yproject.com/resources/#newsletters).

- [Accessibility Weekly](https://a11yweekly.com). Еженедельная рассылка с полезными статьями, постами и новостями за неделю. Приходит по понедельникам.
- [The WebAIM Newsletter](https://webaim.org/newsletter/). Ежемесячная.

## Другие подборки ссылок

- [Public Library](https://www.getstark.co/library/), собранная Stark. Это продуктовая компания, которая занимается разработкой инструментов для проверки доступности.
- [Digital Accessibility Resources](https://www.digitala11y.com/web-accessibility-resources/) на Digital A11y.
- [Список ресурсов по доступности](https://www.a11yproject.com/resources/) на The A11Y Project.
