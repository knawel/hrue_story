import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // The guide page reads its Markdown at request time; ship the files with it.
  outputFileTracingIncludes: {
    "/guide": ["./content/guide/*.md"],
  },
};

export default withNextIntl(nextConfig);
