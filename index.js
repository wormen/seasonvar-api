/**
 Copyright © Oleg Bogdanov
 Developer: Oleg Bogdanov
 */

"use strict";

var request = require("request"),
    VError = require("VError");

const typeErr = {
    noKey: 'Не указан API ключ',
    noIP: 'Для вашего IP адреса доступ запрещен'
};


class API{

    constructor(opts){
        this.API_URL = 'http://api.seasonvar.ru/';

        if(!opts.key || opts.key.length == 0){
            this.setError(typeErr.noKey);
            return;
        }

        this.KEY = opts.key;
    }


    Error(err){
        if(err == null) return;
        console.error(err);
    }

    /**
     * Конвертирование строки в объект ошибки
     * @param str
     * @returns {VError}
     * @constructor
     */
    setError(str){
        return new VError(str);
    }


    /**
     * Cписок всех сериалов
     * @param params
     * @param callback
     */
    getSerialList(params, callback){
        params.command = 'getSerialList';
        this.send(params, callback);
    }


    /**
     * Информацию по указанному сезону
     * @param id
     * @param callback
     */
    getSeason(id, callback){
        var params = {
            season_id: id,
            command: 'getSeason'
        };
        this.send(params, callback);
    }

    /**
     * Поиск фильма(ов)
     * @param params
     *          query - запрос (обязатльный параметр)
     *          country - массив стран
     *          genre - массив жанров
     * @param callback
     */
    search(params, callback){
        params.command = 'search';
        this.send(params, callback);
    }

    
    /**
     * Список последних обновлений на сайте. По умолчанию выводит данные за последние 7 дней.
     * @param params
     *          day_count - Количество дней
     *          seasonInfo - Дополнительная информация к последнему сезону. По умолчанию - false
     * @param callback
     */
    getUpdateList(params, callback){
        params.command = 'getUpdateList';

        params.day_count = params.day_count ? params.day_count : 7;
        params.seasonInfo = params.seasonInfo ? params.seasonInfo : false;


        this.send(params, (err, list)=>{
            if(err)
                callback(err, null);

            else{

                for(let i in list){
                    list[i].id = Number(list[i].id);
                    list[i].year = Number(list[i].year);
                    list[i].create_time = Number(list[i].create_time);

                    if(list[i].season)
                        list[i].season = Number(list[i].season);
                }

                callback(null, list);
            }
        });
    }

    /**
     * Cписок всех жанров
     * @param callback
     */
    getGenreList(callback){
        this.send({command: 'getGenreList'}, (err, list)=>{
            if(err)
                callback(err, null);
            else{
                var arr = [];

                for(let i in list)
                    arr.push({
                        id: Number(i),
                        name: ucFirst(list[i])
                    });

                callback(null, arr);
            }
        });
    }

    /**
     * Cписок всех стран
     * @param callback
     */
    getCountryList(callback){
        this.send({command: 'getCountryList'}, (err, list)=>{
            if(err)
                callback(err, null);
            else{
                var arr = [];

                for(let i in list)
                    arr.push({
                        id: Number(i),
                        name: list[i]
                    });

                callback(null, arr);
            }
        });
    }

    /**
     * Cписок всех сезонов относящихся к сериалу по id или по названию сериала
     * @param param
     *      id (int) - поиск по id сериала
     *      name (string) - по имени сериала
     *      letter (string) - по букве (или части слова, начиная с начала)
     *
     *  Важно: в одном запросе можно использовать только один параметр.
     *
     *  @param callback
     */
    getSeasonList(param, callback){
        param.command = 'getSeasonList';
        this.send(param, callback);
    }


    /**
     * Отправляем запрос в API
     * @param params
     * @param callback
     */
    send(params, callback){
        params.key = this.KEY;

        var self = this;
        
        
        request.post({
            url: this.API_URL,
            form: params,
            json:true
        }, (err, response, body)=> {
            if(err){
                self.Error(err);
                callback(err, body);
            }

            else{

                if(body.error)
                    callback(self.setError(body.error), null);
                else
                    callback(err, body);
            }
        });
    }
}

module.exports = API;



function ucFirst(str) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}