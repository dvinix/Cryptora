import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

export const NoteEditor = ({
  initialTitle = '',
  initialContent = '',
  onSave,
  onCancel,
}: NoteEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (content.trim()) {
      onSave(title, content);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Note title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={onCancel} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-auto bg-background">
        <div className="max-w-full mx-auto h-full px-4">
          <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden h-full">
            {/* Notepad lines effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="border-b border-white/20" style={{ height: '32px' }} />
              ))}
            </div>
            <Textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-full min-h-[calc(100vh-200px)] resize-none text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white leading-relaxed p-6 relative z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
