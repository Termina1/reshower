# reshower
Simple tool for automating tasks for [Termina1/react-shower](https://github.com/Termina1/react-shower) presentations.

## Installation
```
npm install -g reshower
```

## Description

It can initialise new presentations for [Termina1/react-shower](https://github.com/Termina1/react-shower), 
run some tasks for it and deploy result to Github Pages with one command.

With this tool you will have to store only presentation related things in your repository.
Everything else is an npm dependency or just hidden ```gh-pages``` branch.

## Commands

### reshower init

Creates new presentation in current directory.

```-b, --bare``` — create the very minimum template for new presentation, 
otherwise the whole example from https://shwr.me/ will be used.

#### Example:
```
mkdir my-pres && reshower init -b
```

### reshower start

Starts local server for development (including hot reload, webpack and other stuff).

### reshower build

Builds your presentation.

```-d, --dest``` — output directory. Default: ```./p```.

#### Example:
```
reshower build -d ./p
```

### reshower gh

Deploys your presentation to Github Pages.
Automatically merges your current branch to ```gh-pages``` branch, builds presentation, commits changes and pushes them to remote.
Works only if you have ```origin``` and remote repository.

```-d, --dest``` — output directory for build command, means it will place ```index.html``` to this directory. Default: ```./p```,

```-c, --comment``` — comment for new release. Default: ```new release```.

#### Example:

```
reshower gh -d ./ -c "new slides"
```

Builds your presentation in the root directory of you repository.

## Contributing

All contributions are welcomed, just make a pull-request.
