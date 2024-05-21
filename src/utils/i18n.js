import { I18n } from "i18n";

const i18n = new I18n({
    locales: ["en", "ar"],
    defaultLocale: 'en',
    directory: "./locales",
    objectNotation: true,
    register: global
})

export { i18n }