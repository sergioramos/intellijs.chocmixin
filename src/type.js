var request = require('./request'),
    hbs = require('handlebars'),
    path = require('path'),
    fs = require('fs')
    
var template = hbs.compile(fs.readFileSync(path.join(path.dirname(__filename), '../templates/type.hbs'), 'utf-8'))
var css = path.join(path.dirname(__filename), '../vendor/normalize.css')

module.exports = function (r) {
  var cursor_position = r.selection.min()
  var range = new Range(cursor_position, 1)
  var doc = Document.current()
  
  request('type', doc, cursor_position, function (e, definition) {
    if(e) return console.log(e)
    var win = new Popover(Editor.current(), range)
    win.size = { width: 320, height: 120 }
    win.useDefaultCSS = false
    definition.css = css
    win.html = template(definition)
    win.run()
  })
}