// frontend/src/components/NoteCard.jsx
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const NoteCard = ({ note }) => {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title text-xl">{note.title}</h3>
        <p className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
        </p>
        <p className="mt-2">{note.content.slice(0, 100)}...</p>

        {/* ✅ Added: display tags */}
        {note.tags?.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {note.tags.map((tag, idx) => (
              <span key={idx} className="badge badge-outline">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <Link to={`/notes/${note._id}`} className="btn btn-sm btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
