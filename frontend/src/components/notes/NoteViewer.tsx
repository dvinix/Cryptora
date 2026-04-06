import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Lock, Copy, Check, Folder, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { DecryptedNote, DecryptedFolder } from '@/lib/types';

interface NoteViewerProps {
  note: DecryptedNote;
  folders?: DecryptedFolder[];
  onUpdate: (noteId: number, title: string, content: string, folderId?: number) => void;
  onDelete: (noteId: number) => void;
}

export const NoteViewer = ({ note, folders = [], onUpdate, onDelete }: NoteViewerProps) => {
  const [title, setTitle] = useState(note.decrypted_title || '');
  const [content, setContent] = useState(note.decrypted_content);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(note.folder_id);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.decrypted_title || '');
    setContent(note.decrypted_content);
    setCurrentFolderId(note.folder_id);
  }, [note.id]);

  // Auto-save after 1 second of inactivity
  useEffect(() => {
    const hasChanges = 
      title !== (note.decrypted_title || '') || 
      content !== note.decrypted_content;
    
    if (!hasChanges) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content]);

  const handleSave = async (newFolderId?: number) => {
    if (content.trim() && (title !== (note.decrypted_title || '') || content !== note.decrypted_content || newFolderId !== undefined)) {
      setIsSaving(true);
      await onUpdate(note.id, title, content, newFolderId);
      setIsSaving(false);
    }
  };

  const handleMoveToFolder = async (folderId: number | null) => {
    setCurrentFolderId(folderId);
    setIsSaving(true);
    // Use -1 to indicate "remove from folder"
    await onUpdate(note.id, title, content, folderId === null ? -1 : folderId);
    setIsSaving(false);
    toast({
      title: folderId ? 'Moved to folder' : 'Removed from folder',
      description: folderId 
        ? `Note moved to "${folders.find(f => f.id === folderId)?.decrypted_name}"`
        : 'Note is now unfiled',
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Note content copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const currentFolder = folders.find(f => f.id === currentFolderId);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Input
            type="text"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex items-center gap-2 mt-1">
            {isSaving && (
              <span className="text-sm text-muted-foreground">Saving...</span>
            )}
            {folders.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                    <Folder className="w-3 h-3 mr-1" />
                    {currentFolder ? currentFolder.decrypted_name : 'No folder'}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleMoveToFolder(null)}>
                    <span className="text-muted-foreground">No folder</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {folders.map((folder) => (
                    <DropdownMenuItem
                      key={folder.id}
                      onClick={() => handleMoveToFolder(folder.id)}
                      className={currentFolderId === folder.id ? 'bg-accent' : ''}
                    >
                      <Folder className="w-4 h-4 mr-2" />
                      {folder.decrypted_name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button
            onClick={() => onDelete(note.id)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-auto bg-background">
        <div className="max-w-full mx-auto px-4">
          <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
            {/* Notepad lines effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="border-b border-white/20" style={{ height: '32px' }} />
              ))}
            </div>
            <Textarea
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[calc(100vh-250px)] resize-none text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white leading-relaxed p-6 relative z-10"
            />
          </div>
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            <span>This note is end-to-end encrypted. Changes auto-save after 1 second.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
