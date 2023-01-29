module.exports = {
    images: {
        loader: 'imgix',
        path: '/',
    },

    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
            issuer: /\.tsx?$/,
        });

        return config;
    },
};
