import path from 'path'

const dirname = import.meta.dirname

export default {
    mode: 'production',
    entry: './src/index.ts',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(dirname, 'dist'),
        chunkFormat: 'module',
    },
    experiments: {
        outputModule: true,
        topLevelAwait: true,
    },
}
