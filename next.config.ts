// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Для Turbopack - ТОЛЬКО ПРОСТЫЕ ПРАВИЛА!
  turbopack: {
    rules: {
      // ✅ Только так!
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // ✅ Для webpack - можно сложные правила
  webpack: (config) => {
    // ✅ Убираем стандартную обработку SVG
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }
    
    // ✅ Для импорта как React-компонент
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    
    // ✅ Для использования в CSS как URL
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { not: /\.[jt]sx?$/ },
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]',
      },
    });
    
    return config;
  },
};

export default nextConfig;