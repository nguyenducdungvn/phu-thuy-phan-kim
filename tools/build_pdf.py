# -*- coding: utf-8 -*-
"""Dựng PDF "Bí kíp phân kim" — chạy: python build_pdf.py <đường-dẫn-ảnh> <file-ra.pdf>"""
import sys, os, re, datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, Image, KeepTogether, CondPageBreak, NextPageTemplate, Flowable)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon
from reportlab.lib.fonts import addMapping

HERE = os.path.dirname(os.path.abspath(__file__))
IMGDIR = sys.argv[1] if len(sys.argv) > 1 else '.'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'Bi-kip-phan-kim.pdf'
LOGO = sys.argv[3] if len(sys.argv) > 3 else None
F = lambda n: os.path.join(HERE, 'fonts', n)
pdfmetrics.registerFont(TTFont('BVP', F('BeVietnamPro_400Regular.ttf')))
pdfmetrics.registerFont(TTFont('BVP-I', F('BeVietnamPro_400Regular_Italic.ttf')))
pdfmetrics.registerFont(TTFont('BVP-SB', F('BeVietnamPro_600SemiBold.ttf')))
pdfmetrics.registerFont(TTFont('BVP-B', F('BeVietnamPro_700Bold.ttf')))
pdfmetrics.registerFont(TTFont('BVP-XB', F('BeVietnamPro_800ExtraBold.ttf')))
pdfmetrics.registerFont(TTFont('PF', F('PlayfairDisplay_700Bold.ttf')))
pdfmetrics.registerFont(TTFont('PF-XB', F('PlayfairDisplay_800ExtraBold.ttf')))
pdfmetrics.registerFont(TTFont('DV', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
addMapping('BVP', 0, 0, 'BVP'); addMapping('BVP', 1, 0, 'BVP-B'); addMapping('BVP', 0, 1, 'BVP-I'); addMapping('BVP', 1, 1, 'BVP-B')

NIGHT = colors.HexColor('#1a1326'); NIGHT2 = colors.HexColor('#2d2145'); GOLD = colors.HexColor('#c8961e'); GOLD2 = colors.HexColor('#f0c552')
GOLDSOFT = colors.HexColor('#fbf1d6'); INK = colors.HexColor('#221d2b'); MUTED = colors.HexColor('#6c6577'); LINE = colors.HexColor('#e2dace')
RED = colors.HexColor('#b3261e'); REDSOFT = colors.HexColor('#fdecea'); OK = colors.HexColor('#2e7d4f'); OKSOFT = colors.HexColor('#e7f4ec')
VIO = colors.HexColor('#5a3fa0'); VIOSOFT = colors.HexColor('#f1ecfa'); HEAD = colors.HexColor('#f4efe4')

ST = {
    'body': ParagraphStyle('body', fontName='BVP', fontSize=10, leading=15, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=5),
    'small': ParagraphStyle('small', fontName='BVP', fontSize=8.6, leading=12, textColor=INK),
    'cell': ParagraphStyle('cell', fontName='BVP', fontSize=8.6, leading=11.6, textColor=INK),
    'cellb': ParagraphStyle('cellb', fontName='BVP-SB', fontSize=8.6, leading=11.6, textColor=INK),
    'h1': ParagraphStyle('h1', fontName='PF-XB', fontSize=22, leading=27, textColor=NIGHT, spaceBefore=4, spaceAfter=10),
    'h2': ParagraphStyle('h2', fontName='BVP-B', fontSize=13.5, leading=18, textColor=VIO, spaceBefore=10, spaceAfter=5),
    'h3': ParagraphStyle('h3', fontName='BVP-SB', fontSize=11, leading=15, textColor=INK, spaceBefore=7, spaceAfter=3),
    'bul': ParagraphStyle('bul', fontName='BVP', fontSize=10, leading=14.5, textColor=INK, leftIndent=14, bulletIndent=4, spaceAfter=2),
    'eq': ParagraphStyle('eq', fontName='BVP', fontSize=9.8, leading=14, textColor=INK, leftIndent=6),
    'cap': ParagraphStyle('cap', fontName='BVP-I', fontSize=8, leading=10.5, textColor=MUTED, alignment=TA_CENTER),
    'toc1': ParagraphStyle('toc1', fontName='BVP-SB', fontSize=10.5, leading=16, leftIndent=0),
    'toc2': ParagraphStyle('toc2', fontName='BVP', fontSize=9.5, leading=13.5, leftIndent=14, textColor=MUTED),
}

SYM = '→←↑↓✓☐⚠★▶✗'
TOK = re.compile(r'(?<![A-Za-z0-9])(\d*)((?:[A-Z][a-z]?\d*|\(|\)\d*|\[|\]\d*|·\d*)+)')
def _subtok(m):
    pre, body = m.group(1), m.group(2)
    if not re.search(r'[A-Z][a-z]?\d|[\)\]]\d', body): return m.group(0)
    return pre + re.sub(r'([A-Za-z\)\]])(\d+)', r'\1<sub>\2</sub>', body)
def chem(t):
    """H2SO4 -> chỉ số dưới; Fe^2+ -> chỉ số trên; ký hiệu lạ dùng DejaVu. Không đụng vào nội dung trong thẻ <...>."""
    parts = re.split(r'(<[^>]+>)', t)
    out = []
    for p in parts:
        if p.startswith('<'):
            out.append(p); continue
        p = TOK.sub(_subtok, p)
        p = re.sub(r'\^(\d*[+\-])', r'<super>\1</super>', p)
        for c in SYM:
            p = p.replace(c, f'<font name="DV">{c}</font>')
        out.append(p)
    return ''.join(out)
SUBD = str.maketrans('0123456789', '₀₁₂₃₄₅₆₇₈₉')
def chem_plain(t):
    return TOK.sub(lambda m: m.group(1) + re.sub(r'([A-Za-z\)\]])(\d+)', lambda k: k.group(1) + k.group(2).translate(SUBD), m.group(2)) if re.search(r'[A-Z][a-z]?\d|[\)\]]\d', m.group(2)) else m.group(0), t)

story = []
def P(t, s='body'): story.append(Paragraph(chem(t), ST[s]))
def H1(t, key=None):
    story.append(CondPageBreak(60 * mm)); p = Paragraph(t, ST['h1']); p._toc = (0, t); story.append(p)
    story.append(HR(GOLD, 1.6))
def H2(t, toc=True):
    p = Paragraph(chem(t), ST['h2']);
    if toc: p._toc = (1, re.sub('<[^>]+>', '', chem(t)))
    story.append(CondPageBreak(30 * mm)); story.append(p)
def H3(t): story.append(Paragraph(chem(t), ST['h3']))
def B(items, num=False):
    for i, t in enumerate(items, 1):
        story.append(Paragraph(chem(t), ST['bul'], bulletText=(f'{i}.' if num else '•')))
def SP(h=4): story.append(Spacer(1, h))
def EQ(*eqs):
    rows = [[Paragraph(chem(e), ST['eq'])] for e in eqs]
    t = Table(rows, colWidths=[170 * mm])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), HEAD), ('BOX', (0, 0), (-1, -1), .5, LINE), ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3)]))
    story.append(t); SP(5)
def BOX(title, body, kind='note'):
    bg, bd, tc = {'note': (GOLDSOFT, colors.HexColor('#e7cf8a'), colors.HexColor('#7a5a00')), 'warn': (REDSOFT, colors.HexColor('#efb3ad'), RED), 'ok': (OKSOFT, colors.HexColor('#b5dbc3'), OK), 'vio': (VIOSOFT, colors.HexColor('#cfc2ea'), VIO)}[kind]
    cont = [Paragraph(f'<font name="BVP-B" color="{tc.hexval()}">{chem(title)}</font>', ST['body'])]
    if isinstance(body, str): body = [body]
    for b in body:
        cont.append(Paragraph(chem(b), ParagraphStyle('bx', parent=ST['body'], fontSize=9.4, leading=13.5, spaceAfter=2)))
    t = Table([[cont]], colWidths=[170 * mm])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), bg), ('BOX', (0, 0), (-1, -1), .8, bd), ('LEFTPADDING', (0, 0), (-1, -1), 9), ('RIGHTPADDING', (0, 0), (-1, -1), 9), ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6)]))
    story.append(t); SP(6)
def TBL(head, rows, widths, zebra=True, fs=None):
    st = ST['cell']
    data = [[Paragraph(f'<font name="BVP-B">{chem(h)}</font>', st) for h in head]] + [[Paragraph(chem(str(c)), st) for c in r] for r in rows]
    t = Table(data, colWidths=[w * mm for w in widths], repeatRows=1)
    sty = [('BACKGROUND', (0, 0), (-1, 0), HEAD), ('LINEBELOW', (0, 0), (-1, 0), .8, GOLD), ('GRID', (0, 0), (-1, -1), .35, LINE), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
           ('TOPPADDING', (0, 0), (-1, -1), 3.2), ('BOTTOMPADDING', (0, 0), (-1, -1), 3.2), ('LEFTPADDING', (0, 0), (-1, -1), 4), ('RIGHTPADDING', (0, 0), (-1, -1), 4)]
    if zebra:
        for i in range(2, len(data), 2): sty.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor('#fbf9f4')))
    t.setStyle(TableStyle(sty)); story.append(t); SP(7)
def IMG(names, caps, h=48):
    cells, capc = [], []
    for n, c in zip(names, caps):
        p = os.path.join(IMGDIR, n + '.jpg')
        if not os.path.exists(p): continue
        from PIL import Image as PI
        w0, h0 = PI.open(p).size; w = h * mm * w0 / h0
        mx = 170 * mm / len(names) - 4
        if w > mx: w = mx; hh = w * h0 / w0
        else: hh = h * mm
        cells.append(Image(p, width=w, height=hh)); capc.append(Paragraph(c, ST['cap']))
    if not cells: return
    t = Table([cells, capc], colWidths=[170 * mm / len(cells)] * len(cells))
    t.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')]))
    story.append(KeepTogether(t)); SP(6)

class HR(Flowable):
    def __init__(self, c, w=1): super().__init__(); self.c, self.w = c, w
    def wrap(self, aw, ah): self.aw = aw; return aw, 6
    def draw(self): self.canv.setStrokeColor(self.c); self.canv.setLineWidth(self.w); self.canv.line(0, 3, 40 * mm, 3)

def FLOW(steps, color=VIO):
    """Sơ đồ khối các bước, tự xuống dòng."""
    n = len(steps); per = min(n, 5); rows = (n + per - 1) // per
    W = 170 * mm; bw = (W - (per - 1) * 7 * mm) / per; bh = 15 * mm
    d = Drawing(W, rows * (bh + 7 * mm))
    for i, s in enumerate(steps):
        r, c = divmod(i, per)
        x = c * (bw + 7 * mm); y = d.height - (r + 1) * (bh + 7 * mm) + 7 * mm
        d.add(Rect(x, y, bw, bh, rx=5, ry=5, fillColor=VIOSOFT if i % 2 else GOLDSOFT, strokeColor=color, strokeWidth=.8))
        d.add(Rect(x + 2, y + bh - 9, 8, 7, rx=2, ry=2, fillColor=color, strokeColor=None)); d.add(String(x + 6, y + bh - 7.6, f'{i + 1}', fontName='BVP-B', fontSize=6, fillColor=colors.white, textAnchor='middle'))
        words = chem_plain(s).split(); lines = ['']
        for w_ in words:
            if pdfmetrics.stringWidth((lines[-1] + ' ' + w_).strip(), 'BVP-SB', 7.6) > bw - 8: lines.append(w_)
            else: lines[-1] = (lines[-1] + ' ' + w_).strip()
        for k, ln in enumerate(lines[:3]):
            d.add(String(x + bw / 2, y + bh / 2 - 4.5 - (k - (len(lines[:3]) - 1) / 2) * 9, ln, fontName='BVP-SB', fontSize=7.6, fillColor=INK, textAnchor='middle'))
        if i < n - 1 and c < per - 1:
            ax = x + bw + 1; ay = y + bh / 2
            d.add(Line(ax, ay, ax + 7 * mm - 2, ay, strokeColor=color, strokeWidth=1.2))
            d.add(Polygon([ax + 7 * mm - 2, ay, ax + 7 * mm - 6, ay + 2.5, ax + 7 * mm - 6, ay - 2.5], fillColor=color, strokeColor=color))
    story.append(d); SP(8)

