import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import useFetchNotes from "../hooks/useFetchNotes";
import { getAuth } from "firebase/auth"; /// ✅ ADDED
import { Link } from "react-router";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const {
    notes,
    loading,
    setNotes,
    page,
    setPage,
    totalPages,
  } = useFetchNotes(search, selectedTag);

  /// ✅ Log Firebase ID token once (TEMPORARY)
  useEffect(() => {
    const fetchToken = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        console.log("🔥 Firebase ID Token:", token);
      } else {
        console.warn("No user logged in.");
      }
    };
    fetchToken();
  }, []);

  const safeNotes = Array.isArray(notes) ? notes : [];
  const allTags = [...new Set(safeNotes.flatMap((note) => note.tags || []))];
  console.log(safeNotes)
  const handleClearFilters = () => {
    setSearch("");
    setSelectedTag("");
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search + Clear */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full"
        />
        <button onClick={handleClearFilters} className="btn btn-outline">
          Clear Filters
        </button>
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {allTags.map((tag, idx) => (
          <button
            key={idx}
            className={`badge badge-outline ${selectedTag === tag ? "badge-primary" : ""}`}
            onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Notes */}
      {loading ? (
        <p>Loading...</p>
      ) : safeNotes.length === 0 ? (
        <NotesNotFound />
      ) : (
        <div className="grid gap-4">
          <Link to="/create" className="btn btn-primary">
        Create Note
      </Link>
          {safeNotes.map((note) => (
            <NoteCard key={note._id} note={note} setNotes={setNotes} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                className="btn btn-sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>

              <span className="text-sm pt-2">
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-sm"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
