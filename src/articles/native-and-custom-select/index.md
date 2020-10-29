---
title: 'Ищем баланс между нативным и кастомным селектом'
date: 2020-10-19
author: sandrina-pereira
source:
    title: 'Striking a Balance Between Native and Custom Select Elements'
    url: 'https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/'
translators:
    - mikhail-danyushin
editors:

layout: article.njk
tags:
    - article
    - html

preview: ''
hero:
featured: true
---

Вот наш план! Мы сделаем стилизованный селект. Стилизуем не просто [внешние](https://css-tricks.com/styling-a-select-like-its-2019/), но и внутренние составляющие. Полный контроль над стилизацией. Плюс к этому мы собираемся сделать его доступным. Мы не будем пытаться _повторить_ за браузером все, что он делает по умолчанию при отрисовке нативного `<select>`. Мы буквально собираемся использовать `<select>`, как только задействуется любая вспомогательная технология. Но когда будет использоваться мышь, мы отрисуем стилизованную версию и заставим ее функционировать как `<select>`.

Вот что я понимаю под "гибридным" селектом: это одновременно и нативный `<select>` и его стилизованная альтернатива.

<figure>
    <img src="images/1.png" alt="Сравнение кастомного и нативного селектов">
    <figcaption>Кастомный селект (слева) часто используется вместо нативного (справа) ради эстетики и последовательности дизайна</figcaption>
</figure>

### Cелект, выпадающий список, навигация, меню... Имя имеет значение

Во время изучения данной темы я думала о всех тех названиях, которые всплывают и вертятся в голове, когда речь заходит о селектах. Наиболее общие из них - выпадающий список и меню. Есть два типа ошибок при наименовании, которые мы можем допустить: дать _одинаковое_ название разным элементам или дать _разные_ названия одинаковым элементам.

Перед тем как мы двинемся дальше, позвольте мне внести ясность касательно использования словосочетания "выпадающий список". Вот как я его понимаю:

> **Выпадающий список:** Интерактивный компонент, состоящий из кнопки, которая показывает и прячет список элементов, в основном по наведению мыши, клику или тапу. Список невидим по умолчанию пока не произойдет взаимодействие. Список обычно отображает блок содержимого поверх другого содержимого.

Множество интерфейсов могут выглядеть _похоже_ на выпадающий список. Но назвать элемент "выпадающим списком" - все равно что назвать рыбу описывая животных. Что это за семейство рыб? Рыбка-клоун не то же самое, что и акула. То же касается и выпадающих списков.

<figure>
    <img src="images/2.jpeg" src="Отличаем рыбу-клоуна от акулы">
<figure>

Существует множество элементов, о которых мы можем говорить сталкиваясь со словосочетанием "выпадающий список" подобно тому, как в море существует огромное количество видов рыб.

*   **Меню:** Список команд или действий, которые пользователь может реализовать на странице.
*   **Навигация:** Список ссылок, используемых для перемещения по сайту.
*   **Селект:** Контрол формы (`<select>`) показывающий пользователю набор опций, которые он может выбрать в её пределеах.

Определение типа выпадающего списка о котором мы ведем речь кажется туманным. Вот несколько примеров из веба подходящие под мою классификацию вышеупомянутых элементов. Они основаны на моем исследовании, и иногда, когда я не могу найти подходящий ответ моей _интуицией_ руководит опыт.

<figure>
    <img src="images/3.png" alt="Мир выпадающих списков">
    <figcaption>Мир выпадающих списков: 5 сценариев их поведения в Интернете. Более подробное описание ищите в таблице ниже.</figcaption>
</figure>

Diagram Label

Scenario

Dropdown Type

1

The dropdown expects a selected option to be submitted within a form context (e.g. Select Age)

Select

2

The dropdown does not need an active option (e.g. A list of actions: copy, paste and cut)

Menu

3

The selected option influences the content. (e.g. sorting list)

Menu or Select (more about it later)

4

The dropdown contains links to other pages. (e.g. A “meganav” with websites links)

[Disclosure Navigation](https://www.w3.org/TR/wai-aria-practices/examples/disclosure/disclosure-navigation.html)

5

The dropdown has content that is not a list. (e.g. a date picker)

Something else that [should not be called dropdown](https://adrianroselli.com/2020/03/stop-using-drop-down.html)

Не все воспринимают и взаимодействуют с интернетом одинаково. Наделение именами пользовательских интерфейсов и определение дизайн-шаблонов - фундаментальный процесс, хотя и с достаточным пространством для личной интерпретации. Все эти вариации - то что движет населением страны выпадающих списков.

Вот тип выпадающего списка, который определенно можно назвать **меню.** Его использование - горячая тема при обсуждении доступности. Я не буду много говорить об этом здесь, но позвольте мне просто подчеркнуть, что [`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu) устарел и больше не используется. А вот подробное руководство по [инклюзивным меню и его кнопкам](https://inclusive-components.design/menus-menu-buttons/),
 And here’s a detailed explanation about [inclusive menus and menus buttons](https://inclusive-components.design/menus-menu-buttons/), включая объяснение почему [роль меню ARIA не следует использовать для навигации по сайту](https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html).


Мы даже не коснулись других элементов, которые остаются в тени, что делает классификацию выпадающих списков еще более туманной из за недостака практических примеров использования от WCAG.

Уфф..это было объемно. Давайте забудем об этом выпадающем списке и сосредоточимся исключительно на теге `<select>`.

### Поговорим о `<select>`

Стилизация элементом формы - увлекательное путешествие. Согласно MDN, существуют [хорошо стилизуемые, плохо стилизуемые и ужасно стилизуемые элементы формы](https://developer.mozilla.org/en-US/docs/Learn/Forms/Styling_web_forms#Why_is_styling_form_widgets_challenging). К первым относится тег`<form>`, который попросту является блочным элементом. К плохо стилизуемым относятся чекбоксы, стилизация которых [возможна, но громоздка](https://css-tricks.com/custom-styling-form-inputs-with-modern-css-features/). `<select>` определенно из третьей категории.

Огромное число статей посвящены этому, даже в 2020 [все еще трудно создать кастомный селект](https://css-tricks.com/making-a-better-custom-select-element/) и [некоторые пользователи все еще предпочитают простые и нативные селекты](https://www.24a11y.com/2019/select-your-poison-part-2/). 

Среди разработчиков `<select>` - [самый разочарующий элемент формы](https://www.gwhitworth.com/blog/2019/07/form-controls-components/), главным образом из за [отстутствия поддержки стилей](https://www.gwhitworth.com/blog/2019/10/can-we-please-style-select/). Борьба UX за это настолько велика, что мы ищем [иные возможности](https://medium.com/@kollinz/dropdown-alternatives-for-better-mobile-forms-53e40d641b53). Ну, я думаю, что первое правило `<select>` - это, [в соответствии с ARIA](https://www.w3.org/TR/using-aria/%23firstrule): **избегайте его использования, если можете.**

Я могла бы закончить статью прямо сейчас со словами _"Не используйте `<select>`, точка."_ Но давайте посмотрим правде в глаза: селект для нас - все еще лучшее решение в ряде случаев. Сюда можно отнести моменты, когда мы работаем со списком, содержащим множество опций, <!-- Нужен совет как лучше перевисти layouts здесь. оригинал -  we’re working with a list that contains a lot of options, layouts that are tight on space --> или же просто при нехватки времени или бюджета для разработки и реализации пользовательского интерактивного компонента с нуля.

### Требования к кастомному `<select>`.

Приняв решение создать кастомный селект — пусть и самый простой — мы сталкиваемся с требованиями, которые мы должны учесть:

*   Должна быть кнопка, содержащая текущий выбранный вариант.
*   Клик по блоку переключает флажок видимости списка вариантов.
*   Клик по опции, расположенной в списке, обновляет выбранное значение. Текст кнопки меняется и список закрывается. <!--пропадает?-->
*   Клик по области вне компонента закрывает список.
*   Триггер содержит маленький треугольник, направленный вниз, чтобы указать на то, что есть варианты.

Что-то вроде этого:

CodePen Embed Fallback

Кто-то из вас подумает - "работает и хорошо". Но, постойте... Разве это работает для _всех_? Не все используют мышку (или тачскрин). К тому же, нативный `<select>`обладает более широким списком возможностей, которые достаются нам просто так и не входят в этот список требований:


*   Выбранный вариант доступен для восприятия всеми пользователями вне зависимости от их зрения. <!--визуальных способностей?-->
*   С компонентом можно взаимодействовать с помощью клавиатуры предсказуемым образом во всех браузерах (например, используя клавиши стрелок для навигации, `Enter` для выбора, `Esc` для отмены и т.д.).

*   Вспомогательные технологии (например, скринридер) четко сообщают пользователям об элементе, включая его роль, имя и состояние.
*   Положение списка регулируется (т.е. он не пропадает с экрана).
*   Элемент чувствителен к предпочтению операционной системы пользователя (например, к высокой контрастности, цветовой схеме, движению и т.д.)

Именно на этом этапе большинство кастомных селектов терпят крах. Взгляните на некоторые из основных UI библиотек. Я не буду их упоминать, потому что веб достаточно прозрачен, но идите и попробуйте. Вероятно, вы заметите разное поведение селекта в разных фреймворках.

Вот дополнительные характеристики, за которыми нужно следить:

*   Выбирается ли опция списка сразу же при получения фокуса с клавиатуры?
*   Можно ли использовать `Enter` и/или `Space` для выбора варианта?
*   Нажатие на `Tab` переносит нас к следующему варианут списка или же к следующему элементу формы?
*   Что будет, когда вы достигнете последнего варианта в списке с помощью стрелок? Фокус замрет на последнем варианте, вернется к первому или же, что    хуже всего, перейдет к следующему элементу формы?
*   Возможно ли перейти к последней опции списка с помощью клавиши `Page Down`?
*   Можно ли прокручивать элементы списка, если их больше, чем в поле видимости в данный момент?

This is a small sample of the features included in a native `<select>` element.

> Once we decide to create our own custom select, we are forcing people to use it in a certain way that may not be what they expect.

But it gets worse. Even the native `<select>` [behaves differently](https://www.24a11y.com/2019/select-your-poison/) across browsers and screen readers. Once we decide to create our own custom select, we are forcing people to use it in a certain way that may not be what they expect. That’s a dangerous decision and it’s in those details where the devil lives.

### Building a “hybrid” select

When we build a simple custom select, we are making a trade-off without noticing it. Specifically, **we sacrifice functionality to aesthetics.** It should be the other way around.

What if we instead deliver a native select by default and replace it with a more aesthetically pleasing one if possible? That’s where the “hybrid” select idea comes into action. It’s “hybrid” because it consists of two selects, showing the appropriate one at the right moment:

*   A native select, visible and accessible by default
*   A custom select, hidden until it’s safe to be interacted with a mouse

Let’s start with markup. First, we’ll add a native `<select>` with `<option>` items _before_ the custom selector for this to work. (I’ll explain why in just a bit.)

Any form control must have a [descriptive label](https://www.w3.org/WAI/tutorials/forms/labels/). We could use `<label>`, but that would focus the native select when the label is clicked. To prevent that behavior, we’ll use a `<span>` and connect it to the select using `aria-labelledby`.

Finally, we need to tell Assistive Technologies to ignore the custom select, using `aria-hidden="true"`. That way, only the native select is announced by them, no matter what.

    <span class="selectLabel" id="jobLabel">Main job role</span>
    <div class="selectWrapper">
        <select class="selectNative js-selectNative" aria-labelledby="jobLabel">
            <!-- options -->
            <option></option>
        </select>
        <div class="selectCustom js-selectCustom" aria-hidden="true">
            <!-- The beautiful custom select -->
        </div>
    </div>


This takes us to styling, where we not only make things look pretty, but where we handle the switch from one select to the other. We need just a few new declarations to make all the magic happen.

First, both native and custom selects must have the same width and height. This ensures people don’t see major differences in the layout when a switch happens.

    .selectNative,
    .selectCustom {
        position: relative;
        width: 22rem;
        height: 4rem;
    }

There are two selects, but only one can dictate the space that holds them. The other needs to be absolutely positioned to take it out of the document flow. Let’s do that to the custom select because it’s the “replacement” that’s used only if it can be. We’ll hide it by default so it can’t be reached by anyone just yet.

    .selectCustom {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
    }

Here comes the “funny” part. We need to detect if someone is using a device where hover is part of the primary input, like a computer with a mouse. While we typically think of media queries for responsive breakpoints or checking feature support, we can use it to detect hover support too using `@media query (hover :hover)`, which is supported by all major browsers. So, let’s use it to show the custom select only on devices that have hover:

    @media (hover: hover) {
        .selectCustom {
            display: block;
        }
    }

Great, but what about people who use a keyboard to navigate even in devices that have hover? What we’ll do is hide the custom select when the native select is in focus. We can reach for an [adjacent Sibling combinatioron](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator) (`+`). When the native select is in focus, hide the custom select next to it in the DOM order. (This is why the native select should be placed before the custom one.)

    @media (hover: hover) {
        .selectNative:focus + .selectCustom {
            display: none;
        }
    }

That’s it! The trick to switch between both selects is done! There are other CSS ways to do it, of course, but this works nicely.

Last, we need a sprinkle of JavaScript. Let’s add some event listeners:

*   One for click events that trigger the custom select to open and reveal the options
*   One to sync both selects values. When one select value is changed, the other select value updates as well
*   One for basic keyboard navigation controls, like navigation with `Up` and `Down` keys, selecting options with the `Enter` or `Space` keys, and closing the select with `Esc`

CodePen Embed Fallback

### Usability testing

I conducted a very small usability test where I asked a few people with disabilities to try the hybrid select component. The following devices and tools were tested using the latest versions of Chrome (81), Firefox (76) and Safari (13):

*   Desktop device using mouse only
*   Desktop device using keyboard only
*   VoiceOver on MacOS using keyboard
*   NVDA on Windows using keyboard
*   VoiceOver on iPhone and iPad using Safari

All these tests worked as expected, but I believe **this could have even more usability tests with more diverse people and tools**. If you have access to other devices or tools — such as JAWS, Dragon, etc. — please tell me how the test goes.

An issue was found during testing. Specifically, the issue was with the VoiceOver setting “Mouse pointers: Moves Voice Over cursor.” If the user opens the select with a mouse, the custom select will be opened (instead of the native) and the user won’t experience the native select.

What I most like about this approach is how it uses the best of both worlds without compromising the core functionality:

*   Users on mobile and tablets get the native select, which generally offers a better user experience than a custom select, including performance benefits.
*   Keyboard users get to interact with the native select the way they would expect.
*   Assistive Technologies can interact with the native select like normal.
*   Mouse users get to interact with the enhanced custom select.

This approach **provides essential native functionality for everyone** without the extra huge code effort to implement all the native features.

Don’t get me wrong. This technique is not a one-size-fits-all solution. It may work for simple selects but probably won’t work for cases that involve complex interactions. In those cases, we’d need to use ARIA and JavaScript to complement the gaps and create a [truly accessible custom select](https://24ways.org/2019/making-a-better-custom-select-element/).

### A note about selects that look like menus

Let’s take a look back at the third Dropdown-land scenario. If you recall, it’s  a dropdown that always has a checked option (e.g. sorting some content). I classified it in the gray area, as either a menu or a select. 

Here’s my line of thought: Years ago, this type of dropdown was implemented mostly using a native `<select>`. Nowadays, it is common to see it implemented from scratch with custom styles (accessible or not). What we end up with is a select element that looks like a menu. 

<figure>
    <img src="images/4.png" alt="Примеры селектов, выступающих в качестве меню">
</figure>

**A `<select>`  is a type of menu.** Both have similar semantics and behavior, especially in a scenario that involves a list of options where one is always checked.  Now, let me mention the [WCAG 3.2.2 On Input (Level A)](https://www.w3.org/WAI/WCAG21/Understanding/on-input.html) criterion:

> Changing the setting of any user interface component should not automatically cause a change of context unless the user has been advised of the behavior before using the component.

Let’s put this in practice. Imagine a sortable list of students. Visually, it may be obvious that sorting is immediate, but that’s not necessarily true for everyone. So, when using `<select>`, we risk failing the WCAG guideline because the page content changed, and ignificantly re-arranging the content of a page is considered a [change of context](https://www.w3.org/WAI/WCAG21/Understanding/on-input.html%23dfn-changes-of-context).

To ensure the criterion success, we must warn the user about the action before they interact with the element, or include a `<button>` immediately after the select to confirm the change.

    <label for="sortStudents">
        Sort students
        <!-- Warn the user about the change when a confirmation button is not present. -->
        <span class="visually-hidden">(Immediate effect upon selection)</span>
    </label>
    <select id="sortStudents"> ... </select>

That said, using a `<select>` or building a custom menu are both good approaches when it comes to simple menus that change the page content. Just remember that your decision will dictate the amount of work required to make the component fully accessible. This is a scenario where the hybrid select approach could be used.

### Final words

This whole idea started as an innocent CSS trick but, after all of this research, I was reminded once more that creating unique experiences without compromising accessibility is not an easy task.

Building truly accessible select components (or any kind of dropdown) is harder than it looks. WCAG provides excellent guidance and best practices, but without specific examples and diverse practical uses cases, the guidelines are mostly aspirational. That’s not to mention the fact that ARIA support is tepid and that native `<select>` elements look and behave differently across browsers.

The “hybrid” select is just another attempt to create a good looking select while getting as many native features as possible. Don’t look at this technique experiment as an excuse to downplay accessibility, but rather as an attempt to serve both worlds. If you have the resources, time and the needed skills, _please do it right_ and make sure to test it with different users before shipping your component to the world.

P.S. Remember to [use a proper name](https://adrianroselli.com/2020/03/stop-using-drop-down.html) when making a “dropdown” component. 😉