# ---------- số liệu & tính toán ----------
MW = dict(Ag=107.87, Au=196.97, Cu=63.55, Fe=55.85, Zn=65.38, NaCl=58.44, NaOH=40.0, Glu=180.16, Suc=342.3, FeSO47=278.0, SMB=190.1, AgCl=143.32, Urea=60.06)
HNO3_mol_ml = 1.41 * 0.68 / 63.01; HCl_mol_ml = 1.16 * 0.32 / 36.46; H2SO4_mol_ml = 1.84 * 0.98 / 98.08
PRICE = {  # VND — GIẢ ĐỊNH, cần hỏi báo giá thực tế
    'HNO3': ('Axit nitric HNO3 68% (công nghiệp)', 'kg', 35000), 'HCl': ('Axit clohidric HCl 32%', 'kg', 8000), 'H2SO4': ('Axit sunfuric H2SO4 98%', 'kg', 10000),
    'NaOH': ('Xút vảy NaOH 99%', 'kg', 25000), 'NaCl': ('Muối ăn / muối biển', 'kg', 10000), 'Glu': ('Glucose / mạch nha', 'kg', 45000), 'Suc': ('Đường kính', 'kg', 25000),
    'Urea': ('Urê (phân đạm)', 'kg', 15000), 'Fe': ('Đinh sắt / sắt vụn sạch', 'kg', 25000), 'FeSO4': ('Sắt(II) sunfat FeSO4·7H2O', 'kg', 15000), 'SMB': ('SMB Na2S2O5', 'kg', 40000),
    'Borax': ('Hàn the (borax)', 'kg', 60000), 'Zn': ('Kẽm lá', 'kg', 120000), 'H2O2': ('Oxy già H2O2 3%', 'lít', 20000), 'Javel': ('Nước javel NaOCl 5%', 'lít', 15000),
    'Water': ('Nước cất / nước RO', 'lít', 3000), 'Soda': ('Soda Na2CO3 / vôi', 'kg', 12000), 'Gas': ('Gas + oxy cho đèn khò (mỗi lần nấu)', 'lần', 25000)}
AU_PER_G = 148_000_000 / 37.5   # tham chiếu cuối 11/2026: ~148 triệu đồng/lượng vàng 9999
AG_PER_G = 1_600_000 / 37.5     # tham chiếu: ~1,6 triệu đồng/lượng bạc 999
def vnd(x):
    if x >= 1e9: return f'{x / 1e9:,.2f} tỷ'.replace(',', 'X').replace('.', ',').replace('X', '.')
    if x >= 1e6: return f'{x / 1e6:,.1f} triệu'.replace(',', 'X').replace('.', ',').replace('X', '.')
    return f'{x:,.0f} đ'.replace(',', '.')
def num(x, d=0):
    s = f'{x:,.{d}f}'; return s.replace(',', 'X').replace('.', ',').replace('X', '.')

def silver_batch(m, ag_frac=0.925, red='sugar'):
    ag = m * ag_frac; cu = m - ag; nAg = ag / MW['Ag']; nCu = cu / MW['Cu']
    hno3_ml = (nAg * 4 / 3 + nCu * 8 / 3) * 1.25 / HNO3_mol_ml
    r = dict(ag=ag, cu=cu, hno3_ml=hno3_ml, hno3_kg=hno3_ml * 1.41 / 1000, nacl=nAg * 1.3 * MW['NaCl'], naoh=nAg * 1.5 * MW['NaOH'],
             glu=nAg / 2 * MW['Glu'] * 2, suc=nAg / 4 * MW['Suc'] * 2.5, fe=nAg / 2 * MW['Fe'] * 3, out=ag * 0.97, agcl=ag * MW['AgCl'] / MW['Ag'],
             water=max(1.0, m * 0.05))
    cost = r['hno3_kg'] * PRICE['HNO3'][2] + r['nacl'] / 1000 * PRICE['NaCl'][2] + r['water'] * PRICE['Water'][2] + max(5, m * 0.03) / 1000 * PRICE['Borax'][2] + PRICE['Gas'][2]
    cost += (r['naoh'] / 1000 * PRICE['NaOH'][2] + r['glu'] / 1000 * PRICE['Glu'][2]) if red == 'sugar' else (r['fe'] / 1000 * PRICE['Fe'][2] + 0.05 * PRICE['HCl'][2])
    r['cost'] = cost; r['value'] = r['out'] * AG_PER_G
    return r
def gold_batch(m, au_frac=0.75, red='fe'):
    au = m * au_frac; nAu = au / MW['Au']
    fes = nAu * 3 * MW['FeSO47'] * 1.5; nFe = fes / MW['FeSO47']
    r = dict(au=au, hcl_ml=m * 4, hno3_ml=m * 1.0, urea=max(2, m * 0.2), feso4=fes, fe=nFe * MW['Fe'] * 1.15, h2so4_ml=nFe * 1.15 / H2SO4_mol_ml,
             smb=au * 1.3, out=au * 0.98, water=max(1.0, m * 0.08))
    cost = r['hcl_ml'] * 1.16 / 1000 * PRICE['HCl'][2] + r['hno3_ml'] * 1.41 / 1000 * PRICE['HNO3'][2] + r['urea'] / 1000 * PRICE['Urea'][2] + r['water'] * PRICE['Water'][2] + PRICE['Gas'][2] + max(3, m * 0.03) / 1000 * PRICE['Borax'][2]
    cost += (r['fe'] / 1000 * PRICE['Fe'][2] + r['h2so4_ml'] * 1.84 / 1000 * PRICE['H2SO4'][2]) if red == 'fe' else r['smb'] / 1000 * PRICE['SMB'][2]
    r['cost'] = cost; r['value'] = r['out'] * AU_PER_G
    return r

TODAY = '11/2026'

# =========================== NỘI DUNG ===========================
story.append(NextPageTemplate('front'))
story.append(PageBreak())
# --- Lời mở đầu
H1('Lời mở đầu')
P('Chúc mừng bạn — <b>Đại pháp sư 9999</b> của Học viện Giả kim! Bạn đã đi hết bảy nhiệm vụ trong trò chơi <b>Phù thủy Phân kim</b>, hiểu vì sao muối biển tách được bạc khỏi đồng, vì sao đường biến bạc clorua thành bạc bột, vì sao phải đuổi axit nitric dư trước khi kết tủa vàng. Tài liệu này là phần thưởng: một bộ <b>quy trình thao tác chuẩn (SOP)</b> viết ở mức chi tiết để người có kiến thức hoá học cơ bản có thể tham khảo khi làm thí nghiệm thật.')
P('Bí kíp được biên soạn cho ba nhóm người đọc:')
B(['<b>Người tò mò, làm thí nghiệm nhỏ cho vui</b>: vài chục gam bạc cũ, một chiếc nhẫn vàng gãy, một túi chân RAM. Mục tiêu là hiểu và tận mắt thấy phản ứng, không phải kiếm lời.',
   '<b>Người có nguồn nguyên liệu vừa</b> (thợ kim hoàn, tiệm sửa điện thoại, phòng X-quang, người thu mua phế liệu): cần quy trình ổn định, tính được chi phí, biết khi nào nên tự làm và khi nào nên thuê tinh luyện.',
   '<b>Người muốn triển khai quy mô lớn</b>: cần nắm khung pháp lý, an toàn, môi trường và bức tranh đầu tư trước khi bắt tay vào.'])
P('Mỗi quy trình đều có: nguyên liệu và định lượng tính sẵn cho một mẻ mẫu, dấu hiệu nhận biết từng bước, điểm kiểm soát chất lượng, bảng sự cố thường gặp và cách khắc phục. Phần cuối có bảng chi phí giả định cho ba quy mô, bảng tra cứu, mẫu nhật ký mẻ và danh mục kiểm tra an toàn.')
BOX('Hãy đọc chương 1 và 2 trước khi làm bất cứ điều gì', ['Phân kim dùng axit mạnh, sinh khí độc và làm việc với kim loại nóng chảy hơn 1.000 °C. Một sai sót nhỏ có thể gây bỏng, mù hoặc ngộ độc phổi. Nếu bạn chưa từng làm việc với hoá chất trong phòng thí nghiệm, hãy học thực hành có người hướng dẫn trước.'], 'warn')
H2('Lời cảm ơn', toc=False)
P('Xin gửi lời cảm ơn đặc biệt tới <b>Bà giáo phù thủy Hài Lê</b> — người đã dành hơn 20 năm "nghịch hoá chất với những cuốn sách từ thời đại học" và hào phóng chia sẻ kinh nghiệm nghề. Hình ảnh thực tế, các mẹo nghề như <i>hầm bạc bột trước khi nấu</i>, <i>vàng nổi</i>, <i>cán mỏng hay hạ tuổi</i>, <i>không khử đồng vẫn thu đủ bạc</i>, cùng tinh thần "luôn luôn bình tĩnh và cẩn trọng" trong tài liệu này đều được tham khảo từ những chia sẻ của cô.')
P('Cảm ơn bạn — người chơi đã kiên nhẫn đi hết hành trình. Nếu bạn làm thử và có kết quả, dù thành công hay thất bại, hãy chia sẻ lại với tác giả. Những khó khăn thực tế của bạn sẽ giúp phiên bản sau tốt hơn cho người đến sau.')

# --- 1 Miễn trừ
H1('1. Miễn trừ trách nhiệm và điều kiện sử dụng')
B(['<b>Mục đích tham khảo.</b> Tài liệu cung cấp thông tin giáo dục và tham khảo kỹ thuật. Đây không phải chỉ dẫn bắt buộc, không thay thế đào tạo thực hành, tư vấn của chuyên gia hay quy định của cơ quan có thẩm quyền.',
   '<b>Chỉ dành cho người đủ 18 tuổi</b>, có kiến thức hoá học cơ bản, có trang thiết bị bảo hộ và nơi làm việc đạt yêu cầu an toàn.',
   '<b>Tự chịu trách nhiệm.</b> Người đọc tự đánh giá rủi ro và tự chịu hoàn toàn trách nhiệm khi áp dụng. Tác giả, người biên soạn và người đóng góp <b>không chịu trách nhiệm</b> về bất kỳ thương tích, bệnh tật, thiệt hại tài sản, ô nhiễm môi trường, tổn thất tài chính hay hậu quả pháp lý nào phát sinh.',
   '<b>Số liệu là giả định.</b> Định lượng hoá chất tính theo tỉ lượng lý thuyết cộng phần dư hợp lý; hàm lượng nguyên liệu, hiệu suất, đơn giá hoá chất, giá vàng bạc và chi phí đầu tư đều là <b>giả định tại thời điểm biên soạn (' + TODAY + ')</b>. Luôn thử với mẫu nhỏ, hỏi báo giá thực tế và cập nhật giá kim loại trước khi tính toán.',
   '<b>Tuân thủ pháp luật.</b> Người đọc tự chịu trách nhiệm tuân thủ quy định về hoá chất, kinh doanh vàng, an toàn lao động, phòng cháy chữa cháy, bảo vệ môi trường và quản lý chất thải nguy hại (xem chương 10).',
   '<b>Không có chỉ dẫn cho xyanua hay thuỷ ngân.</b> Hai phương pháp này cực độc. Tài liệu cố ý không đề cập và khuyến cáo không sử dụng.',
   '<b>Hình ảnh</b> thuộc quyền chủ sở hữu, chỉ dùng minh hoạ.'])

