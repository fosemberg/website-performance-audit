### site-performance

Проект создан для измерения скорости сайтов.

#### Зависимости
1. [chrome](scripts\install\install-chrome.sh)
2. [influxdb](scripts\install\install-influxdb.sh)
3. [grafana](scripts\install\install-grafana.sh)

#### Установка
1. установить nodejs зависимости.
run: ```yarn```
2. скопировать [конфиг ```env.example.ts```](config/env.example.ts) с новым названием ```env.ts```.
  run: ```cp config/env.example.ts config/env.ts```
3. Сконфигурировать ```config/env.ts```. Не забыть заполнить ```origin```, ```port``` (как можно будет достучаться до приложение).  
4. Собрать grafana config. run: ```yarn run build-grafana``` (соберется ```grafana/build/site-performance.json``` из ```grafana/raw/site-performance.json``` и ```config/env.ts```).
5. собрать и запустить сервис. run: ```yarn run build-start```
6. разрешить в grafana вставлять iframe в текстовый виджет. run: ```sudo sed -i 's/;disable_sanitize_html = true/disable_sanitize_html = true/g' /etc/grafana/grafana.ini```
7. импортировать [grafana шаблон](grafana\build/site-performance.json) в grafana

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

#### TODO
Сейчас при сборке `npm run build` скорей всего будут ошибки из-аз typescript, но проект все равно соберется в папку build и будет работать.  
Надо бы исправить ошибки при сборке.
