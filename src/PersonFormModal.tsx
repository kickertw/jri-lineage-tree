import { useState, useEffect, useMemo } from "react";
import type { PersonNode } from "./graphData";

interface PersonFormModalProps {
  mode: "add" | "edit";
  people: PersonNode[];
  nodeId?: string;
  initialName?: string;
  initialRank?: string;
  initialType?: string;
  initialNotes?: string;
  initialInstructorIds?: string[];
  onSave: (data: {
    nodeId?: string;
    name: string;
    rank: string;
    type: string;
    notes: string;
    instructorIds: string[];
  }) => void;
  onClose: () => void;
}

export default function PersonFormModal({
  mode,
  people,
  nodeId,
  initialName = "",
  initialRank = "",
  initialType = "black",
  initialNotes = "",
  initialInstructorIds = [],
  onSave,
  onClose,
}: PersonFormModalProps) {
  const [name, setName] = useState(initialName);
  const [rank, setRank] = useState(initialRank);
  const [type, setType] = useState(initialType);
  const [notes, setNotes] = useState(initialNotes);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>(initialInstructorIds);
  const [instructorSearch, setInstructorSearch] = useState("");

  useEffect(() => {
    setName(initialName);
    setRank(initialRank);
    setType(initialType);
    setNotes(initialNotes);
    setSelectedInstructors(initialInstructorIds);
  }, [mode, nodeId]);

  const filteredPeople = useMemo(() => {
    const candidates = people.filter((p) => p.id !== nodeId);
    if (!instructorSearch) return candidates;
    const search = instructorSearch.toLowerCase();
    return candidates.filter((p) => p.name.toLowerCase().includes(search));
  }, [people, nodeId, instructorSearch]);

  const toggleInstructor = (id: string) => {
    setSelectedInstructors((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || !rank.trim()) {
      alert("Name and rank are required");
      return;
    }
    onSave({
      nodeId,
      name: name.trim(),
      rank: rank.trim(),
      type,
      notes: notes.trim(),
      instructorIds: selectedInstructors,
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <h2>{mode === "add" ? "Add New Person" : "Edit Person"}</h2>
        <div className="modal-field">
          <label>Name {mode === "add" && "*"}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            autoFocus={mode === "add"}
          />
        </div>
        <div className="modal-field">
          <label>Rank {mode === "add" && "*"}</label>
          <input
            type="text"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="e.g., 5th Dan Black Belt"
          />
        </div>
        <div className="modal-field">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="master">Master</option>
            <option value="black">Black Belt</option>
          </select>
        </div>
        <div className="modal-field">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={mode === "add" ? 3 : 4}
            placeholder="Optional notes about this person"
          />
        </div>
        <div className="modal-field">
          <label>Instructors</label>
          <input
            type="text"
            value={instructorSearch}
            onChange={(e) => setInstructorSearch(e.target.value)}
            placeholder="Search to filter..."
            className="instructor-search"
          />
          <div className="instructor-list">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className="instructor-item"
                onClick={() => toggleInstructor(person.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedInstructors.includes(person.id)}
                  onChange={() => toggleInstructor(person.id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: 'auto', padding: 0 }}
                />
                <div className="instructor-info" style={{ flex: '0 0 auto' }}>
                  <span className="instructor-name">{person.name}</span>
                  <span className="instructor-rank">{person.rank}</span>
                </div>
              </div>
            ))}
            {filteredPeople.length === 0 && (
              <div className="instructor-empty">No matches found</div>
            )}
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-save" onClick={handleSubmit}>
            {mode === "add" ? "Add Person" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
