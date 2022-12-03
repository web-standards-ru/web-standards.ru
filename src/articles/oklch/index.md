---
title: 'OKLCH в CSS: почему мы ушли от RGB и HSL'
date: 2022-21-11
author:
    - andrey-sitnik
    - nina-torgunakova
tags:
    - css
---

<style>
  .color-preview {
    width: 16px;
    height: 16px;
    border: 1px solid black;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    top: 2px;
    margin-right: 2px;
  }

  .compare-block {
    display: flex;
    gap: 10px;
  }

  .compare-code {
    width: 50%;
  }

  .color-preview::before {
    background: repeating-conic-gradient(#fff 0% 25%, #999 0% 50%) 0 0 / 14px 14px;
    display: block;
    width: 14px;
    height: 14px;
    content: '';
    z-index: -1;
    opacity: 0.5;
  }

  .color-preview.without-opacity::before {
    display: none;
  }

  .preview-with-value {
    display: inline-block;
    position: relative;
  }

  .selector {
    color: #a1490f;
  }

  .property {
    --device-width: 80px;
    --mobile-width: 65px;
    color: #550098;
    display: inline-block;
    min-width: var(--device-width);
  }

  .comment {
    color: #706D71;
  }

  @media (max-width: 1239px) {
    .property {
      min-width: var(--mobile-width);
    }
  }

  @media (max-width: 768px) {
    .compare-block {
      flex-direction: column;
    }
    .compare-code {
      width: 100%;
    }
  }
</style>

В CSS мы чаще всего пишем цвета через `rgb()` или hex — но так сложилось исторически. Новая спецификация CSS Color 4 позволит нам описывать цвета удобнее. В этой статье мы расскажем, почему нам больше всего нравится `oklch()`.

## Краткое объяснение

`oklch()` — новый способ определять цвета в CSS. В `oklch(L C H)` или `oklch(L C H / a)` компоненты из аббревиатуры расшифровываются так:

- `L` — яркость (`0%`-`100%`). Отметим, что она передаётся так, как её увидит глаз, в отличие от `L` в `hsl()`;
- `C` — насыщенность. Варьируется от серого до наиболее интенсивного оттенка;
- `H` — оттенок, угол поворота на цветовом круге (`0`-`360`);
- `a` — непрозрачность (`0`-`1` или `0%`-`100%`).
<pre data-lang="css">
<code tabindex="0" class="language-css">
<span class="selector">a:hover&nbsp;</span><span>{</span>
  <span class="property" style="--device-width: 150px; --mobile-width: 110px;">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(0.21, 50.42, 225.59)"></div><span class="value">oklch(45% 0.26 264);&nbsp;</span><span class="comment">/* голубой */</span></div>
  <span class="property" style="--device-width: 150px; --mobile-width: 110px;">color:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: #fff"></div><span class="value">oklch(100% 0 0);&nbsp;</span><span class="comment">/* белый */</span></div>
  <span class="property" style="--device-width: 150px; --mobile-width: 110px;">color:&nbsp;</span><div class="preview-with-value"><div class="color-preview" style="background-color: rgba(0, 0, 0, 0.5);"></div><span class="value">oklch(0% 0 0 / 50%);&nbsp;</span><span class="comment">/* чёрный с прозрачностью 50% */</span></div>
<span>}</span>
</code>
</pre>
Формат OKLCH обладает многими преимуществами:

1. В отличие от `rgb()` или hex (`#ca0000`), OKLCH легко читается. По числам внутри `oklch()` мы без труда сможем определить записанный цвет. Схоже с удобством формата HSL, но тот не передаёт яркость так, как её видит человек;
2. OKLCH лучше подходит для изменения цвета, чем `hsl()`. Он правильно передаёт яркость, поэтому изменение оттенка сохранит контраст. Это защищает от неожиданных результатов, которые были у `darken()` в Sass;
3. Из-за предсказуемого контраста у OKLCH гораздо лучше с доступностью. Это очень важно при создании палитр для дизайн-систем;
4. Многие новые устройства (например, от Apple) поддерживают больше цветов, чем старые мониторы sRGB. OKLCH позволяет использовать эти P3-цвета.

Но, работая с OKLCH, следует помнить о паре важных нюансов:

1. Для OKLCH или LCH при подборе `L`, `C` и `H` есть риск получить цвет, выходящий за пределы возможностей экрана. Хоть браузеры и попытаются найти ближайший поддерживаемый цвет, нам стоит проверять результат в цветовом миксере;
2. OKLCH — цветовое пространство, которое появилось совсем недавно. На момент написания этой статьи в 2022 году его экосистема ограничена. Но у нас уже есть `oklch()` [полифил](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-oklab-function), а также [генератор палитры](https://huetone.ardov.me/), [цветовой миксер](https://oklch.evilmartians.io/) и много [конвертеров](https://bottosson.github.io/posts/oklab/#oklab-implementations).
<figure>
    <img src="images/oklch-picker.png" loading="lazy" alt="Цветовой миксер OKLCH Злых марсиан отображает пространство OKLCH с ползунками для настройки яркости, насыщенности, альфа-канала и оттенка.">
    <figcaption>Пространство OKLCH в цветовом миксере.</figcaption>
</figure>

## Оглавление

- [Развитие цвета в CSS](#section-3)
- [Сравнение OKLCH с другими CSS-форматами цветов](#section-4)
- [Принципы работы OKLCH](#section-5)
- [Внедрение OKLCH в проект](#section-6)
- [Подведение итогов](#section-7)

## Развитие цвета в CSS
#### CSS Colors Module 4

Немного истории: 5 июля 2022 года спецификация [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) стала кандидатом в рекомендации W3C. В ней появляется синтаксический сахар для функций цвета, которым мы будем пользоваться в этой статье:
<pre data-lang="css">
<code tabindex="0" class="language-css">
<span class="selector">.old&nbsp;</span><span>{</span>
  <span class="property">color:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(51, 170, 51);"></div><span class="value">rgb(51, 170, 51);&nbsp;</span></div>
  <span class="property">color:&nbsp;</span><div class="preview-with-value"><div class="color-preview" style="background-color: rgba(51, 170, 51, 0.5);"></div><span class="value">rgba(51, 170, 51, 0.5);&nbsp;</span></div>
<span>}</span>

<span class="selector">.new&nbsp;</span><span>{</span>
  <span class="property">color:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(51 170 51);"></div><span class="value">rgb(51 170 51);&nbsp;</span></div>
  <span class="property">color:&nbsp;</span><div class="preview-with-value"><div class="color-preview" style="background-color: rgb(51 170 51 / 50%);"></div><span class="value">rgb(51 170 51 / 50%);&nbsp;</span></div>
<span>}</span>
</code>
</pre>

Но что ещё важнее, CSS Color 4 добавляет 14 новых способов для определения цвета. И это не просто синтаксический сахар. Новые форматы записи (среди которых и `oklch()`) улучшают читаемость кода, доступность и могут принести прямую пользу для наших сайтов.

#### P3 Colors

Человеческий глаз способен различить гораздо больше цветов, чем способны отобразить многие устройства. Текущий, стандартно поддерживаемый набор цветов называется sRGB.

Но уже сейчас все современные устройства Apple и многие OLED-экраны поддерживают на 30% больше цветов, чем есть в sRGB. Этот расширенный набор цветов называется P3. Он также известен, как широкий цветовой охват (wide-gamut colors).

Поддержка дополнительных 30% цветов будет полезна для дизайнеров:

- Новые цвета зачастую заметно насыщеннее старых. Это поможет создавать более привлекательные и красочные веб-страницы;
- Больше цветов делают более гибким процесс создания палитр для дизайн-систем.
<figure>
    <img src="images/p3.png" loading="lazy" alt="Слева — фигура, представляющая собой расширяющийся клин и показывающая, как P3-цвета расширяют цветовое многообразие по сравнению с sRGB-пространством. Справа — левая иконка отображается в sRGB-цветах, а более яркая правая иконка отображается в P3-цветах, подчёркивая, насколько они ярче.">
    <figcaption>Слева — недавно ставший доступным набор зелёных P3-цветов. Справа — сравнение иконок, использующих sRGB и P3-цвета соответственно.</figcaption>
</figure>

Итак, теперь у нас появились P3-цвета — но радоваться ещё рано: чтобы их использовать, нам нужно найти формат, который поддерживает охват P3.`rgb()`, `hsl()` или hex неудобны для указания P3-цветов — хоть мы и можем использовать новую запись `color(display-p3 1 0 0)` , это не решает проблему плохой читаемости RGB.

К нашему везению, OKLCH очень легко читать и менять прямо в коде. К тому же он поддерживает не только P3, но и любые цвета, которые способен увидеть человек.

#### Встроенные изменения цветов в CSS

[CSS Color 4](https://www.w3.org/TR/css-color-4/) — это большой шаг в мире стилей, но грядущий [CSS Color 5](https://www.w3.org/TR/css-color-5/) будет ещё полезнее. В нём, наконец, появятся встроенные изменения цветов.
<pre data-lang="css">
<code tabindex="0" class="language-css">
<span class="comment">/* В качестве примера в следующих CSS-правилах используются hsl().
   Не используйте формат hsl() в реальных проектах, так как это влечёт проблемы с доступностью. */</span>
<span class="selector">:root&nbsp;</span><span>{</span>
  <span class="property">--accent:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: hsl(63 61% 40%);"></div><span class="value">hsl(63 61% 40%);&nbsp;</span></div>
<span>}</span>

<span class="selector">.error&nbsp;</span><span>{</span>
  <span class="comment">/* Красный вариант акцентирующего цвета */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: hsl(20, 61%, 40%);"></div><span class="value">hsl(from var(--accent) 20 s l);&nbsp;</span></div>
<span>}</span>

<span class="selector">.button:hover&nbsp;</span><span>{</span>
  <span class="comment">/* Вариант на 10% светлее */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: hsl(63, 61%, 50%);"></div><span class="value">hsl(from var(--accent) h s calc(l + 10%));&nbsp;</span></div>
<span>}</span>
</code>
</pre>
С новым синтаксисом мы можем взять один цвет — например, из кастомного свойства — и легко изменить его, переписав отдельные компоненты цвета.

Но, как мы упоминали, у `hsl()` есть ощутимый недостаток: этот формат обладает плохой доступностью. Для него значение `l` зависит от угла поворота оттенка, поэтому после изменения через `hsl()` может получиться плохой контраст текста и фона.

Здесь мы возвращаемся к старой проблеме: нам необходимо пространство, где работа с цветом даёт предсказуемый результат. И OKLCH отлично подходит для этой задачи.
<pre data-lang="css">
<code tabindex="0" class="language-css">
<span class="selector">:root&nbsp;</span><span>{</span>
  <span class="property">--accent:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(160, 167, 45);"></div><span class="value">oklch(70% 0.14 113);&nbsp;</span></div>
<span>}</span>

<span class="selector">.error&nbsp;</span><span>{</span>
  <span class="comment">/* Красный вариант акцентирующего цвета */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(232, 119, 130);"></div><span class="value">oklch(from var(--accent) l c 15);&nbsp;</span></div>
<span>}</span>

<span class="selector">.button:hover&nbsp;</span><span>{</span>
  <span class="comment">/* Вариант на 10% светлее */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(190, 199, 82);"></div><span class="value">oklch(from var(--accent) calc(l + 10%) c h);&nbsp;</span></div>
<span>}</span>
</code>
</pre>
Отметим: `--accent` в `oklch(from …)` не обязательно должен быть тоже в формате OKLCH. Но для улучшения читаемости мы рекомендуем писать в едином формате.

## Сравнение OKLCH с другими CSS-форматами цветов

Мы можем комбинировать разные форматы при работе с цветами. Необязательно везде использовать `oklch()`; но единый подход к записи значительно улучшает читаемость и поддерживаемость кода.

Давайте попробуем выбрать единый, универсальный формат записи цвета? Наши критерии для выбора:

1. У него должна быть встроенная поддержка в CSS;
2. Он должен уметь работать как минимум с широким цветовым охватом P3;
3. Он должен хорошо подходить для изменения цвета. Компоненты формата должны быть удобочитаемыми и при этом не зависеть друг от друга. Например, изменение яркости должно сохранять прежний уровень контраста, а изменение насыщенности не должно менять оттенок.

#### OKLCH против RGB и hex

Все форматы `rgb(109 162 218)`, `#6ea3db` или P3-аналог `color(display-p3 0.48 0.63 0.84)` записываются тремя числами, которые определяют количество красного, зелёного и голубого соответственно. Обратите внимание: `1` в`color(display-p3)` кодирует большее значение, чем `255` в RGB.

Какая проблема объединяет все эти форматы? Они абсолютно нечитаемы для большинства разработчиков. Люди часто просто копируют их как магический набор цифр, не пытаячь их прочитать и понять.

RGB, hex и `color(display-p3)` неудобны для трансформаций цвета, поскольку большинству людей интуитивно сложно задавать цвета, изменяя количество красного, голубого и зелёного. Кроме того, с помощью RGB и hex нельзя определить P3-цвета.

С другой стороны, OKLCH, LCH и HSL кодирует цвет так, как люди о думают о цветах — через оттенок, насыщенность, яркость.

Сравните hex и OKLCH:

<div class="compare-block">
<pre data-lang="css" class="compare-code">
<code tabindex="0" class="language-css">
<span class="selector">.button&nbsp;</span><span>{</span>
  <span class="comment">/* Голубой */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: #6ea3db;"></div><span class="value">#6ea3db;</span></div>
<span>}</span>
<span class="selector">.button:hover&nbsp;</span><span>{</span>
  <span class="comment">/* Более яркий голубой */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: #7db3eb;"></div><span class="value">#7db3eb;</span></div>
<span>}</span>
<span class="selector">.button.is-delete&nbsp;</span><span>{</span>
  <span class="comment">/* Красный с той же насыщенностью */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: #d68585;"></div><span class="value">#d68585;</span></div>
<span>}</span>
</code>
</pre>

<pre data-lang="css">
<code tabindex="0" class="language-css">
<span class="selector">.button&nbsp;</span><span>{</span>
  <span class="comment">/* Голубой */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: #6ea3db;"></div><span class="value">oklch(70% 0.1 250);</span></div>
<span>}</span>
<span class="selector">.button:hover&nbsp;</span><span>{</span>
  <span class="comment">/* Более яркий голубой */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: #7db3eb;"></div><span class="value">oklch(75% 0.1 250);</span></div>
<span>}</span>
<span class="selector">.button.is-delete&nbsp;</span><span>{</span>
  <span class="comment">/* Красный с той же насыщенностью */</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: #d68585;"></div><span class="value">oklch(70% 0.1 20);</span></div>
<span>}</span>
</code>
</pre>
</div>

OKLCH-цвета можн прочитать и сравнить. Но у OKLCH появился совсем недавно — его экосистема только находится в стадии активного развития.

#### OKLCH против HSL

Теперь сравним OKLCH и HSL. HSL использует 3 компонента для кодировки оттенка, насыщенности и яркости, например `hsl(210 60% 64%)`. Главная проблема с HSL в том, что это цветовое пространство растягивается в цилиндр.

Каждый оттенок должен иметь одинаковое значение насыщенности (`0%`—`100%`). Но в реальности экран и глаз имеют разную максимальную насыщенность для разных оттенков. HSL не обращает внимания на это различие. Он деформирует цветовое пространство и растягивает цвета до одинакового показателя максимальной насыщенности.

<figure>
    <img src="images/hsl-vs-oklch.avif" loading="lazy" alt="4 изображения. Два сверху показывают пространства HSL и OKLCH с одинаковыми значениями насыщенности/интенсивности. Два снизу — аналогично для черного и белого цвета.">
    <figcaption>Так выглядят одинаковые значения яркости и оттенка в пространствах HSL и OKLCH для цветной и черно-белой версии. Разные оттенки в HSL имеют разную яркость.</figcaption>
</figure>

HSL искажает итоговый результат, поэтому через него нельзя нельзя менять цвет. Компонент `L` в нём является непредсказуемым, зависящим от оттенка. Это приводит к неприятным проблемам с контрастом и доступностью.

Вот несколько реальных примеров, где проявляются эти проблемы:

1. Добавление 10% яркости для голубого или для фиолетового цвета приведут к разным результатам. Если вы когда-нибудь использовали функцию `darken()` в SASS, то понимаете, какой непредсказуемый может быть итог;
2. Если вы поменяете оттенок (например, чтобы из фирменного цвета сделать красный цвет ошибки), то с ним может измениться яркость, и текст на этом фоне станет нечитаемым.

<figure>
    <img src="images/buttons-hsl-vs-oklch.avif" loading="lazy" alt="4 кнопки. В первой колонке представлено пространство HSL, во второй — OKLCH. Показано, что при изменении угла поворота оттенка в HSL контраст между текстом и фоном кнопки заметно ухудшается. Для OKLCH такой проблемы нет.">
    <figcaption>Изменение угла в пространстве HSL может привести к проблемам доступности из-за низкого контраста.</figcaption>
</figure>

HSL плох для работы с цветом. В сообществе многие [просят избегать](https://stripe.com/blog/accessible-color-systems) HSL при создании палитр. Кроме того, подобно RGB или hex, формат HSL не может быть использован для определения P3-цветов.

OKLCH не искажает цветовое пространство; этот формат показывает нам реальную физику цвета. Это помогает добиться предсказуемого контраста при изменениях цвета и при указании P3-цветов.

С другой стороны, некоторые комбинации значений для OKLCH порождают цвета, которые обычные экраны отобразить не способны. Ряд из них можно увидеть только на P3-мониторах. Но это не критическая проблема: браузеры будут искать ближайший поддерживаемый цвет.

#### OKLCH против Oklab & LCH против Lab

В CSS есть две функции для пространства Oklab: `oklab()` и `oklch()`. Аналогичные есть и для Lab: `lab()` и `lch()`. Так в чём же разница?

При использовании одинакового пространства есть разные способы задать в нём точку. Oklab и lab существуют в декартовых координатах с осями `a` и `b` (`a`— количество красного/зеленого для цвета, `b` — голубого/желтого). OKLCH и LCH используют полярные координаты, где есть угол оттенка и расстояние для насыщенности.

<figure>
    <img src="images/oklab-vs-oklch.avif" loading="lazy" alt="2 круга. Первый иллюстрирует декартовы координаты `a`, `b` в Oklab и прямой угол между этими осями. Второй отображает полярные координаты в OKLCH в виде острого угла поворота оттенка. Угол представлен двумя лучами, один из которых представляет собой насыщенность.">
    <figcaption>Декартовы координаты для Oklab и полярные координаты для OKLCH.</figcaption>
</figure>

OKLCH, и LCH удобнее для работы с цветом, так как люди думают о цвете через насыщенность и оттенок, а не количество красного и зелённого.

#### OKLCH против LCH 

Формат [LCH](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/) построен на пространстве CIE LAB (Lab). Он решает все проблемы, которые существуют в HSL и RGB. Также он позволяет работать с P3-цветами, и в большинстве случаев изменение цвета даёт предсказуемый результат.

Однако формат LCH имеет одну неприятную проблему: неожиданный сдвиг оттенка при изменении насыщенности и яркости для голубого цвета (оттенок между `270` и `330` градусами).

<figure>
    <img src="images/lch-vs-oklch.avif" loading="lazy" alt="Два треугольника, которые представляют собой срезы пространств LCH и OKLCH, где яркость и насыщенность изменяются, а оттенок — одинаков. Фигура слева, обозначающая LCH, является голубой с одной стороны, и фиолетовой с другой. Фигура справа, обозначающая OKLCH, имеет одинаковый цвет на всей площади, как и ожидается.">
    <figcaption>Срезы пространств LCH и OKLCH, где яркость и насыщенность изменяются, а оттенок — одинаков. Срез LCH голубой с одной стороны и фиолетовый с другой. Оттенок в OKLCH остаётся постоянным, как и ожидается.</figcaption>
</figure>

Небольшой пример из реальной жизни:

<div class="compare-block">
<pre data-lang="css" class="compare-code">
<code tabindex="0" class="language-css">
<span class="selector">.temperature.is-very-very-cold&nbsp;</span><span>{</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(65, 46, 241);"></div><span class="value">lch(35% 110 300);</span></div>
  <span class="comment">/* Выглядит голубым */</span>
<span>}</span>
<span class="selector">.temperature.is-very-cold&nbsp;</span><span>{</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(86, 61, 189);"></div><span class="value">lch(35% 75 300);</span></div>
  <span class="comment">/* Мы изменили только яркость, но голубой стал фиолетовым */</span>
<span>}</span>
<span class="selector">.temperature.is-cold&nbsp;</span><span>{</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(90, 72, 138);"></div><span class="value">lch(35% 40 300);</span></div>
  <span class="comment">/* Глубокий фиолетовый */</span>
<span>}</span>
</code>
</pre>

<pre data-lang="css">
<code tabindex="0" class="language-css">
<span class="selector">.temperature.is-very-very-cold&nbsp;</span><span>{</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(64, 43, 241)"></div><span class="value">oklch(48% 0.27 274);</span></div>
  <span class="comment">/* Выглядит голубым */</span>
<span>}</span>
<span class="selector">.temperature.is-very-cold&nbsp;</span><span>{</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(66, 75, 195);"></div><span class="value">oklch(48% 0.185 274);</span></div>
  <span class="comment">/* Всё ещё голубой */</span>
<span>}</span>
<span class="selector">.temperature.is-cold&nbsp;</span><span>{</span>
  <span class="property">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(76, 88, 150);"></div><span class="value">oklch(48% 0.1 274);</span></div>
  <span class="comment">/* Всё ещё голубой */</span>
<span>}</span>
</code>
</pre>
</div>

Пространства Oklab и OKLCH [были созданы](https://bottosson.github.io/posts/oklab/) для решения этой проблемы со сдвигом оттенка.
Но OKLCH — не просто исправление. В нём появляется [много полезных возможностей](https://www.w3.org/TR/css-color-4/#ok-lab), связанных с математическими преобразованиями. Например, появляется упрощённая [гамма-коррекция](https://bottosson.github.io/posts/gamutclipping/), и CSSWG [рекомендует использовать OKLCH](https://www.w3.org/TR/css-color-4/#css-gamut-mapping) для гамма-коррекции.