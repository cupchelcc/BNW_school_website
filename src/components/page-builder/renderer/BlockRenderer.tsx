import React from 'react';
import Link from 'next/link';
import { PageBlock } from '@/types/page-builder';
import {
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  GraduationCap,
  Megaphone,
  Newspaper,
  TreePine,
  User,
  ArrowRight,
  BookOpen,
  FileText,
  Sparkles,
} from 'lucide-react';
import { formatThaiDate } from '@/lib/utils';

interface BlockRendererProps {
  block: PageBlock;
  // Dynamic query data passed from server or mock in preview
  contextData?: {
    news?: any[];
    announcements?: any[];
    events?: any[];
    staff?: any[];
    documents?: any[];
    plants?: any[];
    eServices?: any[];
  };
}

/**
 * Format string with line breaks support (normalizes <br> tags to \n for whitespace-pre-line)
 */
function formatTextWithBreaks(text?: string | null): string {
  if (!text) return '';
  return text.replace(/<br\s*\/?>/gi, '\n');
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, contextData = {} }) => {
  switch (block.type) {
    case 'hero_banner': {
      const { badge, title, subtitle, primaryButtonText, primaryButtonUrl, secondaryButtonText, secondaryButtonUrl, backgroundImageUrl } = block.data;
      return (
        <section
          className="relative overflow-hidden bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-800 text-white py-20 sm:py-24 lg:py-32 px-4 sm:px-6 w-full max-w-full"
          style={
            backgroundImageUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(11, 31, 60, 0.82), rgba(11, 31, 60, 0.94)), url(${backgroundImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {/* Ambient Glow Orbs for Modern Glassmorphism Refraction */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-brand-gold-500/20 blur-3xl pointer-events-none animate-ambient" />
          <div className="absolute -bottom-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-500/20 blur-3xl pointer-events-none animate-ambient [animation-delay:6s]" />
          <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10 w-full overflow-hidden">
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-gold-300 border border-white/20 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-lg shadow-black/10">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold-400 shrink-0" />
                <span className="break-words whitespace-pre-line">{formatTextWithBreaks(badge)}</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight break-words drop-shadow-sm whitespace-pre-line">
              {formatTextWithBreaks(title)}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-lg lg:text-xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed break-words px-2 font-normal whitespace-pre-line">
                {formatTextWithBreaks(subtitle)}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full">
              {primaryButtonText && primaryButtonUrl && (
                <Link
                  href={primaryButtonUrl}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-brand-gold-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-brand-navy-950 font-bold shadow-[0_12px_32px_rgba(234,179,8,0.35)] border border-amber-300/60 transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 text-sm sm:text-base text-center"
                >
                  <span>{primaryButtonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {secondaryButtonText && secondaryButtonUrl && (
                <Link
                  href={secondaryButtonUrl}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold border border-white/30 backdrop-blur-xl shadow-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 text-sm sm:text-base text-center"
                >
                  <span>{secondaryButtonText}</span>
                </Link>
              )}
            </div>
          </div>
        </section>
      );
    }

    case 'announcement_list': {
      const { title = 'ประกาศสำคัญ', limit = 3, showBadge = true } = block.data;
      const items = contextData.announcements?.slice(0, limit) || [];

      return (
        <section className="py-12 sm:py-16 bg-amber-50/40 backdrop-blur-sm border-y border-white/60 w-full max-w-full overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 sm:mb-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 sm:p-3 bg-amber-500/15 text-amber-800 rounded-2xl border border-amber-400/30 backdrop-blur-md shrink-0 shadow-xs">
                  <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 break-words whitespace-pre-line">{formatTextWithBreaks(title)}</h2>
                  <p className="text-xs sm:text-sm text-slate-600">ประกาศด่วนและข้อมูลแจ้งให้ทราบจากสถานศึกษา</p>
                </div>
              </div>
              <Link
                href="/announcements"
                className="text-xs sm:text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900 flex items-center gap-1 shrink-0 self-start sm:self-auto transition-colors"
              >
                ดูประกาศทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center bg-white/70 backdrop-blur-xl rounded-2xl border border-dashed border-slate-300 text-slate-500">
                ไม่มีประกาศสำคัญในขณะนี้
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((ann: any) => (
                  <div
                    key={ann.id}
                    className="p-6 bg-white/75 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(234,179,8,0.12)] hover:border-brand-gold-400/50 hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between"
                  >
                    <div>
                      {showBadge && ann.isPinned ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-700 border border-red-500/20 backdrop-blur-md mb-3">
                          ปักหมุดด่วน
                        </span>
                      ) : null}
                      <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 hover:text-brand-navy-700 text-base break-words whitespace-pre-line">
                        <Link href={`/announcements/${ann.slug}`}>{formatTextWithBreaks(ann.title)}</Link>
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed break-words whitespace-pre-line">{formatTextWithBreaks(ann.content)}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3.5 border-t border-slate-100/80">
                      <span>{formatThaiDate(ann.publishedAt || ann.createdAt)}</span>
                      <Link href={`/announcements/${ann.slug}`} className="text-brand-navy-700 font-semibold hover:underline">
                        อ่านต่อ &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    case 'news_list': {
      const { title = 'ข่าวประชาสัมพันธ์', subtitle, limit = 3 } = block.data;
      const items = contextData.news?.slice(0, limit) || [];

      return (
        <section className="py-16 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-brand-navy-700 font-semibold text-sm mb-2">
                  <div className="p-1.5 rounded-lg bg-brand-navy-50 text-brand-navy-800 border border-brand-navy-100">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <span>ข่าวสาร & กิจกรรม</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight break-words whitespace-pre-line">{formatTextWithBreaks(title)}</h2>
                {subtitle && <p className="text-slate-600 mt-1 break-words whitespace-pre-line">{formatTextWithBreaks(subtitle)}</p>}
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm hover:shadow hover:border-brand-navy-200 transition-all"
              >
                ดูข่าวทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="p-12 text-center bg-white/70 backdrop-blur-xl rounded-2xl border border-dashed border-slate-300 text-slate-500">
                ไม่มีข่าวประชาสัมพันธ์ในขณะนี้
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item: any) => (
                  <article
                    key={item.id}
                    className="flex flex-col rounded-2xl overflow-hidden border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(11,31,60,0.12)] hover:border-brand-navy-200 hover:-translate-y-1.5 transition-all duration-300 group"
                  >
                    <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {item.coverImageUrl ? (
                        <img
                          src={item.coverImageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-brand-navy-900 via-brand-navy-800 to-brand-navy-700 flex items-center justify-center text-white/50">
                          <Newspaper className="w-12 h-12" />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-navy-950/80 text-brand-gold-300 text-xs font-semibold backdrop-blur-md border border-white/20 shadow-sm">
                        {item.category === 'activity' ? 'กิจกรรม' : item.category === 'academic' ? 'วิชาการ' : 'ทั่วไป'}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-brand-navy-600" />
                          <span>{formatThaiDate(item.publishedAt || item.createdAt)}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-brand-navy-700 line-clamp-2 mb-2 leading-snug transition-colors break-words whitespace-pre-line">
                          <Link href={`/news/${item.slug}`}>{formatTextWithBreaks(item.title)}</Link>
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed break-words whitespace-pre-line">
                          {formatTextWithBreaks(item.summary || item.content)}
                        </p>
                      </div>

                      <Link
                        href={`/news/${item.slug}`}
                        className="text-sm font-semibold text-brand-navy-700 hover:text-brand-gold-600 inline-flex items-center gap-1 transition-colors pt-3 border-t border-slate-100"
                      >
                        อ่านรายละเอียด <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    case 'botanical_highlight': {
      const { title = 'สวนพฤกษศาสตร์โรงเรียน', subtitle, limit = 3 } = block.data;
      const items = contextData.plants?.slice(0, limit) || [];

      return (
        <section className="py-16 bg-emerald-50/40 backdrop-blur-md border-t border-emerald-100/60 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                    <TreePine className="w-4 h-4" />
                  </div>
                  <span>โครงการอนุรักษ์พันธุกรรมพืช</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight break-words whitespace-pre-line">{formatTextWithBreaks(title)}</h2>
                {subtitle && <p className="text-slate-600 mt-1 break-words whitespace-pre-line">{formatTextWithBreaks(subtitle)}</p>}
              </div>
              <Link
                href="/botanical-garden"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-emerald-200/60 shadow-sm hover:shadow transition-all"
              >
                ดูพรรณไม้ทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((plant: any) => (
                <div
                  key={plant.id}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:border-emerald-300/60 hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 backdrop-blur-md">
                        {plant.family}
                      </span>
                      <span className="text-xs text-slate-400">สถานะ: ตรวจสอบแล้ว</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1 break-words whitespace-pre-line">{formatTextWithBreaks(plant.thaiName)}</h3>
                    <p className="text-xs italic text-slate-500 mb-3 break-words whitespace-pre-line">{formatTextWithBreaks(plant.scientificName)}</p>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed break-words whitespace-pre-line">{formatTextWithBreaks(plant.characteristics)}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span>ตำแหน่ง: {plant.locationInSchool}</span>
                    <Link href={`/botanical-garden/${plant.id}`} className="text-emerald-700 font-semibold hover:underline">
                      รายละเอียด &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'eservice_links': {
      const { title = 'ระบบบริการออนไลน์ (E-Service)', subtitle } = block.data;
      const items = contextData.eServices || [];

      return (
        <section className="py-16 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-navy-50/80 border border-brand-navy-100 text-brand-navy-700 text-xs font-semibold mb-3 backdrop-blur-md">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>สะดวก รวดเร็ว โปร่งใส</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight break-words whitespace-pre-line">{formatTextWithBreaks(title)}</h2>
              {subtitle && <p className="text-slate-600 break-words whitespace-pre-line">{formatTextWithBreaks(subtitle)}</p>}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((svc: any) => (
                <a
                  key={svc.id}
                  href={svc.url}
                  target={svc.isExternal ? '_blank' : '_self'}
                  rel={svc.isExternal ? 'noopener noreferrer' : undefined}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/80 hover:border-brand-navy-300/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(11,31,60,0.1)] hover:-translate-y-1 transition-all group flex items-start gap-4"
                >
                  <div className="p-3.5 bg-brand-navy-50/80 border border-brand-navy-100 text-brand-navy-700 rounded-xl group-hover:bg-brand-navy-700 group-hover:text-brand-gold-400 group-hover:shadow-md transition-all shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-navy-700 break-words whitespace-pre-line">{formatTextWithBreaks(svc.title)}</h3>
                      {svc.isExternal && <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-gold-600 shrink-0 transition-colors mt-0.5" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-words whitespace-pre-line">{formatTextWithBreaks(svc.description)}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'staff_cards': {
      const { title = 'ทำเนียบบุคลากร', limit = 4 } = block.data;
      const items = contextData.staff?.slice(0, limit) || [];

      return (
        <section className="py-16 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight break-words whitespace-pre-line">{formatTextWithBreaks(title)}</h2>
              <p className="text-slate-600">คณะครูและบุคลากรทางการศึกษา โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((member: any) => (
                <div
                  key={member.id}
                  className="p-6 bg-white/75 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(11,31,60,0.08)] hover:-translate-y-1 transition-all text-center group"
                >
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-slate-100 border-2 border-brand-navy-100/80 shadow-inner mb-4 flex items-center justify-center ring-4 ring-brand-gold-400/20 group-hover:ring-brand-gold-400/50 transition-all">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <User className="w-14 h-14 text-slate-300" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-navy-700 text-base break-words whitespace-pre-line">{formatTextWithBreaks(member.name)}</h3>
                  <p className="text-xs font-semibold text-brand-navy-700 mt-1 break-words whitespace-pre-line">{formatTextWithBreaks(member.position)}</p>
                  <p className="text-xs text-slate-500 mt-1 break-words whitespace-pre-line">{formatTextWithBreaks(member.qualification)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'event_list': {
      const { title = 'ปฏิทินกิจกรรม', limit = 3 } = block.data;
      const items = contextData.events?.slice(0, limit) || [];

      return (
        <section className="py-12 sm:py-16 relative w-full max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-brand-navy-50 text-brand-navy-800 rounded-xl border border-brand-navy-100/70 shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-slate-900 break-words whitespace-pre-line tracking-tight">{formatTextWithBreaks(title)}</h2>
                  <p className="text-xs sm:text-sm text-slate-600">กำหนดการและกิจกรรมสำคัญของโรงเรียน</p>
                </div>
              </div>
              <Link
                href="/calendar"
                className="text-xs sm:text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm hover:shadow flex items-center gap-1 shrink-0 self-start sm:self-auto transition-all"
              >
                ดูปฏิทินทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {items.map((ev: any) => (
                <div
                  key={ev.id}
                  className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(234,179,8,0.1)] hover:border-brand-gold-400/50 hover:-translate-y-0.5 transition-all flex items-start gap-4"
                >
                  <div className="p-3 bg-gradient-to-br from-brand-gold-50 to-amber-100/70 border border-brand-gold-200/80 text-brand-navy-950 rounded-xl text-center min-w-16 shadow-sm">
                    <span className="block text-2xl font-bold leading-none text-brand-navy-900">{new Date(ev.startDate).getDate() || 1}</span>
                    <span className="text-[11px] font-bold text-brand-gold-700 tracking-wider">วันจัด</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 break-words whitespace-pre-line">{formatTextWithBreaks(ev.title)}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed break-words whitespace-pre-line">{formatTextWithBreaks(ev.description)}</p>
                    {ev.location && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">📍 สถานที่: {ev.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'cta': {
      const { title, description, buttonText, buttonUrl } = block.data;
      return (
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-navy-700 via-brand-navy-900 to-brand-navy-950 rounded-3xl blur-xl opacity-60" />
            <div className="relative bg-brand-navy-950/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl">
              <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-brand-gold-400 shadow-inner">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-white break-words whitespace-pre-line">{formatTextWithBreaks(title)}</h2>
              {description && <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base sm:text-lg leading-relaxed break-words whitespace-pre-line">{formatTextWithBreaks(description)}</p>}
              <Link
                href={buttonUrl}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-300 hover:to-brand-gold-400 text-brand-navy-950 font-bold shadow-[0_10px_25px_rgba(234,179,8,0.3)] transition-all hover:scale-105 inline-block border border-brand-gold-300"
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </section>
      );
    }

    case 'text_section': {
      const { title, content, alignment = 'left' } = block.data;
      const alignClass = alignment === 'center' ? 'text-center max-w-3xl mx-auto' : alignment === 'right' ? 'text-right' : 'text-left';

      return (
        <section className="py-12 px-4 sm:px-6 relative">
          <div className={`max-w-5xl mx-auto ${alignClass}`}>
            <div className="bg-white/75 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {title && <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight break-words whitespace-pre-line">{formatTextWithBreaks(title)}</h2>}
              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base sm:text-lg break-words">{formatTextWithBreaks(content)}</div>
            </div>
          </div>
        </section>
      );
    }

    case 'image_single': {
      const { imageUrl, altText, caption, alignment = 'center' } = block.data;
      const alignClass = alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : 'mr-auto';

      return (
        <section className="py-8 px-4 sm:px-6 relative">
          <div className="max-w-5xl mx-auto">
            <figure className={`max-w-3xl ${alignClass} p-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_10px_35px_rgba(0,0,0,0.05)]`}>
              <img src={imageUrl} alt={altText || caption || ''} className="w-full rounded-xl object-cover" />
              {caption && <figcaption className="text-center text-xs text-slate-500 mt-2.5 font-medium break-words whitespace-pre-line">{formatTextWithBreaks(caption)}</figcaption>}
            </figure>
          </div>
        </section>
      );
    }

    case 'image_gallery': {
      const { title, columns = 3, images = [] } = block.data;
      const colClass = columns === 4 ? 'grid-cols-2 md:grid-cols-4' : columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3';

      return (
        <section className="py-12 px-4 sm:px-6 relative">
          <div className="max-w-6xl mx-auto">
            {title && <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center tracking-tight break-words whitespace-pre-line">{formatTextWithBreaks(title)}</h2>}
            <div className={`grid gap-5 ${colClass}`}>
              {images.map((img: any, i: number) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.05)] border border-white/80 bg-white/70 backdrop-blur-md aspect-video hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <img src={img.url} alt={img.alt || img.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-brand-navy-950/80 text-white text-xs text-center backdrop-blur-md border-t border-white/10 break-words whitespace-pre-line">
                      {formatTextWithBreaks(img.caption)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'document_list': {
      const { title = 'เอกสารดาวน์โหลด', limit = 4 } = block.data;
      const items = contextData.documents?.slice(0, limit) || [];

      return (
        <section className="py-10 sm:py-12 px-4 sm:px-6 w-full max-w-full overflow-hidden relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 min-w-0">
                <div className="p-2 bg-brand-navy-50 text-brand-navy-700 rounded-lg shrink-0 border border-brand-navy-100">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="break-words whitespace-pre-line">{formatTextWithBreaks(title)}</span>
              </h2>
              <Link href="/documents" className="text-xs sm:text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900 shrink-0 self-start sm:self-auto transition-colors">
                เอกสารทั้งหมด &rarr;
              </Link>
            </div>
            <div className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] divide-y divide-slate-100">
              {items.map((doc: any) => (
                <div key={doc.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/90 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-brand-navy-50/80 text-brand-navy-700 shrink-0 border border-brand-navy-100/50">
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 text-xs sm:text-sm break-words whitespace-pre-line">{formatTextWithBreaks(doc.title)}</h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{doc.fileType} • {doc.fileSize}</p>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    download
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/90 border border-slate-200/80 text-brand-navy-800 text-xs font-semibold hover:bg-brand-navy-700 hover:text-white hover:border-brand-navy-700 shadow-sm transition-all shrink-0 text-center"
                  >
                    ดาวน์โหลด
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'divider': {
      const { style = 'solid', spacing = 'medium' } = block.data;
      const spaceClass = spacing === 'large' ? 'my-16' : spacing === 'small' ? 'my-6' : 'my-10';
      const styleClass = style === 'dashed' ? 'border-dashed' : style === 'dotted' ? 'border-dotted' : 'border-solid';

      return (
        <div className={`max-w-6xl mx-auto px-4 ${spaceClass}`}>
          <hr className={`border-slate-200/60 ${styleClass}`} />
        </div>
      );
    }

    case 'spacer': {
      const { height = 'md' } = block.data;
      const heightClass = height === 'xl' ? 'h-24' : height === 'lg' ? 'h-16' : height === 'sm' ? 'h-6' : 'h-10';
      return <div className={heightClass} aria-hidden="true" />;
    }

    case 'image_slider': {
      const { slides = [] } = block.data;
      if (slides.length === 0) return null;
      return (
        <section className="py-8 px-4 sm:px-6 relative">
          <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] bg-slate-900 relative border border-white/40 ring-1 ring-black/5">
            <img src={slides[0].imageUrl} alt={slides[0].title || ''} className="w-full h-full object-cover" />
            {(slides[0].title || slides[0].caption) && (
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-brand-navy-950/90 via-brand-navy-950/60 to-transparent text-white backdrop-blur-[2px]">
                {slides[0].title && <h3 className="text-xl sm:text-3xl font-bold text-white drop-shadow-sm break-words whitespace-pre-line">{formatTextWithBreaks(slides[0].title)}</h3>}
                {slides[0].caption && <p className="text-slate-200 text-xs sm:text-sm mt-1 sm:mt-2 max-w-2xl leading-relaxed break-words whitespace-pre-line">{formatTextWithBreaks(slides[0].caption)}</p>}
              </div>
            )}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
};
