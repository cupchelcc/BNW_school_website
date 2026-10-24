import React from 'react';
import Link from 'next/link';
import { School, Phone, Mail, MapPin, Shield, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  theme: {
    siteName: string;
    siteDescription?: string | null;
    logoUrl?: string | null;
    footerCopyright?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    contactAddress?: string | null;
    facebookUrl?: string | null;
    lineUrl?: string | null;
    youtubeUrl?: string | null;
  };
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer className="relative bg-brand-navy-950/95 backdrop-blur-2xl text-white pt-14 sm:pt-16 pb-8 border-t border-white/10 shadow-[0_-10px_40px_rgba(11,31,60,0.3)] w-full max-w-full overflow-x-hidden">
      {/* Top subtle golden light beam */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold-400/60 to-transparent" />
      {/* Ambient glass light refraction */}
      <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-brand-gold-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-white/10">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 text-brand-navy-950 flex items-center justify-center font-bold shadow-[0_4px_16px_rgba(234,179,8,0.25)] border border-brand-gold-300 shrink-0">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight tracking-tight">{theme.siteName}</h3>
                <span className="text-xs text-brand-gold-400 font-medium">สพป.สมุทรสาคร</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {theme.siteDescription || 'สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ คุณธรรมนำความรู้'}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={theme.facebookUrl || 'https://www.facebook.com/Watbangnamwonschool'}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white backdrop-blur-md transition-all hover:scale-105"
                aria-label="Facebook โรงเรียน"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {theme.youtubeUrl && (
                <a
                  href={theme.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white backdrop-blur-md transition-all hover:scale-105"
                  aria-label="YouTube โรงเรียน"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-bold text-sm text-brand-gold-400 uppercase tracking-wider mb-4">
              เกี่ยวกับโรงเรียน
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/about/history" className="hover:text-white transition-colors">
                  ประวัติและข้อมูลทั่วไป
                </Link>
              </li>
              <li>
                <Link href="/about/vision" className="hover:text-white transition-colors">
                  วิสัยทัศน์ พันธกิจ อัตลักษณ์
                </Link>
              </li>
              <li>
                <Link href="/about/structure" className="hover:text-white transition-colors">
                  โครงสร้างการบริหาร
                </Link>
              </li>
              <li>
                <Link href="/about/staff" className="hover:text-white transition-colors">
                  ทำเนียบบุคลากร
                </Link>
              </li>
              <li>
                <Link href="/academic" className="hover:text-white transition-colors">
                  ข้อมูลด้านวิชาการและหลักสูตร
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-white transition-colors">
                  ผลงานและความสำเร็จ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Learning */}
          <div>
            <h4 className="font-bold text-sm text-brand-gold-400 uppercase tracking-wider mb-4">
              บริการและแหล่งเรียนรู้
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  ข่าวประชาสัมพันธ์
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-white transition-colors">
                  ประกาศของโรงเรียน
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-white transition-colors">
                  ปฏิทินกิจกรรม
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-white transition-colors">
                  เอกสารดาวน์โหลด
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  ภาพกิจกรรมและแกลเลอรี
                </Link>
              </li>
              <li>
                <Link href="/e-service" className="hover:text-white transition-colors">
                  ระบบบริการออนไลน์ (E-Service)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-brand-gold-400 uppercase tracking-wider mb-4">
              ติดต่อโรงเรียน
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-brand-gold-400 shrink-0 mt-0.5" />
              <span>{theme.contactAddress || 'เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-brand-gold-400 shrink-0" />
              <span>{theme.contactPhone || '034-490-XXX'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-brand-gold-400 shrink-0" />
              <span>{theme.contactEmail || 'contact@bnw.ac.th'}</span>
            </div>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs text-brand-gold-400 hover:text-brand-gold-300 font-semibold"
              >
                <span>ดูแผนที่และการเดินทาง</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{theme.footerCopyright || '© 2026 โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สงวนลิขสิทธิ์'}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              นโยบายความเป็นส่วนตัว
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              ระบบผู้ดูแล
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
