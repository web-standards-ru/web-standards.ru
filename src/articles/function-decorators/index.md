---
title: 'Функции-декораторы, которые можно написать с нуля'
date: 2018-06-13
author: cristian-salcescu
source:
    title: 'Here are a few function decorators you can write from scratch'
    url: 'https://medium.com/p/488549fe8f86'
translators:
    - vladislav-pocheptsov
editors:
    - vadim-makeev
layout: article.njk
tags:
    - article
    - js
---

<figure>
    <img src="images/1.jpg" alt="">
    <figcaption>
        Фото <a href="https://unsplash.com/photos/rkT_TG5NKF8">Calum Lewis</a>.
    </figcaption>
</figure>

> Декораторы — это функции высшего порядка, которые принимают в качестве аргумента одну функцию и возвращают другую. Возвращаемая функция является преобразованным вариантом функции-аргумента [Javascript Allongé](https://leanpub.com/javascript-allonge/read#decorators)

Давайте самостоятельно напишем некоторые базовые дектораторы, представленные в таких библиотеках, как [underscore.js](http://underscorejs.org/#functions), [lodash.js](https://lodash.com/docs/4.17.5), [ramda.js](http://ramdajs.com/docs/).

## `once()`

- [once(fn)](https://jsfiddle.net/cristi_salcescu/zpLeLp0v/) создает экземпляр функции, которая должна быть выполнена только один раз. Паттерн может быть использован, например, для инициализации, когда нужно быть уверенным в единичном запуске функциональности, даже если сама функция вызвана в нескольких местах.

```js
function once(fn){
    let returnValue;
    let canRun = true;
    return function runOnce(){
        if(canRun) {
            returnValue = fn.apply(this, arguments);
            canRun = false;
        }
        return returnValue;
    }
}

var processonce = once(process);
processonce(); // process
processonce(); //
```

Функция once() возвращает другую функцию — runOnce(), использующую [замыкание](https://medium.freecodecamp.org/why-you-should-give-the-closure-function-another-chance-31253e44cfa0). Обратите также внимание, как осуществлен вызов оригинальной функции, а именно через передачу this и arguments в метод apply: fn.apply(this, arguments).

Если хотите узнать замыкания глубже, обратите внимание на статью «[Why you should give the Closure function another chance](https://medium.com/p/31253e44cfa0)».

## after()

- [after(count, fn)](https://jsfiddle.net/cristi_salcescu/4evuoxe6/) создает вариант функции, которая будет выполнена только после определенного количества вызовов. Функция полезна, например, если должна быть выполнена _только_ по завершению асинхронных операций.

```js
function after(count, fn) {
    let runCount = 0;
    return function runAfter() {
        runCount = runCount + 1;
        if (runCount >= count) {
            return fn.apply(this, arguments);
        }
    }
}

function logResult() { console.log('calls have finished'); }
let logResultAfter2Calls = after(2, logResult);

setTimeout(function logFirstCall() {
    console.log('1st call has finished');
    logResultAfter2Calls();
}, 3000);

setTimeout(function logSecondCall() {
    console.log('2nd call has finished');
    logResultAfter2Calls();
}, 4000);
```

В примере выше при помощи after() я создаю функцию logResultAfter2Calls(). Она в свою очередь выполняет logResult() только после второго вызова.

## throttle()

- [throttle(fn, wait)](https://jsfiddle.net/cristi_salcescu/5tdv0eq6/) создает вариант функции, которая при повторяющихся вызовах выполняется через указанный временной интервал (аргумент wait). Декоратор эффективен для обработки быстро повторяющихся событий.

```js
function throttle(fn, interval) {
    let lastTime;
    return function throttled() {
        let timeSinceLastExecution = Date.now() - lastTime;
        if(!lastTime || (timeSinceLastExecution >= interval)) {
            fn.apply(this, arguments);
            lastTime = Date.now();
        }
    };
}

let throttledProcess = throttle(process, 1000);
$(window).mousemove(throttledProcess);
```

Здесь движение мыши генерирует множество событий mousemove, тогда как оригинальная функция process() вызывается лишь раз в секунду.

## debounce()

- [debounce(fn, wait)](https://jsfiddle.net/cristi_salcescu/424unsa7/) создает вариант функции, которая выполняет _оригинальную_ функцию спустя wait миллисекунд _после_ предыдущего вызова _декорированной_ функции. Паттерн также применяется в работе с повторяющимися событиями. Он полезен, если функциональность должна быть выполнена по завершению очереди событий.

```js
function debounce(fn, interval) {
    let timer;
    return function debounced() {
        clearTimeout(timer);
        let args = arguments;
        let that = this;
        timer = setTimeout(function callOriginalFn() {
                fn.apply(that, args);
        }, interval);
    };
}

let delayProcess = debounce(process, 400);
$(window).resize(delayProcess);
```

Функция debounce() часто используется вместе с событиями scroll, resize, mousemove и keypress.

## Частичное применение

Частичное применение преобразует функцию за счет изменения количества параметров. Это один из примеров движения от общего к частному.

## partial()

На этот раз [создадим метод partial()](https://jsfiddle.net/cristi_salcescu/sbborekp/) и сделаем его доступным для всех функций. В данном примере я использую синтаксис ECMAScript 6, а именно оператор rest. С его помощью набор аргументов функции преобразуется в массив ...leftArguments. Это нужно для конкатенации массивов, тогда как специальный объект arguments массивом не является.

```js
function.prototype.partial = function(...leftArguments){
    let fn = this;
    return function partialFn(...rightArguments){
        let args = leftArguments.concat(rightArguments);
        return fn.apply(this, args);
    }
}

function log(level, message){
    console.log(level  + ' : ' + message);
}

let logInfo = log.partial('Info');
logInfo('here is a message');
```

Обратите внимание, созданная таким образом logInfo() использует лишь один аргумент message.

## Заключение

Применение указанных функций помогает понять принципы работы декораторов и саму идею инкапсуляции логики внутри них.

Декораторы — мощный инструмент расширения функциональности без изменения исходной функции. Это отличный путь переиспользовать код, и он соответствует функциональной парадигме программирования.

### Больше о ФП в JavaScript

- [How point-free composition will make you a better functional programmer](https://medium.com/p/33dcb910303a)
- [You will finally understand what Closure is](https://medium.com/p/13ba11825319)
- [Class vs Factory function: exploring the way forward](https://medium.com/p/73258b6a8d15) (см. [перевод](https://medium.com/@kanby/класс-vs-фабрика-объектов-перспективы-9b4c696823c8)).
- [Make your code easier to read with Functional Programming](https://medium.com/p/94fb8cc69f9d)
