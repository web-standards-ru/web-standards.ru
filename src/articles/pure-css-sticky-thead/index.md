---
title: Липкая шапка таблицы на CSS
date: 2021-06-25
author: grigoriy-kovalenko
tags:
    - html
    - css
preview: Делаем шапку таблицы липкой на чистом CSS
---

Практически на всех сайтах есть таблицы. А если эти таблицы имеют более дюжины строк, то вам, рано или поздно, понадобится сделать шапку таблицы "липкой". Многие разработчики до сих пор делают это с помощью JavaScript, но есть способ на чистом CSS.

## CSS Position Sticky

Надо всего лишь добавить `position: sticky` к `<thead>` (или `<tr>`, что там у вас в роли шапки?) и не забыть указать `top`:

```css
thead {
  position: sticky;
  top: 0;
}
```

<iframe src="https://codepen.io/XAHTEP26/embed/preview/ExWqodG"></iframe>

Еще недавно в Google Chrome был баг, который не позволял делать липкими `<thead>` и `<tr>`, но в версии 91 его исправили. А все благодаря тому, что в хроме теперь используется новый движок для рендеринга таблиц TablesNG.

Если вам все-таки нужна поддержка и более старых версий, то можно сделать липкими сами ячейки (`<td>`) в шапке таблицы. Правда при этом будет сложно указать всем правильное значение `top`, когда шапка состоит из нескольких строк.

## Как не выходить за рамки?

К сожалению почти у всех таблиц, которые я встречаю, используется `border-collapse: collapse`.
С этим свойством проще делать рамки для ячеек, но при этом сами рамки им уже не принадлежат, а как бы становятся частью самой таблицы.
А это значит, что если шапка таблицы и стала липкой — рамки ее ячеек все равно прокручиваются вместе с таблицей.

<iframe src="https://codepen.io/XAHTEP26/embed/preview/MWpNrKv"></iframe>

Чтобы избавиться от этой проблемы я предлагаю использовать `border-collapse: separate`.
Да, с этим свойством рамки ячеек перестанут схлопываться, но нам это не помешает.

В некоторых дизайн-системах у ячеек есть только горизонтальные границы, а значит достаточно просто указывать `border-top` или `border-bottom`.
Но даже если вам нужно указать рамки со всех сторон, то есть много способов это сделать:

### Рамки для конкретных сторон
```css
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
    border-spacing: var(--border-width); /* 1 */
}

thead {
    position: sticky;
    top: var(--border-width); /* 2 */
}

th, td {
    box-shadow: 0 0 0 var(--border-width) var(--border-color); /* 3 */
}
```

Обратите внимание, что мы устанавливаем расстояние между ячейками (1) и отступ для прилипания (2), равное размеру рамки.
А затем просто добавляем ячейкам тень, имитирующую рамку (3).

<iframe src="https://codepen.io/XAHTEP26/embed/preview/JjWgMLx"></iframe>

### Рамки как outline
```css
table {
    border-collapse: separate;
    border-spacing: var(--border-width); /* 1 */
}

thead {
    position: sticky;
    top: var(--border-width); /* 2 */
}

th, td {
    outline: var(--border); /* 3 */
}
```

Тут мы повторяем трюк из предыдущего примера (1 и 2). И имитируем рамку с помощью обводки (3).

<iframe src="https://codepen.io/XAHTEP26/embed/preview/NWpQXLj"></iframe>
