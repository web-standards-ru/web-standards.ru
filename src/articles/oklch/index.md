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
  .text-highlight {
    background-color: #0000000f;
    border-radius: 4px;
    padding: 0.2em 6px;
    white-space: pre-wrap;
    word-break: break-word;
  }

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
</style>

При работе с CSS мы чаще всего указываем цвета с помощью <span class="text-highlight">rgb()</span> или hex – так сложилось исторически. Однако новая спецификация CSS Color 4 открывает для разработчиков более перспективные способы объявления цветов. В этой статье мы расскажем, почему из всех возможных вариантов мы выбрали именно <span class="text-highlight">oklch()</span>.

## Краткое объяснение

<span class="text-highlight">oklch()</span> – это новый способ определять CSS-цвета. В <span class="text-highlight">oklch(L C H)</span> или <span class="text-highlight">oklch(L C H / a)</span> компоненты, представленные буквами в аббревиатуре, означают следующее:

- <span class="text-highlight">L</span> – яркость (<span class="text-highlight">0%</span>-<span class="text-highlight">100%</span>). Важно отметить, что этот компонент передаёт яркость без искажения, в отличие от <span class="text-highlight">L</span> в <span class="text-highlight">hsl()</span>;
- <span class="text-highlight">C</span> – насыщенность, которая варьируется от серого до наиболее интенсивного оттенка;
- <span class="text-highlight">H</span> – оттенок. В качестве значения этого компонента указывается градус угла, который задаёт поворот оттенка на цветовом круге (<span class="text-highlight">0</span>-<span class="text-highlight">360</span>);
- <span class="text-highlight">a</span> – непрозрачность (<span class="text-highlight">0</span>-<span class="text-highlight">1</span> или <span class="text-highlight">0%</span>-<span class="text-highlight">100%</span>).
<pre data-lang="css">
<code tabindex="0" class="language-css">
<span class="selector">a:hover&nbsp;</span><span>{</span>
  <span class="property" style="--device-width: 150px; --mobile-width: 110px;">background:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(0.21, 50.42, 225.59)"></div><span class="value">oklch(45% 0.26 264);&nbsp;</span><span class="comment">/* голубой */</span></div>
  <span class="property" style="--device-width: 150px; --mobile-width: 110px;">color:&nbsp;</span><div class="preview-with-value"><div class="color-preview without-opacity" style="background-color: #fff"></div><span class="value">oklch(100% 0 0);&nbsp;</span><span class="comment">/* белый */</span></div>
  <span class="property" style="--device-width: 150px; --mobile-width: 110px;">color:&nbsp;</span><div class="preview-with-value"><div class="color-preview" style="background-color: rgba(0, 0, 0, 0.5);"></div><span class="value">oklch(0% 0 0 / 50%);&nbsp;</span><span class="comment">/* чёрный с прозрачностью 50% */</span></div>
<span>}</span>
</code>
</pre>
Формат OKLCH обладает рядом достоинств:

1. В отличие от <span class="text-highlight">rgb()</span> или hex(<span class="text-highlight">#ca0000</span>), OKLCH легко читается. По числам, записанных для формата <span class="text-highlight">oklch()</span> можно без труда интерпретировать итоговый цвет. Это схоже с удобством записи в формате HSL, но тот не передаёт яркость так, как её видит человеческий глаз;
2. OKLCH лучше подходит для трансформаций цвета, чем <span class="text-highlight">hsl()</span>. Он правильно передаёт яркость, поэтому при изменении оттенка контраст сохраняется. Это позволяет избежать непредсказуемых результатов, которые свойственны некоторым CSS-функциям (например, функции <span class="text-highlight">darken()</span> в Sass);
3. Благодаря предсказуемой яркости OKLCH обладает лучшей доступностью. Это особенно заметно проявляется при создании цветовых палитр для дизайн-систем;
4. OKLCH позволяет использовать гамму P3-цветов, которая шире стандартного набора цветов. Многие новые устройства (например, от Apple) способны отображать больше цветов, чем старые мониторы sRGB. Чтобы применять цвета из расширенного набора, мы можем использовать формат OKLCH.

Однако, работая с OKLCH, следует помнить о паре важных нюансов:

1. Для OKLCH или LCH при подборе значений <span class="text-highlight">L</span>, <span class="text-highlight">C</span> и <span class="text-highlight">H</span> можно получить цвет, который будет выходить за пределы возможностей экрана. Хотя браузеры и попытаются найти ближайший поддерживаемый цвет, стоит проверять результаты с помощью цветового миксера;
2. OKLCH – цветовое пространство, которое появилось относительно недавно. На момент написания этой статьи в 2022 году его экосистема ограничена. Однако уже есть <span class="text-highlight">oklch()</span> <a href="https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-oklab-function" target="_blank" rel="noopener noreferrer">полифил</a>, а также <a href="https://huetone.ardov.me/" target="_blank" rel="noopener noreferrer">генератор палитры</a>, <a href="https://oklch.evilmartians.io/" target="_blank" rel="noopener noreferrer">цветовой миксер</a> и много <a href="https://bottosson.github.io/posts/oklab/#oklab-implementations" target="_blank" rel="noopener noreferrer">конвертеров</a>.
<figure>
    <img src="images/oklch-picker.png" loading="lazy" alt="Цветовой миксер OKLCH от Evil Martians отображает пространство OKLCH с ползунками для настройки яркости, насыщенности, альфа-канала и оттенка.">
    <figcaption>Пространство OKLCH в цветовом миксере.</figcaption>
</figure>
Это лишь краткое описание особенностей OKLCH — но если вы готовы к тому, чтобы больше узнать о новой эре CSS-цветов, то смело переходите к первой главе.

## Оглавление

- [Развитие цвета в CSS](#section-2)
- [Сравнение OKLCH с другими CSS-форматами цветов](#section-3)
- [Принципы работы OKLCH](#section-4)
- [Внедрение OKLCH в проект](#section-5)
- [Подведение итогов](#section-6)

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

<figure>
    <img src="images/p3.png" loading="lazy" alt="Слева — фигура, представляющая собой расширяющийся клин и показывающая, как P3-цвета расширяют цветовое многообразие по сравнению с sRGB-пространством. Справа — левая иконка отображается в sRGB-цветах, а более яркая правая иконка отображается в P3-цветах, подчёркивая, насколько они ярче.">
    <figcaption>Слева — недавно ставший доступным набор зелёных P3-цветов. Справа — сравнение иконок, использующих sRGB и P3-цвета соответственно.</figcaption>
</figure>

<pre data-lang="css">
<code tabindex="0" class="language-css">
<span class="comment">/* В качестве примера в следующих CSS-правилах используются hsl().
   Не используйте формат hsl() в продакшн-сборке, так как это влечёт проблемы с доступностью. */</span>
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
