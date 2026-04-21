import './App.css'
import { useState } from "react";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrUpdate = () => {
    if (note.trim() === "") return;

    if (editIndex !== null) {
      // Update existing note
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = note;
      setNotes(updatedNotes);
      setEditIndex(null);
    } else {
      // Add new note
      setNotes([...notes, note]);
    }

    setNote("");
  };

  const handleEdit = (index) => {
    setNote(notes[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const filteredNotes = notes.filter((_, i) => i !== index);
    setNotes(filteredNotes);

    if (editIndex === index) {
      setNote("");
      setEditIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Notes App</h1>

      {/* Input Section */}
      <div className="flex gap-2 w-full max-w-md mb-6">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter note..."
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Notes List */}
      <div className="w-full max-w-md space-y-3">
        {notes.length === 0 && (
          <p className="text-gray-400 text-center">No notes yet</p>
        )}

        {notes.map((n, index) => (
          <div
            key={index}
            className="bg-gray-800 p-3 rounded flex justify-between items-center"
          >
            <span>{n}</span>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="bg-yellow-500 px-2 py-1 rounded text-black hover:bg-yellow-400"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-600 px-2 py-1 rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
