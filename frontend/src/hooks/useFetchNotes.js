import { useEffect, useState } from "react";
import api from "../lib/axios";

const useFetchNotes = (search = "", tag = "") => { // ⬅️ removed `page` and `limit` from here
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1); // ✅ NEW: local state to control pagination
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await api.get("/notes", {
          params: { search, tag, page, limit: 5 }, // ✅ limit hardcoded to 5 here
        });
        console.log(res)
        setNotes(res.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [search, tag, page]); // ✅ Now listening to internal `page` state here

  return {
    notes,
    loading,
    totalPages,
    setNotes,
    page,       // ✅ expose current page
    setPage     // ✅ expose setter for page control
  };
};

export default useFetchNotes;
