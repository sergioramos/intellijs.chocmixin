Hooks.addKeyboardShortcut('ctrl-cmd-j', function () {
  Recipe.run(require('./src/jump'))
})

Hooks.addKeyboardShortcut('ctrl-cmd-.', function () {
  Recipe.run(require('./src/rename'))
})

//Hooks.addKeyboardShortcut('ctrl-cmd-o', function () {
//  Recipe.run(require('./src/occurrences'))
//})

var onError = function (e) {
  console.log('intellijs/uncaughtException %s\nArguments: %s\nType: %s\nStack: %s', e.message, e.arguments, e.type, e.stack)
}

process.removeListener('uncaughtException', onError)
process.on('uncaughtException', onError)