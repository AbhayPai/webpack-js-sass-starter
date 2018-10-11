/*
 * always define variable as const for requiring file
 * variable definition should be camelcase
 * use one space for declaration
 * always use comment which can help other developers
 */
const Path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssNano = require('cssnano');

// the path(s) that should be cleaned
let PathsToClean = [
  './public/css',
  './public/js',
];

// the clean options to use
let CleanOptions = {
  exclude:  ['./private/*', './node_modules/*'],
  verbose:  true,
};

// definition of project file compilation
module.exports = {
  // defining entry point for the files
  entry: {
    index: Path.join(__dirname, "./", "private/", "js/", "index.js"),
  },

  // defining output for the files
  output: {
    path: Path.join(__dirname, "./", "public/", "js/"),
    filename: "[name].js"
  },

  // defining rules for the compilation of different sets of file
  module:{
    // rules
    rules: [
      // testing js file
      {
        // defining rules for the js scripts
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // defining rules for the scss styling
        test: /\.scss$/,
        exclude: /node_modules/,
          use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
              // minimize the output css file
              // https://github.com/webpack-contrib/extract-text-webpack-plugin
              loader: 'css-loader',
          }, {
              // using sass loader for compiling the files
              // https://github.com/webpack-contrib/sass-loader
              loader: 'sass-loader',
          }]
        })
      },
    ],
    // rules end
  },

  // defining plugins used to generate the file output
  plugins: [
    // deleting files and folder before generating new ones
    // https://github.com/johnagan/clean-webpack-plugin
    new CleanWebpackPlugin(
      PathsToClean,
      { CleanOptions }
    ),

    // compressing js files
    // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
    new UglifyJsPlugin({
        uglifyOptions: {
        compress: true,
      }
    }),

    // compressed css file genrating
    // https://github.com/webpack-contrib/extract-text-webpack-plugin
    new ExtractTextPlugin({
      filename: "./../css/[name].css"
    }),

    new OptimizeCssAssetsPlugin(
    {
      cssProcessor: CssNano,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
  ]
};
