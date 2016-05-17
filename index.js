var program = require('commander');
var inquirer = require('inquirer');
var exec = require('child_process').exec;
var template = require('lodash.template');
var fs = require('fs');
var path = require('path');

function readFile(name) {
  return new Promise(function(res, rej) {
    fs.readFile(name, function(err, result) {
      if (err) {
        rej("Can't load template");
      } else {
        res(result.toString());
      }
    })
  })
}

function writeFile(name, value) {
  return new Promise(function(res, rej) {
    fs.writeFile(name, value, function(err, result) {
      if (err) {
        rej("Can't write template");
      } else {
        res();
      }
    })
  })
}

function execute(command) {
  return new Promise(function(resolve, rej) {
    var res = exec(command, function(err) {
      if (err) {
        rej("Can't exec: " + err);
      } else {
        resolve();
      }
    });

    res.stdout.pipe(process.stdout);
    res.stderr.pipe(process.stderr);
  });
}

program
  .version("1.0.0");

program
  .command("init")
  .description("Initialize new presentation")
  .action(function(env, options) {
    inquirer.prompt([{
        message: "Enter name of your presentation:",
        type: "input",
        name: "name"
      }, {
        message: "Enter title for your presentation:",
        type: "input",
        name: "description"
      }, {
        message: "Type your name/nickname:",
        type: "input",
        name: "author"
    }]).then(function(answers) {
      return Promise.all([readFile(path.join(__dirname, "./templates/package.json")), answers]);
    }).then(function(result) {
      var tpl = result[0];
      var answers = result[1];
      return writeFile("./package.json", template(tpl, {})(answers));
    }).then(function() {
      return execute("npm install")
    }).then(function() {
      return exec("cp node_modules/react-shower/js/presentation.js ./"
        + "cp node_modules/react-shower/config.json ./"
        + "&& mkdir css"
        + "&& cp node_modules/react-shower/css/theme.css ./css");
    }).catch(function(err) {
      console.log(err);
    });
  });

  module.exports = program;
