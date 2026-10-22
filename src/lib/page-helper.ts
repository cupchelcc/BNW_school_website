export interface StandardPageMeta {
  slug: string;
  title: string;
  publicUrl: string;
  category: 'main' | 'about' | 'academic' | 'service';
  description: string;
}

export const STANDARD_PAGES: StandardPageMeta[] = [
  {
    slug: 'home',
    title: 'หน้าแรก - โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
    publicUrl: '/',
    category: 'main',
    description: 'หน้าแรกของเว็บไซต์ แสดงข่าวเด่น กิจกรรม ปฏิทิน และทางลัดบริการ',
  },
  {
    slug: 'about',
    title: 'ข้อมูลพื้นฐานสถานศึกษา',
    publicUrl: '/about',
    category: 'about',
    description: 'หน้าศูนย์รวมข้อมูลโรงเรียน ภาพรวม 4 หมวดหมู่หลัก',
  },
  {
    slug: 'about-history',
    title: 'ประวัติและข้อมูลทั่วไป',
    publicUrl: '/about/history',
    category: 'about',
    description: 'ความเป็นมาของสถานศึกษา นามรอดพิทยาคม และสัญลักษณ์ประจำโรงเรียน',
  },
  {
    slug: 'about-vision',
    title: 'วิสัยทัศน์ พันธกิจ และเป้าประสงค์',
    publicUrl: '/about/vision',
    category: 'about',
    description: 'ทิศทางการจัดการศึกษา ค่านิยม พันธกิจ 5 ประการ และเป้าประสงค์',
  },
  {
    slug: 'about-structure',
    title: 'โครงสร้างการบริหารสถานศึกษา',
    publicUrl: '/about/structure',
    category: 'about',
    description: 'แผนผังการบริหารงาน 4 ฝ่ายตามโครงสร้างกระทรวงศึกษาธิการ',
  },
  {
    slug: 'academic',
    title: 'งานวิชาการและหลักสูตรสถานศึกษา',
    publicUrl: '/academic',
    category: 'academic',
    description: 'ข้อมูลหลักสูตรการศึกษา 8 กลุ่มสาระ และระดับชั้นที่เปิดสอน',
  },
  {
    slug: 'achievements',
    title: 'ผลงานและความภาคภูมิใจ',
    publicUrl: '/achievements',
    category: 'academic',
    description: 'รางวัลเกียรติยศ ผลงานดีเด่นของนักเรียนและสถานศึกษา',
  },
  {
    slug: 'contact',
    title: 'ติดต่อโรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
    publicUrl: '/contact',
    category: 'service',
    description: 'ข้อมูลที่ตั้ง แผนที่ ช่องทางติดต่อราชการ และแบบฟอร์มส่งข้อความ',
  },
  {
    slug: 'privacy',
    title: 'นโยบายความเป็นส่วนตัว (PDPA)',
    publicUrl: '/privacy',
    category: 'service',
    description: 'ข้อกำหนดการคุ้มครองข้อมูลส่วนบุคคลตามพระราชบัญญัติ PDPA',
  },
];

/**
 * แปลง slug เป็น URL สาธารณะที่ถูกต้อง
 */
export function getPagePublicUrl(slug: string): string {
  const match = STANDARD_PAGES.find((p) => p.slug === slug);
  if (match) return match.publicUrl;
  return `/p/${slug}`;
}
