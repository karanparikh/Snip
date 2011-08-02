var express = require('express'),
    redis = require('redis'),
    sys = require('sys'),
    cp = require('child_process'),
    _ = require('./deps/underscore.js')._;

var app = express.createServer();

app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
app.use(express.bodyParser());

var languages =
 [["apacheconf", "ApacheConf"],
  ["applescript", "AppleScript"],
  ["as", "ActionScript"],
  ["as3", "ActionScript 3"],
  ["basemake", "Makefile"],
  ["bash", "Bash"],
  ["bat", "Batchfile"],
  ["bbcode", "BBCode"],
  ["befunge", "Befunge"],
  ["boo", "Boo"],
  ["brainfuck", "Brainfuck"],
  ["c", "C"],
  ["c-objdump", "c-objdump"],
  ["cheetah", "Cheetah"],
  ["clojure", "Clojure"],
  ["common-lisp", "Common Lisp"],
  ["control", "Debian Control file"],
  ["cpp", "C++"],
  ["cpp-objdump", "cpp-objdump"],
  ["csharp", "C#"],
  ["css", "CSS"],
  ["css+django", "CSS+Django/Jinja"],
  ["css+erb", "CSS+Ruby"],
  ["css+genshitext", "CSS+Genshi Text"],
  ["css+mako", "CSS+Mako"],
  ["css+mako", "CSS+Mako"],
  ["css+myghty", "CSS+Myghty"],
  ["css+php", "CSS+PHP"],
  ["css+smarty", "CSS+Smarty"],
  ["d", "D"],
  ["d-objdump", "d-objdump"],
  ["delphi", "Delphi"],
  ["diff", "Diff"],
  ["django", "Django/Jinja"],
  ["dpatch", "Darcs Patch"],
  ["dylan", "Dylan"],
  ["erb", "ERB"],
  ["erlang", "Erlang"],
  ["fortran", "Fortran"],
  ["gas", "GAS"],
  ["genshi", "Genshi"],
  ["genshitext", "Genshi Text"],
  ["gnuplot", "Gnuplot"],
  ["groff", "Groff"],
  ["haskell", "Haskell"],
  ["html", "HTML"],
  ["html+cheetah", "HTML+Cheetah"],
  ["html+django", "HTML+Django/Jinja"],
  ["html+genshi", "HTML+Genshi"],
  ["html+mako", "HTML+Mako"],
  ["html+mako", "HTML+Mako"],
  ["html+myghty", "HTML+Myghty"],
  ["html+php", "HTML+PHP"],
  ["html+smarty", "HTML+Smarty"],
  ["ini", "INI"],
  ["io", "Io"],
  ["irc", "IRC logs"],
  ["java", "Java"],
  ["js", "JavaScript"],
  ["js+cheetah", "JavaScript+Cheetah"],
  ["js+django", "JavaScript+Django/Jinja"],
  ["js+erb", "JavaScript+Ruby"],
  ["js+genshitext", "JavaScript+Genshi Text"],
  ["js+mako", "JavaScript+Mako"],
  ["js+mako", "JavaScript+Mako"],
  ["js+myghty", "JavaScript+Myghty"],
  ["js+php", "JavaScript+PHP"],
  ["js+smarty", "JavaScript+Smarty"],
  ["jsp", "Java Server Page"],
  ["lhs", "Literate Haskell"],
  ["lighty", "Lighttpd configuration file"],
  ["llvm", "LLVM"],
  ["logtalk", "Logtalk"],
  ["lua", "Lua"],
  ["make", "Makefile"],
  ["mako", "Mako"],
  ["mako", "Mako"],
  ["matlab", "Matlab"],
  ["matlabsession", "Matlab session"],
  ["minid", "MiniD"],
  ["moocode", "MOOCode"],
  ["mupad", "MuPAD"],
  ["myghty", "Myghty"],
  ["mysql", "MySQL"],
  ["nasm", "NASM"],
  ["nginx", "Nginx configuration file"],
  ["numpy", "NumPy"],
  ["objdump", "objdump"],
  ["objective-c", "Objective-C"],
  ["ocaml", "OCaml"],
  ["perl", "Perl"],
  ["php", "PHP"],
  ["pot", "Gettext Catalog"],
  ["pov", "POVRay"],
  ["py3tb", "Python 3.0 Traceback"],
  ["pycon", "Python console session"],
  ["pytb", "Python Traceback"],
  ["python", "Python"],
  ["python3", "Python 3"],
  ["raw", "Raw token data"],
  ["rb", "Ruby"],
  ["rbcon", "Ruby irb session"],
  ["redcode", "Redcode"],
  ["rhtml", "RHTML"],
  ["rst", "reStructuredText"],
  ["scala", "Scala"],
  ["scheme", "Scheme"],
  ["smalltalk", "Smalltalk"],
  ["smarty", "Smarty"],
  ["sourceslist", "Debian Sourcelist"],
  ["splus", "S"],
  ["sql", "SQL"],
  ["sqlite3", "sqlite3con"],
  ["squidconf", "SquidConf"],
  ["tcl", "Tcl"],
  ["tcsh", "Tcsh"],
  ["tex", "TeX"],
  ["text", "Text only"],
  ["trac-wiki", "MoinMoin/Trac Wiki markup"],
  ["vb.net", "VB.net"],
  ["vim", "VimL"],
  ["xml", "XML"],
  ["xml+cheetah", "XML+Cheetah"],
  ["xml+django", "XML+Django/Jinja"],
  ["xml+erb", "XML+Ruby"],
  ["xml+mako", "XML+Mako"],
  ["xml+mako", "XML+Mako"],
  ["xml+myghty", "XML+Myghty"],
  ["xml+php", "XML+PHP"],
  ["xml+smarty", "XML+Smarty"],
  ["xslt", "XSLT"],
  ["yaml", "YAML"]];

var genLanguageMap = function() {
    var result = {};
    for (var i in languages){
        result[languages[i][0]] = languages[i][1];
    }
    return result;
}

var language_map= genLanguageMap();

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
        
    });
});
