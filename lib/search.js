var _ = require('lodash');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');


var search = function (word, cb) {
    if (!word) return cb();

    var url = 'http://dict.hjenglish.com/jp/jc/' + word;

    var options = {
        url: encodeURI(url),
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    }

    request(options, function (err, res, body) {
        var $ = cheerio.load(body);

        var explains = [];
        $('.jp_word_comment').each(function (i, el) {
            var $el = $(el);

            content = $el.find('.word_ext_con').text();
            tone = $el.find('span[title="音调"]').text();
            kana = $el.find('span[title="假名"]').text();
            content = format(content);

            explains.push({
                kana: kana,
                tone: tone,
                content: content,
            });
        });

        var result = {
            word: word,
            explains: explains,
        }
        console.log(explains);

        cb(null, result);
    });
}

var format = function (exp) {
    exp = exp.trim();
    var lineRe = /\d+\.\s+/g

    var lineBreaks = exp.match(lineRe);
    _.each(lineBreaks, function (lineBreak) {
        exp = exp.replace(lineBreak, '\n' + lineBreak);
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

