module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Allow webpack to resolve ESM packages that omit file extensions
            webpackConfig.module.rules.push({
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            });
            return webpackConfig;
        },
    },
};