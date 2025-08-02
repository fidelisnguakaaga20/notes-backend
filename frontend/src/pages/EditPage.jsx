/// frontend/src/pages/EditPage.jsx
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import NoteForm from "../components/NoteForm";
import { useAuth } from "../context/AuthContext";

const EditPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  /// ✅ Fetch the note to pre-fill the form
  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true); /// ✅ Important: begin loading here
      try {
        const token = await user.getIdToken(); /// ✅ Secure fetch
        const res = await api.get(`/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInitialValues(res.data); /// ✅ Loaded note into form
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to load note");
      } finally {
        setLoading(false); /// ✅ Stop loading
      }
    };

    fetchNote();
  }, [id, user]);

  /// ✅ Update note handler
  const handleSubmit = async ({ title, content, tags }) => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      await api.put(
        `/notes/${id}`,
        { title, content, tags },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Note updated successfully!");
      navigate("/"); /// ✅ Redirect after update
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Edit Note</h2>

              {initialValues ? (
                <NoteForm
                  loading={loading}
                  onSubmit={handleSubmit}
                  initialValues={initialValues}
                />
              ) : (
                <p>Loading note...</p> /// ✅ Will disappear once fetched
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
