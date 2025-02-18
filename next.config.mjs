import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
    productionBrowserSourceMaps: true, // 启用生产环境 Source Maps
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
            
            {
                source: '/login/:path*',
                destination: 'http://127.0.0.1:5000/login/:path*'
            }
        ];
    },
});
