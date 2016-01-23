var restify = require('restify');
var orm = require("orm");
var ipAddr = '192.168.0.111';//设定为服务器的ip
var port = '3000';

//用于各个页面获取相应数据
function respond(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    orm.connect("mysql://root:@localhost/baidunews", function(err, db) {
        if (err) throw err;
        db.load('./model/main', function(err) {
            var News = db.models.newscontrol;
            if (req.params.classname) {
                News.find({
                    newsclass: req.params.classname
                }, 5, function(err, news) {
                    if (err) throw err;
                    res.charSet('utf-8');
                    res.send(news);
                });
            } else if (req.params.id) {
                News.find({
                    newsid: req.params.id
                }, function(err, news) {
                    if (err) throw err;
                    res.charSet('utf-8');
                    res.send(news);
                });
            } else if (req.params.all) {
                News.find({}, function(err, news) {
                    if (err) throw err;
                    res.charSet('utf-8');
                    res.send(news);
                });
            }

        });
    });
}
//用于加载更多数据
function getmore(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var i=req.query.i;
    orm.connect("mysql://root:@localhost/baidunews", function(err, db) {
        if (err) throw err;
        db.load('./model/main', function(err) {
            var News = db.models.newscontrol;
            News.find({
                newsclass: req.params.classname
            }, {
                offset: i * 5
            }, 5,function(err, news) {
                if (err) throw err;
                res.charSet('utf-8');
                res.send(news);
                
            });
        });
    });
}
//用于添加数据
function add(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var newsid = req.query.newsid;
    var newsclass = req.query.newsclass;
    var newshref = req.query.newshref;
    var newstitle = req.query.newstitle;
    var newstext = req.query.newstext;
    var newsimg1 = req.query.newsimg1;
    var newsimg2 = req.query.newsimg2;
    var newsimg3 = req.query.newsimg3;
    var newstype = req.query.newstype;
    var addtime = req.query.addtime;
    var newstag = req.query.newstag;
    var tagcolor = req.query.tagcolor;
    if (newsclass === '') {
        res.send('新闻归属为空，请重新填写');
        return false;
    } else if (newshref === '') {
        res.send('新闻链接为空，请重新填写');
        return false;
    } else if (newstitle === '') {
        res.send('新闻标题为空，请重新填写');
        return false;
    } else if (newstype === '') {
        res.send('没有选择新闻排版模式，请重新填写');
        return false;
    } else if (addtime === '') {
        res.send('请输入时间');
        return false;
    }
    orm.connect("mysql://root:@localhost/baidunews", function(err, db) {
        db.load('./model/main', function(err) {
            var News = db.models.newscontrol;
            News.create([{
                newsid: newsid,
                newsclass: newsclass,
                newshref: newshref,
                newstitle: newstitle,
                newstext: newstext,
                newsimg1: newsimg1,
                newsimg2: newsimg2,
                newsimg3: newsimg3,
                newstype: newstype,
                addtime: addtime,
                newstag: newstag,
                tagcolor: tagcolor
            }], function(err, data) {
                if (err) throw err;
                res.charSet('utf-8');
                res.send('数据添加成功');

            });
        });
    });
}
//用于删除数据
function del(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var delNews = req.query.newsid;
    orm.connect("mysql://root:@localhost/baidunews", function(err, db) {
        db.load('./model/main', function(err) {
            var News = db.models.newscontrol;
            News.find({
                newsid: delNews
            }).remove(function(err) {
                if (err) throw err;
                res.charSet('utf-8');
                res.send('数据删除成功');

            });
        });
    });

}
//用于更新数据
function update(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var newsid = req.query.newsid;
    var newsclass = req.query.newsclass;
    var newshref = req.query.newshref;
    var newstitle = req.query.newstitle;
    var newstext = req.query.newstext;
    var newsimg1 = req.query.newsimg1;
    var newsimg2 = req.query.newsimg2;
    var newsimg3 = req.query.newsimg3;
    var newstype = req.query.newstype;
    var addtime = req.query.addtime;
    var newstag = req.query.newstag;
    var tagcolor = req.query.tagcolor;
    if (newsclass === '') {
        res.send('新闻归属为空，请重新填写');
        return false;
    } else if (newshref === '') {
        res.send('新闻链接为空，请重新填写');
        return false;
    } else if (newstitle === '') {
        res.send('新闻标题为空，请重新填写');
        return false;
    } else if (newstype === '') {
        res.send('没有选择新闻排版模式，请重新填写');
        return false;
    } else if (addtime === '') {
        res.send('请输入时间');
        return false;
    }
    orm.connect("mysql://root:@localhost/baidunews", function(err, db) {
        db.load('./model/main', function(err) {
            var News = db.models.newscontrol;
            News.get(newsid, function(err, news) {
                news.save({
                    newsclass: newsclass,
                    newshref: newshref,
                    newstitle: newstitle,
                    newstext: newstext,
                    newsimg1: newsimg1,
                    newsimg2: newsimg2,
                    newsimg3: newsimg3,
                    newstype: newstype,
                    addtime: addtime,
                    newstag: newstag,
                    tagcolor: tagcolor
                }, function(err) {
                    if (err) throw err;
                    res.charSet('utf-8');
                    res.send('数据修改成功');
                });
            });
        });
    });

}
var server = restify.createServer({
    name: 'myapp'
});
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.get('/newsclass/:classname', respond);
server.get('/morenews/:classname', getmore);
server.get('/newsid/:id', respond);
server.get('/news/:all', respond);
server.get('/newsadd/:add', add);
server.get('/newsup/:update', update);
server.get('/newsdel/:del', del);
// server.head('/hello/:name', respond);
server.listen(port, ipAddr, function() {
    console.log('%s listening at %s', server.name, server.url);
});
