var express = require('express'),
    redis = require('redis');

var app = express.createServer();

app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
app.use(express.bodyParser());
app.use(express.static(__dirname + '/'));

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
    var r = redis.createClient();
    r.on('connect', function(){
        r.incr("nextid", function(err, id){
            r.set("snippet:" + id, JSON.stringify(store), function(){
                r.quit();
                var url = "/" + id;
                res.render('add', {url: url});
            });
        });
    });
});

app.get(/\/(\d+)/, function(req, res){
    var id = req.params[0];
    var r = redis.createClient();
    r.on('connect', function(){
        r.get('snippet:' + id, function(err, data){
            if(!data){
                //TODO render 404 / internal server error
                return;
            }

            var obj = JSON.parse(data.toString());
            var code = obj.code;
            var language = obj.language;

            //replace the '<' and '>' from the code for the sytax highlighter
            code = code.replace(/\</g, "&lt;");
            code = code.replace(/\>/g, "&gt;");

            r.quit();

            res.render('display', {code: code, language: language});
        });
    });
});
