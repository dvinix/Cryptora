import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notesApi, setAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, LogOut, FileText, Trash2 } from 'lucide-react';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { NoteViewer } from '@/components/notes/NoteViewer';
import { useToast } from '@/components/ui/use-toast';
import type { Note, DecryptedNote } from '@/lib/types';

export const DashboardPage = () => {
  const { user, password, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<DecryptedNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set auth token when user logs in or component mounts
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    loadNotes();
  }, [isAuthenticated]);

  const loadNotes = async () => {
    if (!user || !password) return;
    try {
      const data = await notesApi.getUserWithNotes(user.alias, password);
      setNotes(data.notes);
    } catch (error) {
      console.error('Failed to load notes', error);
      toast({
        title: 'Error',
        description: 'Failed to load notes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNote = async (noteId: number) => {
    if (!user || !password) return;
    try {
      const note = await notesApi.getNote(user.alias, noteId, password);
      setSelectedNote(note);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to load note', error);
      toast({
        title: 'Error',
        description: 'Failed to load note',
        variant: 'destructive',
      });
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    if (!user || !password) return;
    try {
      const newNote = await notesApi.createNote(user.alias, password, {
        title,
        content,
      });
      setNotes([newNote, ...notes]);
      setSelectedNote({
        ...newNote,
        decrypted_title: title,
        decrypted_content: content,
      });
      setIsCreating(false);
      toast({
        title: 'Success',
        description: 'Note created successfully',
      });
    } catch (error) {
      console.error('Failed to create note', error);
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateNote = async (noteId: number, title: string, content: string) => {
    if (!user || !password) return;
    try {
      const updatedNote = await notesApi.updateNote(user.alias, noteId, password, {
        title,
        content,
      });
      setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
      setSelectedNote({
        ...updatedNote,
        decrypted_title: title,
        decrypted_content: content,
      });
      toast({
        title: 'Success',
        description: 'Note updated successfully',
      });
    } catch (error) {
      console.error('Failed to update note', error);
      toast({
        title: 'Error',
        description: 'Failed to update note',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!user || !password) return;
    try {
      await notesApi.deleteNote(user.alias, noteId, password);
      setNotes(notes.filter(n => n.id !== noteId));
      setSelectedNote(null);
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete note', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold">{user?.alias}'s Notes</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* New Note Button */}
        <div className="p-4 border-b border-border">
          <Button
            onClick={() => {
              setIsCreating(true);
              setSelectedNote(null);
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Notes List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {notes.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notes yet. Create your first note!
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors group">
                  <button
                    onClick={() => handleSelectNote(note.id)}
                    className={`flex-1 text-left ${
                      selectedNote?.id === note.id
                        ? 'bg-primary text-primary-foreground px-2 py-2 rounded'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          Note #{note.id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(note.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this note?')) {
                        handleDeleteNote(note.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-background/50">
        {isCreating ? (
          <NoteEditor onSave={handleCreateNote} onCancel={() => setIsCreating(false)} />
        ) : selectedNote ? (
          <NoteViewer
            note={selectedNote}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4 p-8 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">No note selected</p>
                <p className="text-muted-foreground">Select a note from the sidebar or create a new one</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
