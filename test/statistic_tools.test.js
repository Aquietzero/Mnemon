var st = require('../lib/statistic_tools');

describe('StatisticTools', function () {
    describe('StatisticTools#distanceMap', function () {
        it('should generate a distance map correctly.', function (done) {
            var arr = [5, 3, 1, 2, 2, 1, 4, 6];
            var distMap = st.distanceMap(arr);

            distMap.length.should.equal(arr.length);
            distMap[0].should.eql([2, 4, 3, 3, 4, 1, 1]);
            distMap[1].should.eql([2, 1, 1, 2, 1, 3]);
            distMap[2].should.eql([1, 1, 0, 3, 5]);
            distMap[3].should.eql([0, 1, 2, 4]);
            distMap[4].should.eql([1, 2, 4]);
            distMap[5].should.eql([3, 5]);
            distMap[6].should.eql([2]);
            distMap[7].should.eql([]);
            done();
        });
    });

    describe('StatisticTools#allHorizontalMovement', function (done) {
        it('should be able to search all horizontal movements.', function (done) {
            var arr = [1, 1.1, 1.21, 1.23, 1.22, 1.19, 4, 6, 12, 12.6, 11.7, 11.8, 12.2, 5];
            //                 -----------------------       ---------------------------
            //                 2                     5       8                        12

            var hms = st.allHorizontalMovement(arr, 0.05, 3);
            hms.length.should.equal(2);
            hms[0].from.should.equal(2);
            hms[0].to.should.equal(5);
            hms[1].from.should.equal(8);
            hms[1].to.should.equal(12);
            done();
        });
    });
});

