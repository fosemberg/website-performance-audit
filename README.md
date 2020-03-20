### lighthouse-influxdb-grafana

Проект создан для измерения скорости сайтов.

#### Зависимости
1. chrome
2. [influxdb](scripts\install\install-influxdb.sh)
3. [grafana](scripts\install\install-grafana.sh)

#### Установка
1. скопировать [конфиг ```env.example.ts```](config/env.example.ts) с новым названием ```env.ts```
2. установить nodejs зависимости```yarn```
3. собрать и запустить сервис ```yarn run build-start```
4. импортировать [grafana шаблон](grafana\lighthouse-influxDB.json) в grafana
5. разрешить в grafana вставлять iframe в текстовый виджет
6. Скопировать содержимое web папки после сборки на nginx

#### Использование

Пример api:

```http://example.com/?env=trunk&site=some-site&tag=1.32```

#### Прочее

##### Общая схема работы
1. express nodejs ловит заявки на замеры сайта
2. делается много прогонов сайта, используя lighthouse
3. результаты сохраняются в incluxdb
4. посмотреть результаты можно через grafana

[lighthouse configuration docs](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md)
