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

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, contextData = {} }) => {
  switch (block.type) {
    case 'hero_banner': {
      const { badge, title, subtitle, primaryButtonText, primaryButtonUrl, secondaryButtonText, secondaryButtonUrl, backgroundImageUrl } = block.data;
      return (
        <section
          className="relative overflow-hidden bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-800 text-white py-16 sm:py-20 lg:py-28 px-4 sm:px-6 w-full max-w-full"
          style={
            backgroundImageUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(11, 31, 60, 0.85), rgba(11, 31, 60, 0.95)), url(${backgroundImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="max-w-5xl mx-auto text-center relative z-10 w-full overflow-hidden">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/20 text-brand-gold-300 border border-brand-gold-500/30 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold-400 shrink-0" />
                <span className="truncate">{badge}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-tight break-words">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed break-words px-2">
                {subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full">
              {primaryButtonText && primaryButtonUrl && (
                <Link
                  href={primaryButtonUrl}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-950 font-semibold shadow-lg shadow-brand-gold-500/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 text-sm sm:text-base text-center"
                >
                  <span>{primaryButtonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {secondaryButtonText && secondaryButtonUrl && (
                <Link
                  href={secondaryButtonUrl}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 text-sm sm:text-base text-center"
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
        <section className="py-10 sm:py-12 bg-amber-50/60 border-y border-amber-200/60 w-full max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 sm:p-2.5 bg-amber-500/10 text-amber-700 rounded-lg shrink-0">
                  <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{title}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">ประกาศด่วนและข้อมูลแจ้งให้ทราบจากสถานศึกษา</p>
                </div>
              </div>
              <Link
                href="/announcements"
                className="text-xs sm:text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900 flex items-center gap-1 shrink-0 self-start sm:self-auto"
              >
                ดูประกาศทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                ไม่มีประกาศสำคัญในขณะนี้
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((ann: any) => (
                  <div
                    key={ann.id}
                    className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                  >
                    <div>
                      {showBadge && ann.isPinned ? (
                        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 mb-3">
                          ปักหมุดด่วน
                        </span>
                      ) : null}
                      <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 hover:text-brand-navy-700">
                        <Link href={`/announcements/${ann.slug}`}>{ann.title}</Link>
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4">{ann.content}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <span>{formatThaiDate(ann.publishedAt || ann.createdAt)}</span>
                      <Link href={`/announcements/${ann.slug}`} className="text-brand-navy-700 font-medium hover:underline">
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
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-brand-navy-700 font-semibold text-sm mb-2">
                  <Newspaper className="w-4 h-4" />
                  <span>ข่าวสาร & กิจกรรม</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
                {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900"
              >
                ดูข่าวทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                ไม่มีข่าวประชาสัมพันธ์ในขณะนี้
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item: any) => (
                  <article
                    key={item.id}
                    className="flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {item.coverImageUrl ? (
                        <img
                          src={item.coverImageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-brand-navy-800 to-brand-navy-600 flex items-center justify-center text-white/50">
                          <Newspaper className="w-12 h-12" />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-brand-navy-950/80 text-white text-xs font-medium backdrop-blur-sm">
                        {item.category === 'activity' ? 'กิจกรรม' : item.category === 'academic' ? 'วิชาการ' : 'ทั่วไป'}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatThaiDate(item.publishedAt || item.createdAt)}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-brand-navy-700 line-clamp-2 mb-2 leading-snug">
                          <Link href={`/news/${item.slug}`}>{item.title}</Link>
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                          {item.summary || item.content}
                        </p>
                      </div>

                      <Link
                        href={`/news/${item.slug}`}
                        className="text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900 inline-flex items-center gap-1"
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
        <section className="py-16 bg-emerald-50/50 border-t border-emerald-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-2">
                  <TreePine className="w-4 h-4" />
                  <span>โครงการอนุรักษ์พันธุกรรมพืช</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
                {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
              </div>
              <Link
                href="/botanical-garden"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              >
                ดูพรรณไม้ทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((plant: any) => (
                <div
                  key={plant.id}
                  className="bg-white rounded-xl border border-emerald-200/80 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {plant.family}
                    </span>
                    <span className="text-xs text-slate-400">สถานะ: ตรวจสอบแล้ว</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{plant.thaiName}</h3>
                  <p className="text-xs italic text-slate-500 mb-3">{plant.scientificName}</p>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">{plant.characteristics}</p>
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
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">{title}</h2>
              {subtitle && <p className="text-slate-600">{subtitle}</p>}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((svc: any) => (
                <a
                  key={svc.id}
                  href={svc.url}
                  target={svc.isExternal ? '_blank' : '_self'}
                  rel={svc.isExternal ? 'noopener noreferrer' : undefined}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:border-brand-navy-300 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
                >
                  <div className="p-3 bg-brand-navy-50 text-brand-navy-700 rounded-lg group-hover:bg-brand-navy-700 group-hover:text-white transition-colors">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-navy-700">{svc.title}</h3>
                      {svc.isExternal && <ExternalLink className="w-4 h-4 text-slate-400" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{svc.description}</p>
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
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">{title}</h2>
              <p className="text-slate-600">คณะครูและบุคลากรทางการศึกษา โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((member: any) => (
                <div key={member.id} className="text-center group">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-100 border-2 border-brand-navy-100 shadow-sm mb-4 flex items-center justify-center">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-slate-300" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-navy-700">{member.name}</h3>
                  <p className="text-sm text-brand-navy-700 font-medium mt-0.5">{member.position}</p>
                  <p className="text-xs text-slate-500 mt-1">{member.qualification}</p>
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
        <section className="py-10 sm:py-14 bg-slate-50 border-t border-slate-200 w-full max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 sm:p-2.5 bg-brand-navy-50 text-brand-navy-800 rounded-lg shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{title}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">กำหนดการและกิจกรรมสำคัญของโรงเรียน</p>
                </div>
              </div>
              <Link href="/calendar" className="text-xs sm:text-sm font-semibold text-brand-navy-700 hover:text-brand-navy-900 flex items-center gap-1 shrink-0 self-start sm:self-auto">
                ดูปฏิทินทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {items.map((ev: any) => (
                <div key={ev.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="p-3 bg-brand-gold-50 border border-brand-gold-200 text-brand-gold-800 rounded-lg text-center min-w-16">
                    <span className="block text-xl font-bold leading-none">{new Date(ev.startDate).getDate() || 1}</span>
                    <span className="text-xs font-semibold">วันจัด</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{ev.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{ev.description}</p>
                    {ev.location && <p className="text-xs text-slate-400 mt-2">สถานที่: {ev.location}</p>}
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
        <section className="py-16 bg-brand-navy-900 text-white text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">{description}</p>}
            <Link
              href={buttonUrl}
              className="px-8 py-3.5 rounded-lg bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-950 font-bold shadow-lg transition-transform hover:scale-105 inline-block"
            >
              {buttonText}
            </Link>
          </div>
        </section>
      );
    }

    case 'text_section': {
      const { title, content, alignment = 'left' } = block.data;
      const alignClass = alignment === 'center' ? 'text-center max-w-3xl mx-auto' : alignment === 'right' ? 'text-right' : 'text-left';

      return (
        <section className="py-12 bg-white px-4 sm:px-6">
          <div className={`max-w-5xl mx-auto ${alignClass}`}>
            {title && <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{title}</h2>}
            <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">{content}</div>
          </div>
        </section>
      );
    }

    case 'image_single': {
      const { imageUrl, altText, caption, alignment = 'center' } = block.data;
      const alignClass = alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : 'mr-auto';

      return (
        <section className="py-8 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <figure className={`max-w-3xl ${alignClass}`}>
              <img src={imageUrl} alt={altText || caption || ''} className="w-full rounded-xl shadow-md object-cover" />
              {caption && <figcaption className="text-center text-sm text-slate-500 mt-2">{caption}</figcaption>}
            </figure>
          </div>
        </section>
      );
    }

    case 'image_gallery': {
      const { title, columns = 3, images = [] } = block.data;
      const colClass = columns === 4 ? 'grid-cols-2 md:grid-cols-4' : columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3';

      return (
        <section className="py-12 bg-white px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {title && <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">{title}</h2>}
            <div className={`grid gap-4 ${colClass}`}>
              {images.map((img, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden shadow-sm bg-slate-100 aspect-video">
                  <img src={img.url} alt={img.alt || img.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 text-white text-xs text-center backdrop-blur-sm">
                      {img.caption}
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
        <section className="py-10 sm:py-12 bg-white px-4 sm:px-6 w-full max-w-full overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-brand-navy-700 shrink-0" />
                <span className="truncate">{title}</span>
              </h2>
              <Link href="/documents" className="text-xs sm:text-sm font-semibold text-brand-navy-700 hover:underline shrink-0 self-start sm:self-auto">
                เอกสารทั้งหมด &rarr;
              </Link>
            </div>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              {items.map((doc: any) => (
                <div key={doc.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded bg-brand-navy-50 text-brand-navy-700 shrink-0">
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{doc.title}</h3>
                      <p className="text-[11px] sm:text-xs text-slate-500">{doc.fileType} • {doc.fileSize}</p>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    download
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-brand-navy-50 hover:text-brand-navy-800 transition-colors shrink-0 text-center"
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
          <hr className={`border-slate-200 ${styleClass}`} />
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
        <section className="py-8 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg aspect-[21/9] bg-slate-900 relative">
            <img src={slides[0].imageUrl} alt={slides[0].title || ''} className="w-full h-full object-cover" />
            {(slides[0].title || slides[0].caption) && (
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                {slides[0].title && <h3 className="text-2xl font-bold">{slides[0].title}</h3>}
                {slides[0].caption && <p className="text-slate-300 text-sm mt-1">{slides[0].caption}</p>}
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