# --- 2 An toàn
H1('2. An toàn lao động')
H2('2.1. Mối nguy chính')
TBL(['Tác nhân', 'Nguy hiểm', 'Biện pháp'], [
    ['Khí NO2 (nâu đỏ) — khi hoà kim loại bằng HNO3 hoặc cường toan', 'Phù phổi <b>muộn</b>: 4–24 giờ sau mới khó thở nặng, có thể tử vong. Mùi không đủ cảnh báo.', 'Làm ngoài trời hoặc trong tủ hút; mặt nạ phin khí axit/NOx; tháp hấp thụ khí khi làm lượng lớn. Hít phải: đi khám ngay.'],
    ['Khí Cl2 (vàng lục) — HCl + javel', 'Kích ứng nặng đường hô hấp, mắt.', 'Thêm javel từng ít, ngoài trời, đứng đầu gió.'],
    ['SO2 — SMB, đun dung dịch hãm ảnh', 'Kích ứng hô hấp, nguy hiểm với người hen.', 'Thông gió, không đun sôi dung dịch thiosunfat.'],
    ['H2 — kim loại + axit', 'Cháy nổ.', 'Xa lửa trần, tia lửa điện; không đậy kín.'],
    ['HNO3, HCl, H2SO4, cường toan', 'Bỏng hoá chất, mù. H2SO4 đặc toả nhiệt mạnh khi pha.', 'Rót AXIT VÀO NƯỚC; kính kín + tấm che mặt; găng neoprene/nitrile dày.'],
    ['Nước cường toan', 'Tự phân huỷ sinh Cl2, NOCl; bình kín có thể nổ.', 'Pha đến đâu dùng đến đó. <b>Không bao giờ đậy kín hay cất trữ.</b>'],
    ['NaOH', 'Ăn da, mù mắt; toả nhiệt khi hoà tan.', 'Hoà từ từ vào nước lạnh; kính bảo hộ.'],
    ['Cadmi (tiếp điểm Ag-CdO, que hàn bạc cũ)', 'Khói và muối cadmi gây tổn thương phổi, thận, ung thư.', 'Không nấu chảy trần; dung dịch thải chứa Cd xử lý như chất thải nguy hại.'],
    ['Kim loại nóng chảy 960–1100 °C', 'Bỏng nặng, cháy, nổ hơi nước.', 'Chén, khuôn, bột khô tuyệt đối; gạch chịu lửa; bình chữa cháy.'],
    ['Đốt bo mạch, nhựa', 'Dioxin, furan, khói brom.', '<b>Không đốt.</b> Cắt cơ học phần mạ vàng.']], [48, 58, 64])
H2('2.2. Trang bị bảo hộ (PPE) tối thiểu')
B(['Mặt nạ nửa mặt hoặc toàn mặt với phin lọc khí axit vô cơ/NOx (loại ABEK hoặc E/NO-P<font name="BVP">3</font>). Thay phin theo khuyến cáo nhà sản xuất.',
   'Kính bảo hộ kín (goggles); tấm che mặt khi pha axit đặc và khi nấu chảy.',
   'Găng nitrile dày hoặc neoprene, cổ dài; găng chịu nhiệt khi nấu.',
   'Tạp dề chống hoá chất, áo dài tay cotton (không mặc đồ sợi tổng hợp khi nấu), giày kín.',
   'Trạm rửa mắt hoặc bình nước sạch 10 lít; xô baking soda để trung hoà axit đổ tràn; bình chữa cháy CO2 hoặc bột.'])
H2('2.3. Bố trí nơi làm việc')
B(['Ngoài trời có mái che, thông gió tự nhiên, hoặc tủ hút. Không làm trong bếp, phòng ngủ, gần trẻ em hay vật nuôi.',
   'Khu vực hoá chất tách riêng khu nấu chảy. Mặt bàn chịu axit (gạch men, nhựa PP), có khay chứa tràn.',
   'Hoá chất xếp theo nhóm: axit riêng, kiềm riêng, chất oxy hoá (HNO3, javel) riêng, xa chất hữu cơ và chất dễ cháy.',
   'Mọi chai lọ dán nhãn rõ: tên, nồng độ, ngày pha. Không dùng chai nước uống để đựng hoá chất.'])
H2('2.4. Mười quy tắc vàng của phù thủy')
B(['Đọc toàn bộ quy trình trước khi bắt đầu; chuẩn bị đủ hoá chất và dụng cụ.', 'Mặc đủ đồ bảo hộ trước khi mở nắp bất kỳ chai axit nào.', 'Rót axit vào nước — không bao giờ ngược lại.',
   'Không đậy kín bình đang phản ứng, không cất trữ nước cường toan.', 'Thêm hoá chất từng ít một, quan sát phản ứng rồi mới thêm tiếp.', 'Không làm một mình; có người biết bạn đang làm gì và biết sơ cứu.',
   'Không ăn uống, hút thuốc trong khu làm việc; rửa tay sau khi làm.', 'Ghi nhật ký mẻ: khối lượng, hoá chất, hiện tượng, kết quả.', 'Không đổ bất kỳ dung dịch nào ra cống; gom và xử lý theo chương 9.',
   '"Luôn luôn bình tĩnh và cẩn trọng" — mệt, vội hay đang say thì không làm.'], num=True)
H2('2.5. Sơ cứu và ứng phó sự cố')
TBL(['Sự cố', 'Xử lý ngay'], [
    ['Axit/kiềm dính da', 'Cởi bỏ quần áo dính hoá chất; xả nước sạch liên tục ít nhất 15 phút; đi khám nếu bỏng.'],
    ['Hoá chất bắn vào mắt', 'Xả nước liên tục ít nhất 15 phút, banh mí mắt; đến cơ sở y tế ngay.'],
    ['Hít phải NO2 / Cl2', 'Ra chỗ thoáng, nghỉ ngơi, không vận động mạnh; <b>đi khám ngay cả khi thấy ổn</b> (phù phổi muộn). Gọi 115 nếu khó thở.'],
    ['Đổ tràn axit', 'Sơ tán, thông gió; rắc soda/baking soda từ mép vào trong đến hết sủi; thu gom bằng dụng cụ nhựa.'],
    ['Cháy', 'Ngắt gas, điện; dùng bình CO2 hoặc bột; không dùng nước với kim loại nóng chảy. Gọi 114.'],
    ['Nuốt phải hoá chất', 'Không gây nôn; súc miệng; gọi 115 và mang theo nhãn hoá chất.']], [45, 125])

# --- 3 Nguyên lý
H1('3. Nguyên lý hoá học tóm tắt')
P('Mọi quy trình phân kim đều đi qua bốn giai đoạn. Hiểu bốn giai đoạn này thì đọc SOP nào cũng thấy logic:')
FLOW(['Sơ chế: phân loại, cán mỏng / hạ tuổi', 'Hoà tan (oxy hoá) bằng axit', 'Tách chọn lọc: kết tủa, lọc, đuổi HNO3', 'Hoàn nguyên (khử): đường, sắt, FeSO4, SMB', 'Rửa, sấy, nấu chảy, kiểm tra'])
H2('3.1. Dãy điện hoá và chất khử')
P('Kim loại có thế điện cực chuẩn E° thấp hơn đẩy được ion của kim loại có E° cao hơn ra khỏi dung dịch (xi măng hoá). Một số giá trị E° (V): Zn −0,76; Fe −0,44; Sn −0,14; H2 0,00; Cu +0,34; Ag +0,80; Pd +0,95; AuCl4^-/Au +1,00; Pt +1,18. Cặp Fe^3+/Fe^2+ có E° = +0,77 V: đủ để khử vàng nhưng không khử được Cu^2+ — đó là lý do FeSO4 kết tủa vàng <b>chọn lọc</b>.')
TBL(['Chất khử', 'Kim loại thu được', 'Chọn lọc?', 'Ghi chú'], [
    ['Đường (glucose) + NaOH', 'Ag từ AgCl/Ag2O', 'Cao', 'Bạc sạch nhất ở quy mô nhỏ. Không dùng cho vàng (tạo vàng keo).'],
    ['Đinh sắt / phoi sắt', 'Ag (AgCl, dung dịch), Cu', 'Thấp', 'Rẻ; phải rửa HCl loãng để bỏ sắt dư.'],
    ['Kẽm lá / bột kẽm', 'Ag, Au, Cu, Pd, Pt', 'Rất thấp', 'Nhanh, mạnh; dùng để vét dung dịch loãng.'],
    ['FeSO4 (làm từ đinh sắt)', 'Au', 'Cao', 'Không khử Cu, Ni, Pd.'],
    ['SMB Na2S2O5 (sinh SO2)', 'Au', 'Cao', 'Phổ biến; sinh mùi SO2.']], [42, 40, 20, 68])
H2('3.2. Phản ứng then chốt')
EQ('3Ag + 4HNO3 (loãng) → 3AgNO3 + NO↑ + 2H2O', '3Cu + 8HNO3 → 3Cu(NO3)2 + 2NO↑ + 4H2O ; 2NO + O2 → 2NO2', 'AgNO3 + NaCl → AgCl↓ + NaNO3',
   '2AgCl + 2NaOH → Ag2O + 2NaCl + H2O ; Ag2O + C6H12O6 → 2Ag↓ + C6H12O7', '2AgCl + Fe → 2Ag↓ + FeCl2 ; 2AgCl + Zn → 2Ag↓ + ZnCl2',
   'Au + HNO3 + 4HCl → HAuCl4 + NO↑ + 2H2O', '6HNO3 + 5CO(NH2)2 → 8N2↑ + 5CO2↑ + 13H2O', 'AuCl4^- + 3Fe^2+ → Au↓ + 3Fe^3+ + 4Cl^-',
   '2HAuCl4 + 3SO2 + 6H2O → 2Au↓ + 3H2SO4 + 8HCl', 'Cu + 2HCl + H2O2 → CuCl2 + 2H2O ; 4CuCl + 4HCl + O2 → 4CuCl2 + 2H2O', 'Cu^2+ + Fe → Cu↓ + Fe^2+')

