### lighthouse-influxdb-grafana

Проект создан для измерения скорости сайтов.

Общий схема работы:
1. express nodejs ловит заявки на замеры сайта
2. делается много прогонов сайта, используя lighthouse
3. результаты сохраняются в incluxdb
4. посмотреть результаты можно через grafana

[lighthouse configuration](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md)
