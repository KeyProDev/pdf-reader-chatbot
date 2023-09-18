/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true, asyncWebAssembly: true, layers: true };
    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  i18n: {
    locales: ['en', 'es', 'zh', 'ja', 'de', 'fr'],
    defaultLocale: 'en',
  },
  typescript: {
    ignoreBuildErrors: true
  }
};


export default nextConfig;
