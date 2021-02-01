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

- Использование Docker
    - Исследование системы команд конкретной ОС Linux
    - Работа с базами данных
    - Движок сайта на PHP
    - Фронтенд-приложение
    - Фулстек-приложение
    - Работа с кодом внутри контейнера
    - Тестирование приложений в графическом интерфейсе

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
3. Упаковка приложений:
    - Безопасность Docker.

Необходимо помнить, что основной целью Docker является запуск приложения в воспроизводимом окружении. Запуск в контейнере означает гарантированную работу приложения на любой платформе. Но использовать Docker можно и другим способом. Для разработчика существует несколько таких способов. Они рассматриваются в первой и второй группе задач.

### Исследование системы команд конкретной ОС Linux

Итак, задача стоит перед нами исследовательская. Например, вы хотите попробовать разобраться с новой для вас системой команд конкретной версии ОС Linux или с настройкой какой-то определенной службы.

Чтобы воспользоваться Docker для этой цели, нам необходимо в первую очередь его установить. [На официальном сайте](https://docs.docker.com/get-docker/) найдите дистрибутив Docker Desktop для macOS и Windows или инструкции для установки Docker для вашей версии ОС Linux. В результате установки вы получите Docker engine, Docker daemon и Docker CLI, то есть все самое необходимое для использования Docker.

Следующий этап представляется намного более творческим. Для работы контейнера с «установленной» внутри него версией ОС Linux, необходимо его из чего-то собрать. Для этого используется базовый образ (Docker image). Необходимо найти такой образ, на который вы потом будете «наслаивать» специфическое окружение. Для выполнения поставленной задачи необходимо выбрать образ ОС Linux и получить доступ к терминалу.

Сначала проверим, что после установки и запуска все работает корректно:

```bash
docker --version

> Docker version 19.03.13, build 4484c46d9d
```

Командой выше можно протестировать, что Docker готов, может скачивать, устанавливать и запускать образы (Docker image). Образы должны где-то храниться, и Docker предлагает хранить их с помощью удаленной платформы [Docker Registry](https://docs.docker.com/registry/) или в общедоступном хранилище [Docker Hub](https://hub.docker.com/) (бесплатный общедоступный реестр образов).

Кроме простых образов существует понятие репозиториев [Docker repository](https://docs.docker.com/docker-hub/repos/), которые представляют собой набор образов с одинаковым именем, но с разными тегами (идентификаторами образов). Обычно с помощью тегов организуется хранение образов с разными версиями программного обеспечения и/или ОС.

Попробуем запустить образ. Для этого у команды Docker есть специальный тестовый образ, который можно скачать, установить и запустить следующим образом:

```bash
docker run hello-world

> Unable to find image 'hello-world:latest' locally
> latest: Pulling from library/hello-world
> 0e03bdcc26d7: Pull complete
> Digest: sha256:e7c70bb24b462baa86c102610182e3efcb12a04854e8c582838d92970a09f323
> Status: Downloaded newer image for hello-world:latest
>
> Hello from Docker!
> …
```

Сначала Docker CLI попытался найти указанный образ hello-world среди уже скачанных и не нашел его («Unable to find … locally»). Затем он обратился к реестру Docker Hub, который установлен по умолчанию, нашел, скачал и установил последнюю версию: «latest: Pulling from…». В итоге мы получили вывод в терминале сообщения «Hello from Docker!…».

Если сейчас посмотреть список запущенных контейнеров с помощью команды:

```bash
docker ps

> CONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES
```

Вы увидите, что список пуст (присутствуют только заголовки таблицы). Если запустить эту команду с определенным ключом `--all`, то мы получим список всех запущенных контейнеров и контейнеров, которые уже отработали, но не были удалены из списка (операция удаления производится вручную или при остановки службы Docker daemon):

```
docker ps --all

> CONTAINER ID  IMAGE        COMMAND   CREATED        STATUS                   PORTS  NAMES
> 93cb27f68163  hello-world  "/hello"  3 minutes ago  Exited (0) 3 minutes ago        happy_goldberg
```

Приведу список основных команд со ссылками на оригинальную документацию, которыми вы будете пользоваться большую часть времени при использовании Docker:
- [docker ps](https://docs.docker.com/engine/reference/commandline/ps/)
- [docker run](https://docs.docker.com/engine/reference/commandline/run/);
- [docker image](https://docs.docker.com/engine/reference/commandline/image/);
- [docker container](https://docs.docker.com/engine/reference/commandline/container/);
- [docker volume](https://docs.docker.com/storage/volumes/).

Вернемся к нашей задаче. Самый простой способ воплотить ее в жизнь, найти готовый образ желаемой ОС в реестре и запустить. Для этого переходим на страницу [Docker Hub](https://hub.docker.com) и ищем необходимый нам образ (пусть это будет [образ с CentOS 8](https://hub.docker.com/_/centos)). Вы наверняка увидите подсказку с командой для установки данного образа, после выполнения которой вам будет выведена следующая информация:

```bash
docker pull centos

> Using default tag: latest
> latest: Pulling from library/centos
> 3c72a8ed6814: Pull complete
> Digest: sha256:76d24f3ba3317fa945743bb3746fbaf3a0b752f10b10376960de01da70685fbd
> Status: Downloaded newer image for centos:latest
> docker.io/library/centos:latest
```

Любопытно, что образ чистой ОС занимает всего около 70 Мб, гораздо меньше, чем полноценная ОС Linux. Удивляться не надо, ведь в образе нет, например, ядра ОС.

В интерфейсе Docker Hub есть три вкладки с полезной информацией: Description, Reviews, Tags. Наличие вкладки Tags свидетельствует о том, что перед нами не образ, а репозиторий образов. На вкладке Reviews есть полезные комментарии от пользователей, на которые стоит обратить внимание при выборе образа или версии образа. Также вы можете заметить справа над строкой, которую мы с вами скопировали, селектор с выбором платформы (ОС и архитектура процессора).

Надо понимать, что под архитектурой процессора подразумевается архитектура процессора, для которой собран образ ОС. По умолчанию используется amd64 (синоним x86-64). В первой строке вывода мы также видим, что по умолчанию присваивается тег latest. Это означает, что версию ОС, которая будет установлена в контейнере нужно смотреть в реестре под этим тегом.

Информация о том, какие слои должны присутствовать в образе (другими словами — «какое окружение»), хранится в специальном файле Dockerfile. На главной странице репозитория ссылка [latest, centos8, 8](https://github.com/CentOS/sig-cloud-instance-images/blob/12a4f1c0d78e257ce3d33fe89092eee07e6574da/docker/Dockerfile) в списке тегов (Supported tags and respective Dockerfile links) ведет на содержимое файла Dockerfile с указанием четырех слоев контейнера, чуть позже мы рассмотрим эти конфигурационные файлы подробнее. Для используемого нами образа это всего три слоя (базовый слой, слой операционный системы, запуск терминала), которые устанавливаются командами:

```docker
FROM scratch
ADD centos-8-x86_64.tar.xz /
LABEL org.label-schema.schema-version="1.0" org.label-schema.name="CentOS Base Image" org.label-schema.vendor="CentOS" org.label-schema.license="GPLv2" org.label-schema.build-date="20200809"
CMD ["/bin/bash"]
```

Используется базовая ОС для Docker. С помощью команды `ADD` добавляются файловая система образа интересующей нас ОС, затем устанавливаются именованные константы для контейнера командой `LABEL` (важный шаг для управления контейнерами), а на последнем шаге запускается терминал командой `CMD`. Кажется, пора запустить контейнер.

Давайте посмотрим список загруженных образов с помощью команды:

```bash
docker image ls

> REPOSITORY   TAG     IMAGE ID      CREATED       SIZE
> centos       latest  0d120b6ccaa8  3 months ago  215MB
> hello-world  latest  bf756fb1ae65  11 months ago 13.3kB
```

Обратите внимание на то, что при распаковке размер образа увеличился почти в три раза (215MB против ~ 70MB). Запуск контейнера осуществляется командой:

```bash
docker run centos
```

Если вы выполните эту команду, то увидите, что на консоль ничего не вывелось. Почему? Вроде бы вы скачали правильный образ, вроде бы запустили… Помните, что вы запускаете какое-то приложение. После окончания работы этого приложения контейнер автоматически останавливается и выгружается из памяти. Так и получилось.

Как же быть, если нам нужно запустить терминал для работы с консолью контейнера? Необходимо выполнить команду со специальными ключами:

```bash
docker run -it --entrypoint bash centos
```

Ключ `--entrypoint` перезаписывает значение точки вхождения по умолчанию. Это приложение, которое запускается внутри контейнера после его сборки. Два ключа `-i` и `-t` служат для открытия стандартного потока ввода и использования одного терминала соответственно. С подробностями вы можете ознакомиться в [разделе документации](https://docs.docker.com/engine/reference/commandline/run/), относящейся к команде, [в статье на Хабре](https://habr.com/p/439978/), в Википедии: [Стандартные потоки](https://ru.wikipedia.org/wiki/Стандартные_потоки) и [TTY-абстракция](https://ru.wikipedia.org/wiki/TTY-абстракция).

Чтобы выйти из терминала bash, как обычно, необходимо выполнить команду `exit`. Это приведет к остановке контейнера, поскольку программа терминала будет завершена.

Взаимодействие с внешними хранилищами — папками базовой ОС, на которой запущен Docker, или с содержимым других контейнерами — обеспечивается путем использование томов [Docker volumes](https://docs.docker.com/storage/volumes/). Тома монтируются в папки контейнера, которые можно задавать с помощью конфигурационных файлов или напрямую в терминале установкой определенных флагов.

Тома могут быть как самостоятельными ресурсами, недоступными для базовой ОС (обычный тип), так и связанными с папками базовой ОС (тип bind). Если используется независимый том, его необходимо предварительно создать и подключить к контейнеру. Для работы с томами используются следующие команды:

- Создание тома: `docker volume create my_volume`
- Cписок всех томов: `docker volume ls`
- Информация о конкретном томе: `docker volume inspect my_volume`
- Удаление тома: `docker volume rm my_volume`

Когда вы создадите обычный том и просмотрите информацию о нем, вы увидите, в какой именно папке будет содержаться файл с содержимым тома в базовой ОС. Чтобы подключить том при запуске контейнера и иметь доступ к содержимому этого тома в определенной папке контейнера (например, /tmp/volume), достаточно выполнить команду `run` с параметром `--mount`:

```bash
docker run --mount 'source=my_volume,target=/tmp/volume' -it --entrypoint bash centos
```

Если к контейнеру необходимо подключить папку из базовой ОС, необходимо выполнить команду со следующими ключами:

```bash
docker run --mount 'type=bind,source=/tmp,target=/tmp/volume' -it --entrypoint bash centos
```

Связывать подобным образом папки базовой ОС оказывается довольно удобно для работы приложений внутри контейнера. Вы можете разобраться с использованием томов подробнее [в документации](https://docs.docker.com/storage/) или кратко [в руководстве по работе с данными](https://habr.com/p/441574/).

Имея доступ к терминалу ОС контейнера, вы  можете изучить интересный для вас дистрибутив ОС Linux, не устанавливая его к себе на компьютер и не арендуя сервер. Например, теперь вы можете экспериментировать со специфичным пакетным менеджером или создать файлы настроек нужных вам служб. И все это после выполнения одной команды в терминале!

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

- [Google Container Registry](https://cloud.google.com/container-registry/?utm_source=google&utm_medium=cpc&utm_campaign=emea-ru-all-ru-dr-bkws-all-all-trial-e-gcp-1009139&utm_content=text-ad-none-any-DEV_c-CRE_253514160436-ADGP_Hybrid%20%7C%20AW%20SEM%20%7C%20BKWS%20~%20EXA_1%3A1_RU_RU_Compute_Container%20Registry_google%20cloud%20docker-KWID_43700053282389317-aud-606988878374%3Akwd-218322699127-userloc_1012077&utm_term=KW_google%20cloud%20docker-NET_g-PLAC_&&gclid=CjwKCAiAn7L-BRBbEiwAl9UtkIHHDlVZaoeHHBqxFovaJcgbZZxTmf_A-yEe4j2RljuInIAOHAdwPhoCHrQQAvD_BwE)
- [Amazon Elastic Container Registry](https://aws.amazon.com/ru/ecr/)
- [Yandex Container Registry](https://cloud.yandex.ru/services/container-registry)
- [DigitalOcean Container Registry](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwivmIXPpLntAhVsl4sKHT2CB_sQFjAAegQIAhAC&url=https%3A%2F%2Fwww.digitalocean.com%2Fproducts%2Fcontainer-registry%2F&usg=AOvVaw2UZxBK_bGoFT0Q3guyzasQ)
- [IBM Cloud Container Registry](https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwiO8Lv1pLntAhWL3hgKHYpFCgIYABAAGgJsZQ&ohost=www.google.com&cid=CAESQeD2rpwEp1fMwFsAdxl2bBHdpi1ixzVFB9Ztyj5LArCkvMIz3ei__d8ZiY7pyWM_W7C1jPKND3bLUeQVCaqyLZz4&sig=AOD64_28zcNSrYI29DPMcH_8UqoVd_5Saw&q&adurl&ved=2ahUKEwi8xbH1pLntAhWJw4sKHQEMAGEQ0Qx6BAgPEAE)

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

### Работа с кодом внутри контейнера

До сих пор, мы не говорили о написании кода внутри контейнера. Вы можете использовать классическую связку vim с плагинами + tmux. Вы можете подключится к контейнеру по SSH почти из любой популярной среды разработки. Но не использовать или хотя бы не попробовать использовать возможности Visual Studio Code (VS Code) будет преступлением.

Для того, чтобы работать с кодом красиво, можно и даже нужно использовать Visual Studio Code Remote, что позволяет подключиться к созданному контейнеру и работать с ним в терминальном режиме.

Это делается довольно просто. Достаточно установить расширение [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) и создать файл `.devcontainer.json` в папке из которой собирается ваш контейнер. Часто эта папка является папкой проекта. Можно собрать контейнер и на йходу с помощью мастера, но это трудно воспроизвести впоследствии. Например, содержимое `.devcontainer.json` может быть таким:

```json
{
    "name": "server",
    "dockerComposeFile": ["../docker-compose.yaml"],
    "service": "test",
    "workspaceFolder": "/app"
}
```

Это заставит VS Code собрать все контейнеры, указанные в файле для Docker Compose и открыть папку /app, которая находится внутри контейнера server.

В VS Code можно попытаться открыть папку проекта, и среда сама предложит открыть снова ее, но уже внутри контейнера. А можно сделать это вручную, нажав клавишу F1 или сочетание клавиш Ctrl + P (Cmd + P для macOS) и выбрав команду:

```bash
> Remote-Containers: Open Workspace in Container.
```

Вы также можете указать те расширения, которые нужно поставить для данной рабочей сессии VS Code. После работы все эти расширения удаляться из редактора. Это очень удобно. Мне это позволяет держать в VS Code всего десять (!) расширений, которые будут востребованы в любом проекте, и никаких расширений для конкретного языка или фреймворка. Чистота и порядок!

В списке литературы вы сможете познакомится с [репозиторием](https://github.com/igsekor/docker-seeds) конфигурационных файлов для разных языков и фреймворков, на которых я в основном и работаю. Этот репозиторий обновляется по мере необходимости.

### Тестирование приложений в графическом интерфейсе

В Docker можно запускать не только консольные приложения, но и приложения с графическим интерфейсом. Единственное ограничение — они будут работать на сервере системы X Windows для рендеринга графических приложений и взаимодействия с ними. Воспользоваться можно интересным свойством приложений с графическим интерфейсом Linux. Приложения запускаются как клиенты, которые обращаются к серверу X Windows. При этом не важно, где этот сервер расположен. Он вполне может быть на удаленном хосте. А нам это и надо!

Если вы работаете на любом дистрибутиве ОС Linux, такой сервер у вас уже запущен. Чтобы поставить его на macOS, можете воспользоваться [XQuartz](https://www.xquartz.org/). На ОС Windows можно попробовать использовать [VcXsrv](https://sourceforge.net/projects/vcxsrv/). В первую очередь вы должны разрешить удаленное подключение к X Windows серверу и добавить переменные среды для контейнера. Универсального решения для всех ОС не существует, но я приведу флаги для команды `docker run`, учитывая ОС:

```bash
-e DISPLAY=docker.for.mac.host.internal:0 # macOS
-e DISPLAY=host.docker.internal:0 # Windows
--net=host -e DISPLAY=:0 # Linux
```

Цифра в конце строки обозначает номер монитора, на который будет выведен графический интерфейс приложения (0 используется для обозначения главного монитора). Для macOS и Windows вы можете воспользоваться графическим интерфейсом вашего сервера. Удаленное подключение для LInux можно разрешить с помощью команды:

```bash
xhosts +
```

Например, вы так можете запустить Gimp одной командой:

- macOS: `docker run --rm -ti -e DISPLAY=docker.for.mac.host.internal:0 jamesnetherton/gimp`
- Windows: `docker run --rm -ti -e DISPLAY=host.docker.internal:0 jamesnetherton/gimp`
- Linux: `docker run --rm -ti --net=host -e DISPLAY=:0 jamesnetherton/gimp`

Для запуска Eclipse нужно в конце дописать `psharkey/eclipse` вместо `jamesnetherton/gimp`, а чтобы запустить Firefox — `jess/firefox`. В конце строки вы указываете имя нужного образа, который будет скачан с Docker Hub? Посмотрите, как был собран один из них, и вы будете точно знать, как запустить необходимое вам приложение с графическим интерфейсом.
