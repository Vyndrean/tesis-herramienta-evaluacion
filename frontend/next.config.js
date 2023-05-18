/** @type {import('next').NextConfig} */
const nextConfig = {
  env:{
    SERVIDOR: process.env.SERVIDOR
  },
  reactStrictMode: true
}

module.exports = nextConfig
