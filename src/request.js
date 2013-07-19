var interpolate = require('util').format,
    request = require('request')
    
module.exports = function (type, doc, pos, callback) {
  var nid = MainWindow.current().nid
  var project_id = nid.substring(nid.lastIndexOf('@') + 1)
  
  module.exports[type]({
    project_id: project_id,
    cursor_position: pos,
    sending_full_content: 'true',
    path: doc.path(),
    FILE: doc.text,
    new_name: doc.new_name,
    file: doc.path()
  }, callback)
}

module.exports.definition = function (body, callback) {
  var url = 'http://127.0.0.1:8542/definition'
  
  request.post(url, {form: body}, function (e, res, body) {
    if(e) return callback(interpolate('intellijs/definition: ERROR %j', e))
    if(typeof body === 'string') body = JSON.parse(body)
    if(res && res.statusCode !== 200) return callback('intellijs/definition: NO 200')
    if(!body.file) return callback('intellijs/definition: NO FILE')
    callback(null, body)
  })
}

module.exports.type = function (body, callback) {
  var url = 'http://127.0.0.1:8542/type'
  
  request.post(url, {form: body}, function (e, res, body) {
    if(e) return callback(interpolate('intellijs/type: ERROR %j', e))
    if(typeof body === 'string') body = JSON.parse(body)
    callback(null, body)
  })
}

module.exports.rename = function (body, callback) {
  var url = 'http://127.0.0.1:8542/rename'
  
  request.post(url, {form: body}, function (e, res, body) {
    if(e) return callback(interpolate('intellijs/rename: ERROR %j', e))
    console.log(body);
    if(typeof body === 'string') body = JSON.parse(body)
    callback(null, body)
  })
}