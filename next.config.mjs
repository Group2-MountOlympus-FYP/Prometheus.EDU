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
                source: '/zhhq/:path*', // 匹配所有 /zhhq 开头的路径
                destination: 'https://www.cneeex.com/zhhq/:path*', // 代理到目标地址
            },
            {
                source: '/jsonData/:path*', // 匹配所有 /zhhq 开头的路径
                destination: 'https://www.cneeex.com/zhhq/jsonData/:path*', // 代理到目标地址
            },
            {
                source: '/img/:path*', // 匹配所有 /zhhq 开头的路径
                destination: 'https://www.cneeex.com/img/:path*', // 代理到目标地址
            },
        ];
    },
});