# --- 4 Nguyên liệu đầu vào
H1('4. Nguyên liệu đầu vào và nguồn thu gom')
H2('4.1. Các loại nguyên liệu')
TBL(['Nguyên liệu', 'Hàm lượng điển hình (giả định)', 'Quy trình', 'Đánh giá'], [
    ['Vàng 24K / 9999 phế', '≥ 99% Au', 'SOP-4 (chỉ khi cần nâng tuổi)', 'Thường bán thẳng có lợi hơn'],
    ['Trang sức 18K (75%)', '75% Au, 10–16% Ag, còn lại Cu/Ni/Pd', 'SOP-4', 'Tốt'],
    ['Trang sức 14K (58,5%)', '58,5% Au, 10–25% Ag', 'SOP-4 (cán thật mỏng)', 'Tốt'],
    ['Vàng tây ≤ 10K', '≤ 41,7% Au, nhiều Ag + Cu', 'SOP-5 (hạ tuổi / 3 phần)', 'Tốt, thu thêm bạc'],
    ['Vàng nha khoa', '40–85% Au, có Pd/Pt', 'SOP-4, giữ lại dung dịch có Pd', 'Tốt, phức tạp'],
    ['Phoi, bụi đánh bóng, giấy nhám tiệm vàng', '0,5–30% Au (rất dao động)', 'Đốt hết hữu cơ trong lò kín có xử lý khói → SOP-5', 'Rất tốt với tiệm vàng'],
    ['Chân RAM, khe PCI, chân CPU đã cắt', '≈ 0,2–1,5 g Au/kg', 'SOP-6', 'Đáng làm khi có từ vài kg'],
    ['Sim, cáp mềm, bo điện thoại', '≈ 0,05–0,5 g Au/kg', 'SOP-6', 'Thấp, chủ yếu để học'],
    ['Đồ mỹ ký mạ vàng', '< 0,1 g Au/kg', 'SOP-6', 'Hiếm khi đáng làm'],
    ['Bạc 925 / bạc ta', '92,5% Ag, 7,5% Cu', 'SOP-1 / SOP-2', 'Tốt'],
    ['Xu bạc cổ', '80–90% Ag', 'SOP-1', 'Cân nhắc giá trị sưu tầm'],
    ['Tiếp điểm rơ-le, công tắc', '85–90% Ag (có thể Ag-CdO)', 'SOP-1 + xử lý Cd', 'Cẩn trọng cadmi'],
    ['Que hàn bạc', '15–56% Ag, có thể Cd', 'SOP-1 + xử lý Cd', 'Trung bình'],
    ['Dung dịch hãm ảnh (fixer) đã dùng', '2–8 g Ag/L', 'SOP-3', 'Rất tốt với phòng X-quang'],
    ['Phim X-quang đã chụp', '≈ 3–10 g Ag/kg', 'SOP-3', 'Trung bình']], [42, 46, 46, 36])
IMG(['phe-lieu-trang-suc', 'phe-lieu-bo-mach', 'can-mong-nguyen-lieu'], ['Phế liệu trang sức', 'Ve chai điện tử', 'Nguyên liệu đã cán mỏng'], 40)
H2('4.2. Nguồn đầu vào theo quy mô')
TBL(['Quy mô', 'Nguồn tham khảo', 'Lưu ý'], [
    ['Thí nghiệm nhỏ (cho vui)', 'Trang sức hỏng của gia đình; thìa, nhẫn bạc cũ; một túi RAM/thiết bị cũ; vài tấm phim X-quang; dung dịch hãm từ phòng ảnh quen.', 'Chọn nguyên liệu biết rõ nguồn gốc, hàm lượng; ưu tiên bạc để làm quen trước.'],
    ['Xưởng nhỏ', 'Thu mua có hoá đơn: phoi, bụi, nước rửa tay thợ từ tiệm vàng; tiệm sửa điện thoại, máy tính; phòng khám/bệnh viện (dung dịch hãm, phim); đại lý ve chai điện tử; xưởng cơ điện (tiếp điểm).', 'Lập hợp đồng/biên nhận; kiểm tra mẫu trước khi trả giá; tránh hàng không rõ nguồn gốc.'],
    ['Quy mô lớn', 'Hợp đồng với xưởng chế tác trang sức, nhà máy điện tử, đơn vị thu gom tái chế có giấy phép; bùn mạ, bùn anode điện phân đồng; xuất nhập khẩu theo giấy phép.', 'Cần pháp nhân, giấy phép môi trường, kiểm soát chuỗi cung ứng (chống rửa tiền, hàng gian).']], [32, 88, 50])
H2('4.3. Đánh giá nhanh nguyên liệu trước khi mua hoặc làm')
B(['<b>Cân và ghi chép</b> từng lô; chụp ảnh.', '<b>Thử axit trên đá thử</b>: vạch mẫu lên đá, nhỏ axit thử tuổi (bộ 10K/14K/18K/22K) so với kim thử. Phương pháp truyền thống, sai số vài K.',
   '<b>Tỷ trọng</b> (cân trong không khí và trong nước) để phát hiện hàng độn.', '<b>Máy phân tích phổ XRF</b> (dịch vụ tại tiệm vàng/trung tâm kiểm định): nhanh, không phá huỷ, đọc được cả W, Ir, Ni, Cd.',
   '<b>Thử mẫu nhỏ</b>: lấy 1–5% lô, chạy trọn quy trình, cân kết quả — cách chắc chắn nhất để định giá phế liệu điện tử.'])

# --- 5 Hoá chất & thiết bị
H1('5. Hoá chất, dụng cụ và thiết bị theo quy mô')
H2('5.1. Ba quy mô tham khảo')
TBL(['', 'A. Thí nghiệm nhỏ', 'B. Xưởng nhỏ', 'C. Quy mô lớn'], [
    ['Công suất / mẻ', '≤ 100 g bạc hoặc ≤ 20 g vàng', '0,5–2 kg bạc; 100–500 g vàng', '> 5 kg/ngày; nhiều dây chuyền'],
    ['Nơi làm', 'Ngoài trời có mái che', 'Nhà xưởng riêng, tủ hút + quạt hút', 'Nhà xưởng đạt chuẩn PCCC, khu công nghiệp'],
    ['Lọc', 'Phễu + giấy lọc / lọc cà phê', 'Bộ lọc hút chân không (Buchner + bơm)', 'Lọc khung bản, lọc túi'],
    ['Gia nhiệt', 'Bếp điện / hồng ngoại', 'Bếp từ công nghiệp, bếp cách cát', 'Bồn phản ứng gia nhiệt, khuấy cơ'],
    ['Khí thải', 'Thông gió tự nhiên + mặt nạ', 'Tháp hấp thụ NOx nhỏ (dung dịch kiềm)', 'Hệ thống xử lý khí thải nhiều cấp, quan trắc'],
    ['Nấu chảy', 'Đèn khò gas mini + chén graphit', 'Đèn khò gas–oxy / lò nung điện 1–2 kg', 'Lò cảm ứng, đúc thỏi, cán'],
    ['Kiểm tra', 'Đá thử, cân 0,01 g', 'Cân 0,01 g / 3 kg; gửi XRF', 'Máy XRF riêng; có thể điện phân tinh luyện'],
    ['Pháp lý', 'Không kinh doanh; tự xử lý thải đúng cách', 'Đăng ký kinh doanh; hồ sơ môi trường; hợp đồng thu gom chất thải', 'Giấy phép môi trường, đủ điều kiện hoá chất, giấy phép kinh doanh/sản xuất vàng theo ngành nghề']], [26, 46, 50, 48])
H2('5.2. Danh mục hoá chất')
TBL(['Hoá chất', 'Dùng cho', 'Bảo quản'], [
    ['HNO3 65–68%', 'Hoà bạc, đồng; pha cường toan', 'Chai chịu axit, tối màu, xa hữu cơ'], ['HCl 31–37%', 'Cường toan, AP, rửa bột kim loại', 'Can nhựa kín, thoáng'],
    ['H2SO4 98%', 'Làm FeSO4 từ đinh sắt', 'Can nhựa kín; rót axit vào nước'], ['H2O2 3% (hoặc 30–50% pha loãng)', 'Dung dịch AP', 'Tránh nắng'],
    ['Nước javel NaOCl 4–6%', 'Hoà lá vàng (cùng HCl)', 'Tránh nắng; không để gần axit'], ['NaCl', 'Kết tủa AgCl', '—'],
    ['NaOH vảy', 'Chuyển AgCl → Ag2O; bóc nhũ tương phim', 'Kín, khô'], ['Glucose / mạch nha / đường kính + chanh', 'Khử Ag2O', '—'],
    ['Đinh sắt, phoi sắt, bùi nhùi thép (không mạ kẽm)', 'Khử AgCl; làm FeSO4; thu đồng; vét bạc fixer', 'Khô, tránh gỉ'], ['Kẽm lá', 'Vét kim loại quý từ dung dịch loãng', 'Khô'],
    ['Urê', 'Đuổi HNO3 dư', 'Kín'], ['SMB Na2S2O5 (tuỳ chọn)', 'Kết tủa vàng', 'Kín, khô'], ['Thiếc hàn không chì', 'Pha thuốc thử SnCl2', '—'],
    ['Hàn the (borax)', 'Trợ dung khi nấu', 'Khô'], ['Soda / vôi', 'Trung hoà thải', 'Khô'], ['Nước cất / RO', 'Pha, rửa', '—']], [52, 70, 48])
H2('5.3. Dụng cụ cho quy mô A (bộ khởi đầu)')
B(['3–4 cốc thuỷ tinh borosilicate 250 mL – 1 L, đũa thuỷ tinh, ống đong 100 mL, nhiệt kế 0–200 °C.', 'Bếp điện hoặc bếp hồng ngoại (không dùng bếp gas lửa trần cạnh axit).',
   'Phễu nhựa PP, giấy lọc định lượng hoặc giấy lọc cà phê, bình hứng.', 'Cân điện tử 0,01 g; giấy pH; chai nhựa HDPE có nhãn.', 'Chén nung graphit nhỏ, đèn khò gas mini (hoặc gas–oxy), khuôn đúc nhỏ, gạch chịu lửa, kẹp chén.', 'Bộ bảo hộ (mục 2.2).'])

# --- 6 SOPs
H1('6. Quy trình thao tác chuẩn (SOP)')
P('Định lượng trong mỗi SOP được tính cho <b>một mẻ mẫu</b> theo tỉ lượng phản ứng, đã cộng phần dư. Muốn làm mẻ khác thì nhân tỉ lệ theo khối lượng, hoặc dùng mục "Bàn tính" trong ứng dụng. Ký hiệu: <b>[KS]</b> là điểm kiểm soát chất lượng.')

s1 = silver_batch(100)
H2('SOP-1. Bạc 925 → AgCl → đường + xút (bạc 999)')
P('<b>Phạm vi:</b> bạc 925, bạc ta, xu bạc, tiếp điểm (lưu ý Cd), phoi bạc. <b>Mẻ mẫu:</b> 100 g bạc 925 (92,5 g Ag; 7,5 g Cu). <b>Thời gian:</b> 1–2 ngày (gồm để lắng, sấy).')
FLOW(['Cán mỏng, cắt nhỏ, tẩy dầu', 'Hoà HNO3 1:1, 50–70 °C', 'Pha loãng, lắng, lọc', 'Nước muối → AgCl', 'Rửa AgCl 5–6 lần', 'NaOH → Ag2O nâu đen', 'Đường, 60–80 °C → Ag xám', 'Rửa đến trung tính, sấy', 'Hầm khô, nấu 1000 °C, đúc'])
TBL(['Hoá chất', 'Lượng cho 100 g bạc 925', 'Ghi chú'], [
    ['HNO3 68%', f'{num(s1["hno3_ml"])} mL (≈ {num(s1["hno3_ml"] * 1.41)} g)', 'Pha với cùng thể tích nước cất; đã cộng dư 25%; cho từng phần'],
    ['Muối NaCl', f'{num(s1["nacl"])} g', 'Hoà thành nước muối bão hoà (~360 g/L)'], ['NaOH vảy', f'{num(s1["naoh"])} g', 'Dung dịch ~20% (≈ {0} mL nước)'.format(num(s1['naoh'] * 4))],
    ['Glucose (hoặc mạch nha ≈ 1,4 lần)', f'{num(s1["glu"])} g', 'Hoặc đường kính {0} g đun 15–20 phút với nước + 2 thìa nước cốt chanh'.format(num(s1['suc']))],
    ['Hàn the', '3–5 g', 'Khi nấu chảy'], ['Nước cất', '3–5 L', 'Pha và rửa']], [42, 50, 78])
