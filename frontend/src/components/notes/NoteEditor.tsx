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
      onSave(title.trim(), content.trim());
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
          <Button onClick={handleSave} size="sm" disabled={!content.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={onCancel} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <Textarea
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-full min-h-[calc(100vh-150px)] resize-none text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed p-4"
          autoFocus
        />
      </div>
    </div>
  );
};
