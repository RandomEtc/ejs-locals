'use strict';

const express = require('express');
const request = require('supertest');
const engine = require('../');

var app = express();
app.set('views', __dirname + '/fixtures');
app.engine('ejs', engine);

// this is not the default behavior, but you can set this
// if you want to load `layout.ejs` as the default layout
// (this was the default in Express 2.0 so it's handy for
// quick ports and upgrades)
app.locals._layoutFile = true;

app.locals.hello = 'there';

app.get('/',function(req, res) {
  res.render('index.ejs');
});

app.get('/blog',function(req, res) {
  res.render('blog/home.ejs', {
    _layoutFile: false,
    user: { name: 'Tom' },
    posts: [
      {
        text: '1',
        comments: [ { text: '1.1' }, { text: '1.2' } ]
      },
      {
        text: '2',
        comments: [ { text: '2.1' }, { text: '2.2' }, { text: '2.3' } ]
      }
    ]
  });
});

app.get('/no-layout',function(req,res){
  res.render('index.ejs',{_layoutFile:false});
});

app.get('/res-locals',function(req,res){
  res.render('locals.ejs',{hello:'here'});
});

app.get('/app-locals',function(req,res){
  res.render('locals.ejs');
});

app.get('/mobile',function(req,res){
  res.render('index.ejs',{_layoutFile:'mobile'});
});

app.get('/mobile.ejs',function(req,res){
  res.render('index.ejs',{_layoutFile:'mobile.ejs'});
});

app.get('/collection/_entry',function(req,res){
  res.render('collection.ejs',{name: 'entry', list:[{name:'one'},{name:'two'}]});
});

app.get('/collection/thing',function(req,res){
  res.render('collection.ejs',{name: 'thing', list:[{name:'one'},{name:'two'}]});
});

app.get('/collection/thing-path',function(req,res){
  res.render('collection.ejs',{name: 'path/to/thing', list:[{name:'one'},{name:'two'}]});
});

app.get('/with-layout',function(req,res){
  res.render('with-layout.ejs');
});

app.get('/with-layout-override',function(req,res){
  res.render('with-layout.ejs',{_layoutFile:false});
});

app.get('/with-include-here',function(req,res){
  res.render('with-include.ejs',{_layoutFile:false, hello:'here'});
});

app.get('/with-include-chain',function(req,res){
  res.render('with-include-chain.ejs',{_layoutFile:false, hello:'chain'});
});

app.get('/with-include-chain-subfolder',function(req,res){
  res.render('with-include-chain-subfolder.ejs',{_layoutFile:false, hello:'subchain'});
});

app.get('/with-two-includes',function(req,res){
  res.render('with-two-includes.ejs',{_layoutFile:false, hello:'hello'});
});

app.get('/with-absolute-include',function(req,res){
  res.render('with-absolute-include.ejs',{_layoutFile:false, hello:'hello'});
});

app.get('/with-absolute-sub-include',function(req,res){
  res.render('with-absolute-sub-include.ejs',{_layoutFile:false, hello:'hello'});
});

app.get('/with-include-there',function(req,res){
  res.render('with-include.ejs',{_layoutFile:false});
});

app.get('/deep-inheritance',function(req,res){
  res.render('inherit-grandchild.ejs');
});

app.get('/deep-inheritance-blocks',function(req,res){
  res.render('inherit-grandchild-blocks.ejs');
});

app.get('/subfolder/subitem',function(req,res){
  res.render('subfolder/subitem.ejs');
});

app.get('/subfolder/subitem-with-layout',function(req,res){
  res.render('subfolder/subitem-with-layout.ejs');
});

app.get('/non-existent-partial',function(req,res){
  res.render('non-existent-partial.ejs');
});

app.get('/with-blocks', function(req, res) {
  res.render('with-blocks.ejs', {_layoutFile:false});
});

app.get('/partial-relative-to-app-views', function(req,res) {
  res.render('path/to/relative-partial.ejs');
});

app.get('/deep-partial-relative-to-app-views', function(req,res) {
  res.render('path/to/deep-partial.ejs', {hello: 'Hi'});
});

// override the default error handler so it doesn't log to console:
app.use(function(err,req,res, next) {
  console.log(err.stack);
  res.status(500).send(err.stack);
});