H3('Các bước')
B(['<b>Sơ chế.</b> Cân, ghi nhật ký. Cán mỏng hoặc cắt thành mảnh ≤ 5 mm. Ngâm nước xà phòng ấm, rửa sạch dầu mỡ.',
   f'<b>Hoà tan.</b> Đặt cốc 1 L trên bếp, ngoài trời. Cho bạc vào, đổ ~{num(s1["hno3_ml"] * 0.6)} mL hỗn hợp HNO3 1:1 trước, đun 50–70 °C (không sôi). Khí nâu NO2 bốc lên, dung dịch chuyển xanh lam (Cu). Khi bớt sủi, thêm từng phần axit đến khi bạc tan hết. <b>[KS]</b> Không còn mảnh kim loại; nếu còn cặn đen mịn thì có thể là vàng hoặc thiếc oxit — giữ lại.',
   '<b>Pha loãng và lọc.</b> Để nguội, pha thêm 2–3 lần nước cất, để lắng 1–2 giờ, lọc. Giữ cặn trên giấy lọc riêng (có thể chứa vàng).',
   f'<b>Kết tủa AgCl.</b> Khuấy, đổ từ từ nước muối. Kết tủa trắng như sữa đông vón cục. <b>[KS]</b> Nhỏ 1 giọt nước muối vào phần nước trong phía trên: không còn vẩn trắng là đủ. Lượng AgCl khô dự kiến ≈ {num(s1["agcl"])} g.',
   '<b>Rửa AgCl.</b> Gạn bỏ nước xanh (để riêng cho xử lý thải). Rửa bằng nước nóng 60–80 °C, khuấy, lắng, gạn; lặp 5–6 lần. <b>[KS]</b> Nước rửa trong suốt, không ánh xanh; nhỏ vài giọt amoniac vào nước rửa không thấy xanh đậm. <i>Đây là bước quyết định bạc đạt 999 hay chỉ 99.</i>',
   '<b>Chuyển thành Ag2O.</b> Cho dung dịch NaOH 20% vào AgCl ướt, khuấy kỹ 10–15 phút. Kết tủa chuyển từ trắng → nâu đen. Giữ dư kiềm (giấy pH ≥ 12).',
   '<b>Hoàn nguyên bằng đường.</b> Đun hỗn hợp lên 60–80 °C, cho đường từng phần, khuấy đều 20–40 phút. Màu chuyển nâu đen → xám, có thể sủi nhẹ. <b>[KS]</b> Lấy một ít bột, rửa sạch, nhỏ HNO3 loãng: tan hoàn toàn, không để lại hạt trắng (AgCl chưa khử).',
   '<b>Rửa và sấy.</b> Gạn, rửa nước nóng nhiều lần đến khi giấy pH trung tính và hết nhờn đường. Sấy khô hoàn toàn ở 120–150 °C.',
   '<b>Hầm và nấu chảy.</b> "Hầm" bột: cho vào chén, nung nhẹ từ từ để bột khô hẳn và kết khối (không bị ngọn lửa thổi bay). Thêm 3–5 g hàn the, khò mạnh đến khi bạc chảy thành giọt tròn sáng gương (962 °C), rót khuôn đã sấy nóng.'], num=True)
TBL(['Sự cố', 'Nguyên nhân', 'Khắc phục'], [
    ['Bạc tan rất chậm', 'Mảnh dày; axit quá loãng; nhiệt thấp', 'Cán mỏng hơn; tăng nhiệt lên 60–70 °C; thêm axit đặc từng ít'],
    ['Bạc thành phẩm có ánh vàng/hồng', 'AgCl rửa chưa sạch đồng', 'Hoà lại, kết tủa AgCl, rửa kỹ hơn'],
    ['Có hạt trắng trong bạc bột', 'Thiếu kiềm hoặc đường; nhiệt thấp', 'Bổ sung NaOH, đường; đun thêm'],
    ['Bột bắn tung khi khò', 'Bột ẩm, tơi', 'Sấy kỹ, "hầm" cho kết khối trước'],
    ['Thỏi rỗ, xỉn', 'Xỉ, ẩm, thiếu trợ dung', 'Nấu lại với hàn the; khuôn sấy nóng']], [40, 55, 75])
P(f'<b>Kết quả kỳ vọng:</b> ≈ {num(s1["out"], 1)} g bạc ≥ 99,9% (hiệu suất ~97%). AgCl để ngoài sáng ngả tím xám là bình thường.')
IMG(['agcl-duoi-dung-dich-dong', 'bac-bot-1', 'ket-qua-bac'], ['AgCl trắng dưới dung dịch đồng xanh', 'Bạc bột sau hoàn nguyên', 'Thỏi bạc thành phẩm'], 40)

H2('SOP-2. AgCl → bạc bằng đinh sắt hoặc kẽm lá')
P(f'<b>Dùng khi</b> không có đường/xút hoặc muốn rẻ, nhanh. <b>Mẻ mẫu:</b> AgCl từ 100 g bạc 925 (≈ {num(s1["agcl"])} g AgCl khô). Đinh sắt sạch ≈ {num(s1["fe"])} g (gấp 3 lý thuyết) hoặc kẽm lá ≈ {num(s1["fe"] / 3 * MW["Zn"] / MW["Fe"] * 2)} g.')
EQ('2AgCl + Fe → 2Ag↓ + FeCl2', '2AgCl + Zn → 2Ag↓ + ZnCl2', 'Fe + 2H^+ → Fe^2+ + H2↑ (phản ứng phụ)')
B(['Cho AgCl ướt vào cốc, thêm nước cất ngập 3–4 cm và vài mL H2SO4 hoặc HCl để pH 1–2.', 'Thả đinh sắt đen (không mạ kẽm) đã tẩy gỉ, hoặc lá kẽm sạch. Khuấy thường xuyên.',
   'Kết tủa trắng chuyển xám dần từ vùng tiếp xúc ra cả khối; dung dịch xanh lục nhạt (Fe^2+) hoặc không màu (Zn^2+). Thời gian: 4–24 giờ với sắt, 1–4 giờ với kẽm.',
   '<b>[KS]</b> Lấy mẫu nhỏ, rửa, cho vào amoniac loãng: không tan thêm phần trắng là đã chuyển hết.', 'Gắp sắt/kẽm ra, cạo bạc bám. Rửa bột bằng HCl loãng ấm (1:3) để hoà sắt/kẽm vụn, rồi nước cất nhiều lần.', 'Sấy, hầm, nấu như SOP-1. Độ tinh khiết thường 99–99,5%.'], num=True)
BOX('Vì sao người ta hay dùng kẽm lá?', ['Kẽm (E° = −0,76 V) khử mạnh hơn sắt nên nhanh hơn. Dạng lá dễ cắt, dễ nhúng và gắp ra, bề mặt tiếp xúc lớn, quan sát được lớp kim loại bám. Nhược điểm: kẽm không chọn lọc — khử cả đồng, Pd, Pt và sinh nhiều H2 trong axit, nên kim loại thu được cần tinh chế lại.'], 'vio')

H2('SOP-3. Bạc từ dung dịch hãm ảnh và phim X-quang')
P('<b>Mẻ mẫu:</b> 20 L dung dịch hãm đã dùng (~4 g Ag/L → ~80 g Ag), hoặc 10 kg phim X-quang (~60 g Ag, ước tính).')
FLOW(['Gom fixer / bóc nhũ tương phim', 'Bùi nhùi thép 1–3 ngày', 'Lọc, sấy bùn đen', 'Hoà HNO3 loãng, lọc S', 'AgCl → khử (SOP-1/2)', 'Nấu chảy'])
EQ('2[Ag(S2O3)2]^3- + Fe → 2Ag↓ + Fe^2+ + 4S2O3^2-')
B(['<b>Dung dịch hãm:</b> gom vào thùng nhựa, thả bùi nhùi thép loại không xà phòng (~15 g/L). Khuấy nhẹ mỗi ngày. Bạc bám thành bùn đen. <b>[KS]</b> Nhúng giấy thử bạc hoặc nhỏ vài giọt Na2S vào mẫu nước: không còn kết tủa nâu đen là đã vét hết.',
   '<b>Phim X-quang:</b> cắt nhỏ, ngâm trong NaOH 5% ở 60–80 °C, khuấy đến khi lớp nhũ tương bong hết; lọc lấy bùn đen. (Khoảng 5 L dung dịch cho 1 kg phim.)',
   'Lấy thép ra, giũ sạch bùn, lọc, rửa, sấy bùn.', 'Hoà bùn bằng HNO3 1:1, đun nhẹ ngoài trời; lọc bỏ cặn lưu huỳnh, giấy, sợi.', 'Kết tủa AgCl, rửa kỹ (sắt sẽ ở lại trong dung dịch), khử bằng đường hoặc sắt, nấu chảy.'], num=True)
BOX('Lưu ý', ['Không đun sôi dung dịch hãm (sinh SO2, H2S). Dung dịch sau khi vét bạc vẫn chứa thiosunfat và sắt — không đổ ra cống; giao đơn vị thu gom.'], 'warn')

g1 = gold_batch(10)
H2('SOP-4. Vàng 14–22K → nước cường toan → FeSO4 / SMB (vàng 999–9999)')
P(f'<b>Mẻ mẫu:</b> 10 g vàng 18K (7,5 g Au). <b>Thời gian:</b> 1–2 ngày. Vàng 14K cần cán thật mỏng; vàng dưới 14K dùng SOP-5.')
FLOW(['Làm FeSO4 từ đinh sắt (hoặc pha SMB)', 'Cán mỏng vàng', 'HCl trước, HNO3 từng ít', 'Đuổi HNO3 bằng urê', 'Pha loãng, lắng qua đêm, lọc kỹ', 'Kết tủa vàng', 'Thử SnCl2', 'Rửa HCl nóng, nước cất', 'Nấu 1100 °C, đúc'])
TBL(['Hoá chất', 'Lượng cho 10 g vàng 18K', 'Ghi chú'], [
    ['HCl 32%', f'{num(g1["hcl_ml"])} mL', '≈ 4 mL/g hợp kim'], ['HNO3 68%', f'tối đa {num(g1["hno3_ml"])} mL', 'Cho từng 1–2 mL, chỉ đủ để tan hết'],
    ['Urê', f'{num(g1["urea"], 1)} g (ước lượng)', 'Thêm đến khi hết sủi'],
    ['Đinh sắt + H2SO4 98%', f'{num(g1["fe"], 1)} g sắt + {num(g1["h2so4_ml"], 1)} mL axit', f'Pha axit vào ~{num(g1["h2so4_ml"] * 4)} mL nước (≈20%); tạo ≈ {num(g1["feso4"])} g FeSO4·7H2O'],
    ['Hoặc SMB', f'{num(g1["smb"], 1)} g', 'Hoà trong nước ấm'], ['Thiếc + HCl', '1 g + 10 mL', 'Thuốc thử SnCl2'], ['Hàn the', '1–2 g', 'Nấu chảy']], [40, 55, 75])
