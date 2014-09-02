var fs = require('fs')
var format = require('util').format
var path = require('path')

var log = fs.createWriteStream(path.join(__dirname, 'log'));
var onError = function (e) {
  var msg = 'intellijs/uncaughtException %s\nArguments: %s\nType: %s\nStack: %s\n'
  log.write(format(msg, e.message, e.arguments, e.type, e.stack), 'utf-8', function(){
    process.exit(1)
  })
}

process.removeListener('uncaughtException', onError)
process.on('uncaughtException', onError)


Hooks.addKeyboardShortcut('ctrl-cmd-j', function () {
  Recipe.run(require('./src/jump'))
})

Hooks.addKeyboardShortcut('ctrl-cmd-.', function () {
  Recipe.run(require('./src/rename'))
})