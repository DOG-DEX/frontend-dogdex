# Bat dau tu day - Huong dan docs frontend-dogdex

Doc file nay truoc. Moi thu khac trong folder docs/ chi la chi tiet bo sung.

---

## 1. Docs nay dung de lam gi?

Ban dang xay Dog Dex - app Next.js nhan dien giong cho va bo suu tap breed. Folder docs/ giup:

| Van de | Docs giai quyet bang file nao |
| :--- | :--- |
| Cau truc source code the nao? | `ARCHITECTURE.md` |
| Feature nay code xong chua, test chua? | `features/<ten>/progress.md` |
| Toan bo app tien do the nao? | `PROGRESS.md` |
| AI agent can tuan quy tac gi? | `AGENT_GUIDE.md` |
| Docs doi phien ban khi nao? | `versioning/conventions.md`, `CHANGELOG.md` |

Tom lai: Code nam trong src/, docs nam trong docs/. Docs khong thay code - no giup ban va AI nho, theo doi, khong bi lac.

---

## 2. Chi can nho 3 loai file

```
docs/
|
+-- HIEU KIEN TRUC       -> ARCHITECTURE.md
+-- THEO DOI TIEN DO     -> features/*/progress.md
+-- QUY TAC VA LICH SU   -> AGENT_GUIDE, PROGRESS, CHANGELOG
```

### Vi du cu the - feature Scan

| File | Mo khi nao |
| :--- | :--- |
| `features/scan/progress.md` | Muon biet upload anh / API scan da lam toi dau |
| `PROGRESS.md` | Muon xem tong cac feature |

---

## 3. Ban doc docs the nao? (3 tinh huong)

### Tinh huong A - Tôi moi vao project
1. File nay (`START_HERE.md`)
2. `ARCHITECTURE.md`
3. `PROGRESS.md`

### Tinh huong B - Tôi sap code/sua 1 feature
1. Mo `features/<feature>/progress.md`
2. Code trong `src/features/<feature>/`
3. Sau khi xong -> cap nhat progress + `PROGRESS.md`

### Tinh huong C - Tôi chi muon biet con bao nhieu viec
Mo `PROGRESS.md` - bang Summary va Blockers & TODOs.

---

## 4. Quy trinh quan ly docs

### Quy tac vang
> Code thay doi -> docs cap nhat trong cung PR/commit (hoac ngay sau do).
