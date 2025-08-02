import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"; /// ✅ ADDED
import * as yup from "yup";

/// ✅ ADDED - Validation schema
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
});

const NoteForm = ({
  onSubmit,
  loading,
  initialValues = { title: "", content: "", tags: [] },
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    /// ✅ ADDED resolver
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialValues.title,
      content: initialValues.content,
      tags: initialValues.tags?.join(", ") || "",
    },
  });

  /// ✅ Sync reset when initialValues change
  useEffect(() => {
    reset({
      title: initialValues.title,
      content: initialValues.content,
      tags: initialValues.tags?.join(", ") || "",
    });
  }, [initialValues, reset]);

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="p-4 space-y-4">
      {/* ✅ Title */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Note Title"
          className="input input-bordered"
          {...register("title")} /// ✅ Hook registration
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* ✅ Content */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Content</span>
        </label>
        <textarea
          placeholder="Write your note here..."
          className="textarea textarea-bordered h-32"
          {...register("content")} /// ✅ Hook registration
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* ✅ Tags */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Tags (comma-separated)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. react, mongodb"
          className="input input-bordered"
          {...register("tags")} /// ✅ Hook registration
        />
      </div>

      {/* ✅ Submit */}
      <div className="text-right">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
