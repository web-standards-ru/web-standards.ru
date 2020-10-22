---
title: 'Управление фокусом и атрибут inert'
date: 2020-10-19
author: eric-bailey
source:
    title: 'Focus management and inert'
    url: 'https://css-tricks.com/focus-management-and-inert/'
translators:
    -
editors:
    - vadim-makeev
layout: article.njk
tags:
    - article
    - html
    - a11y
preview: ''
featured: true
---

Множество вспомогательных технологий  используют навигацию с клавиатуры в целях восприятия и взаимодействия с контентом. Один из способов подобной навигации — клавиша Tab. Должно быть вы знакомы с ним, если используете Tab для быстрого перемещения между полями формы без необхдимости тянуться к мышке или трекпаду.

Tab будет перемещаться по интерактивным элементам в том порядке, в котором они отображаются в DOM. Вот почему так важно, чтобы порядок исходного кода соответствовал визуальной иерархии вашего дизайна.

Список [интерактивных элементов](https://www.w3.org/TR/html52/dom.html%23interactive-content), по которым можно пройтись клавишей Tab:

- [Ссылки](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a), с заполненным атрибутом `href`
- [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button),
- [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) и `[<textarea>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)`, с сопутствующим им [label](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label),
- [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select),
- [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details),
- [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) и [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) при наличии контролов,
- [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), в зависимости от того, как он используется,
- любой элемент с `overflow: scroll` в Firefox,
- любой элемент с атрибутом [`contenteditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable), и
- любой элемент с установленным `[tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)` (о нём чуть позже).

Интерактивный элемент получает состояние фокуса, когда:

- На него переходят с помощью клавиши Tab
- На него кликают, переходя по ссылке  <!--Может, имеется ввиду кликают по ссылке просто? -->
- Фокус программно задан с помощью `[element.focus()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus)` в JavaScript.

Фокус похож на hover, поскольку так мы определяем элемент, с которым хотим провзаимодействовать. Вот почему [визуально очевидные стили для фокуса](https://css-tricks.com/focusing-on-focus-styles/) имеют огромное значение.

<video src="video/focus-navigation.mp4"
    width="960" height="540"
    controls loop muted playsinline>
</video>

Фокус следует по домашней странице. Начиная с логотипа, затем к товарам, услугам, вакансиям, блогу, контактам и останавливается на кнопке Learn more.

## Управление фокусом

Управлять фокусом значит определять какие элементы могут его получать, а какие нет.
При разработке веб-интерфейсов это один из самых сложных аспектов, но он важен для доступности сайтов и приложений.

### Полезные практики управления фокусом

**Оставьте фокус в покое.** Я не знаю как еще это подчеркнуть. <!-- Предлагаю убрать тут предложение после заголовка-->

Состояние фокуса будет работать без дополнительных услилий, если вы используете `<button>` для кнопок, `<a>` для ссылок, `<input>` для полей форм и т.д

В редких случаях необходимо прописать фокус элементам, не предназначенным для этого. Вот некоторые рекомендации относительно того, как реализовать это доступно и интуитивно понятно для пользователя.

✅ **Следует: Узнать побольше про атрибут `tabindex`**

`tabindex` делает элементы фокусируемыми. В качестве значения он принимает число, в зависимости от которого меняется поведение фокуса.

❌ **Не следует: Устанавливать `tabindex='0'` там, где это не надо**

Нет необходимости устанавливать  `tabindex` интерактивным элементам, которые могут получать фокус с клавиатуры(такие, как, например, `<button>`)

Кроме того, вам не нужно прописывать `tabindex` неинтерактивным элементам в целях возможности их прочтения вспомогательными устройствами <!--технологиями --> (на самом деле,  отсутствие `role` и доступного имени является ошибкой WCAG). Это может повлечь  [нежелательный для пользователя опыт](https://adrianroselli.com/2019/02/uncanny-a11y.html#Tabindex) использования вспомогательных устройств — у которых попросту есть свои собственные способы чтения контента.

#### ✅ Следует: Устанавливать `tabindex="-1"` для фокуса с помощью JavaScript

`tabindex="-1"` используется для создания доступных интерактивных виджетов посредством JS.

Прописав `tabindex="-1"` вы сделаете элемент фокусируемым для JS, а также по клику/нажатию пальцем, но недоступным через клавишу Tab.

#### ❌ Не следует: Использовать положительное значение `tabindex`

Это антипаттерн. Установив положительное значение `tabindex` вы переопределите ожидемый порядок элементов для фокуса через Tab и запутаете пользователя.

Сделать так один раз - уже плохо, несколько - полный кошмар. Серьезно, не надо так.

#### ❌ Не следует: создавать собственный порядок фокусировки

Интерактивные элементы можно вкладывать в друг друга только в соответствии с тем порядком, в котором с ними будут взаимодействовать.
<!-- Вот тут совсем не понял. Оригинал - Interactive elements can be tabbed to just by virtue of being used. -->

Не следует создавать множество `tabindex` с инкрименируемым каждым раз значением для каждого последующего элемента, в соответствии с вашим представлением о том, как пользователь должен читать ваш сайт. Позвольте DOM сделать это за вас.

## Захват фокуса

Иногда бывает необходимость запретить состояние фокуса. Хороший пример запрета  - это [захват фокуса](https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element), временно ограничивающий его события на родительском элементе.

Захват фокуса не стоит путать с ограничением [навигации с клавиатуры](https://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-trapping.html). Ограничение навигации с клавиатуры является причиной невозможности закрыть виджет или перейти к другому компоненту из за неправильно прописанной логики.

Примером ситуации, когда необхдимо захватить фокус, может быть появление модального окна.

<video src="video/trapped-focus.mp4"
    width="960" height="540"
    controls loop muted playsinline>
</video>

Фокус проходит по странице и открывает модальное окно, чтобы продемонстрировать отмену фокуса. Далее фокус двигается в рамках контента модального окна, на кнопку play, кнопку отмена, кнопку купить и кнопку закрытия.(все это время фокус на странице заблокирован). После закрытия модального окна он возвращается к исходному положению на странице до его открытия.

### Почему это важно?

Удержание фокуса в пределах модального окна помогает понять, что является его контентом, а что нет. Это аналогично тому, как зрячий человек может видеть, как окно всплывает над контентом страницы.Полезно знать это, если:

- У вас [очень плохое зрение](https://adrianroselli.com/2017/02/not-all-screen-reader-users-are-blind.html) и вы полагаетесь на скринридер, чтобы узнать об изменениях после взаимодействия со страницей.
- У вас плохое зрение и увеличенный дисплей, при котром фокусировка за пределами модального окна может сбить с толку и дезориентировать.
- Вы перемещаетесь исключительно с помощью клавиатуры и в случае закрытия модального окна можете потеряться среди страницы в попытках к нему вернуться.

### Как это сделать?

Надежно управлять фокусом - дело сложное. Нужно прибегнуть к JavaScript, чтобы:

1.  Определить родительский блок для всех фокусируемых элементов на странице.
2.  Определить границы захваченного контента (например, модального окна), включая первый и последний фокусируемый элемент.
3.  Убрать как интерактивность, так и видимость всего, что может иметь фокус и находится вне рамок захваченного контента.
4.  Переместить фокус в захваченный контент.
5.  Слушать события, сигнализирующие об уходе с выделенной области (сохрание, отмена, нажатие Esc и т.д.)
6.  Уйти с захваченной области
7.  Восстановить раннее отмененную интерактивность.
8.  Переместить фокус обратно на интерактивный элемент, вызвавший блокировку содержимого.

### Зачем нам это?

Не стану врать: все эти действия отнимают много времени. Но все же, управление фокусом и удобный порядок фокусировки являются частью [руководства по доступности в вебе](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-order.html). Тема достаточна важна, чтобы считать ее частью [международного правового стандарта об удобстве пользования](https://www.w3.org/WAI/policies/).

### Видимость

Существует небольшой трюк, с помощью которого можно легко ограничить видимость и интерактивность элемента.

[Скринридеры обладают режимом взаимодействия](https://tink.uk/understanding-screen-reader-interaction-modes/), который позволяет им проходить по странице виртуальным курсором. Виртуальный курсор также позволяет пользователю скринридера обнаруживать неинтерактивные части страницы. (заголовки, списки и т.д.). В отличие от использования Tab, виртуальный курсор доступен только пользователям скринридера.

При управлении фокусом может потребоваться ограничить возможность обнаружения содержимого виртуальным курсором. В нашем примере с модальным окном это значит предотвратить пользователя от случайного выхода за рамки окна при чтении контента.

Видимость может быть заблокирована с помощтю правильного применения атрибута [`aria-hidden="true"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute). А вот с интерактивностью есть один тонкий нюанс.

## Знакомство с `inert`

[Атрибут `inert`](https://whatpr.org/html/4288/interaction.html#the-inert-attribute) - [глобальный атрибут в HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes), позволяющий легко убирать и восстанавливать видимость интерактивных
```html
<body>
    <div
        aria-labelledby="modal-title"
        class="c-modal"
        id="modal"
        role="dialog"
        tabindex="-1">
        <div role="document">
            <h2 id="modal-title">Save changes?</h2>
            <p>The changes you have made will be lost if you do not save them.<p>
            <button type="button">Save</button>
            <button type="button">Discard</button>
        </div>
    </div>
    <main inert>
        <!-- ... -->
    </main>
</body>
```

I am deliberately avoiding using the `<dialog>` element for the modal due to [its many assistive technology support issues](https://www.scottohara.me/blog/2019/03/05/open-dialog.html).

`inert` has been declared on the `<main>` element following a save confirmation modal. What this means that all content contained within `<main>` cannot receive focus nor be clicked.

Focus is restricted to inside of the modal. When the modal is dismissed, `inert` can be removed from the `<main>` element. This way of handling focus trapping is far easier compared to existing techniques.

**Remember:** A dismissal event can be caused by the two buttons inside our modal example, but also by pressing Esc on your keyboard. Some modals also let you click outside of the modal area to dismiss, as well.

### Support for inert

The latest versions of [Edge, Chrome, and Opera all support `inert`](https://caniuse.com/#feat=mdn-api_htmlelement_inert) when [experimental web platform features are enabled](https://css-irl.info/how-to-enable-experimental-web-platform-features/). Firefox support will also be [landing soon](https://bugzilla.mozilla.org/show_bug.cgi?id=1655722)! The one outlier is both desktop and mobile versions of Safari.

I’d love to see Apple implement native support for `inert`. While [a polyfill is available](https://github.com/WICG/inert), it has [non-trivial support issues for all the major screen readers](https://www.scottohara.me/blog/2019/03/05/open-dialog.html#does-the-polyfill-help). Not great!

In addition, I’d like to call attention to this note from [the `inert` polyfill project’s README](https://github.com/WICG/inert#performance-and-gotchas):

> The polyfill will be expensive, performance-wise, compared to a native `inert` implementation, because it requires a fair amount of tree-walking.

Tree-walking means the JavaScript in the polyfill will potentially require a lot of computational power to work, and therefore slow down the end-user experience.

For lower power devices, such as [budget Android smartphones, older laptops](https://www.pewresearch.org/fact-tank/2019/05/07/digital-divide-persists-even-as-lower-income-americans-make-gains-in-tech-adoption/ft_17-03-21_low-incometech_smartphone/), and more powerful devices doing computationally-intensive tasks (such as running multiple Electron apps), this might mean freezing or crashing occurs. Native browser support means this sort of behavior is a lot less taxing on the device, as it has access to parts of the browser that JavaScript doesn’t.

#### Safari

Personally, I am disappointed by Apple’s lack of support for `inert`. While I understand that adding new features to a browser is incredibly complicated and difficult work, `inert` seems like a feature Apple would have supported much earlier.

macOS and iOS have historically had great support for accessibility, and assistive technology-friendly features are a common part of [their marketing campaigns](https://www.apple.com/accessibility/). Supporting `inert` seems like a natural extension of Apple’s mission, as the feature itself would do a ton for making accessible web experiences easier to develop.

Frustratingly, Apple is also tight-lipped about what it is working on, and when we can generally expect to see it. Because of this, the future of `inert` is an open question.

#### Igalia

[Igalia](https://www.igalia.com/) is a company that works on browser features. They currently have an experiment where the public can vote on what features they’d like to see. The reasoning for this initiative is outside the scope of this article, but you can [read more about it on Smashing Magazine](https://www.smashingmagazine.com/2020/07/crowdfunding-web-platform-features-open-prioritization/).

One feature Igalia is considering is [adding WebKit support for `inert`](https://www.igalia.com/open-prioritization/#inertwebkit). If you have been looking for a way to help improve accessibility on the web, but have been unsure of how to start, [I encourage you to pledge](https://opencollective.com/html-inert-in-webkit-safari). $5, $10, $25. It doesn’t have to be a huge amount, every little bit adds up.

[Pledge Now](https://opencollective.com/html-inert-in-webkit-safari)

## Wrapping up

Managing focus requires some skill and care, but is very much worth doing. The `inert` attribute can go a long way to making this easier to do.

Technologies like `inert` also represents one of the greatest strengths of the web platform: the ability to [pave the cowpaths](https://www.w3.org/TR/html-design-principles/#pave-the-cowpaths) of emergent behavior and codify it into something easy and effective.

### Further reading

- [Controlling focus with tabindex](https://youtu.be/Pe0Ce1WtnUM) (A11ycasts, Episode 04)
- [Using the tabindex attribute](https://developer.paciellogroup.com/blog/2014/08/using-the-tabindex-attribute/) (The Paciello Group)
- [Using JavaScript to trap focus in an element](https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element) (Hidde de Vries)

* * *

Thank you to [Adrian Roselli](https://adrianroselli.com/) and [Sarah Higley](https://sarahmhigley.com/) for their feedback.
