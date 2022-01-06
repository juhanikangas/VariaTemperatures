require('dotenv').config();
module.exports = {
  env: {
    REST_APIKEY: process.env.REST_APIKEY,
    REST_URL: process.env.REST_URL,
  },
  webpack(config){
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
          name: 'SW[name]-[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
};