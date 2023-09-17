/** @type {import('next-i18next').UserConfig} */

export default {
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'es', 'zh', 'ja', 'de', 'fr'],
    },
    react: { useSuspense: false },//this line
}