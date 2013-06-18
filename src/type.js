var request = require('request'),
    hbs = require('handlebars'),
    path = require('path'),
    fs = require('fs')
    
var template = hbs.compile(fs.readFileSync(path.join(path.dirname(__filename), '../templates/type.hbs'), 'utf-8'))
var css = path.join(path.dirname(__filename), '../vendor/normalize.css')
var js = path.join(path.dirname(__filename), '../vendor/testes.js')

module.exports = function (r) {
  var cursor_position = r.selection.min()
  var range = new Range(cursor_position, 1)
  var doc = Document.current()
  
  request.post('http://127.0.0.1:8542/type', {form: {
    cursor_position: cursor_position,
    sending_full_content: 'true',
    path: doc.path(),
    FILE: doc.text
  }}, function (e, res, body) {
    if(res.statusCode !== 200) return
    
    var win = new Popover(Editor.current(), range)
    win.size = { width: 320, height: 120 }
    win.useDefaultCSS = false
    
    body = JSON.parse(body)
    body.css = css
    win.html = template(body)
    win.run()
  })
}