H3('Các bước')
B(['<b>Chuẩn bị chất khử.</b> Rót H2SO4 vào nước thành dung dịch ~20%, ngâm đinh sắt sạch, đun ấm đến khi hết sủi (sinh H2 — xa lửa). Lọc lấy dung dịch xanh lục nhạt, <b>dùng trong ngày</b>. Hoặc hoà SMB vào nước ấm ngay trước khi dùng.',
   '<b>Hoà tan.</b> Cho vàng đã cán mỏng vào cốc, đổ HCl, đun ấm 50–60 °C. Thêm HNO3 từng 1–2 mL; chờ hết sủi mới thêm. Dung dịch vàng cam (vàng trắng/hồng có thể ánh xanh lục do Ni/Cu — <i>không ảnh hưởng thu hồi</i>). Bạc tạo AgCl trắng lắng đáy. <b>[KS]</b> Không còn mảnh kim loại vàng.',
   '<b>Đuổi HNO3 dư.</b> Giữ ấm, rắc urê từng nhúm đến khi không còn sủi. Cách thay thế: cô gần khô, thêm 10 mL HCl, cô lại; lặp 2–3 lần.',
   '<b>Pha loãng và lọc.</b> Pha thêm 3–4 lần nước cất, để lắng qua đêm. Lọc kỹ, tốt nhất bằng lọc hút chân không và giấy lọc mịn. <b>[KS]</b> Dung dịch trong vắt, soi đèn không thấy vệt sáng. Cặn xám/sợi trên giấy có thể là <b>wonfram</b> — phải loại hết, nếu không sẽ gây "điểm cứng" trong vàng.',
   '<b>Kết tủa vàng.</b> Đổ dung dịch FeSO4 (hoặc SMB) vào, khuấy. Dung dịch đục, bột vàng nâu ("màu bã cà phê") lắng xuống. Để lắng 2–4 giờ.',
   '<b>Thử SnCl2.</b> Chấm 1 giọt dung dịch lên giấy lọc, nhỏ SnCl2. Vết tím/nâu tím → còn vàng: thêm chất khử, thử lại. <b>[KS]</b> Không đổi màu.',
   '<b>Vàng nổi.</b> Nếu có lớp bột vàng nổi trên mặt: <b>không gạn đổ</b>. Lọc cả nước qua giấy, hoặc khuấy nhẹ và chờ lâu hơn.',
   '<b>Rửa.</b> Rửa bột bằng HCl loãng nóng (1:3) 2 lần để hoà muối sắt, rồi nước cất nóng 3–4 lần; có thể tráng amoniac loãng rồi nước. Sấy khô.',
   '<b>Nấu chảy.</b> Chén khô, 1–2 g hàn the, khò đến khi giọt vàng tròn, xoay, sáng (1064 °C). Đúc thỏi.'], num=True)
TBL(['Sự cố', 'Nguyên nhân', 'Khắc phục'], [
    ['Vàng tan dở, có lớp vỏ trắng', 'Hợp kim nhiều bạc → AgCl bọc', 'Lọc lấy phần chưa tan, chuyển SOP-5 (hạ tuổi)'],
    ['Thêm FeSO4 nhưng không kết tủa', 'Còn HNO3 dư; FeSO4 đã bị oxy hoá', 'Đuổi HNO3 lại; làm FeSO4 mới'],
    ['Kết tủa rồi lại tan', 'Còn HNO3', 'Thêm urê, kết tủa lại'], ['Vàng xỉn, có đốm cứng', 'Wonfram, AgCl, muối sắt lọt', 'Hoà lại, lọc kỹ, rửa kỹ'],
    ['SnCl2 không lên màu dù chắc còn vàng', 'Thuốc thử hỏng (Sn2+ bị oxy hoá)', 'Pha SnCl2 mới, thử với mẫu chuẩn']], [45, 55, 70])
P(f'<b>Kết quả kỳ vọng:</b> ≈ {num(g1["out"], 2)} g vàng 999–9999 (hiệu suất ~98%). Phần AgCl thu được xử lý theo SOP-1/2 để lấy bạc.')
IMG(['dung-dich-vang', 'wonfram-1', 'vang-bot-nau-1', 'ket-qua-vang-1'], ['Dung dịch HAuCl4', 'Cặn wonfram trên giấy lọc', 'Vàng bột "màu bã cà phê"', 'Vàng thành phẩm'], 36)

H2('SOP-5. Vàng thấp tuổi: hạ tuổi hoặc cán mỏng, làm theo 3 phần')
P('<b>Phạm vi:</b> vàng tây ≤ 10K, bùn vàng, phoi tiệm vàng nhiều bạc. <b>Mẻ mẫu:</b> 30 g vàng 10K (12,5 g Au).')
TBL(['', 'Cán mỏng', 'Hạ tuổi (inquartation)'], [['Cách làm', 'Cán lá thật mỏng (< 0,2 mm), cắt sợi', 'Nấu thêm bạc/đồng để Au ≤ 25% (ví dụ 30 g 10K + ~20 g bạc), đổ hạt vào nước hoặc cán lá'],
    ['Ưu', 'Ít hoá chất, ít NO2', 'Tan triệt để, nhanh'], ['Nhược', 'Cần máy cán, lâu', 'Tốn HNO3, nhiều NO2']], [28, 66, 76])
B(['<b>Phần 1 — hoà các kim loại không phải vàng:</b> HNO3 1:1, đun nhẹ đến khi hết sủi; thay axit mới, đun thêm 30 phút. Vàng còn lại thành bùn/xốp màu nâu đen. Rửa kỹ bằng nước nóng.',
   '<b>Phần 2 — lọc và kết tủa AgCl:</b> dung dịch nitrat chứa bạc → thêm nước muối → AgCl → SOP-1/2 để thu bạc.',
   '<b>Phần 3 — hoà vàng, lọc, hoàn nguyên:</b> bùn vàng đã rửa → SOP-4 từ bước hoà tan bằng cường toan.'], num=True)

H2('SOP-6. Phế liệu điện tử mạ vàng: AP → lá vàng → HCl + javel → kết tủa; thu đồng')
P('<b>Mẻ mẫu:</b> 1 kg chân mạ vàng đã cắt (ước tính 0,2–1,5 g Au; ~850 g đồng/đồng thau/niken). <b>Thời gian:</b> 3–14 ngày (AP chạy chậm).')
FLOW(['Cắt riêng phần mạ vàng', 'AP: HCl 31% + H2O2 3% (2:1) + sục khí', 'Lọc lá vàng, rửa', 'HCl + javel từng ít', 'Lọc, kết tủa FeSO4/SMB', 'Thử SnCl2, rửa, nấu', 'Thu đồng từ AP bằng đinh sắt'])
B(['<b>Sơ chế:</b> cắt riêng ngón tay vàng của RAM/card, chân cắm, khay sim; bỏ nhựa, linh kiện. <b>Không đốt bo mạch.</b>',
   '<b>AP:</b> trong thùng nhựa, đổ HCl 31% và H2O2 3% theo tỉ lệ ~2:1, ngập phế liệu; sục khí bằng máy bơm bể cá. Dung dịch xanh lục đậm dần (CuCl2 tự tái sinh nhờ oxy không khí). Lá vàng mỏng bong ra, lơ lửng. Lượng HCl lý thuyết cho 850 g đồng ≈ 2,6 L HCl 31%; thực tế dùng ít hơn nhờ tái sinh, có thể dùng lại dung dịch nhiều mẻ.',
   '<b>Lọc lá vàng</b> qua vải lọc rồi giấy lọc; rửa bằng HCl loãng đến hết xanh, rồi nước.',
   '<b>Hoà lá vàng:</b> ngập lá trong HCl 32% (~15 mL/g vàng ước tính), thêm javel 5% từng ít (~5 mL/g), khuấy, <b>ngoài trời</b>. Dung dịch vàng chanh.',
   '<b>Kết tủa:</b> lọc trong; đun nhẹ vài phút để đuổi clo dư; thêm FeSO4 hoặc SMB như SOP-4. Thử SnCl2, rửa, nấu.',
   '<b>Thu đồng:</b> thả đinh sắt/sắt vụn vào dung dịch AP đã dùng; đồng đỏ bám và lắng (≈ 0,9 kg sắt cho mỗi kg đồng). Lọc lấy bùn đồng, rồi trung hoà dung dịch.'], num=True)
BOX('Kinh tế của ve chai điện tử', [f'Với giá tham chiếu ~{vnd(AU_PER_G)}/g vàng, 1 kg chân RAM giàu (~1 g Au) chỉ cho giá trị ~{vnd(AU_PER_G)}, trong khi hoá chất, thời gian và xử lý thải không nhỏ. Hãy phân loại kỹ, gom đủ lớn (vài chục kg trở lên) và chạy thử mẫu trước khi đầu tư.'], 'note')

H2('SOP-7. Nấu chảy, đúc thỏi và kiểm tra')
B(['Sấy bột ở 120–150 °C đến khô hẳn; "hầm" trong chén ở nhiệt thấp để kết khối.', 'Chén graphit/gốm đã nung sơ; thêm hàn the 2–5% khối lượng kim loại.',
   'Khò từ trên xuống, giữ ngọn lửa khử (vùng xanh); khi kim loại tròn, xoay, sáng gương thì rót vào khuôn đã sấy nóng, phủ chút dầu/than chì.', 'Ngâm thỏi nguội trong axit loãng ấm để bỏ xỉ hàn the, rửa, sấy, cân.',
   '<b>Kiểm tra:</b> đá thử, tỷ trọng (vàng 19,3; bạc 10,5 g/cm³), dịch vụ XRF. Ghi kết quả vào nhật ký mẻ.'], num=True)
IMG(['giot-vang', 'thoi-vang', 'thoi-bac'], ['Giọt vàng sau khi nấu', 'Thanh vàng', 'Thỏi bạc'], 36)

H2('SOP-8. Xử lý chất thải (bắt buộc)')
B(['<b>Phân luồng:</b> (a) dung dịch đồng/nitrat từ SOP-1; (b) dung dịch sắt/clorua sau kết tủa vàng; (c) AP đã dùng; (d) dung dịch hãm sau vét bạc; (e) dung dịch có Cd. Không trộn (e) với các luồng khác.',
   '<b>Vét kim loại:</b> thả sắt vụn 1–3 ngày; lọc lấy bùn (đồng + kim loại quý sót) — có giá trị, cất riêng. Có thể nhúng kẽm lá để vét lần cuối.',
   '<b>Trung hoà:</b> thêm soda hoặc vôi <b>từ từ</b> tới pH 7–8 (sủi CO2, toả nhiệt). Kim loại nặng kết tủa thành hidroxit.',
   '<b>Lọc tách:</b> bùn rắn đóng bao, dán nhãn "chất thải nguy hại — bùn kim loại"; nước sau lọc kiểm tra pH, kim loại trước khi thải theo quy định hoặc giao đơn vị xử lý.',
   '<b>Hợp đồng</b> với đơn vị thu gom, xử lý chất thải nguy hại có giấy phép; lưu chứng từ.'], num=True)

# --- 7 Tính toán
H1('7. Tính toán và bảng định lượng')
H2('7.1. Quy đổi thường dùng')
TBL(['Đại lượng', 'Giá trị'], [['1 lượng (cây) vàng', '37,5 g = 10 chỉ'], ['1 chỉ', '3,75 g'], ['1 troy ounce (oz)', '31,1035 g'],
    ['Tuổi vàng K → %', '24K = 99,9%; 22K = 91,7%; 18K = 75%; 14K = 58,5%; 10K = 41,7%; "vàng tây" thường 10–18K'], ['Bạc 925 / 999', '92,5% / 99,9% Ag'],
    ['HNO3 68%', 'd = 1,41 g/mL → 15,2 mol/L'], ['HCl 32%', 'd = 1,16 g/mL → 10,2 mol/L'], ['H2SO4 98%', 'd = 1,84 g/mL → 18,4 mol/L']], [50, 120])
