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

    constructor(opts = {key: ''}){
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
     * Список последних обновлений на сайте. По умолчанию выводит данные за последние 7 дней.
     * @param day_count - Количество дней
     * @param seasonInfo - Дополнительная информация к последнему сезону. По умолчанию - false
     */
    getUpdateList(params, callback){
        params.command = 'getUpdateList';

        params.day_count = params.day_count ? params.day_count : 7;
        params.seasonInfo = params.seasonInfo ? params.seasonInfo : false;


        this.send(params, callback);
    }

    /**
     * Cписок всех жанров
     */
    getGenreList(callback){
        this.send({command: 'getGenreList'}, callback);
    }

    /**
     * Cписок всех стран
     */
    getCountryList(callback){
        this.send({command: 'getCountryList'}, callback);
    }

    /**
     * Cписок всех сезонов относящихся к сериалу по id или по названию сериала
     * @param param
     *      id (int) - поиск по id сериала
     *      name (string) - по имени сериала
     *      letter (string) - по букве (или части слова, начиная с начала)
     *
     *  Важно: в одном запросе можно использовать только один параметр.
     */
    getSeasonList(param = {}, callback){
        param.command = 'getSeasonList';
        this.send(param, callback);
    }



    send(params, callback){
        params.key = this.KEY;

        var self = this;

        request.post({
            url: this.API_URL,
            qs: params,
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
