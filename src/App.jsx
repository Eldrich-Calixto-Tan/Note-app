import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDue, setEditDue] = useState("");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!title.trim()) return;
    setNotes([
      { id: Date.now(), title: title.trim(), desc: desc.trim(), due: dueDate },
      ...notes,
    ]);
    setTitle("");
    setDesc("");
    setDueDate("");
  };

  const deleteNote = (id) => setNotes(notes.filter((n) => n.id !== id));

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditDesc(note.desc);
    setEditDue(note.due);
  };

  const saveEdit = (id) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? { ...n, title: editTitle, desc: editDesc, due: editDue }
          : n
      )
    );
    setEditingId(null);
  };

  const isOverdue = (due) => {
    if (!due) return false;
    return new Date(due) < new Date(new Date().toDateString());
  };

  const formatDate = (due) => {
    if (!due) return "";
    return new Date(due).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="app">
      <h1>📝 Notes</h1>

      <div className="form">
        <input
          className="input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description..."
          rows={3}
        />
        <div className="form-row">
          <label>
            Due date:
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
          <button className="btn-add" onClick={addNote}>
            Add Note
          </button>
        </div>
      </div>

      <div className="notes">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`note ${isOverdue(note.due) ? "overdue" : ""}`}
          >
            {editingId === note.id ? (
              <div className="edit-form">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  autoFocus
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Description..."
                  rows={2}
                />
                <div className="form-row">
                  <label>
                    Due:
                    <input
                      type="date"
                      value={editDue}
                      onChange={(e) => setEditDue(e.target.value)}
                    />
                  </label>
                  <div className="edit-actions">
                    <button onClick={() => saveEdit(note.id)}>Save</button>
                    <button
                      className="cancel"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="note-content">
                  <h3>{note.title}</h3>
                  {note.desc && <p>{note.desc}</p>}
                  {note.due && (
                    <span className={`due-tag ${isOverdue(note.due) ? "due-overdue" : ""}`}>
                      📅 {formatDate(note.due)}
                    </span>
                  )}
                </div>
                <div className="note-actions">
                  <button onClick={() => startEdit(note)}>Edit</button>
                  <button
                    className="delete"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {notes.length === 0 && (
          <p className="empty">No notes yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default App;
