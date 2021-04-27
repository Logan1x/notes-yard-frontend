import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { createNote, getNotes } from "../../CRUD/note.crud";
import ReactQuill from "react-quill";
import "../../../node_modules/react-quill/dist/quill.snow.css";
toast.configure();
Modal.setAppElement("*");

const CreateNote = ({ modalStatus, setModalStatus, notebookId, userId, setApiResponse }) => {
  // State Variables
  const [noteName, setNoteName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  // Validating that Collection Name
  const validateFields = () => {
    setError("");
    if (noteName === null || noteName === "") {
      setError("Please enter a notebook name");
      return false;
    }
    return true;
  };

  // Close Modal Function
  const closeModal = () => {
    setError("");
    setNoteName("");
    setNoteContent("")
    setModalStatus(false);
  };

  // Creating Note API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      await createNote(userId, notebookId, noteName, noteContent);
      const updatedList = await getNotes(notebookId)
      setApiResponse(updatedList.data)
      const message = "Bingo! New Note Have Been Created Successfully.";
      toast.success(message, {
        position: "top-right",
        autoClose: 0,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setModalStatus(false);
      setNoteName("");
      setNoteContent("");
      setLoading(false);
    } catch (err) {
      let error = err.message || "Something went wrong!";
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={modalStatus}
      onRequestClose={() => closeModal()}
      className="react-modal"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header" style={{ padding: "1.5rem" }}>
            <h5 className="modal-title">Create Note</h5>
            <button
              type="button"
              className="close"
              onClick={() => closeModal()}
            >
              <span> &times; </span>
            </button>
          </div>
          <div className="modal-body" style={{ padding: "1.5rem" }}>
            <form>
              <div className="form-group">
                <label htmlFor="noteName">Note Title*</label>
                <input
                  required
                  type="text"
                  className="form-control"
                  name="noteName"
                  id="noteName"
                  value={noteName}
                  placeholder="For Eg: Things to do in 2021"
                  onChange={(e) => {
                    setNoteName(e.target.value);
                  }}
                  onBlur={validateFields}
                />
                <div className="text-danger">{error || ""}</div>
              </div>
              <div className="form-group">
                <label htmlFor="noteName">Note Content*</label>
                <ReactQuill
                  onChange={(e) => setNoteContent(e)}
                  value={noteContent}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer" style={{ padding: "1.5rem" }}>
            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              className="btn btn-primary"
              disabled={loading}
            >
              Create Note {loading ? "  " : ""}
              <span
                className={loading ? "spinner-border spinner-border-sm" : ""}
                role="status"
                aria-hidden="true"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateNote;
