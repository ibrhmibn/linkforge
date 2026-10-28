"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Plus,
  ArrowLeft,
  Save,
  X,
  LogOut,
  Loader2,
  Globe,
  Github,
  Linkedin,
  Upload,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  fetchUserLinks,
  updateLinkOrder,
  addLinkToDB,
  updateLinkInDB,
  deleteLinkFromDB,
  getMyProfile,
  upsertMyProfile,
  uploadAvatar,
  deleteOldAvatar,
} from "@/lib/db";
import HUDBar from "@/components/HUDBar";
import ArcadeButton from "@/components/ArcadeButton";
import ArcadeCard from "@/components/ArcadeCard";
import LinkCard, { LinkCardView } from "@/components/LinkCard";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State Profile, Avatar & Theme
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("black"); // <-- State baru
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const router = useRouter();

  // 1. Cek Auth & Fetch Data
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const linksData = await fetchUserLinks();
        setLinks(linksData);

        const profileData = await getMyProfile();
        if (profileData) {
          setUsername(profileData.username);
          setTheme(profileData.theme || "black"); // <-- Fetch theme
          setAvatarUrl(profileData.avatar_url || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;
    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // --- FUNGSI SAVE URUTAN ---
  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      await updateLinkOrder(links);
      alert("Urutan link berhasil disimpan!");
    } catch (error) {
      alert("Gagal nyimpen urutan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- FUNGSI SAVE USERNAME & THEME ---
  const handleSaveUsername = async () => {
    if (!username.trim()) return alert("Username nggak boleh kosong!");
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return alert("Username cuma boleh huruf, angka, dan underscore (_)");
    }

    setIsSavingUsername(true);
    try {
      await upsertMyProfile(username, theme); // <-- Kirim theme juga
      alert("Profil & Theme berhasil disimpan!");
    } catch (error) {
      alert("Gagal simpan profil: " + error.message);
    } finally {
      setIsSavingUsername(false);
    }
  };

  // --- FUNGSI UPLOAD AVATAR ---
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return alert("File harus berupa gambar (JPG, PNG, WEBP)!");
    }
    if (file.size > 2 * 1024 * 1024) {
      return alert("Ukuran gambar maksimal 2MB ya bro!");
    }

    setIsUploadingAvatar(true);
    try {
      if (avatarUrl) await deleteOldAvatar(avatarUrl);
      const newUrl = await uploadAvatar(file);
      setAvatarUrl(newUrl);
    } catch (error) {
      alert("Gagal upload avatar: " + error.message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // --- FUNGSI CRUD LINK ---
  const handleAddNewLink = async () => {
    try {
      const newLink = {
        title: "New Link",
        url: "https://...",
        icon: "Globe",
        color: "red",
        sort_order: links.length,
      };
      const insertedData = await addLinkToDB(newLink);
      setLinks([...links, insertedData]);
    } catch (error) {
      alert("Gagal nambah link: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus link ini?")) return;
    try {
      await deleteLinkFromDB(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditSave = async (updatedLink) => {
    try {
      await updateLinkInDB(updatedLink.id, {
        title: updatedLink.title,
        url: updatedLink.url,
        color: updatedLink.color,
        icon: updatedLink.icon,
      });
      setLinks((prev) =>
        prev.map((l) => (l.id === updatedLink.id ? updatedLink : l)),
      );
      setEditingLink(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <main className="bg-grid-perspective min-h-screen text-white flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-arcade-yellow" />
      </main>
    );
  }

  const activeLink = activeId ? links.find((l) => l.id === activeId) : null;

  return (
    <main className="bg-grid-perspective min-h-screen text-white pb-20">
      <HUDBar score={0} hiScore={0} credits={1} />

      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            <div className="flex gap-2">
              <Link href="/">
                <ArcadeButton variant="dark" className="!px-3 !py-2">
                  <ArrowLeft size={16} className="inline" />
                </ArcadeButton>
              </Link>
              <ArcadeButton
                variant="dark"
                className="!px-3 !py-2"
                onClick={handleLogout}
              >
                <LogOut size={16} className="inline" />
              </ArcadeButton>
            </div>
            <h1 className="font-pixel text-sm text-arcade-yellow md:hidden">
              EDITOR MODE
            </h1>
          </div>

          <h1 className="font-pixel text-xl text-arcade-yellow hidden md:block">
            EDITOR MODE
          </h1>

          <ArcadeButton
            variant="yellow"
            className="!px-4 !py-2 w-full md:w-auto justify-center"
            onClick={handleSaveOrder}
            disabled={isSaving}
          >
            <Save size={16} className="inline mr-2" />{" "}
            {isSaving ? "Saving..." : "Save Order"}
          </ArcadeButton>
        </div>

        {/* FORM AVATAR */}
        <ArcadeCard title="Player Avatar" accent="red" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-arcade-red border-4 border-white rounded-full flex items-center justify-center">
                  <Camera size={32} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <label className="block font-pixel text-xs mb-2">
                Upload New Avatar
              </label>
              <p className="text-sm text-gray-400 mb-3">
                Format: JPG, PNG, WEBP. Max 2MB.
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploadingAvatar}
                className="hidden"
                id="avatar-input"
              />

              <label
                htmlFor="avatar-input"
                className="cursor-pointer inline-block"
              >
                <ArcadeButton
                  variant="yellow"
                  disabled={isUploadingAvatar}
                  as="span"
                >
                  <Upload size={16} className="inline mr-2" />
                  {isUploadingAvatar ? "Uploading..." : "Choose File"}
                </ArcadeButton>
              </label>
            </div>
          </div>
        </ArcadeCard>

        {/* FORM USERNAME & THEME */}
        <ArcadeCard
          title="Your Public URL & Theme"
          accent="white"
          className="mb-8"
        >
          <div className="flex flex-col gap-6">
            {/* Input Username */}
            <div className="w-full">
              <label className="block font-pixel text-xs mb-2">Username</label>
              <div className="flex items-center w-full">
                <span className="bg-white/20 px-3 py-2 border-y-4 border-l-4 border-white font-pixel text-sm">
                  /
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="username-lu"
                  className="w-full bg-arcade-bg border-4 border-white p-2 text-white font-pixel text-sm focus:outline-none focus:border-arcade-yellow"
                />
              </div>
            </div>

            {/* Pilihan Theme */}
            <div className="w-full">
              <label className="block font-pixel text-xs mb-2">
                Pilih Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["black", "red", "blue", "purple"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`
                      h-12 border-4 font-pixel text-[10px] uppercase transition-all
                      ${theme === t ? "border-arcade-yellow scale-105 shadow-hard-yellow" : "border-white hover:border-arcade-yellow/50"}
                      ${t === "black" ? "bg-[#141414] text-white" : ""}
                      ${t === "red" ? "bg-arcade-red text-white" : ""}
                      ${t === "blue" ? "bg-arcade-blue text-white" : ""}
                      ${t === "purple" ? "bg-arcade-purple text-white" : ""}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <ArcadeButton
              variant="red"
              onClick={handleSaveUsername}
              disabled={isSavingUsername}
              className="w-full md:w-auto mt-2"
            >
              {isSavingUsername ? "Saving..." : "Save Profile"}
            </ArcadeButton>
          </div>

          {username && (
            <p className="mt-4 text-sm text-gray-400">
              Preview:{" "}
              <a
                href={`/${username}`}
                target="_blank"
                className="text-arcade-yellow underline hover:text-white"
              >
                localhost:3000/{username}
              </a>
            </p>
          )}
        </ArcadeCard>

        {/* LIST LINKS & DND */}
        <div className="mb-4 flex justify-between items-end">
          <h2 className="font-pixel text-lg text-white">YOUR LINKS</h2>
          <ArcadeButton
            variant="red"
            className="!px-4 !py-2"
            onClick={handleAddNewLink}
          >
            <Plus size={16} className="inline mr-2" /> Add New
          </ArcadeButton>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  onEdit={() => setEditingLink(link)}
                />
              ))}
              {links.length === 0 && (
                <div className="text-center py-10 border-4 border-dashed border-white/20">
                  <p className="font-pixel text-sm text-gray-500">
                    No links yet. Add one above!
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeLink ? <LinkCardView link={activeLink} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* MODAL EDIT LINK */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <ArcadeCard
            title="Edit Link"
            accent="yellow"
            className="w-full max-w-md relative"
          >
            <button
              onClick={() => setEditingLink(null)}
              className="absolute top-4 right-4 text-white hover:text-arcade-red"
            >
              <X size={24} />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSave(editingLink);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-pixel text-xs mb-2">Title</label>
                <input
                  type="text"
                  value={editingLink.title}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, title: e.target.value })
                  }
                  className="w-full bg-arcade-bg border-2 border-white p-2 text-white"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs mb-2">URL</label>
                <input
                  type="url"
                  value={editingLink.url}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, url: e.target.value })
                  }
                  className="w-full bg-arcade-bg border-2 border-white p-2 text-white"
                />
              </div>
              <div>
                <label className="block font-pixel text-xs mb-2">Icon</label>
                <select
                  value={editingLink.icon}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, icon: e.target.value })
                  }
                  className="w-full bg-arcade-bg border-2 border-white p-2 text-white"
                >
                  <option value="Globe">Globe</option>
                  <option value="Github">Github</option>
                  <option value="Linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="block font-pixel text-xs mb-2">
                  Color Accent
                </label>
                <select
                  value={editingLink.color}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, color: e.target.value })
                  }
                  className="w-full bg-arcade-bg border-2 border-white p-2 text-white"
                >
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="white">White</option>
                </select>
              </div>
              <ArcadeButton variant="red" type="submit" className="w-full mt-4">
                Save Changes
              </ArcadeButton>
            </form>
          </ArcadeCard>
        </div>
      )}
    </main>
  );
}
