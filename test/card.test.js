const _ = require('lodash');
const async = require('async');
const Model = require('../model');
const {clean} = require('./utils');

let cardJSON = {
    "title" : "限り",
    "sub_title" : "【かぎり】 ②",
    "content" : "1. 限度，终结。（際限。限度。はて。続いた事の終り。最後。仕舞い。）限りのない仕事。/没完没了的工作。人の欲には限りがない。/人的欲望是无止境的。話しだしたら限りがない。/说起来没有完。いちいち数えあげると限りがない。/不胜枚举；一个个数起来就没个完。そんなことを気にしたら限りがない。/那种事介意起来没完。\n\n2. 段落。（続く物の中間に切れ目をつけること。また、その切れ目。区切り。段落。）ちょうど限りがいい。/正好告一个段落。仕事に限りをつける。/把工作做到一个段落。ひとまずこれで限りをつけよう。/姑且到此为止吧。",
    "memory_aids" : "鍵、钥匙是用来锁住某些东西的，就是一个限度，一个终结。",
    "connections" : [ ],
    "tags" : [ ],
    "deck" : "零散新单词",
    "explain" : "限度，终结\n段落"
}

describe('Test for card.', () => {
    beforeEach((done) => {
        clean(done);
    });

    describe('Card#generateMD5', () => {
        it('should be able to generate md5 for a card.', (done) => {
            let c = new Model.card(cardJSON);
            c.save((err, _c) => {
                _c.md5.should.equal('3195a09274a9f3f4f9ec00c3d3ebc8ff');
                done();
            });
        });
    });

    describe('Card#sentences', () => {
        it('should be able to generate sentences for a card.', (done) => {
            let c = new Model.card(cardJSON);
            //console.log(c.sentences());
            done();
        });
    });
});
