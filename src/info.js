var request = require('./request'),
    hbs = require('handlebars'),
    path = require('path'),
    fs = require('fs')
    
var template = hbs.compile(fs.readFileSync(path.join(__dirname, '../templates/info.hbs'), 'utf8'))
var css = path.join(__dirname, '../vendor/normalize.css')

module.exports = function (r) {
  var cursor_position = r.selection.min()
  var range = new Range(cursor_position, 1)
  var doc = Document.current()
  
  request('type', doc, cursor_position, function (e, definition) {
    if(e) return console.log(e)

    var win = new Popover(Editor.current(), range)
    win.size = { width: 320, height: 120 }
    win.useDefaultCSS = false
    win.html = definition.html ? definition.html : template(definition)
    win.run()
  })
}