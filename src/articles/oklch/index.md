---
title: 'OKLCH в CSS: почему мы ушли от RGB и HSL'
date: 2022-21-11
author: andrey-sitnik
tags:
    - css
---

<style>
  .color-preview {
    width: 16px;
    height: 16px;
    border: 1px solid black;
    margin: 0px 2px 0 0px;
    box-sizing: border-box;
    display: inline-block;
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

  .language-css {
    position: relative;
  }

  .selector {
    color: #a1490f;
  }

  .property {
    color: #550098;
    display: inline-block;
    min-width: 155px;
  }

  .comment {
    color: #706D71;
  }

  @media (max-width: 1239px) {
    .property {
      min-width: 125px;
    }
  }
</style>


<pre data-lang="css">
  <code tabindex="0" class="language-css">
    <span class="selector">a:hover&nbsp;</span><span>{</span>
      <span class="property">background:&nbsp;</span><span class="preview-with-value"><div class="color-preview without-opacity" style="background-color: rgb(0.21, 50.42, 225.59)"></div><span class="value">oklch(45% 0.26 264);&nbsp;</span><span class="comment">/* blue */</span></span>
      <span><span class="property">color:&nbsp;</span><span class="preview-with-value"></span><div class="color-preview without-opacity" style="background-color: #fff"></div><span class="value">oklch(100% 0 0);&nbsp;</span><span class="comment">/* white */</span></span>
      <span><span class="property">color:&nbsp;</span><div class="color-preview" style="background-color: rgba(0, 0, 0, 0.5);"></div><span class="value">oklch(0% 0 0 / 50%);&nbsp;</span><span class="comment">/* black with 50% opacity */</span></span>
    <span>}</span>
  </code>
</pre>
