# Bắt đầu từ đây — Hướng dẫn docs frontend-dogdex

> **Đọc file này trước.** Mọi thứ khác trong folder `docs/` chỉ là chi tiết bổ sung.

---

## 1. Docs này dùng để làm gì? (1 phút)

Bạn đang xây **Dog Dex** — app Next.js nhận diện giống chó và bộ sưu tập breed. Folder `docs/` giúp:

| Vấn đề | Docs giải quyết bằng file nào |
|--------|-------------------------------|
| "Cấu trúc source code thế nào?" | `architecture/architecture-design.md` |
| "Feature này code xong chưa, test chưa?" | `features/<tên>/progress.md` |
| "Toàn bộ app tiến độ thế nào?" | `PROGRESS.md` |
| "AI agent cần tuân quy tắc gì?" | `AGENT_GUIDE.md` |
| "Docs đổi phiên bản khi nào?" | `versioning/CONVENTIONS.md`, `CHANGELOG.md` |

**Tóm lại:** Code nằm trong `src/`, docs nằm trong `docs/`. Docs **không thay code** — nó giúp bạn và AI **nhớ, theo dõi, không bị lạc**.

---

## 2. Chỉ cần nhớ 3 loại file

```
docs/
│
├── 📘 HIỂU KIẾN TRÚC    →  architecture/architecture-design.md
├── 📊 THEO DÕI TIẾN ĐỘ  →  features/*/progress.md
└── 📋 QUY TẮC & LỊCH SỬ  →  AGENT_GUIDE, PROGRESS, CHANGELOG
```

### Ví dụ cụ thể — feature Scan

| File | Mở khi nào |
|------|------------|
| [`features/scan/progress.md`](./features/scan/progress.md) | Muốn biết upload ảnh / API scan đã làm tới đâu |
| [`PROGRESS.md`](./PROGRESS.md) | Muốn xem **tổng** 5 feature |

---

## 3. Bạn đọc docs thế nào? (3 tình huống)

### Tình huống A — "Tôi mới vào project"

1. **File này** (START_HERE.md)
2. [`architecture/architecture-design.md`](./architecture/architecture-design.md)
3. [`PROGRESS.md`](./PROGRESS.md)

⏱ Khoảng 10–15 phút là nắm được bức tranh lớn.

### Tình huống B — "Tôi sắp code/sửa 1 feature"

1. Mở `features/<feature>/progress.md`
2. Code trong `src/features/<feature>/`
3. Sau khi xong → cập nhật progress + `PROGRESS.md`

### Tình huống C — "Tôi chỉ muốn biết còn bao nhiêu việc"

Mở [`PROGRESS.md`](./PROGRESS.md) — bảng Summary và Blockers & TODOs.

---

## 4. Quy trình quản lý docs

### Quy tắc vàng

> **Code thay đổi → docs cập nhật trong cùng PR/commit (hoặc ngay sau đó).**

### Cột status trong progress

| Cột | Giá trị | Nghĩa |
|-----|---------|-------|
| **Status** | `planned` | Chưa có code |
| | `skeleton` | Có view/route, logic còn sơ sài |
| | `implemented` | UI + service hookup xong |
| | `tested` | Đã có test |
| | `stable` | Xong hẳn, không còn bug known |
| **Tests** | `yes` / `no` / `partial` | Có test chưa? |
| **Docs** | `yes` / `no` / `partial` | architecture/progress đã mô tả chưa? |

### Khi nào ghi CHANGELOG?

| Việc làm | Cần CHANGELOG? |
|----------|----------------|
| Sửa status `implemented` → `tested` | Không bắt buộc |
| Thêm feature mới vào docs | Nên ghi (MINOR) |
| Đổi routing / breaking UX | Bắt buộc (MAJOR) |

---

## 5. Nhờ AI agent (copy prompt)

```
Đọc frontend-dogdex/docs/START_HERE.md và AGENT_GUIDE.md trước.
Sau khi sửa code, cập nhật đúng features/<feature>/progress.md và PROGRESS.md.
Không tạo file docs mới nếu không cần. Giữ docs bằng tiếng Anh (trừ START_HERE.md).
```

---

## 6. Bản đồ nhanh

| Muốn… | Mở file |
|--------|---------|
| Hiểu tổng quan docs | **START_HERE.md** |
| Hiểu cấu trúc src/ | `architecture/architecture-design.md` |
| Xem Scan code xong chưa | `features/scan/progress.md` |
| Xem toàn app | `PROGRESS.md` |
| Quy tắc cho AI | `AGENT_GUIDE.md` |
| Lịch sử phiên bản docs | `CHANGELOG.md` |

---

*File này là chuẩn vận hành docs. Khi thắc mắc, quay lại đây trước.*
