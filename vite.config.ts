import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true, // อนุญาตให้เครื่องอื่นในวงแลนเห็นได้ (เผื่อเทสบนมือถือ)
    // open: true, // สั่งให้เปิด Browser อัตโนมัติเมื่อรันเสร็จ
    port: 5173
  },
  build: {
    assetsInlineLimit: 0, // บังคับให้โหลดไฟล์แยกเสมอ (แก้ปัญหาโหลดรูปไม่ขึ้น)
  }
});
