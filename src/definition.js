var request = require('request')

module.exports = function (r) {
  var cursor_position = r.selection.min()
  var doc = Document.current()
  
  request.post('http://127.0.0.1:8542/definition', {form: {
    cursor_position: cursor_position,
    sending_full_content: 'true',
    path: doc.path(),
    FILE: doc.text
  }}, function (e, res, body) {
    if(e) return console.log('intellijs/definition: ERROR %j', e)
    if(res.statusCode !== 200) return console.log('intellijs/definition: NO 200')
    body = JSON.parse(body)
    console.log(body);
    if(!body.file) return console.log('intellijs/definition: NO FILE')
    var range = new Range(body.start, body.end - body.start)
    if(body.file === doc.path()) return Editor.current().setSelection(range)
    var parent = MainWindow.current()
    Document.open(body.file, parent, function (document) {
      Editor.current().setSelection(range)
    })
  })
}

