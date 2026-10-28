import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Globe, Github, Linkedin, Edit2, MoreVertical } from 'lucide-react';
import ArcadeCard from './ArcadeCard';

const ICONS = { Globe, Github, Linkedin };

export function LinkCardView({ link, isOverlay = false, onDelete, onEdit }) {
  const Icon = ICONS[link.icon] || Globe;
  
  return (
    <ArcadeCard 
      accent={link.color} 
      isButton={true} // <-- Pake varian button
      className={`
        relative w-full mb-3
        ${isOverlay ? 'rotate-2 scale-105 cursor-grabbing shadow-hard-yellow' : 'cursor-grab'}
      `}
      onClick={!isOverlay ? onEdit : undefined} 
    >
      {/* Ikon di Kiri */}
      <div className="flex-shrink-0 border-2 border-white bg-arcade-bg p-1.5 rounded">
        <Icon size={20} className="text-white" />
      </div>
      
      {/* Judul di Tengah */}
      <div className="flex-grow text-center px-4 overflow-hidden">
        <p className="font-pixel text-[10px] sm:text-xs text-white uppercase truncate">
          {link.title}
        </p>
      </div>
      
      {/* Tombol Aksi di Kanan */}
      <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
        {onDelete && !isOverlay && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(link.id); }} 
            className="text-arcade-red hover:text-white transition-colors p-1"
            aria-label="Hapus link"
          >
            <Trash2 size={16} />
          </button>
        )}
        
        {onEdit && !isOverlay && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }} 
            className="text-gray-400 hover:text-arcade-yellow transition-colors p-1"
            aria-label="Edit link"
          >
            <MoreVertical size={18} />
          </button>
        )}
        
        <div className="text-white/30 cursor-grab">
          <GripVertical size={18} />
        </div>
      </div>
    </ArcadeCard>
  );
}

export default function LinkCard({ link, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LinkCardView 
        link={link} 
        onDelete={onDelete} 
        onEdit={onEdit ? () => onEdit(link) : undefined} 
      />
    </div>
  );
}