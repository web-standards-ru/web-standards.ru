---
title: 'Распаковка Docker, часть 3'
date: 2021-02-10
author: igor-korovchenko
editors:
    - vadim-makeev
layout: article.njk
tags:
    - article
    - js
---

- Безопасность Docker
    - Безопасность вашей ОС
    - Доступ при запуске приложения
    - Безопасные образы
    - Хранение секретной информации
- Заключение
- Материалы по теме

## Безопасность Docker

Предлагаю обсудить еще одну важную тему — безопасность. Рассмотрим четыре аспекта:

1. Безопасность вашей ОС во время разработки;
2. Управление доступом на этапе запуска приложения в контейнере;
3. Безопасные образы;
4. Хранение секретной информации.

### Безопасность вашей ОС

Что мешает ОС быть в безопасности? Конечно то, что вы вынуждены устанавливать кучу разнообразного софта, в том числе и экспериментального. Это могут быть приложения с графическим интерфейсом или сугубо консольные приложения. Часто вам нужно устанавливать JVM или что-то подобное. Каждая новая программа несет в себе дырки, через которые можно что-нибудь, да сделать. Docker позволяет практически избавить вас от необходимости установки этого груза. Да и работать с коллегами будет намного проще.

### Доступ при запуске приложения

Запуск контейнера происходит в отельном окружении, изолированном от ОС и других контейнеров. Но есть определенные трюки, которые позволят обеспечить вам еще большую изоляцию. В документации к Docker есть замечательное [руководство](https://docs.docker.com/engine/security/userns-remap/), которое точно стоит почитать. Перечислю самые важные советы, с моей точки зрения.

Во-первых, необходимо запуск приложений внутри контейнера осуществлять от имени какого-то пользователя. По умолчанию, приложение запускается от имени root. Осуществить это довольно просто, достаточно добавить параметр -u:

```bash
docker run -u user image
```

Вы также можете добавить эту настройку в Dockerfile:

```docker
FROM alpine:latest
RUN apk update && apk add --no-cache git
USER 1000
```

Во-вторых, необходимо поддерживать только те возможности, которые вам не нужны. Полный функционал для вашего приложения внутри контейнера зачастую совершенно не обязателен. Управление возможностями осуществляется через командную строку с помощью параметров `--cap-drop` и `--cap-add`. Лучшей практикой будет запуск контейнера с одним параметром `--cap-drop all` и разрешающими флагами для необходимых возможностей, обеспечивающих работу вашего приложения. Вы можете ознакомиться подробнее со всеми поддерживаемыми флагами в [документации](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities). С помощью Docker Compose вы также можете управлять поддержкой той или иной возможности контейнера с помощью параметров `cap_drop` и `cap_add`. В документации к Linux есть [исчерпывающий список](https://man7.org/linux/man-pages/man7/capabilities.7.html).

В-третьих, необходимо управлять ресурсами вашей ОС, которые будут доступны для запуска контейнеров. Если вы не будете ограничивать эти ресурсы, Docker просто забьет всю оперативную память, что очень смахивает на DDOS атаку прямо у вас на компьютере. Необходимо также ограничивать и использование процессора. В Windows и macOS вы можете посмотреть потребление ресурсов системы с помощью Docker Desktop. Это можно сделать и через консоль командой, доступной уже на всех ОС:

```bash
docker stats
```

Об оптимальных настройках вы можете подробнее почитать в официальной [документации](https://docs.docker.com/config/containers/resource_constraints/).

### Безопасные образы

Во время работы вы часто будете использовать образы из разных реестров. Будьте бдительны! Использовать образы необходимо с большим количеством скачиваний, высоким рейтингом при большом количестве отзывов, рекомендованные компанией (официальные образы) или группой, которой вы доверяете. Загружая неизвестный образ, вы получаете кота в мешке. В любом случае внимательно смотрите на конфигурационные файлы и базовые образы. Желательно также использовать подписанные образы. Для того чтобы уберечь себя от загрузки «неправильных» образов, необходимо выполнить команду в терминале:

```bash
export DOCKER_CONTENT_TRUST=1
```

Прочитать подробнее про эту систему можно [в документации](https://docs.docker.com/engine/security/trust/).

### Хранение секретной информации

Чтобы учетные данные аккаунтов, сертификаты, секретные ключи доступа, имена ресурсов и любая другая конфиденциальная информация оставались в тайне от других, необходимо следовать двум правилам:

1. Не помещайте секреты внутрь образа;
2. Не используйте для секретов переменные среды.

В документации Docker есть [специальный раздел](https://docs.docker.com/engine/swarm/secrets/), посвящённый сохранности подобной чувствительной информации. Там предлагаются различные варианты. Но Джеф Хэйл (Jeff Hale) [советует](https://towardsdatascience.com/top-20-docker-security-tips-81c41dd06f57) хранить секретные данные в томах (Docker volumes), создание и использование которых были описаны выше.

## Заключение

Нам приходится устанавливать на свою любимую технику всякую дребедень, экспериментировать с новыми технологиями, прикручивать на этапе внедрения продукта то, что не должно быть в нем. Фраза «у меня все работает» по понятным причинам совершенно не устраивает заказчика. Эти неприятные моменты приводят к прокрастинации или даже эмоциональному выгоранию разработчика, который часто работает больше положенных восьми часов в день. Ночные посиделки на кануне сдачи этапа проекта скорее обыденность, чем исключение.

Все вышесказанное является не чем иным, как попыткой помочь узнать основы без чтения документации. Как и всегда, попытка сделать что-либо подобное обречена на провал. Однако надеюсь, что время, проведенное за чтением, не будет бесполезным. Для меня процесс разработки совершенно точно разделился на «До» и «После». Надеюсь, опыт и умозаключения, изложенные выше, вам пригодятся, позволят попробовать различные технологии самостоятельно, поэкспериментировать, и, может быть, обеспечат преимущества при устройстве на следующую работу!

Если вы поработаете с Docker, вас, скорее всего, от него уже не спасти. Есть надежда, что вы будете писать уже следующее приложение внутри контейнера. В заключение, вот вам ещё несколько ссылок:

- [Команды Docker](https://habr.com/p/440660/)
- [Справочник по командам](https://medium.com/hackernoon/docker-commands-the-ultimate-cheat-sheet-994ac78e2888)
- [Мой репозиторий наборов конфигурационных файлов для работы в VS Code](https://github.com/igsekor/docker-seeds)
- [Docker для начинающего разработчика](https://blog.maddevs.io/docker-for-beginners-a2c9c73e7d3d)

## Материалы по теме

1. [Современные операционные системы](https://www.piter.com/collection/A20865/product/sovremennye-operatsionnye-sistemy-4-e-izd)
2. [Anatomy of Docker](https://medium.com/sysf/getting-started-with-docker-1-b4dc83e64389)
3. [LXC vs Docker: Why Docker is Better](https://www.upguard.com/blog/docker-vs-lxc)
4. [A Beginner-Friendly Introduction to Containers, VMs and Docker](https://www.freecodecamp.org/news/a-beginner-friendly-introduction-to-containers-vms-and-docker-79a9e3e119b/)
5. [Изучаем Docker, часть 1: основы](https://habr.com/p/438796/)
6. [Изучаем Docker, часть 2: термины и концепции](https://habr.com/p/439978/)
7. [Википедия: Стандартные потоки](https://ru.wikipedia.org/wiki/Стандартные_потоки)
8. [Википедия: TTY-абстракция](https://ru.wikipedia.org/wiki/TTY-абстракция)
9. [Manage data in Docker](https://docs.docker.com/storage/)
10. [Изучаем Docker, часть 6: работа с данными](https://habr.com/p/441574/)
11. [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
12. [Изучаем Docker, часть 3: файлы Dockerfile](https://habr.com/p/439980/)
13. [Postgres: Dockerfile](https://github.com/docker-library/postgres/blob/master/12/Dockerfile)
14. [Linux downloads (Red Hat family)](https://www.postgresql.org/download/linux/redhat/)
15. [Docker run reference](https://docs.docker.com/engine/reference/run/)
16. [Top 14 Best PHP CMS In Market For Developers in 2020](https://www.cloudways.com/blog/best-php-cms/)
17. [Install Docker Compose](https://docs.docker.com/compose/install/)
18. [Compose file version 3 reference](https://docs.docker.com/compose/compose-file/)
19. [Интегрируем Docker в приложение Vue.js](https://ru.vuejs.org/v2/cookbook/dockerize-vuejs-app.html)
20. [Официальный репозиторий Node.js от команды Docker](https://hub.docker.com/_/node)
21. [Изучаем Docker, часть 4: уменьшение размеров образов и ускорение их сборки](https://habr.com/p/440658/)
22. [Use multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)
23. [Utilizing the power of Docker while building MERN Apps using mern-docker](https://dev.to/sujaykundu777/utilizing-the-power-of-docker-while-building-mern-apps-using-mern-docker-4olb)
24. [How To Set Up Flask with MongoDB and Docker](https://www.digitalocean.com/community/tutorials/how-to-set-up-flask-with-mongodb-and-docker)
25. [Изучаем Docker, часть 5: команды](https://habr.com/p/440660/)
26. [Docker Commands — The Ultimate Cheat Sheet](https://medium.com/hackernoon/docker-commands-the-ultimate-cheat-sheet-994ac78e2888)
27. [Docker Seeds](https://github.com/igsekor/docker-seeds)
28. [Docker для начинающего разработчика](https://blog.maddevs.io/docker-for-beginners-a2c9c73e7d3d)

## Видео по теме

1. [The future of Linux Containers](https://youtu.be/wW9CAH9nSLs)
2. [«Основы Docker. Большой практический выпуск»](https://youtu.be/QF4ZF857m44)