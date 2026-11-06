import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("notes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  }, [notes]);

  const addNote = () => {
    if (!title.trim()) return;
    const newNote = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
    };
    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      addNote();
    }
  };

  return (
    <div className="page-container">
      <div className="editor-card">
        <h1 className="editor-title">Real-Time Notes Editor</h1>

        <div className="form-group">
          <input
            type="text"
            className="input-title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />

          <textarea
            className="input-content"
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
          />

          <button type="button" className="btn-add" onClick={addNote}>
            Add Note
          </button>
        </div>

        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <div className="note-body">
                <h3 className="note-title">{note.title}</h3>
                {note.content && <p className="note-text">{note.content}</p>}
              </div>
              <button
                type="button"
                className="btn-delete"
                onClick={() => deleteNote(note.id)}
                aria-label="Delete note"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
