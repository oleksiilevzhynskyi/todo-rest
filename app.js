var express = require('express'),
    items = require('./routes/items'),
    home = require('./routes/home');
 
var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

app.get('/', home.index);
app.get('/items', items.findAll);
app.post('/items', items.create);
app.get('/items/:id', items.findById);
app.put('/items/:id', items.update);
app.delete('/items/:id', items.destroy);

app.listen(3000);
console.log('Listening on port 3000...');