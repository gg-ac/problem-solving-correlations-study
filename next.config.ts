import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  basePath: '/problem-solving-correlations-study',
  assetPrefix: '/problem-solving-correlations-study',
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
