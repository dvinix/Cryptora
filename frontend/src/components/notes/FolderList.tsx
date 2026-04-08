import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Folder, ChevronRight, ChevronDown, MoreHorizontal, Edit2, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Note, DecryptedFolder } from '@/lib/types';

interface FolderListProps {
  folders: DecryptedFolder[];
  notes: Note[];
  selectedFolderId: number | null;
  selectedNoteId: number | undefined;
  onSelectFolder: (folderId: number | null) => void;
  onSelectNote: (noteId: number) => void;
  onEditFolder: (folder: DecryptedFolder) => void;
  onDeleteFolder: (folderId: number) => void;
  onFolderExpand: (folderId: number) => void;
  decryptedTitles: Map<number, string>;
}

const FOLDER_COLORS: Record<string, string> = {
  default: 'text-primary',
  red: 'text-red-500',
  orange: 'text-orange-500',
  yellow: 'text-yellow-500',
  green: 'text-green-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  pink: 'text-pink-500',
};

export const FolderList = ({
  folders,
  notes,
  selectedFolderId,
  selectedNoteId,
  onSelectFolder,
  onSelectNote,
  onEditFolder,
  onDeleteFolder,
  onFolderExpand,
  decryptedTitles,
}: FolderListProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  const toggleFolder = (folderId: number) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
      // Decrypt folder name when expanded
      onFolderExpand(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getNotesInFolder = (folderId: number) => {
    return notes.filter((note) => note.folder_id === folderId);
  };

  const getUnfiledNotes = () => {
    return notes.filter((note) => note.folder_id === null);
  };

  return (
    <div className="space-y-1">
      {/* All Notes option */}
      <button
        onClick={() => onSelectFolder(null)}
        className={cn(
          'w-full px-3 py-2 flex items-center gap-2 rounded-lg transition-colors text-left',
          selectedFolderId === null && selectedNoteId === undefined
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
        )}
      >
        <FileText className="w-4 h-4" />
        <span className="text-sm font-medium">All Notes</span>
        <span className="ml-auto text-xs text-muted-foreground">{notes.length}</span>
      </button>

      {/* Folders */}
      {folders.map((folder) => {
        const folderNotes = getNotesInFolder(folder.id);
        const isExpanded = expandedFolders.has(folder.id);
        const colorClass = FOLDER_COLORS[folder.color || 'default'] || FOLDER_COLORS.default;

        return (
          <div key={folder.id}>
            <div
              className={cn(
                'w-full px-3 py-2 flex items-center gap-2 rounded-lg transition-colors group',
                selectedFolderId === folder.id
                  ? 'bg-primary/10'
                  : 'hover:bg-accent/50'
              )}
            >
              <button
                onClick={() => toggleFolder(folder.id)}
                className="p-0.5 hover:bg-accent rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
              
              <button
                onClick={() => {
                  onSelectFolder(folder.id);
                  if (!isExpanded) {
                    toggleFolder(folder.id);
                  }
                }}
                className="flex-1 flex items-center gap-2 text-left"
              >
                <Folder className={cn('w-4 h-4', colorClass)} />
                <span className="text-sm font-medium truncate">
                  {folder.decrypted_name || <span className="text-muted-foreground italic">Loading...</span>}
                </span>
                <span className="text-xs text-muted-foreground">{folderNotes.length}</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => onEditFolder(folder)}>
                    <Edit2 className="w-3 h-3 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteFolder(folder.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notes in folder */}
            {isExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                {folderNotes.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-3 py-1">No notes</p>
                ) : (
                  folderNotes.map((note) => {
                    const title = decryptedTitles.get(note.id);
                    return (
                      <button
                        key={note.id}
                        onClick={() => onSelectNote(note.id)}
                        className={cn(
                          'w-full px-3 py-1.5 flex items-center gap-2 rounded-md transition-colors text-left text-sm',
                          selectedNoteId === note.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <FileText className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {title || <span className="italic">Loading...</span>}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Unfiled Notes section */}
      {getUnfiledNotes().length > 0 && folders.length > 0 && (
        <div className="pt-2 border-t border-border/50 mt-2">
          <p className="px-3 py-1 text-xs text-muted-foreground font-medium">Unfiled</p>
          {getUnfiledNotes().map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={cn(
                'w-full px-3 py-2 flex items-center gap-2 rounded-lg transition-colors text-left',
                selectedNoteId === note.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
              )}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{decryptedTitles.get(note.id) || 'Untitled'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
