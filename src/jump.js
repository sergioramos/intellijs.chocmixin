var request = require('./request')

module.exports = function (r) {
  var cursor_position = r.selection.min()
  var doc = Document.current()
  
  request('definition', doc, cursor_position, function (e, definition) {
    if(e) return console.log(e)
    
    var range = new Range(definition.start, definition.end - definition.start)
    if(definition.file === doc.path()) return Editor.current().setSelection(range)
    var parent = MainWindow.current()
    
    Document.open(definition.file, parent, function (document) {
      Editor.current().setSelection(range)
    })
  })
}