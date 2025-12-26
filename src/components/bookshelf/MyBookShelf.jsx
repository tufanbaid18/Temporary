import { useState, useEffect } from "react";
import "./MyBookShelf.css";
import {
  useFolderTree,
  useCreateFolder, useCreateFile,
  useRenameFolder,
  useDeleteFolder,
  useRenameFile,
  useDeleteFile,
} from "../../hooks/folder/useFolder";

export default function MyBookShelf() {
  const { data: shelf = [], isLoading } = useFolderTree();

  const renameFolderMut = useRenameFolder();
  const deleteFolderMut = useDeleteFolder();
  const renameFileMut = useRenameFile();
  const deleteFileMut = useDeleteFile();
  const createFolderMut = useCreateFolder();
  const createFileMut = useCreateFile();

  const [path, setPath] = useState([]);

  // ⭐ FIX: Create a virtual "root" containing all top-level folders
  useEffect(() => {
    if (shelf.length > 0 && path.length === 0) {
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

  const enterFolder = (folder) => setPath([...path, folder]);
  const goTo = (index) => setPath(path.slice(0, index + 1));

  // Actions
  const createFolder = () => {
    const name = prompt("Folder name?");
    if (!name) return;

    const parent = currentFolder?.id || null;

    createFolderMut.mutate({ name, parent });
  };

  const createFile = () => {
    const title = prompt("File name?");
    const url = prompt("PDF URL?");
    if (!title || !url) return;

    const folder = currentFolder?.id || null;

    createFileMut.mutate({ title, url, folder });
  };

  const renameItem = (item) => {
    const newName = prompt("Enter new name", item.name || item.title);
    if (!newName) return;

    if ("subfolders" in item) {
      renameFolderMut.mutate({ id: item.id, name: newName });
    } else {
      renameFileMut.mutate({ id: item.id, title: newName });
    }
  };

  const deleteItem = (item) => {
    if (!window.confirm(`Delete ${item.name || item.title}?`)) return;

    if ("subfolders" in item) deleteFolderMut.mutate(item.id);
    else deleteFileMut.mutate(item.id);
  };

  const moveItem = (item) => alert("Move coming soon…");
  const copyLink = (item) => navigator.clipboard.writeText(item.url || "");

  // Sidebar Tree
  const renderTree = (node, level = 0) => {
    if (node.id === "ROOT") return null; // don't show virtual root

    const isActive = currentFolder?.id === node.id;

    return (
      <div key={node.id} className="tree-node">
        <div
          className={`tree-label ${isActive ? "active" : ""}`}
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => setPath(findPathToNode(node.id))}
        >
          <i className="ri-folder-2-line me-1"></i>
          {node.name}
        </div>

        {node.subfolders?.map((child) => renderTree(child, level + 1))}
      </div>
    );
  };

  // Find full path recursively
  const findPathToNode = (targetId) => {
    const search = (nodes, acc = []) => {
      for (const n of nodes) {
        const newAcc = [...acc, n];
        if (n.id === targetId) return newAcc;
        if (n.subfolders?.length) {
          const result = search(n.subfolders, newAcc);
          if (result) return result;
        }
      }
      return null;
    };

    return [
      {
        id: "ROOT",
        name: "My-BookShelf",
        subfolders: shelf,
        items: [],
      },
      ...(search(shelf) || []),
    ];
  };

  return (
    <div className="bookshelf-layout">

      {/* Sidebar */}
      <div className="bookshelf-sidebar px-3">
        <h5 className="px-3 mt-3 mb-2">Folders</h5>
        <div className="tree-container">
          {shelf.map((root) => renderTree(root))}
        </div>
      </div>

      {/* Main */}
      <div className="bookshelf-main">
        <div className="d-flex justify-content-between">
          <h2 className="mb-4">
            <i className="ri-folder-2-line me-2"></i> My BookShelf
          </h2>
          <div>
            <button className="btn btn-sm btn-primary me-2 mt-2" onClick={createFolder}>
              + New Folder
            </button>
            <button className="btn btn-sm btn-success mt-2" onClick={createFile}>
              + New File
            </button>
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="breadcrumb-area mb-3">
          {path.map((p, index) => (
            <span key={p.id}>
              <span
                className={`breadcrumb-link ${index === path.length - 1 ? "active" : ""
                  }`}
                onClick={() => goTo(index)}
              >
                {p.name}
              </span>
              {index < path.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="folder-loader fade-in">
            <i className="ri-folder-2-line spin me-2"></i> Loading...
          </div>
        ) : (
          <div className="bookshelf-grid fade-in-up">

            {/* Folders */}
            {currentFolder?.subfolders?.map((f) => (
              <div key={f.id} className="item-wrapper">
                <div className="folder-card" onClick={() => enterFolder(f)}>
                  <i className="ri-folder-fill folder-icon"></i>
                  <div className="file-title">{f.name}</div>
                </div>

                <div className="item-menu dropdown">
                  <button
                    className="btn btn-sm btn-light rounded-circle item-menu-btn"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ri-more-2-fill"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item" onClick={() => renameItem(f)}>Rename</button></li>
                    <li><button className="dropdown-item" onClick={() => moveItem(f)}>Move To…</button></li>
                    <li><button className="dropdown-item text-danger" onClick={() => deleteItem(f)}>Delete</button></li>
                  </ul>
                </div>
              </div>
            ))}

            {/* Files */}
            {currentFolder?.items?.map((item) => (
              <div key={item.id} className="item-wrapper">
                <div className="file-card">
                  <i className="ri-file-pdf-2-line file-icon text-danger"></i>
                  <div className="file-title">{item.title}</div>
                  <a href={item.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-light mt-2 w-100">
                    Open PDF
                  </a>
                </div>

                <div className="item-menu dropdown">
                  <button
                    className="btn btn-sm btn-light rounded-circle item-menu-btn"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ri-more-2-fill"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item" onClick={() => renameItem(item)}>Rename</button></li>
                    <li><button className="dropdown-item" onClick={() => deleteItem(item)}>Delete</button></li>
                    <li><button className="dropdown-item" onClick={() => moveItem(item)}>Move To…</button></li>
                    <li><button className="dropdown-item" onClick={() => copyLink(item)}>Copy Link</button></li>
                  </ul>
                </div>
              </div>
            ))}

            {/* Empty */}
            {currentFolder?.subfolders?.length === 0 &&
              currentFolder?.items?.length === 0 && (
                <div className="text-muted small ps-1 fade-in-up">
                  This folder is empty.
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
