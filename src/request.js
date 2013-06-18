var interpolate = require('util').interpolate,
    request = require('request'),
    tern

request.get('http://127.0.0.1:8542/ping', function (e, res, body) {
  if(e) return tern = require('ternproxy/proxy')
})

module.exports = function (type, doc, pos, callback) {
  var project_id = MainWindow.nid.substring(MainWindow.nid.lastIndexOf('@') + 1)
  
  module.exports.definition({
    project_id: project_id,
    cursor_position: pos,
    sending_full_content: 'true',
    path: doc.path(),
    FILE: doc.text
  }, callback)
}

module.exports.definition = function (body, callback) {
  if(tern) return request.post('http://127.0.0.1:8542/definition', {form: body}, function (e, res, body) {
    if(e) return callback(interpolate('intellijs/definition: ERROR %j', e))
    body = JSON.parse(body)
    if(res.statusCode !== 200) return callback('intellijs/definition: NO 200')
    if(!body.file) return callback('intellijs/definition: NO FILE')
    callback(null, body)
  })
  
  var workspace = tern.workspace.find(body)
  if(!workspace) return callback('intellijs/definition: NO WORKSPACE')
  
  workspace.tern.request({
    query: {
      type: 'definition',
      end: Number(body.cursor_position),
      file: '#0'
    }, files: proxy.file(body)
  }, function () {
    console.log(arguments);
  })
}