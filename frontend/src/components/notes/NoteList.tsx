import { FileText } from 'lucide-react';
import type { Note } from '@/lib/types';

interface NoteListProps {
  notes: Note[];
  selectedNoteId?: number;
  onSelectNote: (noteId: number) => void;
  decryptedTitles: Map<number, string>;
}

export const NoteList = ({ notes, selectedNoteId, onSelectNote, decryptedTitles }: NoteListProps) => {
  if (notes.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No notes yet. Create your first note!
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {notes.map((note) => {
        const title = decryptedTitles.get(note.id);
        
        return (
          <button
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`w-full p-3 rounded-lg text-left transition-colors ${
              selectedNoteId === note.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary'
            }`}
          >
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {title || (
                    <span className="text-muted-foreground italic">Loading...</span>
                  )}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
