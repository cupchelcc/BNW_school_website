'use client';

import React, { useState } from 'react';
import { PageBlock, BlockType } from '@/types/page-builder';
import { BlockRenderer } from '../renderer/BlockRenderer';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  Layout,
  Settings,
  Sparkles,
  ChevronRight,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface PageBuilderEditorProps {
  pageId: string;
  initialBlocks: PageBlock[];
  pageTitle: string;
  pageSlug: string;
  pagePublicUrl?: string;
  initialStatus: 'draft' | 'published' | 'archived';
  canPublish: boolean;
  onSave: (blocks: PageBlock[], status: 'draft' | 'published' | 'archived') => Promise<{ success: boolean; error?: string }>;
  contextData?: any;
}

const AVAILABLE_BLOCKS: { type: BlockType; label: string; desc: string; icon: string }[] = [
  { type: 'hero_banner', label: '1. Hero Banner', desc: 'แบนเนอร์หลักพร้อมข้อความ ปุ่มกด และภาพพื้นหลัง', icon: 'Sparkles' },
  { type: 'text_section', label: '2. Text Section', desc: 'เนื้อหาข้อความ ย่อหน้า และจัดกึ่งกลาง', icon: 'AlignLeft' },
  { type: 'image_single', label: '3. Image Single', desc: 'รูปภาพเดี่ยวพร้อมคำบรรยายภาพ', icon: 'Image' },
  { type: 'image_gallery', label: '4. Image Gallery', desc: 'แกลเลอรีรูปภาพแบบตารางหลายคอลัมน์', icon: 'Grid' },
  { type: 'news_list', label: '5. News List', desc: 'รายการข่าวประชาสัมพันธ์ล่าสุดจากฐานข้อมูล', icon: 'Newspaper' },
  { type: 'announcement_list', label: '6. Announcement List', desc: 'รายการประกาศด่วนและประกาศโรงเรียน', icon: 'Megaphone' },
  { type: 'event_list', label: '7. Event List', desc: 'ปฏิทินและกำหนดการกิจกรรมสำคัญ', icon: 'Calendar' },
  { type: 'staff_cards', label: '8. Staff Cards', desc: 'การ์ดรายชื่อคณะผู้บริหารและครู', icon: 'Users' },
  { type: 'document_list', label: '9. Document List', desc: 'รายการเอกสารและแบบฟอร์มดาวน์โหลด', icon: 'FileText' },
  { type: 'cta', label: '10. Call to Action', desc: 'กล่องกระตุ้นการติดต่อหรือการสมัครเรียน', icon: 'MousePointer' },
  { type: 'image_slider', label: '11. Image Slider', desc: 'สไลด์ภาพและภาพแบนเนอร์เคลื่อนไหว', icon: 'Sliders' },
  { type: 'divider', label: '12. Divider', desc: 'เส้นคั่นแบ่งส่วนเนื้อหา', icon: 'Minus' },
  { type: 'spacer', label: '13. Spacer', desc: 'ช่องว่างเว้นระยะแนวตั้ง', icon: 'MoveVertical' },
  { type: 'botanical_highlight', label: '14. Botanical Highlight', desc: 'พรรณไม้เด่นจากสวนพฤกษศาสตร์โรงเรียน', icon: 'TreePine' },
  { type: 'eservice_links', label: '15. E-Service Links', desc: 'ลิงก์ระบบบริการออนไลน์ของโรงเรียน', icon: 'Globe' },
];

