"use client";

import { useState, useCallback } from "react";
import { parseSrt, serializeSrt, SrtEntry } from "@/lib/srt";

export default function SrtEditor() {
  const [entries, setEntries] = useState<SrtEntry[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".srt")) {
      alert("Please upload a valid .srt file.");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEntries(parseSrt(content));
    };
    reader.readAsText(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleTextChange = (id: number, newText: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, text: newText } : entry
      )
    );
  };

  const handleTimeChange = (
    id: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleDownload = () => {
    const content = serializeSrt(entries);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "subtitles.srt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setEntries([]);
    setFileName("");
  };

  if (entries.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg">
          <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
            SRT Editor
          </h1>
          <p className="mb-8 text-center text-gray-500">
            Upload an .srt subtitle file to view and edit its contents
          </p>
          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <svg
              className="mb-4 h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <p className="mb-1 text-lg font-medium text-gray-700">
              Drop your .srt file here
            </p>
            <p className="mb-4 text-sm text-gray-400">or click to browse</p>
            <span className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Choose File
            </span>
            <input
              type="file"
              accept=".srt"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SRT Editor</h1>
            <p className="text-sm text-gray-500">
              {fileName} &mdash; {entries.length} subtitle
              {entries.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Upload New
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Download .srt
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-4 p-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {entry.id}
              </span>
              <input
                className="rounded border border-gray-200 px-2 py-1 font-mono text-xs text-gray-600 focus:border-blue-400 focus:outline-none"
                value={entry.startTime}
                onChange={(e) =>
                  handleTimeChange(entry.id, "startTime", e.target.value)
                }
                aria-label="Start time"
              />
              <span className="text-gray-400">→</span>
              <input
                className="rounded border border-gray-200 px-2 py-1 font-mono text-xs text-gray-600 focus:border-blue-400 focus:outline-none"
                value={entry.endTime}
                onChange={(e) =>
                  handleTimeChange(entry.id, "endTime", e.target.value)
                }
                aria-label="End time"
              />
            </div>
            <textarea
              className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={Math.max(2, entry.text.split("\n").length)}
              value={entry.text}
              onChange={(e) => handleTextChange(entry.id, e.target.value)}
              aria-label={`Subtitle text for entry ${entry.id}`}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
