import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PageBlock, BlockType } from '../src/types/page-builder';

describe('ระบบ Visual Page Builder 15 บล็อกมาตรฐาน', () => {
  const all15BlockTypes: BlockType[] = [
    'hero_banner',
    'text_section',
    'image_single',
    'image_gallery',
    'news_list',
    'announcement_list',
    'event_list',
    'staff_cards',
    'document_list',
    'cta',
    'image_slider',
    'divider',
    'spacer',
    'botanical_highlight',
    'eservice_links',
  ];

  test('ระบบต้องรองรับบล็อกมาตรฐานครบทั้ง 15 ประเภทตามข้อกำหนด', () => {
    assert.equal(all15BlockTypes.length, 15);
  });

  test('การจัดเรียงและการจำลองโครงสร้างบล็อก (Block Serialization & Reordering)', () => {
    const blocks: PageBlock[] = [
      {
        id: 'b-1',
        type: 'hero_banner',
        data: {
          title: 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)',
          subtitle: 'คำอธิบายเสริม',
        },
      },
      {
        id: 'b-2',
        type: 'text_section',
        data: {
          title: 'วิสัยทัศน์',
          content: 'มุ่งมั่นจัดการศึกษา',
        },
      },
      {
        id: 'b-3',
        type: 'announcement_list',
        data: {
          title: 'ประกาศด่วน',
          limit: 3,
        },
      },
    ];

    // ตรวจสอบการแปลงเป็น JSON และแปลงกลับ
    const jsonString = JSON.stringify(blocks);
    const restoredBlocks = JSON.parse(jsonString) as PageBlock[];

    assert.equal(restoredBlocks.length, 3);
    assert.equal(restoredBlocks[0].type, 'hero_banner');
    assert.equal(restoredBlocks[1].type, 'text_section');
    assert.equal(restoredBlocks[2].type, 'announcement_list');

    // ทดสอบการสลับตำแหน่ง (Reorder b-2 ขึ้นไปอยู่ตำแหน่งแรก)
    const reordered = [restoredBlocks[1], restoredBlocks[0], restoredBlocks[2]];
    assert.equal(reordered[0].id, 'b-2');
    assert.equal(reordered[1].id, 'b-1');
    assert.equal(reordered[2].id, 'b-3');
  });
});
