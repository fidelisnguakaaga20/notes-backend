import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import api from "../lib/axios";
import NoteForm from "../components/NoteForm";
import { useAuth } from "../context/AuthContext";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loadingNote, setLoadingNote] = useState(true); // ✅ renamed
  const [saving, setSaving] = useState(false);

  const { user, loading: authLoading } = useAuth(); // ✅ avoid conflict
  const navigate = useNavigate();
  const { id } = useParams();

  if (!user && !authLoading) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoadingNote(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async ({ title, content }) => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/notes/${id}`, { title, content });
      toast.success("Note updated successfully");
    } catch (error) {
      console.log("Error updating the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loadingNote) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Edit Note</h2>

              {note && (
                <NoteForm
                  loading={saving}
                  onSubmit={handleSave}
                  initialValues={{ title: note.title, content: note.content }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
