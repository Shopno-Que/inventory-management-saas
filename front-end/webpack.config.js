const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    storeDashboard: "./dynamic-pages/store-dashboard.jsx",
    userDashboard: "./dynamic-pages/user-dashboard.jsx",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  plugins: [
    // React pages
    new HtmlWebpackPlugin({
      template: "./pages/store-dashboard.html",
      filename: "store-dashboard.html",
      chunks: ["storeDashboard"],
    }),

    new HtmlWebpackPlugin({
      template: "./pages/user-dashboard.html",
      filename: "user-dashboard.html",
      chunks: ["userDashboard"],
    }),

    // Copy static + normal pages
    new CopyPlugin({
      patterns: [
        { from: "pages/home.html", to: "home.html" },
        { from: "pages/about.html", to: "about.html" },
        { from: "static", to: "static" },
      ],
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    watchFiles: ["pages/**/*.html", "static/**/*"],
  },
};