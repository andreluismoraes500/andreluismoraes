/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mantive a configuração que você já tinha feito para o IP
  allowedDevOrigins: ["192.168.1.105", "**"],

  // Adicionado para permitir o carregamento dos SVGs no carrossel
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
