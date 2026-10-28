export const saveLinks = (links) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('linkforge_links', JSON.stringify(links));
  }
};

export const getLinks = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('linkforge_links');
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};