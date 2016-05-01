# Seasonvar API
------------
[![npm package](https://nodei.co/npm/seasonvar-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/seasonvar-api/)



Ответ возвращается в формате JSON.<br/><br/>Обработчик требует наличия двух обязательных параметров:<br/>1. **key** - ключ авторизации, уникальный для каждого пользователя<br/>2. **command** - название команды


## Установка

    npm install --save seasonvar-api


## Примеры использования

```js
const seasonvar = require('seasonvar-api');
const SA = new seasonvar({
    key: 'api_key'
});
```

**Список команд (method):**<br/><br/>

Cписок всех сериалов<br/>

```js
// параметры в настройках не являются обязательными
var options = {
    country: ['сша', 'россия'], //Список стран
    genre: ['анимационные', 'комедия'], // Список жанров
    locale: foreign, // Два вида - domestic(отечественные), foreign(иностранные)
    
    sort: { // Принимает два параметра: order и method
    
        /**
            -kinopoisk  - сортировка по оценкам кинопоиска
            -imdb       - сортировка по оценкам imdb
            -popular    - сортировка по популярным сериалам
            -year       - сортировка по году
        */
        order: 'year',
        method: 'ASC' // порядок сортировки (ASC | DESC)
    },
    
    lastSeasonInfo: false, // Дополнительная информация к последнему сезону (По умолчанию - false)
    letter: 'a' // по букве (или части слова, начиная с начала)
};
SA.getSerialList(options, function(err, list){
    ...
});
```

<br/><br/>
Информацию по указанному сезону<br/>

```js
var season_id = 1; // Обязательный параметр (id запрашиваемого сезона)
SA.getSeason(season_id, function(err, data){
    ...
});
```

<br/><br/>
Поиск фильма(ов)<br/>

```js
var options = {
    query: 'ваш запрос', // обязательный параметр
    country: ['сша', 'россия'], //Список стран (необязательный параметр)
    genre: ['анимационные', 'комедия'], // Список жанров (необязательный параметр)
};
SA.search(options, function(err, list){
    ...
});
```

<br/><br/>
Список последних обновлений на сайте<br/>

```js
var options = {
    day_count: 2, //Количество дней, по умолчанию выводит данные за последние 7 дней (необязательный параметр)
    seasonInfo: false // Дополнительная информация к последнему сезону. По умолчанию - false. (необязательный параметр)
};
SA.getUpdateList(options, function(err, list){
    ...
});
```

<br/><br/>
Список всех жанров<br/>

```js
SA.getGenreList(function(err, list){
    ...
});
```

<br/><br/>
Список всех стран<br/>

```js
SA.getCountryList(function(err, list){
    ...
});
```

<br/><br/>
Список всех сезонов относящихся к сериалу по id или по названию сериала<br/>

```js
// Важно: в одном запросе можно использовать только один параметр.
var options = {
    id (int) - поиск по id сериала
    name (string) - по имени сериала
    letter (string) - по букве (или части слова, начиная с начала)
};
SA.getCountryList(options, function(err, list){
    ...
});
```

<br/><br/>

## License

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2016 Oleg Bogdanov