import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../lib/axios";
import NoteForm from "../components/NoteForm";
import { useAuth } from "../context/AuthContext";

const CreatePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  if (!user && !authLoading) return <Navigate to="/" />;

  const handleSubmit = async ({ title, content, tags }) => {
    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const token = await user.getIdToken();
      await api.post(
        "/notes",
        { title, content, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating notes too fast");
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <NoteForm loading={loading} onSubmit={handleSubmit} initialValues={{ title: "", content: "", tags: [] }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;

