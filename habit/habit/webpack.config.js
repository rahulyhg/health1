var webpack = require('webpack');

module.exports ={
  entry: ["./js/app.js"],
  output: {
    path: "./js",
    filename:"bundle.js"
  },
  module:{
    loaders: [
      {
        test: [/\.es6$/, /\.js$/],
        exclude: /(css|plugins|node_modules)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  plugins:[
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  resolve: {
    extensions: ['', '.js', '.es6', '.jsx']
  },
  watch: false

}
