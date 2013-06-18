Hooks.addKeyboardShortcut('ctrl-i', function () {
  Recipe.run(require('./src/type'))
})

Hooks.addKeyboardShortcut('ctrl-.', function () {
  Recipe.run(require('./src/definition'))
})