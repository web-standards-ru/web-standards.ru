---
title: 'Распаковка Docker, часть 2'
date: 2021-02-09
author: igor-korovchenko
editors:
    - vadim-makeev
layout: article.njk
tags:
    - article
    - js
---

[В первой части](/articles/docker-unboxing-1) были описаны технологии виртуализации, основная терминология Docker и базовый пример использования. В этой части мы рассмотрим примеры использования Docker на практике.

## Навигация

- [Использование Docker](#section-2)
    - [Работа с базами данных](#section-3)
    - [Движок сайта на PHP](#section-4)
    - [Фронтенд-приложение](#section-5)
    - [Фулстек-приложение](#section-6)

## Использование Docker

Начнем, пожалуй, с самого простого. Определим задачи, для которых Docker может понадобиться веб-программисту, разбив примеры типовых задачи на группы:

1. Эксперименты и обучение:
    - Исследование системы команд конкретной ОС Linux (на примере CentOS 8);
    - Работа с базами данных (на примере PostgreSQL);
    - Движок сайта на PHP (на примере CMS Drupal).
2. Разработка приложений:
    - Фронтенд приложение (на примере настройки базового репозитория для разработки на Node.js);
    - Фулстек-приложение (на примере MERN и связки Flask с MongoDB);
    - Работа с кодом внутри контейнера;
    - Тестирование приложений в графическом интерфейсе.

Необходимо помнить, что основной целью Docker является запуск приложения в воспроизводимом окружении. Запуск в контейнере означает гарантированную работу приложения на любой платформе. Но использовать Docker можно и другим способом. Для разработчика существует несколько таких способов. Они рассматриваются в первой и второй группе задач.

### Работа с базами данных

Можно поступить по-старому: скачать образ нужной ОС и установить на ней интересующую вас СУБД. Но это противоречит философии Docker. Понятно, что подобрать готовый образ вы сможете и сами на Docker Hub. Однако, давайте создадим свой собственный образ, чтобы потренироваться.

Нам необходимо приготовить свой «слоеный пирог», как иногда метафорически называют образ в официальной документации. Мы уже знаем, что существует конфигурационный файл Dockerfile, в котором описываются все нужные нам слои с помощью специальных команд (инструкций). [В официальной документации](https://docs.docker.com/engine/reference/builder/) подробно описаны все инструкции. Можно также обратиться [к руководству по Dockerfile](https://habr.com/p/439980/). Инструкция в Dockerfile формируется по следующему принципу:

```docker
# Comment
INSTRUCTION arguments
```

Строка начинается с имени инструкции, а дальше указываются значения ее аргументов. [Посмотрите на Dockerfile](https://github.com/docker-library/postgres/blob/master/12/Dockerfile) из официального образа с установленной СУБД PostgreSQL от команды Docker. Вы увидите достаточно большой файл конфигурации (больше двух сотен строк!). Можно ли проще? Можно, если вы не претендуете на универсальность вашего решения. Давайте постепенно будем формировать файл конфигурации. В первую очередь нам необходимо определить базовый образ. Нам, например, понадобился образ CentOS 8, последней стабильной версии. В Dockerfile достаточно написать для этого всего лишь строчку:

```docker
FROM centos:latest
```

Давайте попробуем сформировать и запустить его? Используем команду [docker build](https://docs.docker.com/engine/reference/commandline/build/). Если запустить ее в каталоге с Dockerfile с точкой после слова build, Docker CLI должен собрать новый образ. Переходим в отдельный каталог, создаем файл Dockerfile, записываем в него строчку и запускаем сборку. Достаточно выполнить следующие две команды в терминале:

```bash
touch ./Dockerfile && echo "FROM centos:latest" > ./Dockerfile && cat ./Dockerfile
docker build .
```

Если посмотрим список доступных образов, то увидим новую строчку списка:

```bash
docker image ls

> REPOSITORY   TAG     IMAGE ID      CREATED        SIZE
> <none>       <none>  183420543a45  3 months ago   215MB
> centos       latest  0d120b6ccaa8  3 months ago   215MB
> hello-world  latest  bf756fb1ae65  11 months ago  13.3kB
```

Давайте двигаться дальше. Сначала запустим контейнер в режиме доступа к консоли, указав в качестве имени контейнера Image ID:

```bash
docker run -it --entrypoint bash 183420543a45
```

Имя контейнера можно было указать при его создании, и мы это обязательно сделаем, но чуть позже.

Разумеется, для сборки все команды нужно попробовать сначала а терминале ОС, а только потом в Docker. Надо помнить также, что настройки ОС и установленные приложения не сохранятся и будут утеряны после завершения работы контейнера. Нам необходимо установить PostgreSQL в ОС, что мы и сделаем [в соответствии с официальной документацией](https://www.postgresql.org/download/linux/redhat/). Используем команды для CentOS 8, поскольку в последней версии образа устанавливается именно эта версия ОС:

```bash
rpm -Uvh https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
dnf install -y postgresql12-server --disablerepo=AppStream
```

Кажется, все успешно. Эти команды можно превратить в инструкции для Dockerfile следующим образом:

```docker
RUN rpm -Uvh https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm; dnf install -y postgresql12-server --disablerepo=AppStream
```

При сборке контейнера рекомендуется использовать наименьшее количество слоев. Это нужно как для сборки контейнера, так и для быстродействия работы его файловой системы. Поэтому мы выполняем команды друг за другом на одном слое (в одной инструкции), перечисляя их через точку с запятой.

Теперь надо запустить установленную СУБД при старте уже собранного контейнера. Попробуем сделать через консоль контейнера. Для этого можно снова [воспользоваться инструкцией](https://www.postgresql.org/download/linux/redhat/):

```bash
systemctl start postgresql-12.service

> System has not been booted with systemd as init system (PID 1). Can’t operate.
> Failed to connect to bus: Host is down
```

Ошибка! Но почему? Мы имеем дело не с полноценной ОС, а с контейнером, который существует только как абстракция. В нашем случае проблема связана с двумя вещами: доступом к системным службам и журналу поведения этих служб базовой ОС.

Поскольку Docker является надстройкой над ядром ОС, доступ контейнера к службе systemd означает доступ к ней в базовой ОС, что не является безопасным действием и по умолчанию запрещено.

Можно запустить контейнер в специальном привилегированном режиме, но на свой страх и риск. Мы будем использовать указанный флаг, [учитывая документацию Docker](https://docs.docker.com/engine/reference/run/), поскольку мы это делаем исключительно в исследовательских целях, используя официальный образ ОС.

Давайте отвлечемся на минуту, и еще добавим красивые имена для образа и контейнера. Чтобы каждый раз не смотреть значение Image ID (оно будет меняться при каждой сборке) установим имя образа и тег:

```bash
docker image rm -f 183420543a45
docker build -t psql:centos .
```

Первая команда используется для того, чтобы удалить собранный на предыдущем шаге образ. Ключ `-f` мы используем, поскольку Docker без него не будет удалять образы, которые были запущены раньше. Попробуем запустить:

```bash
docker run -it psql:centos bash
```

Все работает. Вы можете посмотреть на список всех запущенных контейнеров в другом окне терминала, если выполните следующую команду:

```bash
docker ps

> CONTAINER ID  IMAGE        COMMAND  CREATED        STATUS        PORTS  NAMES
> f53b4f7223c2  psql:centos  "bash"   9 seconds ago  Up 8 seconds         cool_curie
```

Значение `CONTAINER ID` не очень говорящее. Каждый раз смотреть его не удобно. Давайте добавим ключ с указанием имени контейнера, чтобы можно было легче им управлять. Для этого остановим наш контейнер и запустим его снова с именем:

```bash
docker stop f53b4f7223c2
docker run -it --name psql-centos-1 psql:centos bash
```

Теперь намного лучше:

```bash
docker ps

> CONTAINER ID  IMAGE        COMMAND  CREATED        STATUS        PORTS  NAMES
> 39954a216f6b  psql:centos  "bash"   8 seconds ago  Up 8 seconds         psql-centos-1
```

Если вы уже запускали контейнер с определенным именем, то в будущем Docker CLI под тем же именем вам не даст его запустить, даже если он уже был остановлен. Предварительно имя нужно удалить из списка с помощью команды:

```bash
docker rm psql-centos-1

> psql-centos-1
```

Посмотреть весь список, в котором будут отображены запущенные и остановленные контейнеры, можно с помощью команды:

```bash
docker ps -a
```

Теперь вернемся к нашей задаче. Для запуска менеджера служб systemd необходимо запустить сначала специальную службу:

```bash
docker run -it --privileged --name psql-centos-1 psql:centos /sbin/init
```

В другом окне терминала вы можете обратится к уже запущенному контейнеру и попасть в него с помощью команды:

```bash
docker exec -it psql-centos-1 /bin/bash
```

Теперь можно управлять запуском служб. Выполнения команды `exit` для остановки контейнера вам теперь будет не достаточно. Чтобы остановить контейнер, вам нужно выполнить команду:

```bash
docker stop psql-centos-1
```

Попробуем запустить нашу службу сейчас:

```bash
systemctl enable postgresql-12.service # Успешно
systemctl start postgresql-12.service

> Job for postgresql-12.service failed because the control process exited with error code.
> See "systemctl status postgresql-12.service" and "journalctl -xe" for details.
```

Снова неудача. В этот раз нет принципиальных ошибок, чтобы запустить нашу СУБД, осталось только настроить язык (local). Для этого нужно подправить Dockerfile следующим образом:

```docker
FROM centos:latest
RUN rpm -Uvh https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm && dnf install -y postgresql12-server --disablerepo=AppStream; dnf install -y glibc-locale-source glibc-langpack-en; dnf clean all
RUN localedef -i en_US -f UTF-8 en_US.UTF-8
```

Теперь нам нужно инициализировать СУБД и запустить ее как службу. Хотя с помощью Dockerfile сделать это можно, мы для простоты будем делать это вручную в терминале. Если выполнить команду внутри контейнера, то все получится:

```bash
/usr/pgsql-12/bin/postgresql-12-setup initdb && systemctl start postgresql-12 && su postgres
```

Вы сможете теперь работать с СУБД, если наберете команду:

```bash
psql
```

Если добавить команду запуска сервера СУБД в качестве инструкции типа RUN в Dockerfile, то вы получите ошибку при сборке образа на этапе инициализации СУБД. Есть пути решения этой проблемы, но говорить о них в рамках данной статьи будет несколько преждевременно.

Не забывайте, что в рабочих задачах установка привилегированного доступа к службе `systemd` базовой ОС очень опасна! Если ваша задача является широко распространенной, то вы должны озаботиться поиском готового решения.

### Движок сайта на PHP

Мы уже научились создавать базовые конфигурации для контейнеров и использовать контейнеры в двух режимах. Давайте теперь поработаем со стандартной задачей для веб-программиста или контент-менеджера — создание сайта на популярном PHP-движке. [Тройка наиболее популярных движков в мире на лето 2020 года](https://www.cloudways.com/blog/best-php-cms/): Wordpress, Magento, Drupal. Наиболее универсальным, мощным и относительно безопасным движком с хорошим тулингом (системой инструментов для разработчиков) является Drupal, он близок моему сердцу. Остановимся на нем, хотя чаще всего задача стоит в том, чтобы поставить и использовать Wordpress (Вы легко это сможете сделать в качестве упражнения по аналогии).

Попробуем найти подходящий образ на Docker Hub. Вы, скорее всего, наткнетесь [на официальный репозиторий](https://hub.docker.com/_/drupal). Отмечу только, что достаточно хорошими образами для Wordpress и Magento, на мой взгляд, являются соответственно [wordpress](https://hub.docker.com/_/wordpress) и [magento-cloud-docker-php](https://hub.docker.com/r/magento/magento-cloud-docker-php).

В образе, который вы сможете загрузить к себе и запустить будет установлена определенная версия Drupal (ее можно выбрать с помощью тегов), но не будет установлена СУБД, без которой ничего не заработает. С точки зрения философии Docker запускать контейнер с СУБД нужно отдельно, а потом сопрягать его с контейнером, в котором установлен Drupal.

Давайте, в рамках поставленной задачи, познакомимся с Docker Compose. Если вы устанавливали Docker Desktop, то Docker Compose у вас уже установлен, беспокоиться не о чем. Если вы счастливый обладатель ОС Linux, то Docker Compose необходимо будет установить. Для этого вам необходимо перейти на вкладку Linux [на странице документации](https://docs.docker.com/compose/install/).

Что такое Docker Compose? Это инструмент, который позволяет управлять списком связанных контейнеров путем установки параметров запуска. Все управление осуществляется в специальном файле конфигурации в формате YAML, который в последнее время очень часто используется. Файл имеет не только заданный формат, но и имя — «docker-compose.yml».

Нам необходимо определенным образом сконфигурировать и запустить два образа Docker совместно: в одном будет находиться CMS Drupal, а в другом — СУБД MySQL. Если перейти на страницу образа drupal, то вы сможете в описании увидеть, какой именно репозиторий рекомендуется использовать для работы Drupal с СУБД MySQL:

```bash
docker run -d --name some-mysql --network some-network \
    -e MYSQL_DATABASE=drupal \
    -e MYSQL_USER=user \
    -e MYSQL_PASSWORD=password \
    -e MYSQL_ROOT_PASSWORD=password \
mysql:5.7
```

У нас нет оснований использовать что-то другое, поэтому доверимся разработчикам репозитория. Для облегчения работы с несколькими контейнерами и был придумал Docker Compose.

Не буду уделять много внимания описанию инструмента и системы его команд. Давайте посмотрим на готовый конфигурационный файл и попробуем разобраться с тем, как он устроен. Ниже на странице образа drupal есть готовый YAML файл.

Файл конфигурации устроен следующим образом. Сначала описывается требуемая для сборки контейнеров версия Docker Compose. Затем перечисляются те сервисы, которые вы планируете запускать. Под сервисами подразумеваются приложения, для каждого из которых создаётся отдельный контейнер. Для сервисов вы можете указать настройки, с которыми контейнер должен запускаться. Все тонкости можно найти [в документации](https://docs.docker.com/compose/compose-file/). Приведу конфигурационный файл для Drupal последней версии, работающего на базе Apache и MySQL. Благодаря формату, конфигурация довольно проста для понимания:

```yaml
version: '3.8'
services:
    drupal:
    image: drupal:latest
    ports:
        - 8080:80
    volumes:
        - /var/www/html/modules
        - /var/www/html/profiles
        - /var/www/html/themes
        - /var/www/html/sites
    restart: always
    mysql:
    image: mysql:5.7
    environment:
        MYSQL_DATABASE: drupal
        MYSQL_USER: user
        MYSQL_PASSWORD: passwod
        MYSQL_ROOT_PASSWORD: password
    restart: always
```

Если файл docker-compose.yml уже создан и вы находитесь в этой же папке, для запуска контейнеров достаточно выполнить команду:

```bash
docker-compose up -d
```

Ключ -d нужен для установки режима работы контейнеров в фоновом режиме. Если вы теперь перейдете на ссылке `http://localhost:8080` в браузере базовой ОС, вы сможете работать с сайтом. При настройке Drupal не забудьте, что СУБД работает на хосте mysql (имя сервиса в docker-compose.yaml). После остановки контейнеров все данные сайта потеряются, если предварительно не создать тома для хранения данных. Приведу также две важные команды для работы с Docker Compose:

- Просмотр списка запущенных контейнеров: `docker-compose ps`
- Остановка всех контейнеров, которые были подняты: `docker-compose down`

Вы только что запустили рабочий сайт на последней версии Drupal. Перейдем теперь к следующей группе задач.

### Фронтенд-приложение

Как мы можем использовать Docker для работы с фреймворками Angular, React, Vue и подобными? Чтобы ответить на этот вопрос, нужно разделить этапы разработки и внедрения. На первом этапе с помощью Docker вы сможете обеспечить комфорт для себя (DX, developer experience), на втором — для администраторов или специалистов в области CI/CD.

Выполнить одну команду поднятия сервера гораздо проще, чем обеспечить поддержку необходимых библиотек и следить за их версиями, которые используются в коде. Сборка и развертывание проекта станет простым делом и для всех участников этого непростого процесса.

Давайте потренируемся в создании репозитория образов для фронтенда, заодно научимся работать с Docker Hub не только как потребители. Для желающих есть также [хорошее руководство](https://ru.vuejs.org/v2/cookbook/dockerize-vuejs-app.html).

Для этого вам необходимо [зарегистрироваться](https://hub.docker.com/signup) на платформе Docker Hub. После регистрации вы сможете [создать свой репозиторий](https://hub.docker.com/repository/create).

Репозиторий может быть либо публичным, либо частным (в базовом бесплатном пакете услуг допускается только один частный репозиторий). Кстати, вы также можете найти и другие реестры от крупных компаний:

- [Google Container Registry](https://cloud.google.com/container-registry/)
- [Amazon Elastic Container Registry](https://aws.amazon.com/ru/ecr/)
- [Yandex Container Registry](https://cloud.yandex.ru/services/container-registry)
- [DigitalOcean Container Registry](https://www.digitalocean.com/products/container-registry/)
- [IBM Cloud Container Registry](https://www.ibm.com/cloud/container-registry)

Я подготовил [простой репозиторий в реестре](https://hub.docker.com/repository/docker/igsekor/node) для разработки на Node.js. Я также связал этот репозиторий [с репозиторием на GitHub](https://github.com/igsekor/docker-node), чтобы процесс сборки новых образов происходил в автоматическом режиме после отправки очередного коммита.

Платформа Docker Hub позволяет использовать триггеры двух типов, которые служат основанием для начала сборки новой версии образа: коммиты с заданными тегами и коммиты в заранее определенных ветках. Я выбрал для простоты понимания второй вариант — на основе веток. Отправка коммита в определенной ветке означает автоматическую сборку образа в репозитории. Настраиваются связи между GitHub и Docker Hub на вкладке Builds репозитория на Docker Hub.

Чтобы загрузка и установка образов не занимали много времени, а сами образы не занимали много места на диске, в качестве базовой ОС на этот раз мы будем использовать Linux Alpine — довольно популярное решение. Опишу процесс создания четырех образов. В дальнейшем я буду развивать репозиторий, поэтому вы можете увидеть уже больше образов в нем.

Первый образ будет базовым, в нем будет только Node.js и пакетный менеджер npm. Второй образ будет являться базовым проектом с системой сборки Webpack, третий будет содержать vue-cli для разработки сайтов на VueJS, а четвертый позволит собирать любые проекты на Node.js и запускать их в изолированном окружении на веб-сервере nginx. В этот раз я не буду проводить вас по всей процедуре. Думаю, что достаточно будет только привести соответствующий образу Dockerfile.

Первый образ будет содержать только [базовый образ Node.js](https://hub.docker.com/_/node). В дальнейшем вы сможете его приспособить под свои задачи, например, добавить утилиты для тестирования веб-приложений, системы мониторинга и тому подобные инструменты. Итак, вот самый базовый Dockerfile:

```docker
FROM node:lts-alpine
```

Одной инструкции вполне достаточно для поставленной задачи. Теперь попробуем решить более сложную задачу — установить базовый проект Node.js. Создаем новую ветку в репозитории, создаем новый проект Node.js и собираем его:

```bash
git branch webpack
git checkout webpack
npm init
npm install
vi Dockerfile
```

После того, как мы добавили webpack, Dockerfile будет содержать дополнительные инструкции:

```docker
FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install; npm install webpack webpack-cli --save-dev
```

Пробуем собрать образ. Если все успешно, то добавляем нужные файлы, делаем коммит и отправляем на GitHub (новый образ соберется в репозитории на Docker Hub автоматически, если вы все предварительно настроили):

```bash
docker build .
git add .
git commit -m 'Add basic image for webpack project'
git push origin webpack
```

Перейдем к следующей задаче:

```bash
git branch vue
git checkout vue
```

Чтобы создать проект на Vue, можно было бы просто добавить его в package.json. Но мы пойдем другим путем, уберем webpack и заменим его утилитой vue-cli, удалив предварительно все лишние файлы:

```bash
rm *.json
vue create .
rm -r node_modules
git add .
git commit -m 'Install Vue 3'
git push origin vue
```

Необходимо также поправить Dockerfile:

```docker
FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
COPY babel.config.js ./
COPY README.md ./
COPY src/ ./src
COPY public/ ./public
```

Мы сделали не оптимальный Dockerfile, но зато очень понятный. Для повышения оптимальности можно скопировать все содержимое папки в папку проекта внутри контейнера одной строчкой `COPY . .`, но тогда вам нужно будет создать файл .dockerignore с единственной строкой `node_modules` (по аналогии с .gitignore). Если у вас уже настроено правило на Docker Hub, то после коммита и отправки на GitHub все опять автоматически соберется.

Перейдем к последнему образу, который будет отвечать за сборку готового сайта на Vue и запуск на веб-сервере nginx. Предлагаю использовать веб-сервер nginx для статических файлов готовой сборки. Снова создаем соответствующую ветку в репозитории и, перейдя к ней, редактируем Dockerfile:

```bash
git branch vue-prod
git checkout vue-prod
vi Dockerfile
```

Я возьму [готовый Dockerfile из руководства Vue](https://ru.vuejs.org/v2/cookbook/dockerize-vuejs-app.html), в нем все более или менее удачно с точки зрения универсального решения:

```docker
# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production-stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Здесь происходит пока что-то непонятное, поскольку используется механизм многоступенчатых сборок Docker, которые доступны с версии 17.05. Если вы хотите разобраться с этим механизмом подробнее, то можно воспользоваться [статьей](https://habr.com/p/440658/) или [официальной документацией](https://docs.docker.com/develop/develop-images/multistage-build/).

Многоступенчатая сборка используется тогда, когда мы хотим часть файлов из одной сборки скопировать в другую сборку, что сильно уменьшает размер конечного образа. На нашем примере мы собираем сайт с помощью Node.js, а потом копируем его целиком в другую сборку, где работает nginx. Мы получаем готовое веб-приложение, которое можно смело использовать в рамках реальной разработки.

Пробуем собрать образ, и, если все успешно, заливаем его на GitHub:

```bash
git add .
git commit -m 'Add production building for VueJS app'
git push origin vue-prod
```

### Фулстек-приложение

Приведу пару полезных примеров для фулстек-приложений, в которых используется несколько контейнеров, работающих совместно. Сначала посмотрим работу с MERN-приложением (MongoDB, Express, React, Node), которое у вас, предположим, уже написано — [подробнее об этом](https://dev.to/sujaykundu777/utilizing-the-power-of-docker-while-building-mern-apps-using-mern-docker-4olb).

Схема работы приложения описана и проиллюстрирована в том же репозитории. Предлагаю пройтись по стандартным конфигурационным файлам .env, Dockerfile, docker-compose.yml, которые нужно будет добавить в проект:

.env:

```bash
MONGO_HOSTNAME=mongo
MONGO_DB=myapp_db
MONGO_PORT=27017
```

Dockerfile:

```docker
# Dockerfile for Node Express Backend api (development)

FROM node:lts-alpine

# ARG NODE_ENV=development

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm ci

# Copy app source code
COPY . .

# Exports
EXPOSE 8080

CMD ["npm", "start"]
```

docker-compose.yml:

```yaml
version: '3.7'

services:
    webapp-server:
        build:
            context: .
            dockerfile: Dockerfile
        image: myapp-server-img
        container_name: myapp-node-express
        volumes:
            - .:/usr/src/app
            - /usr/src/app/node_modules
        ports:
            - "8080:8080"
        depends_on:
            - mongo
        env_file: .env
        environment:
            - MONGO_HOSTNAME=$MONGO_HOSTNAME
            - MONGO_PORT=$MONGO_PORT
            - MONGO_DB=$MONGO_DB
    mongo:
        image: mongo
        container_name: myapp-mongodb
        ports:
            - "27017:27017"
```

В docker-compose.yml используется несколько другой подход с подключением отдельного файла для описания контейнера и загрузки переменных среды из файла .env. Такое решение, как вы наверняка знаете, довольно распространено. В репозиторий не попадают пароли, ключи и прочие секретные данные.

В Dockerfile описан процесс копирования файлов проекта внутрь контейнера и запуск приложения в режиме разработки на порте 8080. Режим выбран не случайно, поскольку эта сборка предназначена для разработки. При этом на ваш компьютер не нужно будет устанавливать ничего кроме Docker. Это очень полезно как для вас, так и для вашей ОС.

Другим распространенным примером является использование Flask в качестве бэкенда, отдельного веб-сервера для производительности и MongoDB в качестве СУБД. Такой пример [приведен в руководстве](https://www.digitalocean.com/community/tutorials/how-to-set-up-flask-with-mongodb-and-docker). Вот файл docker-compose.yml из него:

```yaml
version: '3'
services:

    flask:
        build:
            context: app
            dockerfile: Dockerfile
        container_name: flask
        image: digitalocean.com/flask-python:3.6
        restart: unless-stopped
        environment:
            APP_ENV: "prod"
            APP_DEBUG: "False"
            APP_PORT: 5000
            MONGODB_DATABASE: flaskdb
            MONGODB_USERNAME: flaskuser
            MONGODB_PASSWORD: your_mongodb_password
            MONGODB_HOSTNAME: mongodb
        volumes:
            - appdata:/var/www
        depends_on:
            - mongodb
        networks:
            - frontend
            - backend

    mongodb:
        image: mongo:4.0.8
        container_name: mongodb
        restart: unless-stopped
        command: mongod --auth
        environment:
            MONGO_INITDB_ROOT_USERNAME: mongodbuser
            MONGO_INITDB_ROOT_PASSWORD: your_mongodb_root_password
            MONGO_INITDB_DATABASE: flaskdb
            MONGODB_DATA_DIR: /data/db
            MONDODB_LOG_DIR: /dev/null
        volumes:
            - mongodbdata:/data/db
        networks:
            - backend

    webserver:
        build:
            context: nginx
            dockerfile: Dockerfile
        image: digitalocean.com/webserver:latest
        container_name: webserver
        restart: unless-stopped
        environment:
            APP_ENV: "prod"
            APP_NAME: "webserver"
            APP_DEBUG: "true"
            SERVICE_NAME: "webserver"
        ports:
            - "80:80"
            - "443:443"
        volumes:
            - nginxdata:/var/log/nginx
        depends_on:
            - flask
        networks:
            - frontend

networks:
    frontend:
        driver: bridge
    backend:
        driver: bridge

volumes:
    mongodbdata:
        driver: local
    appdata:
        driver: local
    nginxdata:
        driver: local
```

Автор предлагает создать три контейнера: для веб-сервера, для СУБД и для Flask. Обратите внимание на создание внутренней сети. Думаю, вы вполне разберетесь с конфигурацией.

* * *

Мы можем использовать Docker и для организации собственных рабочих процессов, поговорим об этом [в третьей части](/articles/docker-unboxing-3).
