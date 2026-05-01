/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.buildforce.ca',
      },
      {
        protocol: 'https',
        hostname: 'www.austintec.com',
      },
      {
        protocol: 'https',
        hostname: 'havitsteelstructure.com',
      },
      {
        protocol: 'https',
        hostname: 'naxmltd.az',
      },
      {
        protocol: 'https',
        hostname: '166photography.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'maximalengineer.com',
      },
      {
        protocol: 'https',
        hostname: 'media.bizj.us',
      },
      {
        protocol: 'https',
        hostname: 'www.secsl.gov.lk',
      },
      {
        protocol: 'https',
        hostname: 'bucudnopgltcbbsnspub.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'humanfocus.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
      {
        protocol: 'http',
        hostname: 'island.lk',
      },
      {
        protocol: 'https',
        hostname: 'www.metlspan.com',
      },
      {
        protocol: 'https',
        hostname: 'www.nwsdb.lk',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      }
    ],
  },
};

export default nextConfig;
