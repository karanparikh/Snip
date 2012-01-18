var express = require('express'),
    redis = require('redis');

var app = express.createServer();

app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/sh'));

var language_map = {
    'cpp': "C++",
    'java': "Java",
    'js': "Javascript",
    'perl': "Perl",
    'php': "PHP",
    'python': "Python",
    'ruby': "Ruby"
};

app.listen(8080);
console.log("Server started on port 8080");

app.get('/', function(req, res){
    res.render('index', {items: language_map});
});

app.post('/add', function(req, res){
    var code = req.body.code;
    var language = req.body.language;
    var store = {};
    store.code = code;
    store.language = language;
    var redisClient = redis.createClient();
    redisClient.on('connect', function(){
        redisClient.incr("nextid", function(err, id){
            redisClient.hmset("snippet:" + id,
                {"language": store.language, "code": store.code},
                function(){
                    redisClient.quit();
                    var url = "/" + id;
                    res.render('add', {url: url});
                }
            );
        });
    });
});

app.get(/\/(\d+)/, function(req, res){
    var id = req.params[0];
    var redisClient = redis.createClient();
    redisClient.on('connect', function(){
        redisClient.hgetall('snippet:' + id, function(err, data){
            if(!data.code){
                redisClient.quit();
                res.render('404');
                return;
            }

            // replace the '<' and '>' from the code for the sytax highlighter
            data.code = data.code.replace(/\</g, "&lt;");
            data.code = data.code.replace(/\>/g, "&gt;");

            redisClient.quit();

            res.render('display', {code: data.code, language: data.language});
        });
    });
});