H2('7.2. Định lượng chuẩn trên 1 gam kim loại quý')
TBL(['Bước', 'Tính trên 1 g Ag', 'Tính trên 1 g Au'], [
    ['Hoà tan', 'HNO3 68%: ~1,1 mL (loãng, gồm dư) + Cu kèm theo', 'HCl 32% ~4 mL + HNO3 68% ≤ 1 mL / g hợp kim'],
    ['Tách', f'NaCl: {num(1 / MW["Ag"] * MW["NaCl"] * 1.3, 2)} g', f'Urê: ~0,2 g / g hợp kim'],
    ['Khử', f'NaOH {num(1 / MW["Ag"] * 1.5 * 40, 2)} g + glucose {num(1 / MW["Ag"] / 2 * MW["Glu"] * 2, 2)} g; hoặc Fe {num(1 / MW["Ag"] / 2 * MW["Fe"] * 3, 2)} g', f'FeSO4·7H2O {num(1 / MW["Au"] * 3 * MW["FeSO47"] * 1.5, 2)} g (từ {num(1 / MW["Au"] * 3 * 1.5 * MW["Fe"] * 1.15, 2)} g sắt) hoặc SMB 1,3 g'],
    ['Sản phẩm trung gian', f'AgCl {num(MW["AgCl"] / MW["Ag"], 3)} g', 'HAuCl4 tan']], [32, 70, 68])
H2('7.3. Công thức tỉ lượng')
P('Số mol n = m / M. Ví dụ: 92,5 g Ag → n = 92,5 / 107,87 = 0,858 mol. Theo 3Ag + 4HNO3, cần 0,858 × 4/3 = 1,14 mol HNO3. Cộng 7,5 g Cu (0,118 mol × 8/3 = 0,31 mol) → 1,46 mol; dư 25% → 1,82 mol. HNO3 68% chứa 15,2 mol/L → cần ≈ 120 mL.')
P('Ví dụ vàng: 7,5 g Au → 0,0381 mol; AuCl4^- + 3Fe^2+ → cần 0,114 mol Fe^2+ → 31,8 g FeSO4·7H2O lý thuyết, dùng dư 50% ≈ 48 g.')

# --- 8 Chi phí
H1('8. Chi phí giả định theo quy mô')
BOX('Đọc kỹ trước khi dùng số liệu', [f'Tất cả đơn giá dưới đây là <b>giả định</b> để minh hoạ cách tính, không phải báo giá. Giá hoá chất công nghiệp thay đổi theo nhà cung cấp, quy cách và khu vực; giá hoá chất tinh khiết phòng thí nghiệm có thể cao gấp 3–10 lần. Giá kim loại tham chiếu thị trường cuối tháng 11/2026: vàng 9999 khoảng 148 triệu đồng/lượng (≈ {vnd(AU_PER_G)}/g), bạc 999 khoảng 1,6 triệu đồng/lượng (≈ {vnd(AG_PER_G)}/g). Hãy cập nhật trước khi tính.'], 'warn')
H2('8.1. Đơn giá hoá chất giả định')
TBL(['Hoá chất', 'Đơn vị', 'Đơn giá giả định'], [[v[0], v[1], vnd(v[2])] for v in PRICE.values()], [90, 25, 55])
H2('8.2. Quy mô A — thí nghiệm nhỏ cho vui')
TBL(['Hạng mục đầu tư ban đầu', 'Ước tính'], [['Bộ cốc thuỷ tinh, ống đong, đũa, nhiệt kế', '0,5–0,8 triệu'], ['Bếp điện / hồng ngoại', '0,5–1 triệu'], ['Cân 0,01 g', '0,3–0,5 triệu'],
    ['Phễu, giấy lọc, chai lọ, giấy pH', '0,2–0,4 triệu'], ['Chén graphit, đèn khò mini, khuôn, gạch chịu lửa', '0,6–1,2 triệu'], ['Bảo hộ: mặt nạ ABEK, kính, găng, tạp dề', '1–1,8 triệu'], ['<b>Tổng</b>', '<b>≈ 3–6 triệu đồng</b>']], [120, 50])
a_ag = silver_batch(100); a_au = gold_batch(10)
TBL(['Mẻ thử', 'Hoá chất + gas', 'Kim loại thu được', 'Giá trị tham chiếu'], [
    ['100 g bạc 925 (SOP-1)', vnd(a_ag['cost']), f'{num(a_ag["out"], 1)} g bạc 999', vnd(a_ag['value'])],
    ['10 g vàng 18K (SOP-4, FeSO4 từ đinh sắt)', vnd(a_au['cost']), f'{num(a_au["out"], 2)} g vàng 9999', vnd(a_au['value'])]], [56, 34, 40, 40])
P('Nhận xét: chi phí hoá chất mỗi mẻ nhỏ chỉ vài chục nghìn đồng, nhưng <b>giá trị gia tăng thực</b> chỉ là phần chênh giữa giá bán kim loại tinh khiết và giá bán hợp kim ban đầu (tiệm thường mua 18K, 925 theo hàm lượng trừ một khoản). Ở quy mô A, mục tiêu là học và trải nghiệm; hao hụt vài phần trăm do tay nghề có thể xoá hết phần chênh này.')
H2('8.3. Quy mô B — xưởng nhỏ')
TBL(['Hạng mục đầu tư', 'Ước tính'], [['Bộ lọc hút chân không (phễu Buchner, bình 5 L, bơm)', '6–12 triệu'], ['Bếp từ/bếp cách cát công suất, cốc 5–10 L borosilicate', '5–10 triệu'],
    ['Tủ hút / quạt hút hoá chất + ống PVC', '10–25 triệu'], ['Tháp hấp thụ khí NOx loại nhỏ', '15–30 triệu'], ['Lò nung điện 1–2 kg hoặc bộ khò gas–oxy', '10–40 triệu'],
    ['Cân 0,01 g / 3 kg, dụng cụ, chai lọ', '3–6 triệu'], ['Bồn xử lý thải, thùng chứa, bảo hộ đầy đủ', '8–15 triệu'], ['<b>Tổng</b>', '<b>≈ 60–140 triệu đồng</b> (chưa gồm mặt bằng, hồ sơ pháp lý)']], [120, 50])
b_ag = silver_batch(1000); b_au = gold_batch(200)
TBL(['Mẻ', 'Hoá chất + gas', 'Thu được', 'Giá trị tham chiếu', 'Hoá chất / giá trị'], [
    ['1 kg bạc 925', vnd(b_ag['cost']), f'{num(b_ag["out"])} g Ag', vnd(b_ag['value']), f'{num(b_ag["cost"] / b_ag["value"] * 100, 1)}%'],
    ['200 g vàng 18K', vnd(b_au['cost']), f'{num(b_au["out"], 1)} g Au', vnd(b_au['value']), f'{num(b_au["cost"] / b_au["value"] * 100, 2)}%']], [32, 30, 30, 40, 38])
P('Chi phí vận hành khác cần tính: nhân công (1–2 người), điện nước, khấu hao thiết bị, thay phin mặt nạ, thu gom chất thải nguy hại (tính theo kg, hỏi báo giá đơn vị có phép), phí phân tích XRF. Ở quy mô này, nguồn thu thường đến từ <b>phí tinh luyện thuê</b> cho tiệm vàng hoặc từ chênh lệch khi thu mua phế liệu đã định giá đúng. Mức phí thuê tinh luyện trên thị trường cần khảo sát trực tiếp.')
H2('8.4. Quy mô C — lớn (định hướng)')
TBL(['Hạng mục', 'Ghi chú'], [['Mặt bằng trong khu/cụm công nghiệp', 'Đáp ứng khoảng cách an toàn, PCCC'], ['Hồ sơ pháp lý', 'Giấy phép môi trường, đủ điều kiện kinh doanh/sử dụng hoá chất, ngành nghề kinh doanh vàng phù hợp, an toàn lao động'],
    ['Thiết bị', 'Bồn phản ứng chịu axit có khuấy, lọc khung bản, hệ thống xử lý khí thải nhiều cấp, trạm xử lý nước thải, lò cảm ứng, có thể thêm điện phân tinh luyện bạc/vàng, máy XRF'],
    ['Nhân sự', 'Kỹ sư hoá, cán bộ an toàn–môi trường, kế toán kim loại quý'], ['Tổng đầu tư', 'Rất sơ bộ từ vài tỷ đến hàng chục tỷ đồng tuỳ công suất — cần lập dự án và thuê tư vấn']], [45, 125])
H2('8.5. Khi nào nên tự làm, khi nào nên thuê?')
B(['Trang sức có tuổi rõ ràng, khối lượng nhỏ: bán hoặc đổi ở tiệm thường lợi hơn tự tinh luyện.', 'Nguyên liệu không rõ hàm lượng, hỗn hợp (bụi, bùn, điện tử): tự làm mẫu thử để biết giá trị thật trước khi mua/bán.',
   'Khối lượng đều đặn, có khách thuê: cân nhắc quy mô B với đầy đủ thủ tục.', 'Không bao giờ để tiết kiệm hoá chất hay thiết bị bảo hộ lấn át an toàn.'])

# --- 9 Môi trường (đã có SOP-8) & 10 Pháp lý
H1('9. Môi trường và chất thải')
P('Mọi dung dịch sau phân kim đều chứa axit và kim loại nặng (Cu, Ni, Zn, Fe, có thể Cd). Theo pháp luật về bảo vệ môi trường (Luật Bảo vệ môi trường số 72/2020/QH14 và các văn bản hướng dẫn), đây là <b>chất thải nguy hại</b>: phải phân loại, lưu chứa đúng cách và chuyển giao cho đơn vị có giấy phép xử lý. Quy trình kỹ thuật xem SOP-8.')
B(['Ghi sổ lượng chất thải phát sinh mỗi mẻ.', 'Thùng chứa nhựa HDPE có nắp, nhãn, đặt trên khay chống tràn, có mái che.', 'Khí thải NOx: ở quy mô B trở lên cần tháp hấp thụ (dung dịch kiềm) — dung dịch hấp thụ sau dùng cũng là chất thải cần xử lý.'])
H1('10. Khung pháp lý cần lưu ý (Việt Nam)')
BOX('Lưu ý', ['Phần này chỉ nêu các văn bản chính để người đọc tự tra cứu, không phải tư vấn pháp lý. Văn bản có thể được sửa đổi; hãy kiểm tra hiệu lực và hỏi cơ quan chức năng hoặc luật sư trước khi kinh doanh.'], 'vio')
TBL(['Lĩnh vực', 'Văn bản tham khảo', 'Nội dung liên quan'], [
    ['Hoá chất', 'Luật Hoá chất số 69/2025/QH15 (hiệu lực 01/01/2026); Nghị định 24/2026, 25/2026, 26/2026/NĐ-CP; Nghị định 275/2026/NĐ-CP về xử phạt', 'Điều kiện kinh doanh, sử dụng, tồn trữ hoá chất; danh mục hoá chất kiểm soát; xử phạt'],
    ['Kinh doanh vàng', 'Nghị định 24/2012/NĐ-CP, sửa đổi bởi Nghị định 232/2025/NĐ-CP (hiệu lực 10/10/2025)', 'Sản xuất, gia công vàng trang sức, mỹ nghệ là hoạt động kinh doanh có điều kiện; giao dịch mua bán vàng từ 20 triệu đồng/ngày phải thanh toán qua tài khoản'],
    ['Môi trường', 'Luật Bảo vệ môi trường 72/2020/QH14 và văn bản hướng dẫn', 'Giấy phép môi trường, quản lý chất thải nguy hại, xả thải'],
    ['An toàn lao động, PCCC', 'Luật An toàn, vệ sinh lao động; pháp luật về PCCC', 'Huấn luyện an toàn, trang bị bảo hộ, phương án chữa cháy']], [28, 72, 70])

