#!/usr/bin/env node
const nodemon = require('nodemon');

const root = process.cwd()
const args = process.argv.slice(2).join(" ")
const isEnableNodemon = process.argv.includes("--nodemon")

if (isEnableNodemon && ["s", "start"].includes(args[0])){
  nodemon(`${__dirname}/runHori.js ${args}`);

  nodemon.on('start', function () {
    console.log('App has started');
  }).on('quit', function () {
    console.log('App has quit');
    process.exit();
  }).on('restart', function (files) {
    console.log('App restarted due to: ', files);
  });
} else {
	require(`${__dirname}/requireHori.js`).run(process.argv)
}

nodemon.on('start', function () {
  console.log('App has started');
}).on('quit', function () {
  console.log('App has quit');
  process.exit();
}).on('restart', function (files) {
  console.log('App restarted due to: ', files);
});