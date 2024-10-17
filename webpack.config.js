import path from 'path'

const dirname = import.meta.dirname

export default {
    mode: 'production', // Устанавливаем режим на основе переменной среды
    entry: './src/index.ts', // Укажите входную точку вашего приложения
    target: 'node', // Указываем, что это проект для Node.js
    module: {
        rules: [
            {
                test: /\.ts$/, // Применяем правило для файлов с расширением .ts
                use: 'ts-loader', // Используем ts-loader для обработки TypeScript
                exclude: /node_modules/, // Исключаем node_modules
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'], // Указываем, какие расширения будут обрабатываться
    },
    output: {
        filename: 'bundle.js', // Имя выходного файла
        path: path.resolve(dirname, 'dist'), // Путь к выходной папке
        chunkFormat: 'module', // Устанавливаем формат чанка на модуль
    },
    experiments: {
        outputModule: true, // Включаем поддержку выходного модуля
        topLevelAwait: true, // Опционально, если хотите использовать await на верхнем уровне
    },
}