# --- Phụ lục
H1('Phụ lục')
H2('A. Bảng tra nhanh')
TBL(['Chất', 'M (g/mol)', 'Khối lượng riêng', 'Nóng chảy', 'Ghi chú'], [
    ['Au', '196,97', '19,3 g/cm³', '1064 °C', 'Không tan trong HNO3; tan trong cường toan, HCl + Cl2'], ['Ag', '107,87', '10,5 g/cm³', '962 °C', 'Tan trong HNO3'],
    ['Cu', '63,55', '8,96 g/cm³', '1085 °C', 'Tan trong HNO3, AP'], ['Pd', '106,42', '12,0 g/cm³', '1555 °C', 'Có trong vàng trắng, nha khoa'], ['W', '183,84', '19,3 g/cm³', '3422 °C', 'Không tan trong cường toan — lọc bỏ'],
    ['AgCl', '143,32', '5,56 g/cm³', '455 °C', 'Ksp ≈ 1,8·10<super>-10</super>; nhạy sáng'], ['Hàn the Na2B4O7·10H2O', '381,4', '1,73 g/cm³', '743 °C (khan)', 'Trợ dung']], [22, 18, 26, 22, 82])
H2('B. Thuật ngữ nghề')
TBL(['Thuật ngữ', 'Nghĩa'], [['Phân kim', 'Tách kim loại quý khỏi hợp kim/phế liệu'], ['Hạ tuổi', 'Nấu thêm bạc/đồng để giảm tỷ lệ vàng ≤ 25% trước khi hoà HNO3'], ['Cán mỏng', 'Cán hợp kim thành lá mỏng để tăng diện tích tiếp xúc'],
    ['Cường toan', 'Nước cường toan: HCl + HNO3 (~3–4 : 1)'], ['Hoàn nguyên', 'Khử ion kim loại về kim loại'], ['Hầm bạc bột', 'Nung từ từ bột cho khô, kết khối trước khi nấu'],
    ['Vàng nổi', 'Bột vàng siêu mịn nổi trên mặt dung dịch do sức căng bề mặt, bọt khí'], ['AP', 'Dung dịch HCl + H2O2 hoà đồng để bóc lớp mạ vàng'], ['Xi măng hoá', 'Kim loại hoạt động hơn đẩy kim loại kém hoạt động khỏi dung dịch'],
    ['Purple of Cassius', 'Vàng keo tím khi thử SnCl2 — dấu hiệu còn vàng']], [40, 130])
H2('C. Mẫu nhật ký mẻ')
TBL(['Mục', 'Ghi chép'], [['Mã mẻ / ngày', ''], ['Nguyên liệu, nguồn gốc', ''], ['Khối lượng vào (g)', ''], ['Hàm lượng ước tính (%)', ''], ['Hoá chất & lượng dùng', ''],
    ['Hiện tượng quan sát được', ''], ['Sự cố & xử lý', ''], ['Khối lượng thu được (g)', ''], ['Kết quả kiểm tra (đá thử/XRF)', ''], ['Hiệu suất (%)', ''], ['Chất thải phát sinh', ''], ['Người thực hiện / ký', '']], [60, 110], zebra=False)
H2('D. Danh mục kiểm tra (checklist)')
TBL(['Thời điểm', 'Kiểm tra'], [
    ['Trước khi làm', '☐ Đọc SOP  ☐ Đủ hoá chất, dụng cụ  ☐ Đồ bảo hộ, phin mặt nạ còn hạn  ☐ Thông gió  ☐ Nước rửa, soda, bình chữa cháy  ☐ Có người biết'],
    ['Trong khi làm', '☐ Thêm hoá chất từng ít  ☐ Không đậy kín  ☐ Theo dõi nhiệt độ  ☐ Ghi nhật ký  ☐ Không rời vị trí khi đang đun'],
    ['Sau khi làm', '☐ Gom chất thải đúng luồng  ☐ Rửa dụng cụ  ☐ Cất hoá chất  ☐ Cân, ghi kết quả  ☐ Rửa tay, thay quần áo']], [32, 138])

# --- Cảm ơn & Giới thiệu
H1('Lời cảm ơn và giới thiệu')
P('<b>Bà giáo phù thủy Hài Lê</b> (Facebook: <link href="https://www.facebook.com/haile1980" color="#5a3fa0"><u>facebook.com/haile1980</u></link>) — nguồn hình ảnh, kiến thức thực tế và cảm hứng. Hơn 20 năm làm nghề, cô chia sẻ rằng lúc mới bắt đầu "không hỏi được ai, cứ đọc sách và thử nghiệm", nên nay muốn truyền lại cho những người như mình ngày xưa. Những mẹo nghề quý trong tài liệu này đến từ những chia sẻ đó.')
P('<b>Nguyễn Đức Dũng</b> — ý tưởng, thiết kế trò chơi, biên soạn nội dung và phát triển ứng dụng <i>Phù thủy Phân kim — Học viện Giả kim Vàng & Bạc</i>.')
BOX('🎓 Muốn học trực tiếp?', ['Nếu muốn học nghề phân kim bài bản, có người hướng dẫn tận tay, hãy liên hệ Cô giáo phù thủy Hài Lê qua Facebook: <link href="https://www.facebook.com/haile1980" color="#5a3fa0"><u>https://www.facebook.com/haile1980</u></link>. Nhắn rằng bạn biết cô qua game Phù thủy Phân kim nhé!'], 'vio')
BOX('☕ Mời một ly cà phê?', ['Nếu thấy trò chơi và Bí kíp hữu ích, "ly cà phê" tác giả thích nhất là bạn <b>chia sẻ trò chơi cho một người cùng sở thích</b>. Và nếu bạn làm thử, hãy gửi lại kết quả cùng những khó khăn gặp phải trong thực tế (qua mục Giới thiệu trong ứng dụng) để phiên bản sau tốt hơn.'], 'ok')
P('<i>Phiên bản tài liệu: 1.0 — biên soạn ' + TODAY + ', đi kèm ứng dụng Phù thủy Phân kim v2.0.</i>', 'small')

# =========================== DỰNG TRANG ===========================
class Doc(BaseDocTemplate):
    def afterFlowable(self, f):
        if hasattr(f, '_toc'):
            lvl, txt = f._toc; key = f'k{id(f)}'
            self.canv.bookmarkPage(key); self.canv.addOutlineEntry(re.sub('<[^>]+>', '', txt), key, lvl, closed=lvl > 0)
            self.notify('TOCEntry', (lvl, txt, self.page, key))

def cover(c, d):
    W, H = A4
    c.setFillColor(NIGHT); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(NIGHT2); c.circle(W * .8, H * .9, 220, fill=1, stroke=0)
    c.setStrokeColor(GOLD); c.setLineWidth(3); c.rect(14 * mm, 14 * mm, W - 28 * mm, H - 28 * mm)
    c.setLineWidth(.8); c.rect(18 * mm, 18 * mm, W - 36 * mm, H - 36 * mm)
    if LOGO and os.path.exists(LOGO): c.drawImage(LOGO, W / 2 - 38 * mm, H - 112 * mm, 76 * mm, 76 * mm, mask='auto')
    c.setFillColor(GOLD2); c.setFont('BVP-B', 11); c.drawCentredString(W / 2, H - 124 * mm, 'HỌC VIỆN GIẢ KIM · PHÙ THỦY PHÂN KIM')
    c.setFillColor(colors.white); c.setFont('PF-XB', 46); c.drawCentredString(W / 2, H - 148 * mm, 'BÍ KÍP PHÂN KIM')
    c.setFillColor(colors.HexColor('#d9cfe9')); c.setFont('BVP', 14)
    c.drawCentredString(W / 2, H - 162 * mm, 'Quy trình thu hồi & tinh luyện vàng, bạc')
    c.drawCentredString(W / 2, H - 170 * mm, 'từ thí nghiệm nhỏ đến xưởng sản xuất')
    c.setFillColor(GOLD2); c.roundRect(W / 2 - 62 * mm, H - 196 * mm, 124 * mm, 14 * mm, 7, fill=1, stroke=0)
    c.setFillColor(NIGHT); c.setFont('BVP-B', 11); c.drawCentredString(W / 2, H - 191 * mm, 'Dành cho Đại pháp sư 9999 — người đủ 18 tuổi')
    c.setFillColor(colors.HexColor('#cfc4e0')); c.setFont('BVP', 10)
    y = 70 * mm
    for t in ['8 quy trình chuẩn (SOP) · Định lượng tính sẵn · Chi phí giả định 3 quy mô', 'An toàn lao động · Xử lý chất thải · Khung pháp lý · Bảng tra & nhật ký mẻ']:
        c.drawCentredString(W / 2, y, t); y -= 6 * mm
    c.setFillColor(colors.white); c.setFont('BVP-SB', 10.5)
    c.drawCentredString(W / 2, 42 * mm, 'Hình ảnh & kiến thức thực tế: Bà giáo phù thủy Hài Lê · facebook.com/haile1980')
    c.drawCentredString(W / 2, 36 * mm, 'Phát triển ứng dụng & biên soạn: Nguyễn Đức Dũng')
    c.setFillColor(colors.HexColor('#a99cc0')); c.setFont('BVP', 8.5)
    c.drawCentredString(W / 2, 26 * mm, f'Phiên bản 1.0 · {TODAY} · Tài liệu tham khảo — đọc kỹ Miễn trừ trách nhiệm (chương 1) trước khi áp dụng')

def page(c, d):
    W, H = A4
    c.setStrokeColor(GOLD); c.setLineWidth(.6); c.line(20 * mm, H - 14 * mm, W - 20 * mm, H - 14 * mm)
    c.setFont('BVP-SB', 8); c.setFillColor(VIO); c.drawString(20 * mm, H - 11.5 * mm, 'BÍ KÍP PHÂN KIM')
    c.setFont('BVP', 8); c.setFillColor(MUTED); c.drawRightString(W - 20 * mm, H - 11.5 * mm, 'Học viện Giả kim · Phù thủy Phân kim')
    c.line(20 * mm, 14 * mm, W - 20 * mm, 14 * mm)
    c.drawString(20 * mm, 9.5 * mm, 'Tài liệu tham khảo cho người đủ 18 tuổi · Số liệu giả định · Tự chịu trách nhiệm khi áp dụng')
    c.setFont('BVP-B', 9); c.setFillColor(INK); c.drawRightString(W - 20 * mm, 9.5 * mm, str(d.page))

doc = Doc(OUT, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm, topMargin=20 * mm, bottomMargin=20 * mm,
          title='Bí kíp phân kim', author='Nguyễn Đức Dũng', subject='Quy trình thu hồi và tinh luyện vàng, bạc', creator='Phù thủy Phân kim v2.0')
fr = Frame(20 * mm, 18 * mm, A4[0] - 40 * mm, A4[1] - 36 * mm, id='f')
doc.addPageTemplates([PageTemplate('cover', [Frame(20 * mm, 20 * mm, 100, 100, id='c')], onPage=cover), PageTemplate('front', [fr], onPage=page)])
toc = TableOfContents(); toc.levelStyles = [ST['toc1'], ST['toc2']]; toc.dotsMinLevel = 0
full = [Spacer(1, 1), NextPageTemplate('front'), PageBreak(), Paragraph('Mục lục', ST['h1']), HR(GOLD, 1.6), toc] + story
doc.multiBuild(full)
print('OK', OUT)
