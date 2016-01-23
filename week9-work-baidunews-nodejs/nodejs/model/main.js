//定义表结构Model
module.exports = function(db, cb) {
    db.define('newscontrol', {
        newsid: {
            type: 'serial',
            key: true
        },
        newsclass: String,
        newshref: String,
        newstitle: String,
        newstext: String,
        newsimg1: String,
        newsimg2: String,
        newsimg3: String,
        newstype: String,
        addtime: Date,
        newstag: String,
        tagcolor: String
    });
    return cb();
}
