"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  searchDocuments,
  DocumentRecord,
  SearchResultItem,
} from "@/lib/api";

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation state
  const [docToDelete, setDocToDelete] = useState<DocumentRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // RAG Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  const fetchDocs = async () => {
    setLoadingDocs(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err: any) {
      setErrorMsg("Failed to load documents from server.");
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // Handle file selection and validation
  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    const validExtensions = [".pdf", ".txt", ".md", ".markdown"];
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      setErrorMsg(`Unsupported file format (${fileExt}). Supported: PDF (.pdf), Plain Text (.txt), Markdown (.md, .markdown).`);
      return;
    }

    const maxSize = 25 * 1024 * 1024; // 25 MB
    if (file.size > maxSize) {
      setErrorMsg(`File size exceeds 25 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      // Simulate gradual progress bar steps
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 80 ? 80 : prev + 20));
      }, 300);

      const newDoc = await uploadDocument(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSuccessMsg(`Successfully uploaded and indexed "${file.name}".`);
        fetchDocs();
      }, 400);
    } catch (err: any) {
      setIsUploading(false);
      setUploadProgress(0);
      setErrorMsg(err?.message || "Document upload failed.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDocument(docToDelete.id);
      setSuccessMsg(`Deleted "${docToDelete.original_filename}" successfully.`);
      setDocToDelete(null);
      fetchDocs();
    } catch (err) {
      setErrorMsg("Failed to delete document.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchPerformed(true);
    setErrorMsg(null);

    try {
      const results = await searchDocuments(searchQuery.trim(), 3);
      setSearchResults(results);
    } catch (err) {
      setErrorMsg("Semantic retrieval query failed.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 font-serif pb-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E5E7EB] pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-normal text-zinc-900 tracking-tight font-serif">
              Knowledge Base & RAG Corpus
            </h1>
            <p className="text-sm text-zinc-500 mt-1 font-sans">
              Supabase Storage Private Bucket connected • pgvector 768-dim active (Google Gemini)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans">
              <span className="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Vector Index Synchronized
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-sans rounded-md shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
              accept=".pdf,.txt,.md,.markdown"
              className="hidden"
            />
          </div>
        </div>

        {/* Status Banners */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-md flex justify-between items-center font-sans">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700 font-bold">×</button>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-md flex justify-between items-center font-sans">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 font-bold">×</button>
          </div>
        )}

        {/* Upload Card / Drag & Drop Area */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-normal text-zinc-900 mb-2">Document Ingestion & Storage</h3>
          <p className="text-xs text-zinc-500 mb-4 font-sans">
            Upload enterprise research, compliance reports, or specifications. Supported formats: PDF, TXT, Markdown (max 25MB).
          </p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              dragOver ? "border-zinc-900 bg-zinc-50" : "border-zinc-300 hover:border-zinc-400 bg-zinc-50/50"
            }`}
          >
            {isUploading ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-zinc-800 font-sans">Processing & generating 768-dim vector embeddings with Google Gemini...</p>
                <div className="w-full max-w-xs mx-auto bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-zinc-900 h-2 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-xs text-zinc-500 font-sans">{uploadProgress}% complete</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto text-zinc-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-800 font-sans">
                  Click to browse or drag and drop your documents here
                </p>
                <p className="text-xs text-zinc-500 font-sans">PDF, TXT, MD up to 25MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Document Listing Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-zinc-50/50">
            <div>
              <h3 className="text-lg font-normal text-zinc-900">Indexed Corpus Files</h3>
              <p className="text-xs text-zinc-500 font-sans mt-0.5">Active documents parsed and embedded in pgvector</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-zinc-200 text-zinc-700 rounded-full font-sans">
              {documents.length} Documents
            </span>
          </div>

          {loadingDocs ? (
            <div className="p-12 text-center text-zinc-500 font-sans text-sm">Loading corpus files...</div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-sans text-sm">No documents found in knowledge base.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-zinc-50/80 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Document Name</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Size</th>
                    <th className="py-3 px-6">Pages / Chunks</th>
                    <th className="py-3 px-6">Uploaded</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-sm text-zinc-800">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-zinc-50/50 transition">
                      <td className="py-4 px-6">
                        <div className="font-medium text-zinc-900 font-serif">{doc.original_filename}</div>
                        <div className="text-xs text-zinc-400 font-mono mt-0.5">{doc.filename}</div>
                        {doc.status === "FAILED" && doc.error_message && (
                          <div className="mt-1.5 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-sans max-w-md break-words">
                            <span className="font-medium">Failure Reason:</span> {doc.error_message}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : doc.status === "PROCESSING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {doc.status === "PROCESSING" && (
                            <svg className="animate-spin h-3 w-3 text-amber-700" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                          )}
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-zinc-600 text-xs">{formatBytes(doc.file_size_bytes)}</td>
                      <td className="py-4 px-6 text-zinc-600 text-xs">
                        <span className="font-medium">{doc.page_count}</span> pages • <span className="font-medium">{doc.chunk_count}</span> chunks
                      </td>
                      <td className="py-4 px-6 text-zinc-500 text-xs">
                        {new Date(doc.created_at).toLocaleDateString()} {new Date(doc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setDocToDelete(doc)}
                          className="text-zinc-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition"
                          title="Delete Document"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Interactive Semantic Search / RAG Test Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-normal text-zinc-900">Interactive Semantic Search & RAG Test</h3>
            <p className="text-xs text-zinc-500 font-sans mt-1">
              Query indexed vector chunks in real-time with similarity scores, page citations, and provenance excerpts.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. What are the zero-trust security and cryptographic key rotation policies?"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white font-sans transition"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-sans rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Retrieving...
                </>
              ) : (
                "Retrieve Evidence"
              )}
            </button>
          </form>

          {/* Search Results Display */}
          {searchPerformed && (
            <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-800 font-sans">
                  Retrieved Chunks & Citation Provenance
                </h4>
                {searchResults && (
                  <span className="text-xs text-zinc-500 font-sans">
                    {searchResults.length} matching passages found
                  </span>
                )}
              </div>

              {isSearching ? (
                <div className="py-8 text-center text-xs text-zinc-500 font-sans">
                  Querying vector embeddings and computing cosine similarity...
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {searchResults.map((res, idx) => (
                    <div
                      key={res.chunk_id || idx}
                      className="p-5 bg-zinc-50/60 border border-zinc-200 rounded-lg space-y-3 font-sans"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-zinc-900 text-white rounded font-mono text-[10px]">
                            Rank #{idx + 1}
                          </span>
                          <span className="font-medium text-zinc-900 font-serif">{res.filename}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                            Similarity: {(res.similarity_score * 100).toFixed(0)}%
                          </span>
                          <span className="text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded font-medium">
                            Page {res.page_number} Citation
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed font-serif bg-white p-3.5 rounded border border-zinc-200">
                        "{res.content}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-zinc-500 font-sans">
                  No matching chunks found for your query. Try a broader search term.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {docToDelete && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl font-sans">
              <h3 className="text-lg font-medium text-zinc-900">Confirm Document Deletion</h3>
              <p className="text-sm text-zinc-600">
                Are you sure you want to delete <span className="font-semibold text-zinc-900">{docToDelete.original_filename}</span>? This will permanently remove the file from Supabase Storage and purge all associated vector chunks from pgvector.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDocToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition flex items-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Delete Document"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
