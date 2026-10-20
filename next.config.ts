import type { NextConfig } from "next";
import { hosts } from "./app/core/config";

const nextConfig: NextConfig = {
  allowedDevOrigins: Array.from(
    new Set([...hosts, "*.trycloudflare.com"])
  ),
};

export default nextConfig;
