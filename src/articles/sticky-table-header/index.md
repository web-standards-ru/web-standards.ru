---
title: Липкая шапка таблицы на CSS
date: 2021-06-25
author: grigoriy-kovalenko
tags:
    - html
    - css
preview: Делаем шапку таблицы липкой на чистом CSS
---

Практически на всех сайтах есть таблицы. А если эти таблицы имеют более дюжины строк, то вам, рано или поздно, понадобится сделать шапку таблицы «липкой». Многие до сих пор делают это с помощью JavaScript, но есть способ на чистом CSS.

## Position Sticky

Надо добавить `position: sticky` к `<thead>` (или `<tr>`, что там у вас в роли шапки?) и не забыть указать `top`:

```css
thead {
    position: sticky;
    top: 0;
}
```

<iframe src="https://codepen.io/XAHTEP26/embed/preview/ExWqodG"></iframe>

Еще недавно в Chrome был баг, который не позволял делать липкими `<thead>` и `<tr>`, но в версии 91 его исправили. А всё благодаря тому, что в браузере теперь используется [новый движок для рендеринга таблиц TablesNG](https://developer.chrome.com/blog/tablesng/).

Если вам всё-таки нужна поддержка и более старых версий, то можно сделать липкими сами ячейки (`<td>`) в шапке таблицы. Правда при этом будет сложно указать всем правильное значение `top`, когда шапка состоит из нескольких строк.

## Как не выходить за рамки?

К сожалению почти у всех таблиц, которые я встречаю, используется `border-collapse: collapse`. С этим свойством проще делать рамки для ячеек, но при этом сами рамки им уже не принадлежат, а как бы становятся частью самой таблицы. А это значит, что если шапка таблицы и стала липкой — рамки её ячеек всё равно прокручиваются вместе с таблицей.

<iframe src="https://codepen.io/XAHTEP26/embed/preview/MWpNrKv"></iframe>

Чтобы избавиться от этой проблемы, можно использовать `border-collapse: separate`. Да, с этим свойством рамки ячеек перестанут схлопываться, но нам это не помешает.

В некоторых дизайн-системах у ячеек есть только горизонтальные рамки, а значит достаточно просто указывать `border-top` или `border-bottom`. Но даже если вам нужно указать рамки со всех сторон, то есть много способов это сделать:

### Рамки для конкретных сторон

```css
:root {
  --border-width: 2px;
  --border-color: #CED4DA;
  --border: var(--border-width) solid var(--border-color);
}

table {
    border-collapse: separate;
    border-spacing: 0;
}

thead {
    position: sticky;
    top: 0;
}

th, td {
    border-right: var(--border);
    border-bottom: var(--border);
}

th:first-child, td:first-child {
    border-left: var(--border);
}

thead tr:first-child th {
    border-top: var(--border);
}
```

<iframe src="https://codepen.io/XAHTEP26/embed/preview/jOBgYGw"></iframe>

### Рамки как box-shadow

```css
table {
    border-collapse: separate;
    border-spacing: var(--border-width);
}

thead {
    position: sticky;
    top: var(--border-width);
}

th, td {
    box-shadow:
        0 0 0
        var(--border-width)
        var(--border-color);
}
```

В примере выше мы устанавливаем расстояние между ячейками с помощью `border-spacing` для таблицы и отступ для прилипания с помощью `top` для шапки, равный размеру рамки. А затем добавляем ячейкам тень `box-shadow`, имитирующую рамку.

<iframe src="https://codepen.io/XAHTEP26/embed/preview/JjWgMLx"></iframe>

### Рамки как outline

```css
table {
    border-collapse: separate;
    border-spacing: var(--border-width);
}

thead {
    position: sticky;
    top: var(--border-width);
}

th, td {
    outline: var(--border);
}
```

В примере выше мы повторяем трюк из предыдущего примера, но имитирурем рамку с помощью `outline`.

<iframe src="https://codepen.io/XAHTEP26/embed/preview/NWpQXLj"></iframe>
