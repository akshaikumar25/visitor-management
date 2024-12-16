import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { auth } from "@/auth";
import ClientProvider from "./ClientProvider";
const mukta = Noto_Sans({ subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://compass-nextjs-one.vercel.app/"),
  title: "Visitor Management",
  description:
    "Visitor Management Security Services - work closely with our customers for providing world-class security services with optimized solutions.",
  openGraph: {
    title: "Visitor Management",
    description:
      "Visitor Management Security Services - work closely with our customers for providing world-class security services with optimized solutions.",
    url: "https://compass-nextjs-one.vercel.app/",
    siteName: "Visitor Management",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/31690c6f-83b4-4c61-978c-51efa70365a8.svg?token=Aa1EVvmFoa78k1vtMvUS6-yZtN517bOwpfMVCWXCQqo&height=128&width=128&expires=33259513215",
        width: 400,
        height: 400,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visitor Management",
    description:
      "Visitor Management Security Services - work closely with our customers for providing world-class security services with optimized solutions.",
    images: [
      "https://opengraph.b-cdn.net/production/images/31690c6f-83b4-4c61-978c-51efa70365a8.svg?token=Aa1EVvmFoa78k1vtMvUS6-yZtN517bOwpfMVCWXCQqo&height=128&width=128&expires=33259513215",
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <Head>
        <title>Visitor Management</title>
        <meta
          name="description"
          content="Visitor Management Security Services - work closely with our customers for providing world-class security services with optimized solutions."
        />
        <meta
          property="og:url"
          content="https://compass-nextjs-one.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Career Compass" />
        <meta
          property="og:description"
          content="Visitor Management Security Services - work closely with our customers for providing world-class security services with optimized solutions."
        />
        <meta
          property="og:image"
          content="https://opengraph.b-cdn.net/production/images/31690c6f-83b4-4c61-978c-51efa70365a8.svg?token=Aa1EVvmFoa78k1vtMvUS6-yZtN517bOwpfMVCWXCQqo&height=128&width=128&expires=33259513215"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="compass-nextjs-one.vercel.app"
        />
        <meta
          property="twitter:url"
          content="https://compass-nextjs-one.vercel.app/"
        />
        <meta name="twitter:title" content="Career Compass" />
        <meta
          name="twitter:description"
          content="Visitor Management Security Services - work closely with our customers for providing world-class security services with optimized solutions."
        />
        <meta
          name="twitter:image"
          content="https://opengraph.b-cdn.net/production/images/31690c6f-83b4-4c61-978c-51efa70365a8.svg?token=Aa1EVvmFoa78k1vtMvUS6-yZtN517bOwpfMVCWXCQqo&height=128&width=128&expires=33259513215"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Visitor Management",
              url: "https://compass.vetnet.social",
              logo: "https://compass.vetnet.social/logo.png", // Replace with the actual path to your logo
              description:
                " Visitor Management Security Services - work closely with our customers for providing world-class security services with optimized solutions.",
            }),
          }}
        />
      </Head>
      <body className={mukta.className}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
