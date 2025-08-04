import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: process.env.NODE_ENV === 'development' ? '.next_dev' : '.next',
};

export default nextConfig;
