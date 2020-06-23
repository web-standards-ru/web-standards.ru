---
title: 'Ускоряемся с помощью Browserslist'
date: 2020-04-19
author: daniil-onoshko
editors:
    - irina-pitaeva
    - vadim-makeev
layout: article.njk
tags:
    - article
    - js
    - performance
preview: 'На сегодняшний день имеется большое количество разных браузеров и ещё большее количество версий каждого из них. Если раньше новые фичи добавлялись в браузеры редко, то сейчас их можно обнаружить практически с каждым новым релизом. Как итог, у разных версий браузера — разная поддержка фич, не говоря уже о разном уровне поддержки среди разных вендоров. На самом деле нам незачем транспилировать и полифилить абсолютно все фичи — достаточно это делать только с теми, которые не поддерживаются актуальными браузерами.'
---

На сегодняшний день имеется большое количество разных браузеров и ещё большее количество версий каждого из них. Если раньше новые фичи добавлялись в браузеры редко, то сейчас их можно обнаружить практически с каждым новым релизом. Как итог, у разных версий браузера — разная поддержка фич, не говоря уже о разном уровне поддержки среди разных вендоров.

Разработчикам хочется использовать новые фичи, так как зачастую это упрощает жизнь. Благодаря инструментам разработки можно использовать фичи до их появления в браузерах путём транспиляции и использования полифилов. Также эти инструменты гарантируют работу сайта в любом браузере независимо от того, имеется ли в нём поддержка той или иной фичи. Из примеров: [Autoprefixer](https://github.com/postcss/autoprefixer) и [postcss-preset-env](https://preset-env.cssdb.org) для CSS, [Babel](https://babeljs.io) для JavaScript. Но нужно понимать, что при этом размер кода увеличивается.

В итоге мы имеем сайт, который работает в любом браузере, но из-за этого загружается медленнее, чем мог бы. Напомню, что скорость загрузки и работы сайта напрямую влияет на количество и глубину просмотров. Что с этим можно сделать? На самом деле нам незачем транспилировать и полифилить абсолютно все фичи — достаточно это делать только с теми, которые не поддерживаются актуальными браузерами (или актуальными для аудитории вашего сайта). Например, промисы не поддерживаются только очень старыми версиями браузеров.

## Browserslist

[Browserslist](https://github.com/browserslist/browserslist) — это тот инструмент, с помощью которого можно описать целевые браузеры веб-приложения, используя простые выражения:

```
last 2 years
> 1%
not dead
```

Этот пример файла `.browserslistrc` означает, что вам нужны живые браузеры за последние два года, у которых больше 1% пользователей. Посмотреть в какие конкретные браузеры это разрезолвится можно на сайте [browserl.ist](https://browserl.ist/), а более подробно узнать про синтаксис выражений можно [на странице проекта](https://github.com/browserslist/browserslist).

Уже упомянутые [Autoprefixer](https://github.com/postcss/autoprefixer), [postcss-preset-env](https://preset-env.cssdb.org) и [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env) под капотом используют Browserslist, и если в вашем проекте есть конфиг Browserslist, то код проекта будет собран под эти браузеры.

На этом этапе можно прийти к следующему выводу: чем новее браузеры, в которые мы целимся, тем меньше будет весить итоговый код сайта. При этом нужно не забывать, что в реальном мире не у всех пользователей самый новый браузер, и сайт должен быть доступен если не всем пользователям, то большинству из них. Как можно поступить, учитывая это условие?

## Варианты таргетирования браузеров

### 1. Более узкое таргетирование

По умолчанию, если в проекте нет конфига, то Browserslist будет использовать `defaults` браузеры. Это выражение является сокращением для `> 0.5%, last 2 versions, Firefox ESR, not dead`. В целом, можно остановиться на использовании этого выражения, и со временем браузеры, подходящие под это выражение, станут поддерживать большинство актуальных фич.

Но можно целиться в более узкое количество браузеров: исключить старые и непопулярные, учитывать более-менее актуальные версии браузеров. Звучит просто, но на самом деле это не так. Необходимо сбалансировать конфиг Browserslist так, чтобы он, опять же, покрывал большую часть аудитории.

### 2. Анализ аудитории

Если ваш сайт подразумевает использование только в определенных регионах, то можно попробовать использовать выражение вида `> 5% in US`, которое вернёт браузеры, подходящие по статистике использования в указанной стране.

Семейство Browserslist полно разными дополнительными инструментами, один из них — [Browserslist-GA](https://github.com/browserslist/browserslist-ga) (также есть [browserslist-adobe-analytics](https://github.com/xeroxinteractive/browserslist-adobe-analytics)), который позволяет выгрузить из сервиса аналитики данные о браузерах, используемые посетителями вашего сайта. После этого становится возможным использовать эти данные в конфиге Browserslist и применять на них выражения:

```
> 0.5% in my stats
```

К примеру, если обновлять эти данные при каждом деплое, то сайт будет всегда собираться под актуальные браузеры, используемые вашей аудиторией.

### 3. Условная загрузка ресурсов

В марте 2019 [Матиас Байненс](https://twitter.com/mathias) из Google [предложил](https://github.com/whatwg/html/issues/4432) добавить в браузеры дифференциальную загрузку скриптов (differential script loading, далее DSL):

```html
<script type="module"
        srcset="2018.mjs 2018, 2019.mjs 2019"
        src="2017.mjs"></script>
<script nomodule src="legacy.js"></script>
```

До сих пор его предложение остается лишь предложением, и неизвестно, будет ли это в том или ином виде реализовано в браузерах. Но концепт понятен, и в семействе Browserslist есть инструменты, с помощью которых можно реализовать что-то подобное, один из них — [browserslist-useragent](https://github.com/browserslist/browserslist-useragent). Этот инструмент позволяет проверить User-Agent браузера на соответствие вашему конфигу.

#### Browserslist-useragent

В интернете уже есть несколько статей на эту тему, вот пример одной из них — [«Smart Bundling: How To Serve Legacy Code Only To Legacy Browsers»](https://www.smashingmagazine.com/2018/10/smart-bundling-legacy-code-browsers/). Коротко пробежимся по реализации. Для начала необходимо настроить ваш процесс сборки для вывода, например, двух версий бандлов для новых и старых браузеров. Здесь вам поможет Browserslist с его [возможностью объявления нескольких сред в конфигурационном файле](https://github.com/browserslist/browserslist#configuring-for-different-environments):

```
[modern]
last 2 versions
last 1 year
not safari 12.1

[legacy]
defaults
```

Далее необходимо настроить сервер для отдачи нужного бандла под браузер пользователя:

```js
/* … */
import { matchesUA } from 'browserslist-useragent'
/* … */
app.get('/', (request, response) => {
    const userAgent = request.get('User-Agent')
    const isModernBrowser = matchesUA(userAgent, {
        env: 'modern',
        allowHigherVersions: true
    })
    const page = isModernBrowser
        ? renderModernPage(request)
        : renderLegacyPage(request)

    response.send(page)
})
```

Таким образом, сайт будет выдавать легковесный бандл пользователям с новыми браузерами, что приведёт к более быстрой загрузке страниц, сохраняя при этом доступность для остальных пользователей. Но, как можно было заметить, этот способ требует наличия собственного сервера со специальной логикой.

#### Module/nomodule

С появлением в браузерах поддержки ES-модулей появился другой способ реализовать DSL, но уже на стороне клиента:

```html
<script type="module" src="index.modern.js"></script>
<script nomodule src="index.legacy.js"></script>
```

Этот паттерн имеет название module/nomodule, и его суть состоит в том, что старые браузеры без поддержки ES-модулей не будут обрабатывать скрипты с типом `module`, так как этот тип им неизвестен. А браузеры, которые поддерживают ES-модули, будут загружать скрипт с типом `module` и игнорировать скрипт с атрибутом `nomodule`. Браузеры с поддержкой ES-модулей, описываются следующим конфигом:

```
[esm]
edge >= 16
firefox >= 60
chrome >= 61
safari >= 11
opera >= 48
```

Главным плюсом паттерна module/nomodule является отсутствие необходимости в собственном сервере — всё работает полностью на клиентской части. Загрузку стилей в зависимости от браузера таким образом не сделать, но можно реализовать загрузку ресурсов с помощью JavaScript, используя проверку вида:

```js
if ('noModule' in document.createElement('script')) {
    // Новые браузеры
} else {
    // Старые браузеры
}
```

Из минусов: этот паттерн имеет кое-какие [кроссбраузерные проблемы](https://gist.github.com/jakub-g/5fc11af85a061ca29cc84892f1059fec). Также уже начинают появляться фичи, которые имеют разный уровень поддержки, даже среди браузеров с поддержкой ES-модулей, например, [optional chaining operator](https://caniuse.com/#feat=mdn-javascript_operators_optional_chaining). С появлением новых фич этот вариант DSL потеряет свою актуальность.

Прочитать ещё больше про паттерн module/nomodule можно в статье [«Modern Script Loading»](https://jasonformat.com/modern-script-loading/). Если вас заинтересовал этот вариант DSL и хочется попробовать внедрить его в свой проект, то вы можете воспользоваться плагином для Webpack: [webpack-module-nomodule-plugin](https://www.npmjs.com/package/webpack-module-nomodule-plugin).

#### Browserslist-useragent-regexp

Относительно недавно появился ещё один инструмент для Browserslist: [browserslist-useragent-regexp](https://github.com/browserslist/browserslist-useragent-regexp). Этот инструмент позволяет получить из конфига регулярное выражение для проверки User-Agent браузера. Регулярные выражения работают в любой среде исполнения JavaScript, что даёт возможность проверять User-Agent браузера не только на стороне сервера, но и на стороне клиента. Таким образом, можно реализовать работающий в браузере DSL:

```js
// last 2 firefox versions
var modernBrowsers = /Firefox\/(73|74)\.0\.\d+/
var script = document.createElement('script')

script.src = modernBrowsers.test(navigator.userAgent)
    ? 'index.modern.js'
    : 'index.legacy.js'

document.all[1].appendChild(script)
```

Можно добавить, что генерируемые регулярные выражения работают быстрее, чем функция `matchesUA` из browserslist-useragent, так что есть смысл использовать browserslist-useragent-regexp и на стороне сервера:

```js
> matchesUA('Mozilla/5.0 (Windows NT 10.0; rv:54.0) Gecko/20100101 Firefox/54.0', { browsers: ['Firefox > 53']})
first time: 21.604ms
> matchesUA('Mozilla/5.0 (Windows NT 10.0; rv:54.0) Gecko/20100101 Firefox/54.0', { browsers: ['Firefox > 53']})
warm: 1.742ms

> /Firefox\/(5[4-9]|6[0-6])\.0\.\d+/.test('Mozilla/5.0 (Windows NT 10.0; rv:54.0) Gecko/20100101 Firefox/54.0')
first time: 0.328ms
> /Firefox\/(5[4-9]|6[0-6])\.0\.\d+/.test('Mozilla/5.0 (Windows NT 10.0; rv:54.0) Gecko/20100101 Firefox/54.0')
warm: 0.011ms
```

Все это выглядит очень здорово, но хочется иметь удобный способ встроить это в процесс сборки проекта… И такой способ есть!

#### Browserslist Differential Script Loading

[Bdsl-webpack-plugin](https://github.com/TrigenSoftware/bdsl-webpack-plugin) это плагин для Webpack, работающий в паре с [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) и использующий [browserslist-useragent-regexp](https://github.com/browserslist/browserslist-useragent-regexp), который помогает автоматизировать добавление в бандл дифференциальной загрузки. Вот пример конфига для Webpack с применением этого плагина:

```js
const {
    BdslWebpackPlugin,
    getBrowserslistQueries,
    getBrowserslistEnvList
} = require('bdsl-webpack-plugin')

function createWebpackConfig(env) {
    return {
        name: env,
        /* … */
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        ['@babel/preset-env', {
                            /* … */
                            targets: getBrowserslistQueries({ env })
                        }]
                    ],
                    plugins: [/* … */]
                }
            }]
        },
        plugins: [
            new HtmlWebpackPlugin(/* … */),
            new BdslWebpackPlugin({ env })
        ]
    };
}

module.exports = getBrowserslistEnvList().map(createWebpackConfig)
```

В этом примере экспортируется [несколько конфигов](https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations) для вывода бандлов для каждой среды из конфига Browserslist. На выходе мы получим HTML-файл со встроенным DSL-скриптом:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Example</title>
        <script>function dsl(a,s,c,l,i){c=dsld.createElement('script');c.async=a[0];c.src=s;l=a.length;for(i=1;i<l;i++)c.setAttribute(a[i][0],a[i][1]);dslf.appendChild(c)}var dsld=document,dslf=dsld.createDocumentFragment(),dslu=navigator.userAgent,dsla=[[]];if(/Firefox\/(73|74)\.0\.\d+/.test(dslu))dsl(dsla[0],"/index.modern.js")
else dsl(dsla[0],"/index.legacy.js");dsld.all[1].appendChild(dslf)</script>
    </head>
    <body></body>
</html>
```

Помимо загрузки скриптов есть поддержка [загрузки стилей](https://github.com/TrigenSoftware/bdsl-webpack-plugin/tree/master/examples/postcss-preset-env). Также имеется возможность использовать этот плагин [на стороне сервера](https://github.com/TrigenSoftware/bdsl-webpack-plugin/tree/master/examples/SsrBdslWebpackPlugin).

Но, к сожалению, есть и кое-какие нюансы, о которых нужно знать при использовании bdsl-webpack-plugin: так как загрузка скриптов и стилей инициализируется из JavaScript, то они загружаются асинхронно без блокировки рендеринга и т. д. К примеру, в случае скриптов — это означает невозможность использования атрибута `defer`, а для стилей — необходимость скрывать контент страницы до момента полной загрузки стилей. Про то, как можно обойти эти нюансы, и про другие возможности данного плагина можно прочитать в [документации](https://github.com/TrigenSoftware/bdsl-webpack-plugin/blob/master/README.md) и в [примерах использования](https://github.com/TrigenSoftware/bdsl-webpack-plugin#examples).

## Транспиляция зависимостей

Из уже прочитанной части статьи мы узнали несколько способов того, как с помощью Browserslist можно уменьшить размер _собственного_ кода сайта, но остаётся другая часть итогового бандла — зависимости. В веб-приложениях размер зависимостей в итоговом бандле может занимать весомую часть.

По умолчанию, процесс сборки должен избегать транспиляцию зависимостей, так как тогда сборка будет занимать много времени, да и сами зависимости, если их исходники используют неподдерживаемый синтаксис, обычно распространяются уже транспилированными. На практике же можно выделить три типа пакетов:

1. c транспилированным кодом;
2. c транспилированным и исходным кодом;
3. c кодом на актуальном синтаксисе только для новых браузеров.

С первым типом, очевидно, ничего сделать не получится. Второй — нужно настроить бандлер для работы только с исходной версией кода в пакете. Третий тип — для работы кода даже в не очень актуальных браузерах всё равно необходимо транспилировать.

Так как общепринятого способа делать пакеты с несколькими версиями бандла нет, то опишу как я делаю такие пакеты: обычная транспилированная версия имеет расширение `.js`, и главный файл записывается в поле `main` файла `package.json`, а версия бандла без транспиляции имеет расширение `.babel.js`, и главный файл записывается в поле `raw`. Вот реальный пример — пакет [Canvg](https://unpkg.com/browse/canvg/). Но можно делать и по-другому, например, как это сделано [в пакете Preact](https://unpkg.com/browse/preact/) — исходники выделены в отдельную папку, а в `package.json` есть поле `source`.

Для того, чтобы Webpack мог работать с такими пакетами, нужно модифицировать секцию `resolve`:

```js
{
    /* … */
    resolve: {
        mainFields: [
            'raw',
            'source',
            'browser',
            'module',
            'main'
        ],
        extensions: [
            '.babel.js',
            '.js',
            '.jsx',
            '.json'
        ]
    }
    /* … */
}
```

Таким образом мы указываем Webpack как он должен искать файлы в пакетах, которые он должен использовать для сборки. Дальше нам остаётся настроить [babel-loader](https://github.com/babel/babel-loader):

```js
{
    /* … */
    test: /\.js$/,
    exclude: _ => /node_modules/.test(_) && !/(node_modules\/some-modern-package)|(\.babel\.js$)/.test(_),
    loader: 'babel-loader'
    /* … */
}
```

Логика простая: просим игнорировать всё из `node_modules`, за исключением конкретных пакетов и файлов с определенным расширением.

## Результаты

Я замерил размеры бандла и скорости загрузки до и после применения дифференциальной загрузки вместе с транспиляцией зависимостей, на примере сайта [DevFest Siberia 2019](https://github.com/TrigenSoftware/DevFest-Siberia):

<table>
    <caption>Размеры бандла</caption>
    <thead>
        <tr>
            <th></th>
            <th>Без сжатия</th>
            <th>После сжатия</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Без DSL</td>
            <td>1,08 Мб</td>
            <td>292 Кб</td>
        </tr>
        <tr>
            <td>С плагином BDSL для Webpack</td>
            <td>0,80 Мб</td>
            <td>218 Кб</td>
        </tr>
    </tbody>
</table>

<table>
    <caption>Среднее время загрузки, мс</caption>
    <thead>
        <tr>
            <th></th>
            <th>Обычный интернет</th>
            <th>Обычный 4G</th>
            <th>Хороший 3G</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Без DSL</td>
            <td>1,511</td>
            <td>4,240</td>
            <td>8,696</td>
        </tr>
        <tr>
            <td>С плагином BDSL для Webpack</td>
            <td>1,594</td>
            <td>3,409</td>
            <td>8,561</td>
        </tr>
    </tbody>
</table>

<table>
    <caption>Лучшее время загрузки, мс</caption>
    <thead>
        <tr>
            <th></th>
            <th>Обычный интернет</th>
            <th>Обычный 4G</th>
            <th>Хороший 3G</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Без DSL</td>
            <td>1,266</td>
            <td>3,366</td>
            <td>8,349</td>
        </tr>
        <tr>
            <td>С плагином BDSL для Webpack</td>
            <td>1,143</td>
            <td>3,142</td>
            <td>6,673</td>
        </tr>
    </tbody>
</table>

В итоге получился прирост скорости загрузки и размер бандла уменьшился на ≈20%, [читайте более подробный отчёт](https://gist.github.com/dangreen/5427c5f2158c357bf0b15d38270508ac). Также вы можете самостоятельно провести подобные замеры — необходимый скрипт есть [в репозитории bdsl-webpack-plugin](https://github.com/TrigenSoftware/bdsl-webpack-plugin#metrics).

### Источники

- [Smart Bundling: How To Serve Legacy Code Only To Legacy Browsers](https://www.smashingmagazine.com/2018/10/smart-bundling-legacy-code-browsers/), Шабхам Канодия
- [Modern Script Loading](https://jasonformat.com/modern-script-loading/), Джейсон Миллер
