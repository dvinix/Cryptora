import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notesApi, foldersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, LogOut, FileText, FolderPlus } from 'lucide-react';
import { FolderList } from '@/components/notes/FolderList';
import { FolderDialog } from '@/components/notes/FolderDialog';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { NoteViewer } from '@/components/notes/NoteViewer';
import { useToast } from '@/components/ui/use-toast';
import type { Note, DecryptedNote, DecryptedFolder } from '@/lib/types';

export const DashboardPage = () => {
  const { user, password, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [decryptedFolders, setDecryptedFolders] = useState<DecryptedFolder[]>([]);
  const [decryptedTitles, setDecryptedTitles] = useState<Map<number, string>>(new Map());
  const [selectedNote, setSelectedNote] = useState<DecryptedNote | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Folder dialog state
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<DecryptedFolder | null>(null);

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
      
      // Don't decrypt folder names on load - will decrypt on demand
      const decryptedFoldersList: DecryptedFolder[] = data.folders.map(folder => ({
        ...folder,
        decrypted_name: '', // Will be decrypted on demand
      }));
      setDecryptedFolders(decryptedFoldersList);
      
      // Don't decrypt anything on initial load
      setDecryptedTitles(new Map());
    } catch (error) {
      console.error('Failed to load notes', error);
    } finally {
      setLoading(false);
    }
  };

  // Decrypt folder name on demand
  const decryptFolderName = async (folderId: number) => {
    if (!user || !password) return;
    
    const folder = decryptedFolders.find(f => f.id === folderId);
    if (!folder || folder.decrypted_name) return; // Already decrypted
    
    try {
      const decrypted = await foldersApi.getFolder(user.alias, folderId, password);
      setDecryptedFolders(prev => 
        prev.map(f => f.id === folderId ? decrypted : f)
      );
    } catch (error) {
      setDecryptedFolders(prev => 
        prev.map(f => f.id === folderId ? { ...f, decrypted_name: 'Unnamed Folder' } : f)
      );
    }
  };

  // Decrypt note titles for a specific folder
  const decryptNoteTitlesInFolder = async (folderId: number | null) => {
    if (!user || !password) return;
    
    const folderNotes = folderId === null 
      ? notes 
      : notes.filter(note => note.folder_id === folderId);
    
    for (const note of folderNotes) {
      if (!decryptedTitles.has(note.id)) {
        try {
          const decrypted = await notesApi.getNote(user.alias, note.id, password);
          setDecryptedTitles(prev => new Map(prev).set(note.id, decrypted.decrypted_title || 'Untitled'));
        } catch (error) {
          setDecryptedTitles(prev => new Map(prev).set(note.id, 'Untitled'));
        }
      }
    }
  };

  // Handle folder selection - decrypt folder name and note titles
  const handleSelectFolder = async (folderId: number | null) => {
    setSelectedFolderId(folderId);
    
    if (folderId !== null) {
      // Decrypt folder name if not already decrypted
      await decryptFolderName(folderId);
      // Decrypt note titles in this folder
      await decryptNoteTitlesInFolder(folderId);
    }
  };

  const handleSelectNote = async (noteId: number) => {
    if (!user || !password) return;
    try {
      const note = await notesApi.getNote(user.alias, noteId, password);
      setSelectedNote(note);
      setIsCreating(false);
      
      // Cache the decrypted title
      setDecryptedTitles(prev => new Map(prev).set(noteId, note.decrypted_title || 'Untitled'));
    } catch (error) {
      console.error('Failed to load note', error);
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    if (!user || !password) return;
    try {
      await notesApi.createNote(user.alias, password, { 
        title, 
        content,
        folder_id: selectedFolderId || undefined
      });
      await loadNotes();
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create note', error);
    }
  };

  const handleUpdateNote = async (noteId: number, title: string, content: string, folderId?: number) => {
    if (!user || !password) return;
    try {
      await notesApi.updateNote(user.alias, noteId, password, { 
        title, 
        content,
        folder_id: folderId
      });
      await loadNotes();
      if (selectedNote) {
        handleSelectNote(noteId);
      }
    } catch (error) {
      console.error('Failed to update note', error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!user || !password) return;
    try {
      await notesApi.deleteNote(user.alias, noteId, password);
      await loadNotes();
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  // Folder handlers
  const handleCreateFolder = async (name: string, color: string) => {
    if (!user || !password) return;
    try {
      await foldersApi.createFolder(user.alias, password, { name, color });
      await loadNotes();
      toast({
        title: 'Folder created',
        description: `"${name}" has been created.`,
      });
    } catch (error) {
      console.error('Failed to create folder', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    }
  };

  const handleEditFolder = (folder: DecryptedFolder) => {
    setEditingFolder(folder);
    setFolderDialogOpen(true);
  };

  const handleUpdateFolder = async (name: string, color: string) => {
    if (!user || !password || !editingFolder) return;
    try {
      await foldersApi.updateFolder(user.alias, editingFolder.id, password, { name, color });
      await loadNotes();
      setEditingFolder(null);
      toast({
        title: 'Folder updated',
        description: `Folder has been renamed to "${name}".`,
      });
    } catch (error) {
      console.error('Failed to update folder', error);
      toast({
        title: 'Error',
        description: 'Failed to update folder',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    if (!user || !password) return;
    try {
      await foldersApi.deleteFolder(user.alias, folderId, password);
      await loadNotes();
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
      toast({
        title: 'Folder deleted',
        description: 'Notes have been moved to unfiled.',
      });
    } catch (error) {
      console.error('Failed to delete folder', error);
      toast({
        title: 'Error',
        description: 'Failed to delete folder',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold">{user?.alias}'s Notes</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
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
          <Button
            onClick={() => {
              setEditingFolder(null);
              setFolderDialogOpen(true);
            }}
            variant="outline"
            className="w-full"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <FolderList
            folders={decryptedFolders}
            notes={notes}
            selectedFolderId={selectedFolderId}
            selectedNoteId={selectedNote?.id}
            onSelectFolder={handleSelectFolder}
            onSelectNote={handleSelectNote}
            onEditFolder={handleEditFolder}
            onDeleteFolder={handleDeleteFolder}
            onFolderExpand={decryptFolderName}
            decryptedTitles={decryptedTitles}
          />
        </ScrollArea>
      </div>

      <div className="flex-1 bg-background/50">
        {isCreating ? (
          <NoteEditor onSave={handleCreateNote} onCancel={() => setIsCreating(false)} />
        ) : selectedNote ? (
          <NoteViewer
            note={selectedNote}
            folders={decryptedFolders}
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

      <FolderDialog
        open={folderDialogOpen}
        onClose={() => {
          setFolderDialogOpen(false);
          setEditingFolder(null);
        }}
        onSave={editingFolder ? handleUpdateFolder : handleCreateFolder}
        folder={editingFolder}
      />
    </div>
  );
};
