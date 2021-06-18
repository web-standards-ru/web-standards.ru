---
title: Ссылка для скачивания
date: 2021-06-18
author: nikita-dubko
source:
    title: Link to download
    url: https://mefody.dev/chunks/download-link/
translators:
    - nikita-dubko
tags:
    - html
    - js
preview: Простой способ сделать ссылку для скачивания при помощи атрибута download.
---

Иногда передо мной стоит задача сделать ссылку, которая должна открывать системный диалог для сохранения файла. Браузеры достаточно умны, чтобы открывать такой диалог при скачивании бинарников вроде архивов или EXE-файлов. Но что делать, если я хочу скачивать картинки или какие-нибудь видео? Именно скачивать, не открывать для просмотра.

## Заголовок Content-Disposition

Самый правильный способ попросить браузер скачать файл — добавить на стороне сервера заголовок `Content-Disposition` к потоку с файлом.

```
Content-Disposition: attachment; filename=kitten.jpg
```

Когда браузер видит у заголовка значение `attachment`, то пытается скачать файл.

Но иногда у вас просто нет возможности настроить сервер под свои нужды и добавить ещё один `mod_rewrite`. Нужен какой-то более браузерный способ решить задачу.

## Атрибут download

Самый простой способ — добавить атрибут `download` к ссылке.

Если вы добавите его просто так, без значения, браузер постарается получить имя файла либо из заголовка `Content-Disposition` (опять он, и у него довольно высокий приоритет), либо из пути файла.

```html
<a href="images/kitten.jpg" download>
    <img src="images/kitten-preview.jpg" alt="Котёнок, превью.">
</a>
```

Попробуйте: <a href="demo/kitten-pixel.jpg" download>ссылка</a>.

Но вы можете задать значение атрибуту `download`, и тогда это значение станет именем скачиваемого файла. Это может быть полезно, если у ваших файлов какие-нибудь странные автогенерируемые урлы вроде `https://cdn/images/a1H5-st42-Av1f-rUles`.

```html
<a href="images/1h24v9lj.jpg" download="kitten">
    Скачать
</a>
```

Попробуйте: <a href="demo/kitten-pixel.jpg" download="i-am-tiny">ссылка</a>.

**Важно!** Вся эта магия атрибутов [не для ссылок с других доменов (cross-origin)](https://www.chromestatus.com/feature/4969697975992320). Вы не можете управлять чужими ресурсами из соображений безопасности.

И помните, что IE и старые Safari не понимают атрибут `download`. [Проверьте в Can I use…](https://caniuse.com/download).

## blob: и data:

Полезный лайфхак, чтобы помочь вашим пользователям сохранять картинки котиков в удобном для них формате. Если вы на своём сайте используете картинки в форматах AVIF или WebP, есть очень высокая вероятность, что ни один пользователь не сможет сохранить их к себе на компьютер или смартфон, чтобы потом пересмотреть. Точнее, сохранить-то смогут, а вот посмотреть вне браузера не смогут. Печаль.

Чтобы помочь пользователям, используйте `data:` или `blob:` внутри атрибута `href`.

### Шаг 1. Нарисуйте картинку на Canvas

```js
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const image = new Image();
image.onload = function () {
    context.drawImage(image, 0, 0);

    // TODO: всю магию намазывать сюда
};
image.src = 'kitten-170.avif';
```

### Шаг 2а. Сохранить картинку как блоб в атрибут `href` ссылки

```js
const blobLink = document.getElementById('blob-link');

canvas.toBlob(blob => {
    const blobUrl = URL.createObjectURL(blob);
    blobLink.href = blobUrl;
}, 'image/jpeg', 0.9);
```

Да-да, я могу сохранить AVIF как JPEG. Классно, правда? Пользователь скачал всего 4 КБ AVIF с сервера, а получил 13 КБ JPEG на клиенте!

### Шаг 2б. Сохранить картинку как data в атрибут `href` ссылки.

Некоторые браузеры не умеют работать с блобами, поэтому вы можете помочь им при помощи data-урлов.

```js
const dataLink = document.getElementById('data-link');

dataLink.href = canvas.toDataURL('image/jpeg', 0.9);
```

Так даже проще, но такой подход хуже по производительности.

Можете поиграть с полным демо тут:

- [Демо](https://mefody.dev/chunks/download-link/demo/index.html)
- [Исходный код](https://github.com/MeFoDy/mefody.dev/blob/main/src/chunks/download-link/demo/index.html)

## Источники

- [Wiki: Content-Disposition](https://en.wikipedia.org/wiki/MIME#Content-Disposition)
- [MDN: The Anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/A)
- [MDN: `canvas.toDataURL`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)
- [MDN: `canvas.toBlob`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
