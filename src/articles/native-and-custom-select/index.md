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

Вот что я понимаю под "гибридным" селектом: это одновременно и нативный `<select>` и стилизованная альтернатива селекта в определенном стиле.

### Cелект, выпадающий список, навигация, меню... Имя имеет значение

Во время изучения данной темы я думала о всех тех названиях, которые всплывают и вертятся в голове, когда речь заходит о селектах. Наиболее общие из них - выпадающий список и меню. Есть два типа ошибок при наименовании, которые мы можем допустить: дать _одинаковое_ название разным элементам или дать _разные_ названия одинаковым элементам.

Перед тем как мы двинемся дальше, позвольте мне внести ясность касательно использования словосочетания "выпадающий список". Вот как я его понимаю:

> **Выпадающий список:** Интерактивный компонент, состоящий из кнопки, которая показывает и прячет список элементов, в основном по наведению мыши, клику или тапу. Список невидим по умолчанию пока не произойдет взаимодействие. Список обычно отображает блок содержимого поверх другого содержимого.

Множество интерфейсов могут выглядеть _похоже_ на выпадающий список. Но назвать элемент "выпадающим списком" - все равно что назвать рыбу описывая животных. Что это за семейство рыб? Рыбка-клоун не то же самое, что и акула. То же касается и выпадающих списков.

<!--Тут картиночка-->

Существует множество элементов, о которых мы можем говорить сталкиваясь со словосочетанием "выпадающий список" подобно тому, как в море существует огромное количество видов рыб.

*   **Меню:** Список команд или действий, которые пользователь может реализовать на странице.
*   **Навигация:** Список ссылок, используемых для перемещения по сайту.
*   **Селект:** Контрол формы (`<select>`) показывающий пользователю набор опций, которые он может выбрать в её пределеах.

Deciding what type of dropdown we’re talking about can be a foggy task. Here are some examples from around the web that match how I would classify those three different types. This is based on my research and sometimes, when I can’t find a proper answer, _intuition_ based on my experience.

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

Not everyone perceives and interacts with the internet in the same way. Naming user interfaces and defining design patterns is a fundamental process, though one with a lot of room for personal interpretation. All of that variation is what drives the population of dropdown_\-land._

There is a dropdown type that is clearly a **menu.** Its usage is a hot topic in conversations about accessibility. I won’t talk much about it here, but let me just reinforce that the [`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu) element is deprecated and no longer recommended. And here’s a detailed explanation about [inclusive menus and menus buttons](https://inclusive-components.design/menus-menu-buttons/), including why [ARIA menu role should not be used for site navigation](https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html).

We haven’t even touched on other elements that fall into a rather gray area that makes classifying dropdowns even murkier because of a lack of practical uses cases from the WCAG community.

Uff… that was a lot. Let’s forget about this dropdown-land mess and focus exclusively on the dropdown type that is clearly a `<select>` element.

### Let’s talk about `<select>`

Styling form controls is an interesting journey. As MDN puts it, there’s [_the good, the bad, and the ugly_](https://developer.mozilla.org/en-US/docs/Learn/Forms/Styling_web_forms#Why_is_styling_form_widgets_challenging). Good is stuff like `<form>` which is just a block-level element to style. Bad is stuff like checkboxes, which [can be done but is somewhat cumbersome](https://css-tricks.com/custom-styling-form-inputs-with-modern-css-features/). `<select>` is definitely in ugly terrain.

A lot of articles have been written about it and, even in 2020, [it’s still a challenge to create custom selects](https://css-tricks.com/making-a-better-custom-select-element/) and [some users still prefer the simple native ones](https://www.24a11y.com/2019/select-your-poison-part-2/). 

Among developers, the `<select>` is the [most frustrating form control by far](https://www.gwhitworth.com/blog/2019/07/form-controls-components/), mainly because of [its lack of styling support](https://www.gwhitworth.com/blog/2019/10/can-we-please-style-select/). The UX struggle behind it is so big that we [look for other alternatives](https://medium.com/@kollinz/dropdown-alternatives-for-better-mobile-forms-53e40d641b53). Well, I guess the first rule of `<select>` is [similar to ARIA](https://www.w3.org/TR/using-aria/%23firstrule): **avoid using it if you can.**

I could finish the article right here with _“Don’t use `<select>`, period.”_ But let’s face reality: a select is still our best solution in a number of circumstances. That might include scenarios where we’re working with a list that contains a lot of options, layouts that are tight on space, or simply a lack of time or budget to design and implement a great custom interactive component from scratch.

### Custom `<select>` requirements

When we make the decision to create a custom select — even if it’s just a “simple” one — these are the requirements we generally have to work with:

*   There is a button that contains the current selected option.
*   Clicking the box toggles the visibility of the options list (also called listbox).
*   Clicking an option in the listbox updates the selected value. The button text changes and the listbox is closed.
*   Clicking outside the component closes the listbox.
*   The trigger contains a small triangle icon pointing downward to indicate there are options.

Something like this:

CodePen Embed Fallback

Some of you may be thinking this works and is good to go. But wait… does it work for _everyone_?  Not everyone uses a mouse (or touch screen). Plus, a native `<select>` element comes with more features we get for free and aren’t included in those requirements, such as:

*   The checked option is perceivable for all users regardless of their visual abilities.
*   The component can interact with a keyboard in a predictable way across all browsers (e.g. using arrow keys to navigate, `Enter` to select, `Esc` to cancel, etc.).
*   Assistive technologies (e.g. screen readers) announce the element clearly to users, including its role, name and state.
*   The listbox position is adjusted. (i.e. does not get cut off of the screen).
*   The element respects the user’s operating system preferences (e.g high contrast, color scheme, motion, etc.).

This is where the majority of the custom selects fail in some way. Take a look at some of the major UI components libraries. I won’t mention any because the web is ephemeral, but go give it a try. You’ll likely notice that the select component in one framework behaves differently from another. 

Here are additional characteristics to watch for:

*   Is a listbox option immediately activated on focus when navigating with a keyboard?
*   Can you use `Enter` and/or `Space` to select an option?
*   Does the `Tab` key jump go to the next option in the listbox, or jump to the next form control?
*   What happens when you reach the last option in the listbox using arrow keys? Does it simply stay at the last item, does it go back to the first option, or worst of all, does focus move to the next form control? 
*   Is it possible to jump directly to the last item in the listbox using the `Page Down` key?
*   Is it possible to scroll through the listbox items if there are more than what is currently in view?

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
