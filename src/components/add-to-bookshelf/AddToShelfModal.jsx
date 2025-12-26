import { useState, useEffect } from "react";
import "./AddToShelfModal.css";
import {
  useFolderTree,
  useCreateFolder,
  useCreateFile,
} from "../../hooks/folder/useFolder";

export default function AddToShelfModal({ article, onClose }) {
  const { data: shelf = [], isLoading } = useFolderTree();
  const createFolderMut = useCreateFolder();
  const createFileMut = useCreateFile();

  const [path, setPath] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Virtual root (same idea as MyBookShelf)
  useEffect(() => {
    if (shelf.length && path.length === 0) {
      setPath([
        {
          id: "ROOT",
          name: "My-BookShelf",
          subfolders: shelf,
          items: [],
        },
      ]);
    }
  }, [shelf]);

  const currentFolder = path[path.length - 1];

  const enterFolder = (folder) => {
    setPath([...path, folder]);
    setSelectedFolderId(folder.id);
  };

  const goTo = (index) => {
    setPath(path.slice(0, index + 1));
    setSelectedFolderId(path[index]?.id);
  };

  const createFolder = async () => {
    const name = prompt("Folder name?");
    if (!name) return;

    await createFolderMut.mutateAsync({
      name,
      parent: currentFolder?.id === "ROOT" ? null : currentFolder?.id,
    });
  };

  const handleAdd = async () => {
    if (!selectedFolderId || selectedFolderId === "ROOT") return;

    await createFileMut.mutateAsync({
      folder: selectedFolderId,
      title: article.title,
      url: article.pdf,
    });

    onClose();
  };

  return (
    <div className="bookshelf-modal-backdrop">
      <div className="bookshelf-modal">

        {/* HEADER */}
        <div className="modal-header">
          <h5>Add to Shelf</h5>
          <button onClick={onClose}>×</button>
        </div>

        {/* ARTICLE */}
        <div className="modal-article">
          <i className="ri-file-text-line"></i>
          <span>{article.title}</span>
        </div>

        {/* BREADCRUMB */}
        <div className="breadcrumb-area px-3">
          {path.map((p, index) => (
            <span key={p.id}>
              <span
                className={`breadcrumb-link ${
                  index === path.length - 1 ? "active" : ""
                }`}
                onClick={() => goTo(index)}
              >
                {p.name}
              </span>
              {index < path.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </div>

        {/* CONTENT */}
        <div className="modal-content-area">
          {isLoading ? (
            <div className="text-muted small">Loading folders…</div>
          ) : (
            <div className="bookshelf-grid">

              {currentFolder?.subfolders?.map((f) => (
                <div key={f.id} className="item-wrapper">
                  <div
                    className={`folder-card ${
                      selectedFolderId === f.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedFolderId(f.id)}
                    onDoubleClick={() => enterFolder(f)}
                  >
                    <i className="ri-folder-fill folder-icon"></i>
                    <div className="file-title">{f.name}</div>
                  </div>
                </div>
              ))}

              {currentFolder?.subfolders?.length === 0 && (
                <div className="text-muted small">
                  No subfolders here.
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn btn-light" onClick={createFolder}>
            + New Folder
          </button>

          <div>
            <button className="btn btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              disabled={!selectedFolderId || selectedFolderId === "ROOT"}
              onClick={handleAdd}
            >
              Add Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
