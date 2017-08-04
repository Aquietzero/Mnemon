let _ = require('lodash');
let async = require('async');
let request = require('request');
let cheerio = require('cheerio');


let search = (word, cb) => {
    let language = determineLanguage(word);

    if (language == 'jp') {
        searchJapanese(word, cb);
    } else {
        searchEnglish(word, cb);
    }
}

// TODO determination of other languages.
let determineLanguage = (word) => {
    if (word.match(/\w/g)) return 'en';
    return 'jp';
}

let searchJapanese = (word, cb) => {
    if (!word) return cb();

    let url = 'http://dict.hjenglish.com/jp/jc/' + word;

    let options = {
        url: encodeURI(url),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    }

    console.log(options);
    request(options, (err, res, body) => {
        let $ = cheerio.load(body);

        let explains = [];
        $('.jp_word_comment').each((i, el) => {
            let $el = $(el);

            let content = $el.find('.word_ext_con').text();
            let tone = $el.find('span[title="音调"]').text();
            let kana = $el.find('span[title="假名"]').text();
            content = format(content);

            explains.push({
                kana: kana,
                tone: tone,
                content: content,
            });
        });

        let result = {
            word: word,
            explains: explains,
        }
        console.log(explains);

        cb(null, result);
    });
}

let searchEnglish = (word, cb) => {
    if (!word) return cb();

    let url = 'http://dict.hjenglish.com/w/' + word;

    let options = {
        url: encodeURI(url),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    }

    console.log(options);
    request(options, (err, res, body) => {
        let $ = cheerio.load(body);

        let explains = [];
        // by type.
        $('div.tip_content_item').each((i, el) => {
            let $el = $(el);

            let phonetic = $el.find('.xd-word-phonogram').text();
            let type = $el.attr('title');
            let meanings = [];

            $el.next().find('li.flag').each((j, meaningEl) => {
                let $meaningEl = $(meaningEl);
                let meaning = $meaningEl.find('.word_comment').text();
                let sentences = [];
                $meaningEl.find('.pnl_cmd_sent .cmd_sent').each((m, sentEl) => {
                    sentences.push({
                        en: $(sentEl).find('.cmd_sent_ee').text().trim(),
                        cn: $(sentEl).find('.cmd_sent_cn').text().trim(),
                    });
                });

                meanings.push({
                    meaning,
                    sentences,
                });
            });

            explains.push({
                phonetic,
                type,
                meanings,
            });
        });

        let result = {
            word: word,
            explains: explains,
        }
        console.log(JSON.stringify(explains, 0, 2));

        cb(null, result);
    });
}

let format = (exp) => {
    exp = exp.trim();
    let lineRe = /\d+\.\s+/g

    let lineBreaks = exp.match(lineRe);
    _.each(lineBreaks, function (lineBreak) {
        exp = exp.replace(lineBreak, '\r\r' + lineBreak);
    });

    exp = exp.replace('更多详细释义帮小D改进本词', '');
    return exp;
}

// search('まっしぐら', function (err) {
//     if (err) console.log(err);
//     console.log('done.');
//     process.exit();
// });

module.exports = search;

