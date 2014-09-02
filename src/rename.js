var request = require('./request'),
    hbs = require('handlebars'),
    async = require('async'),
    path = require('path'),
    fs = require('fs')

var template = hbs.compile(fs.readFileSync(path.join(__dirname, '../templates/rename.hbs'), 'utf8'))

var into_files = function (changes) {
  var returns = {}

  changes.forEach(function (change) {
    if(!returns[change.file]) returns[change.file] = []
    returns[change.file].push(change)
  })

  return returns
}

var rename = function (new_name, r) {
  var doc = Document.current()
  doc.new_name = new_name
  var changed = 0

  request('rename', doc, r.selection.min(), function (e, rename) {
    rename.changes = into_files(rename.changes)

    async.each(Object.keys(rename.changes), function (file, callback) {
      Document.open(file, MainWindow.current(), function (doc) {
        doc = Document.current()

        Recipe.run(function (recipe) {
          async.each(rename.changes[file], function (change, callback) {
            change.length = change.end - change.start
            change.start += changed
            change.end += changed

            var difference = new_name.length - change.length

            var range = new Range(change.start, change.length)
            changed += difference

            recipe.replaceTextInRange(range, new_name, true)
            callback()
          }, callback)
        })
      })
    }, function (e) {
      if(e) console.log(e)
      Document.open(doc.path(), MainWindow.current())
      win.close();
    })
  })
}

module.exports = function (r) {
  var cursor_position = r.selection.min()
  var range = new Range(cursor_position, 1)

  var win = new Popover(Editor.current(), range)
  win.size = { width: 169, height: 38 }

  win.onLoad = function () {
    win.applyFunction(function () {
      var input = document.getElementById('input')

      input.focus()
      input.select()

      input.addEventListener('keyup', function (e) {
        if(e.keyCode === 13) chocolat.sendMessage('new_name', input.value)
      })
    })
  }

  request('type', Document.current(), cursor_position, function (e, definition) {
    if(e) return console.log(e)

    win.onMessage = function (e, new_name) {
      if(e !== 'new_name') return
      win.hide()
      rename(new_name, r, win)
    }

    win.html = template(definition)
    win.run()
  })
}