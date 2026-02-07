"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getContentsData, selectContents, selectContentStatus, editContentData } from "./contentSlice";

const ContentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const contents = useAppSelector(selectContents);
  const status = useAppSelector(selectContentStatus);

  const [selected, setSelected] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; description: string }>({ name: "", description: "" });

  useEffect(() => {
    if (status === "idle") {
      dispatch(getContentsData());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (selected) {
      const content = contents.find(c => c.contentId === selected);
      if (content) {
        setEditForm({ name: content.name, description: content.description ?? "" });
      }
    }
  }, [selected, contents]);

  const handleEdit = (contentId: string) => {
    setSelected(contentId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!selected) return;
    const original = contents.find(c => c.contentId === selected);
    if (!original) return;
    dispatch(editContentData({ ...original, name: editForm.name, description: editForm.description }));
    setSelected(null);
  };

  let renderedContents: React.ReactNode;

  if (status === "loading") {
    renderedContents = <p>Loading...</p>;
  } else if (status === "failed") {
    renderedContents = <p>Failed to load content.</p>;
  } else if (!contents.length) {
    renderedContents = <p>No content found.</p>;
  } else {
    renderedContents = contents.map((content) => (
      <div
        key={content.contentId}
        className={`border p-4 mb-2 rounded-lg shadow-sm cursor-pointer ${selected === content.contentId ? "bg-blue-50" : ""}`}
        onClick={() => handleEdit(content.contentId)}
      >
        <p>
          <strong>ID:</strong> {content.contentId}
        </p>
        <p>
          <strong>Name:</strong> {content.name}
        </p>
        <p>
          <strong>Language:</strong> {content.languageId}
        </p>
      </div>
    ));
  }

  return (
    <div>
      <h2>Content List</h2>
      {renderedContents}
      {selected && (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow">
          <h3 className="font-semibold mb-2">Edit Content</h3>
          <label className="block mb-2">
            Name:
            <input
              name="name"
              value={editForm.name}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            />
          </label>
          <label className="block mb-2">
            Description:
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            />
          </label>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setSelected(null)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentList;