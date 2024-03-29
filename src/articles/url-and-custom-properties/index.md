---
title: 'Пути в кастомных свойствах. История одного бага'
date: 2021-11-09
author: sergey-artemov
editors:
    - vadim-makeev
tags:
    - css
---

[В недавнем выпуске «Веб-стандартов»](https://web-standards.ru/podcast/302/) обсуждались релиз-ноуты Safari TP 133, среди которых оказался интересный фикс. О нём рассказал Никита Дубко:

> Беда была в том, что CSS-переменные работали не так: если вы в CSS-переменную задаёте URL, то он резолвился относительно HTML-документа. Оказывается, эта история связана с тем, как работают CSS-переменные. В Safari починили, или скорее поменяли это поведение, и теперь CSS-переменные точно так же резолвятся относительно URL стилевой таблицы — вполне себе ожидаемая штука.

Поведение действительно поменяли, но если сказать точнее — скорее исправили ошибку, ведь в других браузерах всё работало по-другому, согласно спецификации. А ещё всё намного сложнее, чем кажется. Но начнём с начала.

## История фикса

Несколько месяцев назад я узнал (не без помощи Руслана Берендеева), что в WebKit функция `url()` в кастомных свойствах резолвится не так, как ожидается, в отличие от движков Gecko (Firefox) и Blink (Chrome). Я нашёл уже давно заведённый [баг 200092](https://bugs.webkit.org/show_bug.cgi?id=200092) — в нём была тишина, которую я и не надеялся расшевелить. Оставил этот баг на несколько месяцев, пока в него не заглянул Вадим Макеев. И, оказывается, там отвечают 😮

Тогда я решил посмотреть, как теперь дела обстоят с этим багом, и с удивлением обнаружил, что в заброшенной ветке сломанные пути починились, но почему-то не везде. Разница в коде небольшая, но существенная. Вдобавок оказалось, что надо учесть ещё одну особенность, шлейфом тянущуюся из уже исправленного на тот момент [бага 198512](https://bugs.webkit.org/show_bug.cgi?id=198512), из которого в уже знакомый мне баг пришли Вадим и разработчик WebKit Дарин Адлер. Обе эти особенности кода обозначу ниже.

Для прояснения ситуации я решил собрать тест, максимально совпадающий с описанием из [заметки в спецификации](https://drafts.csswg.org/css-variables-1/#syntax), на которую сослался Дарин.

> Например, относительные URL-адреса в CSS сопоставляются с базовым URL-адресом таблицы стилей, в которой объявляется значение. Однако, если кастомное свойство, к примеру, `--my-image: url(foo.jpg)` объявляется в таблице стилей _/a/style.css,_ оно не будет немедленно преобразовано в абсолютный URL-адрес; если эта переменная позже будет использоваться, например `background: var(--my-image)`, в другой таблице стилей _/b/style.css,_ то она преобразуется в путь _/b/foo.jpg._

Я добавил к описанному сценарию все возможные варианты, на основе тех особенностей. Снабдил тест описанием и таблицей результатов. И представил его в комментаниях к багу, надеясь, что это прояснит всю ситуацию.

Но оказалось, что я заметку понял как описание того, как это **должно** работать, а Дарин — как **не должно**. В итоге, до выяснения правильного поведения, ни о каких правках в коде не могло быть и речи. Подход правильный, надо было разобраться. Понимая, что со своим так-себе английским могу не замечать какого-то нюанса в формулировке, я стал просить помощи известных мне гуру спецификации. И таки помог «человек-спека» — Илья Стрельцын. Он заметил, что вообще-то этот баг про [регистрируемые кастомные свойства](https://drafts.css-houdini.org/css-properties-values-api/#the-registerproperty-function), которые:

> Передаются не как токены, а уже как обработанные значения.

Кажется это вывело из тупика, оживилось обсуждение, в результате которого, чтобы не менять этот, Дарин открыл новый [баг 230243](https://bugs.webkit.org/show_bug.cgi?id=230243), про взаимоотношения URL уже с обычными кастомными свойствами. Исправил и закрыл. Дело за отгрузкой этого исправления в Safari.

## Тест работы путей с кастомными свойствами

То была история. А для понимания всех тонкостей текущей проблемы работы путей с кастомными свойствами легче всего разобраться с довольно простым устройством теста.

Обычное (не регистрируемое) кастомное свойство объявляется в стилевом файле в одной директории _/a/style.css:_

```css
.test {
    --my-image: url('foo.svg');
}
```

А используется оно в другой `/b/style.css`:

```css
.test {
    background: var(--my-image);
}
```

Этот вариант я назвал **inside,** где `url()` находится _внутри_ кастомного свойства.

Но Дарин с Вадимом пришли из бага, пример кода в котором можно назвать **beside,** где `url()` не в кастомном свойстве, а просто _рядом_, через пробел от `var()` с кастомным свойством, в котором может быть вообще любое значение, например цвет:

```css
.test {
    background: url('foo.svg') var(--my-color);
}
```

И раз уж возможно такое, то нельзя исключать и вариант **outside,** где `var()` находится от `url()` вообще _в соседнем_ (через запятую) значении множественного значения.

```css
.test {
    background:
        url('foo.svg'),
        linear-gradient(
            var(--my-color),
            var(--my-color)
        );
}
```

Но и это ещё не всё. Упомянутое ранее небольшое, но существенное, отличие в коде, которое ломало разрешение пути — это всего лишь форма свойства, в значении которого применяется путь. Представленные выше варианты используют сокращённую форму свойства, и все их можно назвать **shorthand**. Для _beside_ возможен только такой вариант. Но остальные сценарии возможны и с отдельными (не сокращёнными) формами свойства — **longhand**. В таком случае _inside_ выглядит так:

```css
.test {
    background-image: var(--my-image);
}
```

Вариант _outside_ выглядит вот так:

```css
.test {
    background-image:
        url('foo.svg'),
        linear-gradient(
            var(--my-color),
            var(--my-color)
        );
}
```

Во всех случаях `url()` содержит путь до файла без переходов по директориям `url('foo.svg')`. И во всех случаях он должен резолвиться в путь _/b/foo.svg,_ по которому находится изображение:

<img src="demo/b/foo.svg" width="100" height="100" alt="Успех! :3">

Для _inside_ стоило предусмотреть разрешение пути по месту объявления кастомного свойства, то есть в путь _/a/foo.svg,_ поэтому там я разместил изображение:

<img src="demo/a/foo.svg" width="100" height="100" alt="Не та папка">

И остаётся последнее из возможных разрешений пути — рядом с HTML-страницей _/foo.svg:_

<img src="demo/foo.svg" width="100" height="100" alt="Провал :(">

Вся структура проекта выглядит так:

```
├─ a
│  ├─ foo.svg
│  └─ style.css
├─ b
│  ├─ foo.svg
│  └─ style.css
├─ foo.svg
└─ index.html
```

А вот и сам тест во фрейме или, если удобно, [на отдельной странице](demo/).

<iframe title="Таблица с результатами тестов" src="demo/" width="296" height="216"></iframe>

До 14-й версии в Safari все пять сценариев теста фэйлились. Начиная с 14.1 — все варианты теста с _shorthand_ стали проходить успешно (видимо это и был фикс [бага 198512](https://bugs.webkit.org/show_bug.cgi?id=198512)), но оба _longhand_ — фейлятся.

Напомню, что этот тест касается только обычных кастомных свойств. Если ещё не запутались в этом всём, то попробуйте угадать, в какое изображение должен резолвиться путь в каждом из сценариев, если обычное кастомное свойство заменить регистрируемым.

Думаю, если повнимательнее присмотреться, например, к коду сценария _longhand + outside,_ то станет понятно, что разрешение пути до _/foo.svg_ ну никак не может считаться нормальным поведением движка браузера. Это очевидная ошибка. Поэтому всё-таки «починили», а не «поменяли» поведение.

Остаётся лишь дождаться стабильного релиза с этой починкой и с полным _успехом_ в тесте. А также надеяться, что с путями в регистрируемых кастомных свойствах будет всё хорошо. А пока…

## Заключение

Напоследок пара советов:

Если вам понадобится заиспользовать `url()` хотя бы где-то рядом (внутри одного свойства) с использованием кастомного свойства, и тем более `url()` внутри кастомного свойства — используйте для этого пока, до релиза фикса, сокращённые свойства `background` и `mask`, а не отдельные `background-image` и `mask-image`.

Не бойтесь писать об ошибках в баг-трекеры браузеров. Написал бы я сразу, а не месяцы спустя, может уже фикс был бы в стабильном релизе. И не просто ждите, когда больной для вас баг вылечат — помогите разработчикам хоть чем-нибудь, информации подробной дайте, или тест соберите (даже ошибочность релизноутов [обнаружили](https://bugs.webkit.org/show_bug.cgi?id=230243#c13), прогоняя этот мой тест).
