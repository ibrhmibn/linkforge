"use client";

import { useState, useEffect } from "react";
import { Globe, Github, Linkedin } from "lucide-react";
import ArcadeCard from "@/components/ArcadeCard";
import HUDBar from "@/components/HUDBar";
import { getProfileByUsername } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ArcadeButton from "@/components/ArcadeButton";

const ICONS = { Globe, Github, Linkedin };

// Mapping style theme
const THEME_STYLES = {
  black: {
    wrapper: "bg-grid-perspective",
    gradient:
      "linear-gradient(to bottom, #141414 0%, #141414 55%, #2a0c0a 100%)",
    line: "#FFCC00",
  },
  red: {
    wrapper: "bg-grid-perspective",
    gradient:
      "linear-gradient(to bottom, #1a0505 0%, #1a0505 55%, #4a0c0a 100%)",
    line: "#FF3B30",
  },
  blue: {
    wrapper: "bg-grid-perspective",
    gradient:
      "linear-gradient(to bottom, #0a0f1a 0%, #0a0f1a 55%, #0c1a2a 100%)",
    line: "#3B82F6",
  },
  purple: {
    wrapper: "bg-grid-perspective",
    gradient:
      "linear-gradient(to bottom, #12071c 0%, #12071c 55%, #2a0c3a 100%)",
    line: "#A855F7",
  },
};

export default function PublicProfileClient({ username }) {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const profileData = await getProfileByUsername(username);

      if (profileData) {
        setProfile(profileData);
        const { data: linksData } = await supabase
          .from("links")
          .select("*")
          .eq("user_id", profileData.id)
          .order("sort_order", { ascending: true });

        if (linksData) setLinks(linksData);
      }
      setLoading(false);
    };

    fetchData();
  }, [username]);

  if (loading) return <div className="min-h-screen bg-arcade-bg"></div>;

  if (!profile) {
    return (
      <main className="bg-grid-perspective min-h-screen text-white flex flex-col items-center justify-center">
        <h1 className="font-pixel text-4xl text-arcade-red">404</h1>
        <p className="font-pixel text-sm mt-4">PLAYER NOT FOUND</p>
      </main>
    );
  }

  // Tentukan tema aktif, fallback ke 'black' kalo kosong/error
  const activeTheme = profile?.theme || "black";
  const currentTheme = THEME_STYLES[activeTheme] || THEME_STYLES.black;

  return (
    <main
      className={`${currentTheme.wrapper} min-h-screen text-white flex flex-col items-center`}
      style={{
        "--line-color": currentTheme.line,
        background: currentTheme.gradient,
      }}
    >
      <HUDBar score={9999} hiScore={9999} credits={1} />

      <div className="mt-16 mb-12 text-center">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={`Avatar of ${username}`}
            className="w-24 h-24 border-4 border-white mx-auto rounded-full mb-4 object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-arcade-red border-4 border-white mx-auto rounded-full mb-4 flex items-center justify-center">
            <span className="font-pixel text-4xl text-white uppercase">
              {username.charAt(0)}
            </span>
          </div>
        )}

        <h1 className="font-pixel text-2xl text-arcade-yellow">@{username}</h1>
        <p className="mt-2 text-xl text-gray-300">
          Welcome to my Arcade Profile!
        </p>
      </div>

      <div className="w-full max-w-lg px-4 space-y-4 pb-20">
        {links.map((link) => {
          const Icon = ICONS[link.icon] || Globe;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <ArcadeCard
                accent={link.color}
                isButton={true}
                className="hover:-translate-y-1 hover:shadow-hard-yellow transition-transform cursor-pointer"
              >
                <div className="flex-shrink-0 border-2 border-white bg-arcade-bg p-1.5 rounded">
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex-grow text-center px-4">
                  <span className="font-pixel text-[10px] sm:text-xs text-white uppercase truncate">
                    {link.title}
                  </span>
                </div>
                <div className="w-8 h-8"></div>
              </ArcadeCard>
            </a>
          );
        })}
        {links.length === 0 && (
          <p className="text-center text-gray-500 font-pixel text-sm py-10">
            No links added yet.
          </p>
        )}
      </div>

      <div className="mt-12 mb-24 text-center">
        <Link href="/">
          <ArcadeButton variant="yellow" className="text-sm">
            Get Your Own LinkForge
          </ArcadeButton>
        </Link>
        <p className="mt-4 text-sm text-gray-500 font-pixel">
          © {new Date().getFullYear()} LINKFORGE
        </p>
      </div>
    </main>
  );
}
