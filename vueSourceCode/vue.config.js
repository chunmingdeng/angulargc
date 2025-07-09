const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig(() => {
    return {
        transpileDependencies: true,
        publicPath: './',
        outputDir: 'dist01',
        configureWebpack: {
            devtool: 'source-map', // 👈 在这里设置 source map
        },
    };
});
