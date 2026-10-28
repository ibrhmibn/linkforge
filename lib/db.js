import { supabase } from './supabase';

// 1. Ambil semua link
export const fetchUserLinks = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No session');

  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', session.user.id) // Pake session.user.id
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

// 2. Update urutan
export const updateLinkOrder = async (links) => {
  for (let i = 0; i < links.length; i++) {
    const { error } = await supabase
      .from('links')
      .update({ sort_order: i })
      .eq('id', links[i].id);
      
    if (error) throw error;
  }
};

// 3. Tambah link baru (ANTI RLS ERROR)
export const addLinkToDB = async (linkData) => {
  // Pake getSession() biar dapet ID pasti
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session) {
    throw new Error('Sesi login nggak ketemu. Coba logout terus login lagi!');
  }
  
  // Insert dengan user_id yang valid
  const { data, error } = await supabase
    .from('links')
    .insert([{ 
      ...linkData, 
      user_id: session.user.id // <-- PASTI VALID
    }])
    .select();

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw error;
  }
  
  // Balikin objek pertama (karena insert selalu balikin array)
  return data[0]; 
};

// 4. Update link
export const updateLinkInDB = async (linkId, updates) => {
  const { error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', linkId);

  if (error) throw error;
};

// 5. Hapus link
export const deleteLinkFromDB = async (linkId) => {
  const { error } = await supabase.from('links').delete().eq('id', linkId);
  if (error) throw error;
};

// 6. Ambil profil berdasarkan username (Buat Public Page)
export const getProfileByUsername = async (username) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) return null;
  return data;
};

// 7. Ambil profil milik user yang lagi login
export const getMyProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (error) return null;
  return data;
};

// 8. Simpan / Update Username & Theme
export const upsertMyProfile = async (username, theme = 'black') => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Harus login');

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      id: session.user.id, 
      username: username,
      theme: theme
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 9. Upload avatar ke Supabase Storage + update profile
export const uploadAvatar = async (file) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Harus login dulu');

  const userId = session.user.id;
  const ext = file.name.split('.').pop(); // Ambil ekstensi (jpg, png, dll)
  const filePath = `${userId}/avatar-${Date.now()}.${ext}`; // Path unik

  // 1. Upload ke Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // 2. Ambil URL publiknya
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  // 3. Simpan URL ke tabel profiles
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  if (updateError) throw updateError;

  return publicUrl;
};

// 10. Hapus avatar lama (biar storage nggak penuh)
export const deleteOldAvatar = async (oldUrl) => {
  if (!oldUrl) return;

  // Ambil path file dari URL (buang bagian domain)
  const pathMatch = oldUrl.match(/avatars\/(.+)$/);
  if (!pathMatch) return;

  const filePath = pathMatch[1];

  const { error } = await supabase.storage
    .from('avatars')
    .remove([filePath]);

  if (error) console.warn('Gagal hapus avatar lama:', error.message);
};