export const PageBuilderEditor: React.FC<PageBuilderEditorProps> = ({
  pageId,
  initialBlocks,
  pageTitle,
  pageSlug,
  pagePublicUrl,
  initialStatus,
  canPublish,
  onSave,
  contextData = {},
}) => {
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(initialBlocks[0]?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mobileTab, setMobileTab] = useState<'blocks' | 'canvas' | 'inspector'>('canvas');

  // เลื่อนบล็อกขึ้น
  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index - 1];
    newBlocks[index - 1] = newBlocks[index];
    newBlocks[index] = temp;
    setBlocks(newBlocks);
  };

  // เลื่อนบล็อกลง
  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index + 1];
    newBlocks[index + 1] = newBlocks[index];
    newBlocks[index] = temp;
    setBlocks(newBlocks);
  };

  // ลบบล็อก
  const removeBlock = (id: string) => {
    if (!confirm('ยืนยันที่จะลบบล็อกนี้ออกจากหน้าเว็บหรือไม่?')) return;
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    if (selectedBlockId === id) {
      setSelectedBlockId(newBlocks[0]?.id || null);
    }
  };

  // เพิ่มบล็อกใหม่
  const addBlock = (type: BlockType) => {
    const newId = `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let newBlock: PageBlock;

    switch (type) {
      case 'hero_banner':
        newBlock = {
          id: newId,
          type: 'hero_banner',
          data: {
            badge: 'ยินดีต้อนรับ',
            title: 'หัวข้อหลักของหน้าเว็บ',
            subtitle: 'คำอธิบายเสริมเพื่อความเข้าใจที่ชัดเจนยิ่งขึ้น',
            primaryButtonText: 'ข้อมูลเพิ่มเติม',
            primaryButtonUrl: '#',
          },
        };
        break;
      case 'text_section':
        newBlock = {
          id: newId,
          type: 'text_section',
          data: {
            title: 'หัวข้อเนื้อหา',
            content: 'พิมพ์ข้อความของคุณที่นี่...',
            alignment: 'left',
          },
        };
        break;
      case 'announcement_list':
        newBlock = {
          id: newId,
          type: 'announcement_list',
          data: { title: 'ประกาศสำคัญ', limit: 3, showBadge: true },
        };
        break;
      case 'news_list':
        newBlock = {
          id: newId,
          type: 'news_list',
          data: { title: 'ข่าวประชาสัมพันธ์', subtitle: 'ติดตามข่าวสารล่าสุด', limit: 3 },
        };
        break;
      case 'botanical_highlight':
        newBlock = {
          id: newId,
          type: 'botanical_highlight',
          data: { title: 'สวนพฤกษศาสตร์โรงเรียน', subtitle: 'พรรณไม้ท้องถิ่น', limit: 3 },
        };
        break;
      case 'eservice_links':
        newBlock = {
          id: newId,
          type: 'eservice_links',
          data: { title: 'บริการออนไลน์ E-Service', subtitle: 'บริการสำหรับนักเรียนและผู้ปกครอง' },
        };
        break;
      case 'staff_cards':
        newBlock = {
          id: newId,
          type: 'staff_cards',
          data: { title: 'คณะผู้บริหารและบุคลากร', limit: 4 },
        };
        break;
      case 'event_list':
        newBlock = {
          id: newId,
          type: 'event_list',
          data: { title: 'ปฏิทินกิจกรรม', limit: 3 },
        };
        break;
      case 'cta':
        newBlock = {
          id: newId,
          type: 'cta',
          data: {
            title: 'พร้อมที่จะเริ่มต้นเรียนรู้กับเราหรือยัง?',
            description: 'สอบถามข้อมูลเพิ่มเติมได้ที่ห้องธุรการโรงเรียน',
            buttonText: 'ติดต่อเรา',
            buttonUrl: '/contact',
          },
        };
        break;
      case 'divider':
        newBlock = { id: newId, type: 'divider', data: { style: 'solid', spacing: 'medium' } };
        break;
      case 'spacer':
        newBlock = { id: newId, type: 'spacer', data: { height: 'md' } };
        break;
      case 'image_single':
        newBlock = {
          id: newId,
          type: 'image_single',
          data: { imageUrl: '/images/sample.jpg', caption: 'คำอธิบายรูปภาพ' },
        };
        break;
      case 'image_gallery':
        newBlock = {
          id: newId,
          type: 'image_gallery',
          data: { title: 'ภาพกิจกรรม', columns: 3, images: [] },
        };
        break;
      case 'image_slider':
        newBlock = {
          id: newId,
          type: 'image_slider',
          data: { slides: [{ imageUrl: '/images/banner.jpg', title: 'ภาพแบนเนอร์' }] },
        };
        break;
      case 'document_list':
        newBlock = {
          id: newId,
          type: 'document_list',
          data: { title: 'เอกสารและแบบฟอร์ม', limit: 4 },
        };
        break;
      default:
        newBlock = { id: newId, type: 'text_section', data: { content: 'บล็อกใหม่' } };
    }

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newId);
  };

  // ปรับแต่งค่าของบล็อกที่ถูกเลือก
  const updateSelectedBlockData = (key: string, value: any) => {
    if (!selectedBlockId) return;
    setBlocks(
      blocks.map((b) => {
        if (b.id !== selectedBlockId) return b;
        return {
          ...b,
          data: {
            ...b.data,
            [key]: value,
          },
        } as PageBlock;
      })
    );
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // ดำเนินการบันทึก
  const handleSave = async (publish: boolean) => {
    setIsSaving(true);
    setSaveMessage(null);
    const newStatus = publish ? 'published' : 'draft';
    try {
      const res = await onSave(blocks, newStatus);
      if (res.success) {
        setStatus(newStatus);
        setSaveMessage({
          type: 'success',
          text: publish ? 'เผยแพร่หน้าเว็บจริงเรียบร้อยแล้ว!' : 'บันทึกแบบร่าง (Draft) สำเร็จ!',
        });
      } else {
        setSaveMessage({ type: 'error', text: res.error || 'เกิดข้อผิดพลาดในการบันทึก' });
      }
    } catch (e: any) {
      setSaveMessage({ type: 'error', text: e.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-100 w-full max-w-full overflow-hidden">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">{pageTitle}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600">
                /{pageSlug}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง (Draft)'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">Visual Page Builder (15 บล็อกมาตรฐาน)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between sm:justify-end">
          {saveMessage && (
            <div
              className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {saveMessage.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{saveMessage.text}</span>
              {saveMessage.type === 'success' && pagePublicUrl && (
                <a
                  href={pagePublicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1.5 underline font-bold hover:text-emerald-950 flex items-center gap-0.5"
                >
                  <span>เปิดดู ↗</span>
                </a>
              )}
            </div>
          )}

          {/* Direct Live Site Link */}
          {pagePublicUrl && (
            <a
              href={pagePublicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="เปิดดูหน้าเว็บจริงในแท็บใหม่"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-gold-600" />
              <span className="hidden sm:inline">ดูหน้าเว็บจริง</span>
            </a>
          )}

          {/* Tab Switcher */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'editor' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>โหมดจัดบล็อก</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'preview' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ดูพรีวิวสด</span>
            </button>
          </div>

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกแบบร่าง'}</span>
          </button>

          {canPublish && (
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-brand-navy-900 hover:bg-brand-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isSaving ? 'กำลังเผยแพร่...' : 'เผยแพร่สู่หน้าเว็บ'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      {activeTab === 'preview' ? (
        <div className="flex-1 overflow-y-auto bg-white w-full max-w-full">
          <div className="border-b border-amber-200 bg-amber-50 px-4 sm:px-6 py-2 text-xs text-amber-800 flex items-center justify-between">
            <span>💡 มุมมองตัวอย่างจริง: แสดงผลจากโครงสร้างข้อมูลจริงของระบบ</span>
            <button onClick={() => setActiveTab('editor')} className="font-semibold underline">
              กลับไปหน้าแก้ไข
            </button>
          </div>
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} contextData={contextData} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full max-w-full">
          {/* Mobile Sub-Navigation for small screens */}
          <div className="lg:hidden bg-slate-200 border-b border-slate-300 p-1 flex text-xs font-semibold shrink-0">
            <button
              onClick={() => setMobileTab('blocks')}
              className={`flex-1 py-1.5 text-center rounded-md transition-colors ${
                mobileTab === 'blocks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              📋 บล็อก ({blocks.length})
            </button>
            <button
              onClick={() => setMobileTab('canvas')}
              className={`flex-1 py-1.5 text-center rounded-md transition-colors ${
                mobileTab === 'canvas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              🖥️ แคนวาส
            </button>
            <button
              onClick={() => setMobileTab('inspector')}
              className={`flex-1 py-1.5 text-center rounded-md transition-colors ${
                mobileTab === 'inspector' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ⚙️ ปรับแต่ง {selectedBlock ? '•' : ''}
            </button>
          </div>

          {/* Left Panel: Block List & Reordering */}
          <div className={`w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 ${mobileTab === 'blocks' ? 'flex' : 'hidden lg:flex'}`}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ลำดับบล็อกในหน้า ({blocks.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {blocks.map((block, idx) => {
                const info = AVAILABLE_BLOCKS.find((b) => b.type === block.type);
                const isSelected = block.id === selectedBlockId;
                return (
                  <div
                    key={block.id}
                    onClick={() => {
                      setSelectedBlockId(block.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) setMobileTab('inspector');
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-navy-600 bg-brand-navy-50/70 shadow-sm font-semibold text-brand-navy-950'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden min-w-0">
                      <span className="text-slate-400 font-mono text-[10px] w-4 shrink-0">{idx + 1}</span>
                      <span className="truncate">{info?.label || block.type}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => moveBlockUp(idx)}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-20 text-slate-500"
                        title="เลื่อนขึ้น"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveBlockDown(idx)}
                        disabled={idx === blocks.length - 1}
                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-20 text-slate-500"
                        title="เลื่อนลง"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="p-1 hover:bg-red-100 text-red-500 rounded"
                        title="ลบบล็อก"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Block Palette */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                เพิ่มบล็อกใหม่ (+15 บล็อก)
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {AVAILABLE_BLOCKS.map((ab) => (
                  <button
                    key={ab.type}
                    onClick={() => {
                      addBlock(ab.type);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) setMobileTab('inspector');
                    }}
                    className="p-2 text-left bg-white border border-slate-200 hover:border-brand-navy-400 rounded-md text-[11px] font-medium text-slate-800 hover:text-brand-navy-900 transition-colors shadow-2xs truncate"
                  >
                    + {ab.label.split('. ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Canvas: Live Interactive Preview of selected blocks */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/60 ${mobileTab === 'canvas' ? 'block' : 'hidden lg:block'}`}>
            <div className="max-w-4xl mx-auto space-y-4">
              {blocks.map((block) => {
                const isSelected = block.id === selectedBlockId;
                return (
                  <div
                    key={block.id}
                    onClick={() => {
                      setSelectedBlockId(block.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) setMobileTab('inspector');
                    }}
                    className={`rounded-xl overflow-hidden transition-all relative ${
                      isSelected
                        ? 'ring-3 ring-brand-navy-600 shadow-xl'
                        : 'hover:ring-2 hover:ring-slate-400/60 shadow'
                    }`}
                  >
                    <div className="bg-slate-800 text-white text-[11px] px-4 py-1.5 flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wider">
                        บล็อก: {block.type}
                      </span>
                      {isSelected && (
                        <span className="bg-brand-gold-500 text-brand-navy-950 font-bold px-2 py-0.5 rounded text-[10px]">
                          กำลังเลือกแก้ไข
                        </span>
                      )}
                    </div>
                    <div className="bg-white pointer-events-none">
                      <BlockRenderer block={block} contextData={contextData} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Block Property Inspector */}
          <div className={`w-full lg:w-88 bg-white border-l border-slate-200 flex flex-col shrink-0 ${mobileTab === 'inspector' ? 'flex' : 'hidden lg:flex'}`}>
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-navy-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ปรับแต่งบล็อกที่เลือก
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs">
              {!selectedBlock ? (
                <div className="text-slate-400 text-center py-10">เลือกบล็อกทางซ้ายเพื่อเริ่มปรับแต่ง</div>
              ) : (
                <div className="space-y-4">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                    <span className="font-bold text-slate-800 block mb-0.5">ประเภท: {selectedBlock.type}</span>
                    <span className="text-[11px] text-slate-500">ID: {selectedBlock.id}</span>
                  </div>

                  {/* Dynamic Fields by Type */}
                  {selectedBlock.type === 'hero_banner' && (
                    <>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Badge หัวเรื่อง</label>
                        <input
                          type="text"
                          value={selectedBlock.data.badge || ''}
                          onChange={(e) => updateSelectedBlockData('badge', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">หัวข้อหลัก (Title)</label>
                        <textarea
                          rows={2}
                          value={selectedBlock.data.title || ''}
                          onChange={(e) => updateSelectedBlockData('title', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">คำบรรยายย่อย (Subtitle)</label>
                        <textarea
                          rows={3}
                          value={selectedBlock.data.subtitle || ''}
                          onChange={(e) => updateSelectedBlockData('subtitle', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">ข้อความปุ่มที่ 1</label>
                        <input
                          type="text"
                          value={selectedBlock.data.primaryButtonText || ''}
                          onChange={(e) => updateSelectedBlockData('primaryButtonText', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">URL ปุ่มที่ 1</label>
                        <input
                          type="text"
                          value={selectedBlock.data.primaryButtonUrl || ''}
                          onChange={(e) => updateSelectedBlockData('primaryButtonUrl', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                    </>
                  )}

                  {selectedBlock.type === 'text_section' && (
                    <>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">หัวข้อส่วนเนื้อหา</label>
                        <input
                          type="text"
                          value={selectedBlock.data.title || ''}
                          onChange={(e) => updateSelectedBlockData('title', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">เนื้อหาข้อความ</label>
                        <textarea
                          rows={6}
                          value={selectedBlock.data.content || ''}
                          onChange={(e) => updateSelectedBlockData('content', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">การจัดวางแนว (Alignment)</label>
                        <select
                          value={selectedBlock.data.alignment || 'left'}
                          onChange={(e) => updateSelectedBlockData('alignment', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        >
                          <option value="left">ชิดซ้าย (Left)</option>
                          <option value="center">กึ่งกลาง (Center)</option>
                          <option value="right">ชิดขวา (Right)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {(selectedBlock.type === 'news_list' ||
                    selectedBlock.type === 'announcement_list' ||
                    selectedBlock.type === 'botanical_highlight' ||
                    selectedBlock.type === 'event_list' ||
                    selectedBlock.type === 'staff_cards') && (
                    <>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">หัวข้อบล็อก</label>
                        <input
                          type="text"
                          value={(selectedBlock.data as any).title || ''}
                          onChange={(e) => updateSelectedBlockData('title', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">จำนวนที่แสดง (Limit)</label>
                        <input
                          type="number"
                          min={1}
                          max={12}
                          value={(selectedBlock.data as any).limit || 3}
                          onChange={(e) => updateSelectedBlockData('limit', parseInt(e.target.value) || 3)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                    </>
                  )}

                  {selectedBlock.type === 'cta' && (
                    <>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">หัวข้อกระตุ้น</label>
                        <input
                          type="text"
                          value={selectedBlock.data.title || ''}
                          onChange={(e) => updateSelectedBlockData('title', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">คำอธิบาย</label>
                        <textarea
                          rows={3}
                          value={selectedBlock.data.description || ''}
                          onChange={(e) => updateSelectedBlockData('description', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">ข้อความปุ่ม</label>
                        <input
                          type="text"
                          value={selectedBlock.data.buttonText || ''}
                          onChange={(e) => updateSelectedBlockData('buttonText', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">URL ปุ่ม</label>
                        <input
                          type="text"
                          value={selectedBlock.data.buttonUrl || ''}
                          onChange={(e) => updateSelectedBlockData('buttonUrl', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md"
                        />
                      </div>
                    </>
                  )}

                  {selectedBlock.type === 'divider' && (
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">รูปแบบเส้น (Style)</label>
                      <select
                        value={selectedBlock.data.style || 'solid'}
                        onChange={(e) => updateSelectedBlockData('style', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md"
                      >
                        <option value="solid">เส้นทึบ (Solid)</option>
                        <option value="dashed">เส้นประ (Dashed)</option>
                        <option value="dotted">เส้นจุด (Dotted)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
