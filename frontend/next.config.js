module.exports = {
  webpack(config, options) {
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