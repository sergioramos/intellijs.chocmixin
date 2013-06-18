var tern = require('ternproxy/src/proxy'),
    interpolate = require('util').format,
    request = require('request'),
    listening = false
    

request.get('http://127.0.0.1:8542/ping', function (e, res, body) {
  if(!e && res.statusCode === 200) listening = true
})

module.exports = function (type, doc, pos, callback) {
  var nid = MainWindow.current().nid
  var project_id = nid.substring(nid.lastIndexOf('@') + 1)
  
  module.exports[type]({
    project_id: project_id,
    cursor_position: pos,
    sending_full_content: 'true',
    path: doc.path(),
    FILE: doc.text
  }, callback)
}

module.exports.definition = function (body, callback) {
  var process = function (e, body, res) {
    if(e) return callback(interpolate('intellijs/definition: ERROR %j', e))
    if(typeof body === 'string') body = JSON.parse(body)
    if(res && res.statusCode !== 200) return callback('intellijs/definition: NO 200')
    if(!body.file) return callback('intellijs/definition: NO FILE')
    callback(null, body)
  }
  
  if(listening) return request.post('http://127.0.0.1:8542/definition', {form: body}, function (e, res, body) {
    process(e, body, res)
  })
  
  var workspace = tern.workspace.find(body)
  if(!workspace) return callback('intellijs/definition: NO WORKSPACE')
  
  workspace.tern.request({
    query: {
      type: 'definition',
      end: Number(body.cursor_position),
      file: '#0'
    }, files: tern.file(body)
  }, process)
}

module.exports.type = function (body, callback) {
  var process = function (e, body, res) {
    if(e) return callback(interpolate('intellijs/type: ERROR %j', e))
    if(typeof body === 'string') body = JSON.parse(body)
    callback(null, body)
  }
  
  if(listening) return request.post('http://127.0.0.1:8542/type', {form: body}, function (e, res, body) {
    process(e, body, res)
  })
  
  var workspace = tern.workspace.find(body)
  if(!workspace) return callback('intellijs/type: NO WORKSPACE')
  
  workspace.tern.request({
    query: {
      type: 'type',
      end: Number(body.cursor_position),
      file: '#0'
    }, files: tern.file(body)
  }, process)
}