import type { NextConfig } from "next";

const rawHosts =
  process.env.NEXT_PUBLIC_ALLOWED_HOSTS ||
  "http://localhost:3030, http://localhost:5173";

const parsedHosts = rawHosts
  .split(",")
  .map((host) => host.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""))
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins: Array.from(
    new Set([...parsedHosts, "*.trycloudflare.com"])
  ),
};

export default nextConfig;
