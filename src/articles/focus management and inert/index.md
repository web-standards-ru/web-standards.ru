---
title: ''
date:
author: eric-bailey
source:
    title: 'Focus management and inert'
    url: 'https://css-tricks.com/focus-management-and-inert/ '
translators:
    -
editors:
    - ***
layout: article.njk
tags:
    - article

preview: ''
featured: true
---

Множество вспомогательных технологий подразумевает использование навигации с клавиатуры в целях восприятия контента и взаимодействия с ним. Один из способов подобной навигации - клавиша Tab. Вы можете быть знакомы с ним, если используете Tab для быстрого перемещения между полями формы без необхдимости тянуться к мышке или трекпаду.

Tab будет перемещаться по интерактивным элементам в том порядке, в котором они отображаются в DOM. Это одна из причин, почему так важно, чтобы порядок исходного кода соответствовал визуальной иерархии вашего дизайна.

Список интерактивных элементов, по которым можно пройтись клавишей Tab:

- [Якорные ссылки](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a), с заполненным атрибутом `href`
- [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
- [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) и [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea), с сопутствующим им [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)
- [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
- [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) и [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) при наличии контроллов
- [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), в зависимости от того, как он используется
- любой элемент с `overflow: scroll;` в Firefox
- любой элемент с атрибутом `contenteditable`
- любой элемент с атрибутом `tabindex` (о нем чуть позже)

Интерактивный элемент в состоянии фокуса, когда:

- пользователь использует клавишу Tab
- на него нажимают, переходя по якорной ссылке, ведущей к другому фокусируемому элементу
- фокус задан с помощью element.focus() в JavaScript

Состояние фокуса похоже на hover, поскольку таким образом вы определяете элемент, с которым хотите провзаимодействовать. Поэтому так важно задавать визуально очевидные стили для фокуса.

## Управление фокусом

Управление фокусом - это практика определения того, что может получать событие фокуса, а что нет.
Это одна из самых сложных вещей при разработке веб-интерфейсов, но она важна для доступности сайтов и приложений.

###

99% of the time, you want to leave focus order alone. I cannot stress this enough.

Focus will just work for you with no additional effort required, provided you’re using the <button> element for buttons, the anchor element for links, the <input> element for user input, etc.

There are rare cases where you might want to apply focus to something out of focus order, or make something that typically can’t receive focus events be focusable. Here are some guidelines for how to go about it in an accessible, intuitive to navigate way:

✅ Do: learn about the tabindex attribute

tabindex allows an element to be focused. It accepts an integer as a value. Its behavior changes depending on what integer is used.

❌ Don’t: Apply tabindex="0" to things that don’t need it

Interactive elements  that can receive keyboard focus (such as the <button> element) don’t need to have the tabindex attribute applied to them.

Additionally, you don’t need to declare tabindex on non-interactive elements to ensure that they can be read by assistive technology (in fact, this is a WCAG failure if no role and accessible name is present). Doing so actually creates an unexpected and difficult to navigate experience for a person who uses assistive technology — they have other, expected ways to read this content.

✅ Do: Use tabindex="-1" for focusing with JavaScript
tabindex="-1" is used to create accessible interactive widgets with JavaScript.

A declaration of tabindex="-1" will make an element focusable via JavaScript or click/tap. It will not, however, let it be navigated to via the Tab key.

❌ Don’t: Use a positive integer as a tabindex value
This is a serious antipattern. Using a positive integer will override the expected tab order, and create a confusing and disorienting experience for the person trying to navigate your content.

One instance of this is bad enough. Multiple declarations is a total nightmare. Seriously: don’t do it.

❌ Don’t: Create a manual focus order
Interactive elements can be tabbed to just by virtue of being used. You don’t need to set a series of tabindex attributes with incrementing values on every interactive element in the order you think the person navigating your site should use. You’ll let the order of the elements in the DOM do this for you instead.


Focus trapping
There may be times where you need to prevent things from being focused. A good example of this is focus trapping, which is the act of conditionally restricting focus events to an element and its children.

Focus trapping is not to be confused with keyboard traps (sometimes referred to as focus traps). Keyboard traps are situations where someone navigating via keyboard cannot escape out of a widget or component because of a nasty loop of poorly-written logic.

A practical example of what you would use focus trapping for would be for a modal:


Why is it important?
Keeping focus within a modal communicates its bounds, and helps inform what is and is not modal content — it is analogous to how a sighted person can see how a modal “floats” over other website or web app content. This is important information if:

You have low or no vision and rely on screen reader announcements to help communicate the shift in interaction mode.
You have low vision and a magnified display, where focusing outside of the bounds of the modal may be confusing and disorienting.
You navigate solely via keyboard and could otherwise tab out of the modal and get lost on the underlying page or view trying to get back into the modal.
How do you do it?
Reliably managing focus is a complicated affair. You need to use JavaScript to:

Determine the container elements of all focusable elements on the current page or view.
Identify the bounds of the trapped content, including the first and last focusable item.
Remove both interactivity and discoverability from anything identified as focusable that isn’t within that set of trapped content.
Move focus into the trapped content.
Listen for events that signals dismissing the trapped content (save, cancel, dismissal/hitting the Esc key, etc.).
Dismiss the trapped content area when triggered by a pertinent event.
Restore previously removed interactivity.
Move focus back to the interactive element that triggered the trapped content.
Why do we do it?
I’m not going to lie: this is all tricky and time-consuming to do. However, focus management and a sensible, usable focus order is a Web Content Accessibility Guideline. It’s important enough that it’s considered part of an international, legally-binding standard about usability.

Tabbable and discoverable
There’s a bit of a trick to removing both discoverability and interactivity.

Screen readers have an interaction mode that allows them to explore the page or view via a virtual cursor. The virtual cursor also lets the person using the screen reader discover non-interactive parts of the page (headings, lists, etc.). Unlike using Tab and focus styles, the virtual cursor is only available to people using a screen reader.

When you are managing focus, you may want to restrict the ability for the virtual cursor to discover content. For our modal example, this means preventing someone from accidentally “breaking out” of the bounds of the modal when they’re reading it.

Discoverability can be suppressed via a judicious application of aria-hidden="true". However, interactivity is a little more nuanced.

Enter inert
The inert attribute is a global HTML attribute that would make removing, then restoring the ability of interactive elements to be discovered and focused a lot easier. Here’s an example of how it would work:

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

I am deliberately avoiding using the <dialog> element for the modal due to its many assistive technology support issues.

inert has been declared on the <main> element following a save confirmation modal. What this means that all content contained within <main> cannot receive focus nor be clicked.

Focus is restricted to inside of the modal. When the modal is dismissed, inert can be removed from the <main> element. This way of handling focus trapping is far easier compared to existing techniques.

Remember: A dismissal event can be caused by the two buttons inside our modal example, but also by pressing Esc on your keyboard. Some modals also let you click outside of the modal area to dismiss, as well.

Support for inert
The latest versions of Edge, Chrome, and Opera all support inert when experimental web platform features are enabled. Firefox support will also be landing soon! The one outlier is both desktop and mobile versions of Safari.

I’d love to see Apple implement native support for inert. While a polyfill is available, it has non-trivial support issues for all the major screen readers. Not great!

In addition, I’d like to call attention to this note from the inert polyfill project’s README:

The polyfill will be expensive, performance-wise, compared to a native inert implementation, because it requires a fair amount of tree-walking.

Tree-walking means the JavaScript in the polyfill will potentially require a lot of computational power to work, and therefore slow down the end-user experience.

For lower power devices, such as budget Android smartphones, older laptops, and more powerful devices doing computationally-intensive tasks (such as running multiple Electron apps), this might mean freezing or crashing occurs. Native browser support means this sort of behavior is a lot less taxing on the device, as it has access to parts of the browser that JavaScript doesn’t.

Safari
Personally, I am disappointed by Apple’s lack of support for inert. While I understand that adding new features to a browser is incredibly complicated and difficult work, inert seems like a feature Apple would have supported much earlier.

macOS and iOS have historically had great support for accessibility, and assistive technology-friendly features are a common part of their marketing campaigns. Supporting inert seems like a natural extension of Apple’s mission, as the feature itself would do a ton for making accessible web experiences easier to develop.

Frustratingly, Apple is also tight-lipped about what it is working on, and when we can generally expect to see it. Because of this, the future of inert is an open question.

Igalia
Igalia is a company that works on browser features. They currently have an experiment where the public can vote on what features they’d like to see. The reasoning for this initiative is outside the scope of this article, but you can read more about it on Smashing Magazine.

One feature Igalia is considering is adding WebKit support for inert. If you have been looking for a way to help improve accessibility on the web, but have been unsure of how to start, I encourage you to pledge. $5, $10, $25. It doesn’t have to be a huge amount, every little bit adds up.

Pledge Now
Wrapping up
Managing focus requires some skill and care, but is very much worth doing. The inert attribute can go a long way to making this easier to do.

Technologies like inert also represents one of the greatest strengths of the web platform: the ability to pave the cowpaths of emergent behavior and codify it into something easy and effective.

Further reading
Controlling focus with tabindex (A11ycasts, Episode 04)
Using the tabindex attribute (The Paciello Group)
Using JavaScript to trap focus in an element (Hidde de Vries)
