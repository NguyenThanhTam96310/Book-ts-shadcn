// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// });

// const nextConfig = {
//     experimental: {
//         appDir: true,
//     },
//     images: {
//         remotePatterns: [
//             {
//                 protocol: "http",
//                 hostname: "localhost",
//                 port: "8080",
//                 pathname: "/api/public/file/**",
//             },
//         ],
//     },
//     // Thêm cấu hình khác nếu cần
// };

// module.exports = withBundleAnalyzer(nextConfig);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/api/public/file/**",
            },
            {
                protocol: "https",
                hostname: "**.ngrok-free.app", // hỗ trợ tất cả các ngrok-free subdomains
                pathname: "/api/public/file/**",
            },
        ],
    },
};

module.exports = withBundleAnalyzer(nextConfig);
