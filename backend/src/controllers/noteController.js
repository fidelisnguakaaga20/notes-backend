import Note from "../models/Note.js";

export const getAllNotes = async (req, res) => {
  try {
    const { uid } = req;
    const notes = await Note.find({ userId: uid });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req;
    const note = await Note.findOne({ _id: id, userId: uid });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const { uid } = req;

    const newNote = new Note({
      title,
      content,
      tags,
      userId: uid,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req;
    const { title, content, tags } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: uid },
      { title, content, tags },
      { new: true }
    );

    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req;

    const deletedNote = await Note.findOneAndDelete({ _id: id, userId: uid });

    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
