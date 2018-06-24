const _ = require('lodash')
const webpack = require('webpack')

// base config -- inherited by ALL configs
const base = {
  target: 'node',
  plugins: [
    new webpack.IgnorePlugin(/^encoding$/, /node-fetch/)
  ]
}

// container for the output configs
const configs = []

// simple merge config function
function addConfig(config = {}) {
  configs.push(_.merge({}, base, config))
}

// now add each lambda function's config
// need one 'addConfig' per lambda function that requires a build

// config for AuthWithSlack
addConfig({
  entry: './lambdas/AuthWithSlack/src.js',
  output: {
    path: __dirname + "/lambdas/AuthWithSlack",
    filename: 'index.js'
  }
})

// print the configs
console.log(JSON.stringify(configs, null, 2))

module.exports = configs