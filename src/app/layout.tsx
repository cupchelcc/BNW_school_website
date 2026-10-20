import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
  description: 'เว็บไซต์ทางการ โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรสาคร',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="overflow-x-hidden">
      <body className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
