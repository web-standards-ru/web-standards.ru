---
title: 'Атрибут contenteditable'
date: 2012-03-09
source:
    title: 'The contenteditable attribute'
    url: 'https://html5doctor.com/the-contenteditable-attribute/'
author: jack-osborne
translators:
  - anton-nemtsev
editors:
  - vadim-makeev
layout: article.njk
tags:
  - article
  - html
---

Мы уже давно используем различные технологии для редактирования и хранения текста в браузере. С атрибутом `contenteditable` это становится намного проще. В этой статье я расскажу для чего этот атрибут, как он работает и куда нам двигаться дальше.

## Основы

Давайте обратимся к спецификации:

> Атрибут `contenteditable` обладает фиксированным набором значений, он может быть пустой строкой, `true` или `false`. Пустая строка или `true` обозначают, что элемент доступен для редактирования. `false` обозначает, что элемент недоступен для редактирования. Есть еще третье состояние — `inherit`, это значение атрибута по умолчанию и оно означает, что значение наследуется от родительского элемента.
> [WHATWG](http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#contenteditable)

В основном, атрибут `contenteditable` должен был обеспечивать работу WYSIWYG-редакторов. Скорее всего, вы встречали его в инструментах подобных Symphony или на сайтах вроде Flickr, где вы начинаете редактировать материалы, просто кликнув в определенную область.

Как упоминалось выше, `contenteditable` может быть в трёх возможных состояниях:

1. `contenteditable=""` или `contenteditable="true"` означает, что элемент доступен для редактирования
2. `contenteditable="false"` означает, что элемент недоступен для редактирования
3. `contenteditable="inherit"` означает, что элемент доступен для редактирования в случае, если его непосредственный родитель доступен для редактирования. Это значение атрибута по умолчанию.

Когда вы добавляете элементу атрибут `contenteditable`, браузер делает его доступным для редактирования. Кроме того, все потомки этого элемента также становятся доступны для редактирования, если атрибут `contenteditable` у них явно не установлен в `false`.

## Пример кода

    <div id="example-one" contenteditable="true">
        <style scoped>
            #example-one {
                margin:12px 0;
            }
            #example-one[contenteditable="true"] {
                padding:10px;
                outline:3px dashed #CCC;
            }
            #example-one[contenteditable="true"]:hover {
                outline:3px dashed #2B8BAD;
            }
        </style>
        <p>Всё что находится в этом блоке, доступно для редактирования в браузерах, поддерживающих <code>HTML5</code>. Давайте, попробуйте: кликните для начала редактирования.</p>
    </div>

## Демонстрация

Вот два простых примера, показывающие работу `contenteditable`:

### Пример №1

<div id="example-one" contenteditable="true">

<style>
    #example-one {
        margin: 12px 0;
        font-family: Consolas, Monaco, monospace;
    }

    #example-one[contenteditable="true"] {
        padding: 10px;
        outline: 3px dashed #cccccc;
    }

    #example-one[contenteditable="true"]:hover {
        background: #e4f3f9;
        outline:3px dashed #2b8bad;
    }
</style>

Всё, что находится в этом блоке, доступно для редактирования в браузерах, поддерживающих HTML5. Давайте, попробуйте: кликните для начала редактирования.

</div>

Редактирование текста.

Я использовал CSS для создания оформления, показывающего, что текст доступен для редактирования. Обратите внимание на ориентированное на будущее использование `<style scoped>`, которое описано в моей [предыдущей статье](https://html5doctor.com/the-scoped-attribute/).

### Пример №2

[Крис Койер](https://twitter.com/chriscoyier) рассказывал на CSS-Tricks, что вы можете позволить вашим пользователям [редактировать CSS в реальном времени](http://css-tricks.com/show-and-edit-style-element/), так как `<style>` элемент имеет `display:none` по умолчанию, но ведь значение можно изменить на `block`.

Попробуйте отредактировать CSS, приведенный ниже:

<div id="example-two" contenteditable="true">

<style contenteditable="true">
    #example-two {
        margin: 12px 0;
        font-family: Consolas, Monaco, monospace;
    }

    #example-two style {
        display: block;
        white-space: pre;
    }

    #example-two[contenteditable="true"] {
        padding: 10px;
        outline: 3px dashed #cccccc;
    }

    #example-two[contenteditable="true"]:hover{
        background: #e4f3f9;
        outline: 3px dashed #2B8BAD;
    }
</style>

</div>

Редактирование таблицы стилей.

## Поддержка браузерами

Поддержка атрибута `contenteditable` браузерами на удивление хороша:

| Браузер           | Версия |
| ----------------- | ------ |
| Chrome            | 4.0+   |
| Safari            | 3.1+   |
| Mobile Safari     | 5.0+   |
| Firefox           | 3.5+   |
| Opera             | 9.0+   |
| Opera Mini/Mobile | Нет    |
| Internet Explorer | 5.5+   |
| Android           | 3.0+   |

Поддержка браузерами свойства `contenteditable`.

Должен отметить, что появлением и отличной поддержкой атрибута мы обязаны IE 5.5, хотя на самом деле ранний вариант `contenteditable` был [разработан и внедрен Microsoft в июле 2000 года](http://msdn.microsoft.com/en-us/library/ms537837(VS.85).aspx).

Более подробную таблицу совместимости можно увидеть тут: [When Can I Use](http://caniuse.com/contenteditable).

## Сохранение изменений

Для написания этого раздела я обратился за помощью к доктору Реми, так как он гораздо более сведущ во всём, что касается хранения <del>данных</del> всего на свете.

> В зависимости от сложности блока ваш код может отлавливать нажатие <kbd>Enter</kbd> (код 13) для сохранения изменения и <kbd>Esc</kbd> (код 27) для их отмены.
>
> Когда пользователь нажимает <kbd>Enter</kbd> (предполагаем, что редактируем однострочные данные), получаем `innerHTML` редактируемого блока и посылаем AJAX-запрос с изменениями на сервер.
>
> Простой пример можно увидеть тут: [Сохранение данных из элемента с `сontenteditable` при помощи AJAX](http://jsbin.com/owavu3).
>
> [Реми Шарп](http://remysharp.com/)

## Заключение

В своих статьях я неоднократно упоминал этот подход: спецификация наконец-то сделала официальным то, что внедрено в браузерах много лет назад.

Атрибут `contenteditable` — один из самых малоизвестных, но могу поспорить, что вы будете использовать его чаще, чем думаете.

Представьте себе возможность редактирования блока текста после простого клика на него: делать быстрые правки в статьях, редактировать комментарии или даже создавать не завязанные на серверную часть таблицы в веб-приложениях.

Если у вас есть идеи, как использовать этот атрибут — расскажите нам об этом в комментариях.

## Читать дальше

- [Что такое contenteditable?](http://blog.whatwg.org/the-road-to-html-5-contenteditable#what)
- [Разворачиваем изображения с помощью HTML5 contenteditable](http://css-tricks.com/expanding-images-html5/)
