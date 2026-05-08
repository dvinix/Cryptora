import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { DecryptedNote } from '@/lib/types';

interface NoteViewerProps {
  note: DecryptedNote;
  onUpdate: (noteId: number, title: string, content: string) => void;
  onDelete: (noteId: number) => void;
}

export const NoteViewer = ({ note, onUpdate, onDelete }: NoteViewerProps) => {
  const [title, setTitle] = useState(note.decrypted_title || '');
  const [content, setContent] = useState(note.decrypted_content);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.decrypted_title || '');
    setContent(note.decrypted_content);
  }, [note.id]);

  // Auto-save after 1 second of inactivity
  useEffect(() => {
    const hasChanges = 
      title.trim() !== (note.decrypted_title || '').trim() || 
      content.trim() !== note.decrypted_content.trim();
    
    if (!hasChanges || !content.trim()) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content]);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    const hasChanges = 
      title.trim() !== (note.decrypted_title || '').trim() || 
      content.trim() !== note.decrypted_content.trim();
    
    if (hasChanges) {
      setIsSaving(true);
      await onUpdate(note.id, title.trim(), content.trim());
      setIsSaving(false);
    }
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

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Input
            type="text"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex items-center gap-2 mt-1">
            {isSaving && (
              <span className="text-xs text-muted-foreground">Saving...</span>
            )}
            <span className="text-xs text-muted-foreground">
              Created: {new Date(note.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button
            onClick={() => {
              if (confirm('Delete this note?')) {
                onDelete(note.id);
              }
            }}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="h-full min-h-[calc(100vh-150px)] border-0 focus-visible:ring-0 resize-none text-base focus-visible:ring-offset-0 leading-relaxed p-4"
        />
      </div>
    </div>
  );
};
