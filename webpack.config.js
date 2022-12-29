const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const pathModule = require('path');
module.exports={
    entry:'./src/index.js',
    output:{
        filename:'script.bundle.js',
        path: pathModule.join(__dirname, "build"),
    },
   
    mode:'production',
    module: {
        rules: [
         
          {
            test: /\.css$/i,
            
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
             
               MiniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader",
            ],
          },
        ],
    },
    plugins: [new HtmlWebpackPlugin({template:'src/index.html'}),
    new MiniCssExtractPlugin({filename:"style.min.css"}),
  ],
  optimization: {
    minimizer: [
      
      `...`,
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
           
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["mozjpeg", { quality: 60 }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                     
                      convertShapeToPath: {
                        convertArcs: true
                      },
                      
                      convertPathData: false
                    }
                  }
                }
              ],
            ],
          },
        },
      }),
    ],
  },
}