const path = require("path");
var webpack = require("webpack");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
  const plugins = [
    // allow jQuery and $ to be used within imported js files
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ];

  //   if you would like auto-refresh on save of file (js,scss or php) in dev, uncomment BrowserSyncPlugin below
  if (env.dev) {
    plugins.push(
      new BrowserSyncPlugin({
        host: "localhost",
        port: 3000,
        files: ["*.html", "assets/js/*.js", "assets/css/*.css", "assets/scss/*.scss"],
        server: { baseDir: ["./"] },
        // proxy: "http://localhost:8888/coding-videos/web-design-to-site-01/",
      })
    );
  }

  return [
    //   js config
    {
      mode: env.dev ? "development" : "production",
      //   mode: 'development',
      entry: {
        main: "./assets/js/index.js",
        global: {
          import: "./assets/js/global.js",
          library: {
            name: "validjs",
            type: "var",
          },
        },
      },
      output: {
        path: path.resolve(__dirname, "./assets/build/js"),
        filename: "[name].js",
      },
      plugins,
      module: {
        rules: [
          {
            test: /\.js$/,
            use: "babel-loader",
            exclude: /node_modules/,
          },
        ],
      },
      // avoid exporting entire jquery module in every file that uses jquery
      externals: {
        jquery: "jQuery",
      },
      optimization: {
        // minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                // remove console logs from production
                drop_console: env.dev ? false : true,
                // drop_console: false
              },
              output: {
                // remove comments from production
                comments: env.dev ? "some" : false,
                // comments: 'some'
              },
            },
          }),
          "...",
        ],
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
      },
    },
  ];
};
