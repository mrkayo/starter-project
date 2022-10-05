let languages = {
    ar: {
        name: "ar",
        direction: "rtl"
    },
    en: {
        name: "en",
        direction: "ltr"
    }
}

module.exports = {
    lang: {
        default: {
            ...languages.ar,
            baseUrl: ""
        },
        secondary: {
            ...languages.en,
            active: true,
            baseUrl: "../"
        }
    },
    paths: {
        srcs: {
            pug: "./src/*.pug",
            pugIncludes: "./src/include/**/*.pug",
            scssMain: "./src/assets/scss/style.scss",
            scssWatch: "./src/assets/scss/**/*.scss",
        },
        dists: {
            html: "./dist/",
            css: "./dist/assets/css/"
        }
    }
}