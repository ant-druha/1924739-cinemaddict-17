// path — встроенный в Node.js модуль
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // Указываем путь до входной точки:
  entry: "./src/main.js",
  // Описываем, куда следует поместить результат работы:
  output: {
    // Путь до директории (важно использовать path.resolve):
    path: path.resolve(__dirname, "build"),
    // Имя файла со сборкой:
    filename: "bundle.js",
    clean: true
  },
  devtool: "source-map",
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public" }],
    }),
  ],
  module: {
    rules: [
      {
        // Это правило будет применяться ко всем файлам,
        // имя которых подойдет под регулярное выражение:
        test: /\.js$/,
        // Список лоадеров, которые применятся к файлу:
        exclude: /(node_modules)/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
