---
title: 'Миграция с vue-cli на vitejs'
date: 2021-04-08
author: cedric-nicoloso
source:
    title: 'From vue-cli to vitejs'
    url: https://medium.com/nerd-for-tech/from-vue-cli-to-vitejs-648d2f5e031d
translators:
    - igor-korovchenko
editors:
    - vadim-makeev
layout: article.njk
tags:
    - article
    - performance
preview: 'В статье описан процесс миграции vue-cli на vitejs для проектов, написанных с использованием фреймворка Vue'
---

Я недавно переносил свои проекты на Vue2 со стэка vue-cli / webpack на vitejs. После того, как я сделал это в третий раз, у меня сложилось представление об этом процессе, которое я излагаю в этой статье.

![](https://miro.medium.com/max/1400/1*3jZhjT5nxJKiQxYmHtF2WA.png)

## package.json

### devDependencies

Давайте удалим зависимость “@vue/cli-service” и заменим ее на  _vite_ 🚀

![Add vite dev dependency, v2.1.3 at the time of writing](https://miro.medium.com/max/1400/1*MIbEHjFjf2BsTmcqiRKhBw.png)

```bash
npm un @vue/cli-service
npm i vite -D
```

Вы можете также удалить все остальные зависимости, которые начинаются с “@vue/cli-plugin-xxx”, поскольку они все равно больше не будут работать, например:

![](https://miro.medium.com/max/1400/1*jJ8GWQdU6qqdtvSRKbMCMA.png)

```bash
npm un vue/cli-plugin-babel vue/cli-plugin-eslint vue/cli-plugin-unit-jest
```

Если вы используете Vue2, нужно будет добавить плагин `vite-plugin-vue2` , который мы будем использовать в нашем ‘vite.config.js’:

![](https://miro.medium.com/max/1400/1*V3EOjy-j-Yhc8YlL-HoJkg.png)

```bash
npm i vite-plugin-vue2 -D
```

Также, если вы используете **git hooks**, без сомнения нужно будет установить `yorkie` , чтобы все заработало как раньше (думаю, что этот инструмент был частью vue-cli, а в _vite_ его нет).

```bash
npm i yorkie -D
```

### scripts

Мы заменим скрипт serve для vue-cli на соответствующий скрипт для _vite_:

![](https://miro.medium.com/max/1400/1*ggYNrtcmXaUyrBI_qGFhxQ.png)

Если вам ближе использование слова serve вместо dev, можете использовать и его.

Мы еще вернемся к скриптам build, test и lint в конце статьи.

## index.html

Давайте посмотрим на наш `public/index.html`, который мы должны переместить в корневую папку проекта. 1️⃣

Мы также должны добавить скрипт, который является точкой входа приложения и без которого _vite_ не сможет собрать проект: `<script type="module" src="/src/main.js"></script>`. 2️⃣

И наконец, мы должны заменить путь до фавикона `<%= BASE_URL %>favicon.ico` на более простой `/favicon.ico` (_vite_ сможет отыскать его сам в папке public). 3️⃣

![](https://miro.medium.com/max/1400/1*9yc110Q7jULpPS2GfPAWFw.png)

## vite.config.js

Мы должны переименовать наш файл с конфигурацией сборки с `**vue**.config.js` на `vite.config.js`.

В начале файла нужно указать следующее:

```js
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
export default defineConfig({
  plugins: [
    createVuePlugin(),
  ],
})
```

Чтобы сделать миграцию на _vite_ максимально прозрачной для вашей команды разработчиков, давайте оставим тот же порт 8080, который и был:

```js
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
export default defineConfig({
  [...],
  server: {
    port: 8080,
  }
})
```

Все доступные опции для конфигурации можно посмотреть здесь:

[https://vitejs.dev/config/#config-file](https://vitejs.dev/config/#config-file)

### ‘@’ alias

Если вы используете псевдонимы webpack для импортов в файлах вашего проекта, мы должны переопределить их:

```js
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
export default defineConfig({
  [...],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
})
```

Для пользователей WebStorm:

При использовании webpack вам достаточно было прописать в настройках IDE путь до файла с конфигурацией webpack (для vue-cli это был путь до базового файла webpack: `node_modules/@vue/cli-servive/webpack.config.js`) и WebStorm магическим образом подхватывал псевдоним ‘@’,  что позволяло очень просто обращаться к библиотекам.

Пока WebStorm не умеет парсить ‘vite.config.js’, и мы должны помочь ему, прописав настройки псевдонимов вручную в ‘**webStorm.config.js’**:

```js
System.config({
  paths: {
    '@/*': './src/*',
  },
})
```

Это все, что вы должны сделать :)

## Расширение `".vue"` и импорты

Для webpack было совершенно не обязательно указывать расширение .vue для файлов компонентов, но не для vite.

Вы должны заменить:

```js
import DotsLoader from '@/components/DotsLoader'
```

на:

```js
import DotsLoader from '@/components/DotsLoader.vue'
```

Не по теме, но из моего опыта: использовать импорты с полными путями — лучшая практика.

## Очистка маршрутов для ленивой загрузки

Вы со спокойной душой можете удалить комментарии `webpackChunkName` для генерации чанков для определенных маршрутов:

```js
{
  path: '/links',
  name: 'linksPage',
  component: () => import(/* webpackChunkName: "links" */ './views/LinksPage.vue'),
},
```

Используя _vite_ можно писать так:

```js
{
  path: '/links',
  name: 'linksPage',
  component: () => import'./views/LinksPage.vue'),
},
```

Я в этом не эксперт, но если вы действительно хотите изменить имя для вашего чанка, вероятно, вы можете это сделать принудительно: [rollup output.entryFileNames](https://rollupjs.org/guide/en/#outputentryfilenames).

Также, можете посмотреть опции для сборщика [vite build.rollupOptions](https://vitejs.dev/config/#build-rollupoptions) и перенести часть задач на него.

## Переменные окружения

Мы должны заменить все `process.env`, которые _vite_ не понимает. Для _vite_ нужно использовать `**import.meta.env**`.

Если ваш роутер использует встроенную переменную окружения `BASE_URL`, то ее имя надо будет заменить на `import.meta.env.BASE_URL`:

![](https://miro.medium.com/max/1400/1*2XzGLTKsDjgnIh1DcgvGqw.png)

Другой встроенной переменной окружения является `import.meta.env.PROD`. Давайте будем использовать ее везде, где можем:

![](https://miro.medium.com/max/1400/1*8qAVB3MjCpFUnOFqfWz6og.png)

Убедитесь, что настройка `NODE_ENV=production` соответствует настройкам среды в файле `.env` или в переменных окружения сервера, на котором собирается ваше приложение во время релиза. Подробнее можно посмотреть по ссылке [переменные окружения и режимы работы _Vite_](https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes)

Что касается ваших собственных переменных окружения, которые вы использовали раньше с префиксом “VUE\_APP” — вам нужно будет заменить его на “VITE”. Любая переменная окружения, которая будет начинаться с “**VITE\_xxx**”, будет доступна во всем вашем коде.

Вот пример для моей переменной окружения BACKEND\_URL:

![](https://miro.medium.com/max/1400/1*tFCoE-cUHJJmzwBcwIfnpw.png)

Файл `.env.local`:

```js
VITE_APP_BACKEND_URL=http://localhost:3001
```

## Тесты

Поскольку мы больше не можем использовать  `vue-cli-service test:unit`, давайте настроем наши тесты.

Для начала надо обновить скрипт для тестов `test`:

![](https://miro.medium.com/max/1400/1*Oy_2RmOoIeo-8XJ6G5yjXQ.png)

Затем пройдемся по шагам, описанным в [мануале](https://vue-test-utils.vuejs.org/installation/#manual-installation).

Если вы использовали файл ‘babel.config.js’:

```js
presets: ['**@vue/cli-plugin-babel/preset**'],
```

его нужно будет заменить на что-то вроде:

```js
presets: ['**@babel/preset-env**']
```

У меня были ошибки для выражения **import.meta.env**.

К сожалению, простых настроек для модульных тестов в _vite_ нет, но этот [комментарий](https://github.com/vitejs/vite/issues/1149#issuecomment-775033930) помог мне.

Мой файл ‘babel.config.js’ теперь выглядит так:

```js
module.exports = {
  presets: ['@babel/preset-env'],
  // For Jest not to be annoyed by 'import.meta.xxx'
  plugins: [
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString('process')
          },
        },
      }
    },
  ],
}
```

Вы можете усилить сборку этим [плагином](https://github.com/javiertury/babel-plugin-transform-import-meta) для Babel, который будет исправлять автоматически ошибки в ваших тестах, связанные с `import.meta`.

Вы можете почитать и обсудить в отдельном [ишью на GitHub](https://github.com/vitejs/vite/issues/1955) совместную работу **_vite_ и Jest**.

### Ошибка “regeneratorRuntime”

```bash
  49 | export const actions = {
> 50 |   init: async ({ commit }, routeContext) => {
ReferenceError: **regeneratorRuntime** is not defined
```

Устанавливая `regenerator-runtime` и ссылаясь на него в моем ‘setupTests.js’, я обнаружил, что эту ошибку уже починили.

```bash
npm i regenerator-runtime -D
```

‘jest.config.js’:

```js
module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    // tells Jest to handle `*.vue` files
    'vue',
  ],
  transform: {
    // process `*.vue` files with `vue-jest`
    '.*\\.(vue)$': 'vue-jest',
    // process `*.js` files with `babel-jest`
    '.*\\.(js)$': 'babel-jest',
  },
  setupFiles: ['./setupTests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: false,
};
```

Первая строчка файла конфигурации ‘setupTests.js’ будет такой:

```js
import 'regenerator-runtime/runtime';
```

## Линтер

Я заменил два скрипта для линтинга одним:

![(Выглядит просто, что vue-cli-service вообще делала в этой сборке?…)](https://miro.medium.com/max/1400/1*qdCwEiS6QxvfyJ1QgR5Nbg.png)

## Развертывание приложений

В этом примере мое приложение крутится в облаке S3 / CloudFront.

У меня два окружения для режима “production”: **preprod** и **prod**.
Поэтому у меня и два файла для настройки окружения `.env`:
- `.env.preprod`
- `.env.prod`

Когда мы собираем наше приложение с помощью rollup, мы указываем **режим**, и _vite_ меняет переменные окружения на те, которые соответствуют этому режиму.

Это очень похоже на vue-cli, поэтому обновление скриптов в ‘package.json’ очень простое:

![Замена vue-cli-service на vite](https://miro.medium.com/max/1400/1*xbikMZgH5LefpOuOp1Q5Bg.png)

Если вам нужно больше деталей, они хорошо описаны [здесь](https://vitejs.dev/guide/env-and-mode.html#modes).

Небольшая ремарка: мне пришлось также поменять максимальный размер для чанка в ‘**vite.config.js**’:

```js
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
export default defineConfig({
  [...],
  build: {
    chunkSizeWarningLimit: 700, // Default is 500
  },
})
```

_Так делать не хорошо, я знаю._

## Визуализация сборки

Это последнее упоминание vue-cli, которое было в моей кодовой базе:

```js
"build:report": "**vue-cli-service** build --report",
```

Давайте поищем что-то похожее в мире rollup. Использование [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) оказалось достаточно хорошим решением для меня.

Я импортировал этот плагин и прописал его в ‘**vite.config.js**’:

```js
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import visualizer from 'rollup-plugin-visualizer'
export default defineConfig({
  plugins: [
    createVuePlugin(),
    visualizer(),
  ],
  [...],
})
```

Результат теста в сгенерированном файле ‘**stats.html**’:

![](https://miro.medium.com/max/1400/1*Fv42Kw-WbjTMgWykCq_wTQ.png)

## Несколько метрик

### Startup time

Загрузка **_vite_**: ~ 4 секунды (и предполагается, что это время не сильно изменится, даже если проект будет расти 🙌)

Загрузка с **vue-cli / webpack**: ~ 30 секунд (и это время постоянно растет при увеличении количества файлов в проекте 😢)

### Горячая перезагрузка

**vite**:

- _Простые изменения (файлы разметки HTML, CSS классы…)_: очень быстро! 🚀
- _Серьезные изменения (переименование функций JS, добавление компонентов…)_: не уверен, иногда мне было удобнее перезагрузить страницу самому.

**vue-cli / webpack**:

- _ Простые изменения_: ~ 4 секунды 😕
- _ Серьезные изменения_: я никогда не жду,  сам перезагружаю страницу.

### Первая загрузка страницы

Мы запрашиваем страницу в первый раз после запуска _vite_. У меня было веб-приложение с большим количеством компонентов. Давайте взглянем на **вкладку сеть (network)** в инструментах разработчика в Chrome.

- **vite**:  загрузка около ~ 1430 JS-файлов💥 длится примерно ~ 11 секунд 😟
- **vue-cli / webpack**: загрузка около ~ 23 JS-файлов 👍 длится примерно ~ 6 секунд 👍

![](https://miro.medium.com/max/1400/1*C68YD5ei5kGbzV4uIAA2xQ.png)

Давайте посмотрим, как будет развиваться проект. Пока у меня не было достаточного опыта использования _vite_ в качестве разработчика, но начало многообещающее. Надо будет еще оценить все возможности этого сборщика. Например, заявлено, что в _vite_ круто реализована ленивая загрузка компонентов!

## Заключение

Поработав некоторое время с _vite_,  могу сказать, что это был очень приятный опыт 🌟 И теперь все тяжелее и тяжелее работать с webpack на других проектах!