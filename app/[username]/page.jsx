// app/[username]/page.jsx
import { getProfileByUsername } from "@/lib/db";
import PublicProfileClient from "./PublicProfileClient";

export async function generateMetadata({ params }) {
  const profile = await getProfileByUsername(params.username);

  if (!profile) {
    return {
      title: "Player Not Found",
      description: "Player ini nggak ada di arcade kami.",
    };
  }

  const title = `@${params.username}`;
  const description = `Cek semua link dari @${params.username} di LinkForge!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${params.username}`,
      siteName: "LinkForge",
      images: [
        {
          url: `/api/og?username=${params.username}`, // dynamic OG image!
          width: 1200,
          height: 630,
          alt: `LinkForge profile of @${params.username}`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?username=${params.username}`],
    },
  };
}

export default function PublicProfile({ params }) {
  return <PublicProfileClient username={params.username} />;
}