/* Tạo chuỗi VietQR (chuẩn EMVCo / NAPAS) để chuyển khoản — chạy offline.
   VietQR.payload({bin:'970436', account:'0123456789', amount:50000, note:'Cafe'}) → chuỗi đưa vào mã QR. */
(function () {
  'use strict';
  const tlv = (id, v) => id + String(v.length).padStart(2, '0') + v;
  function crc16(s) { // CRC-16/CCITT-FALSE
    let c = 0xFFFF;
    for (let i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (let k = 0; k < 8; k++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF; }
    return c.toString(16).toUpperCase().padStart(4, '0');
  }
  const ascii = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9 ]/g, '').slice(0, 25).trim();
  function payload(o) {
    const acc = tlv('00', 'A000000727') + tlv('01', tlv('00', String(o.bin)) + tlv('01', String(o.account).replace(/\s/g, ''))) + tlv('02', 'QRIBFTTA');
    let s = tlv('00', '01') + tlv('01', o.amount > 0 ? '12' : '11') + tlv('38', acc) + tlv('53', '704');
    if (o.amount > 0) s += tlv('54', String(Math.round(o.amount)));
    s += tlv('58', 'VN');
    const note = ascii(o.note); if (note) s += tlv('62', tlv('08', note));
    s += '6304';
    return s + crc16(s);
  }
  /* Mã BIN một số ngân hàng phổ biến (kiểm tra lại trong app ngân hàng nếu không chắc) */
  const BANKS = { '970436': 'Vietcombank', '970415': 'VietinBank', '970418': 'BIDV', '970405': 'Agribank', '970407': 'Techcombank', '970422': 'MB Bank', '970416': 'ACB', '970432': 'VPBank', '970423': 'TPBank', '970403': 'Sacombank', '970441': 'VIB', '970437': 'HDBank', '970443': 'SHB', '970448': 'OCB', '970426': 'MSB', '970440': 'SeABank', '970431': 'Eximbank', '970449': 'LPBank', '970428': 'Nam A Bank', '970454': 'Viet Capital Bank', '970412': 'PVcomBank' };
  window.VietQR = { payload, crc16, BANKS, ascii };
})();
