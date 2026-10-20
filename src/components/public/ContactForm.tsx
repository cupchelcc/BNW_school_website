'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-3">
        <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
        <h3 className="font-bold text-base">ส่งข้อความเรียบร้อยแล้ว</h3>
        <p className="text-xs text-emerald-700 leading-relaxed">
          ขอบพระคุณสำหรับข้อความของท่าน ทางฝ่ายธุรการโรงเรียนวัดบางน้ำวน (รอดพิทยาคม) ได้รับข้อมูลแล้ว และจะติดต่อกลับตามข้อมูลที่ท่านระบุไว้โดยเร็วที่สุด
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setMessage('');
          }}
          className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800"
        >
          ส่งข้อความอื่นเพิ่มเติม
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="block font-bold text-slate-700 mb-1" htmlFor="c-name">
          ชื่อ-นามสกุล ผู้ติดต่อ *
        </label>
        <input
          id="c-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="นาย/นาง/นางสาว..."
          className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-navy-600 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-bold text-slate-700 mb-1" htmlFor="c-phone">
            เบอร์โทรศัพท์ติดต่อ *
          </label>
          <input
            id="c-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08X-XXX-XXXX"
            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-navy-600 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1" htmlFor="c-email">
            อีเมล (ถ้ามี)
          </label>
          <input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-navy-600 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-700 mb-1" htmlFor="c-subject">
          เรื่องที่ต้องการติดต่อ *
        </label>
        <input
          id="c-subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="เช่น สอบถามการรับสมัครนักเรียน, ขอเอกสารทางการศึกษา..."
          className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-navy-600 outline-none"
        />
      </div>

      <div>
        <label className="block font-bold text-slate-700 mb-1" htmlFor="c-message">
          รายละเอียดข้อความ *
        </label>
        <textarea
          id="c-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="พิมพ์ข้อความของคุณที่นี่..."
          className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-navy-600 outline-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
      >
        <Send className="w-4 h-4 text-brand-gold-400" />
        <span>ส่งข้อความ</span>
      </button>
    </form>
  );
};