describe('app',function(){

  describe('GET /',function(){
    it('should render with default layout.ejs',function(done){
      request(app)
        .get('/')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /blog',function(){
    xit('should render all the fiddly partials',function(done){
      request(app)
        .get('/blog')
        .expect(200)
        .expect('<h1>Tom</h1><ul><li>1<ul><li>1.1</li><li>1.2</li></ul></li><li>2<ul><li>2.1</li><li>2.2</li><li>2.3</li></ul></li></ul>', done);
    });
  });

  describe('GET /no-layout',function(){
    it('should render without layout',function(done){
      request(app)
        .get('/no-layout')
        .expect(200)
        .expect('<h1>Index</h1>', done);
    });
  });

  describe('GET /res-locals',function(){
    it('should render "here"',function(done){
      request(app)
        .get('/res-locals')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>here</h1></body></html>', done);
    });
  });

  describe('GET /app-locals',function(){
    it('should render "there"',function(done){
      request(app)
        .get('/app-locals')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>there</h1></body></html>', done);
    });
  });

  describe('GET /mobile',function(){
    it('should render with mobile.ejs as layout',function(done){
      request(app)
        .get('/mobile')
        .expect(200)
        .expect('<html><head><title>ejs-locals mobile</title></head><body><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /mobile.ejs',function(){
    it('should render with mobile.ejs as layout',function(done){
      request(app)
        .get('/mobile.ejs')
        .expect(200)
        .expect('<html><head><title>ejs-locals mobile</title></head><body><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /collection/_entry',function(){
    xit('should render _entry.ejs for every item with layout.ejs as layout',function(done){
      request(app)
        .get('/collection/_entry')
        .expect(200)
        .end(function(err, res) {

          res.body.should.equal('<html><head><title>ejs-locals</title></head><body><ul><li>one</li><li>two</li></ul></body></html>');
          done();
        });
    });
  });

  describe('GET /collection/thing-path',function(){
    xit('should render thing/index.ejs for every item with layout.ejs as layout',function(done){
      request(app)
        .get('/collection/thing-path')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><ul><li>one</li><li>two</li></ul></body></html>', done);
    });
  });

  describe('GET /collection/thing',function(){
    xit('should render thing/index.ejs for every item with layout.ejs as layout',function(done){
      request(app)
        .get('/collection/thing')
        .expect(200)
        .end(function(err, res) {

          res.body.should.equal('<html><head><title>ejs-locals</title></head><body><ul><li>one</li><li>two</li></ul></body></html>');
          done();
        });
    });
  });

  describe('GET /with-layout',function(){
    it('should use layout.ejs when rendering with-layout.ejs',function(done){
      request(app)
        .get('/with-layout')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /with-layout-override',function(){
    it('should use layout.ejs when rendering with-layout.ejs, even if layout=false in options',function(done){
      request(app)
        .get('/with-layout-override')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /with-include-here',function(){
    it('should include and interpolate locals.ejs when rendering with-include.ejs',function(done){
      request(app)
        .get('/with-include-here')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>here</h1></body></html>', done);
    });
  });

  describe('GET /with-include-there',function(){
    it('should include and interpolate locals.ejs when rendering with-include.ejs',function(done){
      request(app)
        .get('/with-include-there')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>there</h1></body></html>', done);
    });
  });

  describe('GET /with-include-chain',function(){
    it('should include and interpolate include-chain-2.ejs when rendering with-include-chain.ejs',function(done){
      request(app)
        .get('/with-include-chain')
        .expect(200)
        .expect('<html><head><title>ejs-locals-include</title></head><body><h1>chain</h1></body></html>', done);
    });
  });

  describe('GET /with-include-chain-subfolder',function(){
    it('should include and interpolate parent-include-chain.ejs when rendering with-include-chain-subfolder.ejs',function(done){
      request(app)
        .get('/with-include-chain-subfolder')
        .expect(200)
        .expect('<html><head><title>ejs-locals-include-sub</title></head><body><h1>subchain</h1></body></html>', done);
    });
  });

  describe('GET /with-two-includes',function(){
    it('should include both files and interpolate the same data',function(done){
      request(app)
        .get('/with-two-includes')
        .expect(200)
        .expect('<html><head><title>ejs-locals-two-includes</title></head><body><h1>hello</h1><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /with-absolute-include',function(){
    xit('should include locals.ejs and interpolate the data correctly',function(done){
      request(app)
        .get('/with-absolute-include')
        .expect(200)
        .expect('<html><head><title>ejs-locals-abs</title></head><body><h1>hello</h1></body></html>', done);
    });
  });

  describe('GET /with-absolute-sub-include',function(){
    xit('should include subfolder/sublocals.ejs and include subfolder/subitem.ejs correctly',function(done){
      request(app)
        .get('/with-absolute-sub-include')
        .expect(200)
        .expect('<html><head><title>ejs-locals-abs-sub</title></head><body><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /deep-inheritance',function(){
    it('should recurse and keep applying layouts until done',function(done){
      request(app)
        .get('/deep-inheritance')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><i>I am grandchild content.</i><b>I am child content.</b><u>I am parent content.</u></body></html>', done);
    });
  });

  describe('GET /subfolder/subitem',function(){
    it('should render subfolder/subitem.ejs and still use layout.ejs',function(done){
      request(app)
        .get('/subfolder/subitem')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /subfolder/subitem-with-layout',function(){
    it('should render subitem-with-layout.ejs using sub-layout.ejs',function(done){
      request(app)
        .get('/subfolder/subitem-with-layout')
        .expect(200)
        .expect('<html><head><title>ejs-locals sub-layout</title></head><body><h1>Index</h1>\n</body></html>\n', done);
    });
  });

  describe('GET /non-existent-partial',function(){
    it('should send 500 and error saying a partial was not found',function(done){
      request(app)
        .get('/non-existent-partial')
        .expect(500)
        .expect(/Could not find partial 'non-existent'/, done);
    });
  });

  describe('GET /with-blocks',function(){
    it('should arrange blocks into layout-with-blocks.ejs when rendering with-blocks.ejs',function(done){
      request(app)
        .get('/with-blocks')
        .expect(200)
        .expect('<li><a href="hello.html">there</a></li><p>What\'s up?</p>© 2012', done);
    });
  });

  describe('GET /partial-relative-to-app-views',function(){
    it('should render a partial relative to app views',function(done){
      request(app)
        .get('/partial-relative-to-app-views')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><h1>Index</h1></body></html>', done);
    });
  });

  describe('GET /deep-partial-relative-to-app-views',function(){
    it('should render a partial relative to app views nested within another partial',function(done){
      request(app)
        .get('/deep-partial-relative-to-app-views')
        .expect(200)
        .expect('<html><head><title>ejs-locals</title></head><body><div><section><h1>Hi</h1></section></div></body></html>', done);
    });
  });
});
