---
title: "Clipboard API"
date: 2021-03-10
author: pavel-mineev
editors:
    - vadim-makeev
layout: article.njk
tags:
preview: ""
hero:
    src: ""
    alt: ""
    contain: true
    background: "#e1e4eb"
---

Возможность скопировать что-то в буфер обмена существует в браузерах достаточно давно. Но синхронный запуск команд `copy` или `write` через в функцию `document.execCommand()` всегда был не самым лучшим API. Его неудобство сподвигло разработчиков к написанию множества библиотек, которые помогали пользоваться копированием с помощью более удобного интерфейса. К счастью, W3C задумался над разработкой нового, более удобного способа взаимодействия с Clipboard API и уже в декабре 2016 года [был опубликован первый черновик](https://github.com/w3c/clipboard-apis/commit/3ffdbba8580e0096aa7d492d49e1309001d25162) современного API. В 2021 году эта возможность уже есть во всех браузерах, хотя и с [некоторыми отличиями в поддержке](https://caniuse.com/async-clipboard).

## Почему работа с буфером обмена важна для сайтов

Кажется, что такие знакомые сочетания клавиш как <kbd>Ctrl C</kbd> и <kbd>Ctrl V</kbd> знакомы каждому. Но пользователю иногда всё-таки легче кликнуть по кнопке и получить содержимое в буфере обмена. Например, если пользователь хочет скопировать ссылку, то сочетания клавиш не помогают и нужно совершить больше действий. Прямо как на сайте [web-standards.ru](https://web-standards.ru) — вы можете скопировать ссылку на конкретное место в статье, обозначенное заголовком, если кликнете на иконку справа от заголовка. Получается, что если вы точно знаете, что пользователю нужно будет скопировать какие-то данные, путь к этому можно сократить с помощью простой кнопки.

## Возможности современных браузеров

Современный API позволяет работать не только с текстом, но и с картинками, а также копировать смешанный контент или исключать какие-то элементы при попытке копирования. Есть несколько способов работы с Clipboard API, один из самых главных — это API для чтения и записи буфера обмена. Методы в `window.navigator.clipboard` предоставляют прямой доступ к чтению или записи данных в буфер обмена. Также есть и другие возможности, которые мы рассмотрим далее.

## Запись в буфер обмена

Для сохранения данных в буфер можно использовать универсальный метод `write()` или специальный `writeText()`, если мы собираемся помещать в буфер только текст. Оба метода являются асинхронными и возвращают `Promise`

Рассмотрим простой пример с копированием ссылки:

```html
<span class="tooltip">
    <button
        class="tooltip__button"
        aria-label="Копировать ссылку на заголовок"
        data-href="#section-2"
        aria-labelledby="copy-section-2">
    </button>
    <span class="tooltip__label" role="tooltip" id="copy-section-2">
        Скопировать ссылку
    </span>
</span>
```

```js
document.querySelector('.tooltip').addEventListener('click', () => {
    const tooltip = this.nextSibling;
    const hash = this.getAttribute('data-href');

    navigator.clipboard
        .writeText(`${window.location.href}${hash}`)
        .then(() => {
            setSuccessState(tooltip);
        })
        .catch(() => {
            setErrorState(tooltip);
        });
});
```

[Полный пример кода на GitHub](https://github.com/web-standards-ru/web-standards.ru/blob/master/src/scripts/modules/copy-link.js)

Так как `writeText` возвращает `Promise`, мы должны обработать исключение, и в случае возникновения ошибки предупредить пользователя об этом.

Если мы используем функцию `write`, то к копируемым данным можно добавить, например, картинку. Как показано в примере:

```js
const blob = await fetch('https://placehold.jp/150x150.png').then((req) =>
    req.blob()
);
const clipboardItem = new ClipboardItem({ [blob.type]: blob });

navigator.clipboard
    .write([clipboardItem])
    .then(() => console.log('Картинка скопирована!'))
    .catch((err) => console.error(err));
```

Также можно изменять данные перед записью в буфер обмена, когда пользователь пытается скопировать контент на странице, например, добавлять дополнительную информацию:

```js
document.addEventListener('copy', (evt) => {
    const source = `Источник: ${window.location.href}`;

    // Нужно заблокировать стандартное поведение
    evt.preventDefault();
    // И поместить дополнительные данные в Clipboard
    evt.clipboardData.setData(
        'text',
        `${document.getSelection()}\n\n${source}`
    );
});
```

## Чтение буфера обмена

По аналогии с записью, мы также можем читать данные из буфера обмена. Для этого есть аналогичные методы `read` и `readText`:

```js
navigator.clipboard
    .readText()
    .then((data) => console.log('Скопировано', data))
    .catch((err) => console.error('Не удалось скопировать', err));
```

Важная особенность чтения из буфера в том, что оно работает не напрямую. Например, в Google Chrome во время попытки прочитать данные из буфера пользователю скажут о попытке и предложать разрешить или запретить действие. А Safari, например, покажет контекстное меню с пунктом «Paste».

Также можно запросить разрешение на чтение буфера заранее с помощью [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) — хотя стоит заметить, что не все браузеры его поддерживают.

Другой вариант чтения данных из буфера — реагировать на вставку данных на сайте. Такое событие можно слушать как на всём `document`, так и, например, в поле ввода `<textarea>`. С помощью этого метода можно перехватить и обработать событие.

```js
document.querySelector('textarea').addEventListener('paste', (evt) => {
    if (evt.clipboardData.files.lenght === 0) {
        return;
    }

    const files = Array.from(evt.clipboardData.files);

    evt.preventDefault();

    uploadFiles(files)
        .then(() => console.log('Загружено!'))
        .catch((err) => console.error('Произошла ошибка', err));
});
```

## Заключение

Правильное использование современных API может значительно повысить удобство ваших интерфейсов. Clipboard API — один из таких случаев, когда вы можете упростить решение задач даже для самых неопытных пользователей.
