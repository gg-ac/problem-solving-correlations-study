import type { NextConfig } from "next";

console.log('DEPLOY_TARGET at build:', process.env.DEPLOY_TARGET);
console.log('basePath resolved to:', process.env.DEPLOY_TARGET === 'GITHUB'
  ? '/problem-solving-correlations-study'
  : '(empty)');


const nextConfig: NextConfig = {
  basePath: process.env.DEPLOY_TARGET === 'GITHUB' ? '/problem-solving-correlations-study' : '',
  assetPrefix: process.env.DEPLOY_TARGET === 'GITHUB' ? '/problem-solving-correlations-study' : '',
  distDir: 'out',
  output: 'export',
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",          
        }
      ]
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js"
      }
    }
  }
};


export default nextConfig;
