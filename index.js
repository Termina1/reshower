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

function execute(command, nopipe) {
  return new Promise(function(resolve, rej) {
    var res = exec(command, function(err, stdout) {
      if (err) {
        rej("Can't exec: " + err);
      } else {
        resolve(stdout);
      }
    });
    if (!nopipe) {
      res.stdout.pipe(process.stdout);
      res.stderr.pipe(process.stderr);
    }
  });
}

function initStdTheme() {
  return execute("cp node_modules/react-shower/js/presentation.js ./"
    + "&& cp node_modules/react-shower/config.json ./"
    + "&& mkdir -p css"
    + "&& cp " + path.join(__dirname, "templates/gitignore ./.gitignore")
    + "&& cp node_modules/react-shower/css/theme.css ./css");
}

function initBareTheme(answers) {
  return execute("cp node_modules/react-shower/config.json ./"
    + "&& mkdir -p css"
    + "&& cp " + path.join(__dirname, "templates/gitignore ./.gitignore")
    + "&& cp " + path.join(__dirname, "templates/theme.css") + " ./css")
      .then(function() {
        return readFile(path.join(__dirname, "templates/presentation.js"))
      }).then(function(file) {
        return writeFile("./presentation.js", template(file, {})(answers));
      });
}

function buildShower(dest) {
  dest = dest || "p";
  return execute("npm run build " + dest);
}

var version = JSON.parse(
  fs.readFileSync(path.join(__dirname, './package.json'))
).version;

program
  .version(version);

program
  .command("init")
  .description("initialize new presentation")
  .option("-b, --bare", "init with minimal initial template")
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
      return writeFile("./package.json", template(tpl, {})(answers))
        .then(function() { return answers });
    }).then(function(answers) {
      return execute("npm install")
        .then(function() { return answers });
    }).then(function(answers) {
      if (env.bare) {
        return initBareTheme(answers);
      } else {
        return initStdTheme();
      }
    }).catch(function(err) {
      console.log(err);
    });
  });

program
  .command("start")
  .description("runs server for development")
  .action(function() {
    return execute("npm start");
  });

program
  .command("build")
  .description("builds presentation for deployment")
  .option("-d, --dest", "directory to build to")
  .action(function(dest) {
    return buildShower(dest);
  });

function getGitBranch() {
  return execute("git rev-parse --abbrev-ref HEAD", true)
    .then(function(branch) {
      return branch.trim();
    })
}

program
  .command("gh")
  .description("deploys your presentation to Github Pages")
  .option("-d, --dest <dest>", "directory where presentations will be")
  .option("-c, --comment <comment>", "release comment for gh-pages")
  .action(function(env) {
    return getGitBranch().then(function(branch) {
      return execute("git checkout gh-pages || git checkout -b gh-pages", true)
        .then(function() {
          return execute("git merge " + branch, true);
        }).then(function() {
          return buildShower(env.dest);
        }).then(function() {
          var gcomment = env.comment || "\"new release\"";
          return execute("git add . && git commit -m " + gcomment);
        }).then(function() {
          return execute("git push origin gh-pages");
        }).catch(function(err) {
          return true;
        }).then(function() {
          return execute("git checkout " + branch, true);
        });
    });
  })

  module.exports = program;
