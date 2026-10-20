'use client';

import React, { useState } from 'react';
import { Upload, Search, Trash2, Copy, Check, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { formatFileSize, formatThaiDate } from '@/lib/utils';

interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  url: string;
  altText?: string | null;
  createdAt: string;
}

interface MediaProps {
  initialFiles: MediaItem[];
  canDelete: boolean;
}

export const MediaLibraryManager: React.FC<MediaProps> = ({ initialFiles, canDelete }) => {
  const [files, setFiles] = useState<MediaItem[]>(initialFiles);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFiles = files.filter(
    (f) =>
      f.originalName.toLowerCase().includes(search.toLowerCase()) ||
      (f.altText && f.altText.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selected);
    formData.append('altText', selected.name);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const newItem: MediaItem = {
          id: data.mediaId,
          fileName: selected.name,
          originalName: selected.name,
          mimeType: selected.type,
          fileSize: selected.size,
          url: data.fileUrl,
          altText: selected.name,
          createdAt: new Date().toISOString(),
        };
        setFiles([newItem, ...files]);
      } else {
        setError(data.error || 'การอัปโหลดล้มเหลว');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์เพื่ออัปโหลดได้');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันที่จะลบไฟล์นี้ออกจากคลังสื่อหรือไม่?')) return;
    try {
      const res = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFiles(files.filter((f) => f.id !== id));
      } else {
        alert(data.error || 'ไม่สามารถลบไฟล์ได้');
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-pink-700 uppercase tracking-wider">Asset Management</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">คลังรูปภาพและเอกสาร (Media Library)</h1>
          <p className="text-xs text-slate-500 mt-1">
            อัปโหลด ค้นหา และคัดลอก URL เพื่อนำไปใช้งานใน Visual Page Builder หรือโมดูลข่าวสาร
          </p>
        </div>

        <div>
          <label className="px-4 py-2.5 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-transform active:scale-95">
            <Upload className="w-4 h-4 text-brand-gold-400" />
            <span>{isUploading ? 'กำลังอัปโหลด...' : '+ อัปโหลดไฟล์ใหม่'}</span>
            <input
              type="file"
              disabled={isUploading}
              onChange={handleUpload}
              accept="image/*,application/pdf"
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="ค้นหาชื่อไฟล์ หรือคำบรรยายภาพ (Alt Text)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs outline-none bg-transparent"
        />
      </div>

      {/* Media Grid */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-semibold">ไม่พบไฟล์ในคลังสื่อ</p>
          <p className="text-xs mt-1">กดปุ่ม "+ อัปโหลดไฟล์ใหม่" ด้านบนเพื่อเริ่มอัปโหลดรูปภาพหรือเอกสาร</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredFiles.map((file) => {
            const isImage = file.mimeType.startsWith('image/');
            const isCopied = copiedId === file.id;

            return (
              <div
                key={file.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img src={file.url} alt={file.altText || ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <FileText className="w-10 h-10 text-brand-navy-700" />
                      <span className="text-[10px] font-bold uppercase">{file.mimeType.split('/')[1]}</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur-sm">
                    {formatFileSize(file.fileSize)}
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-xs text-slate-800 truncate" title={file.originalName}>
                    {file.originalName}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{formatThaiDate(file.createdAt)}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => copyUrl(file.id, file.url)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'คัดลอกแล้ว' : 'คัดลอก URL'}</span>
                    </button>

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        title="ลบไฟล์"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
