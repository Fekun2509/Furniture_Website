# Deploy: Vercel (frontend) + DigitalOcean droplet (backend + MySQL)

Repo này gộp chung cả frontend và backend (monorepo) để deploy: `git push` lên GitHub, Vercel tự
deploy frontend, backend thì `git pull` trên droplet rồi restart PM2.

Layout:
```
Furniture_Website/
  frontend/   -> deploy lên Vercel
  backend/    -> deploy lên DigitalOcean droplet
  deploy/
    nginx/furniture-app.conf
    README.md   <- file này
```

Kiến trúc: frontend (Vercel, domain riêng, vd `furniture-app.vercel.app`) gọi API sang backend
(droplet, domain riêng, vd `api-furniture.duckdns.org`) qua CORS — 2 domain khác nhau, không sao vì
backend đã bật `cors({ origin: true })`.

---

## Phần A — Backend + MySQL trên DigitalOcean

### A1. Tạo Droplet

1. Đăng ký tại https://www.digitalocean.com, thêm phương thức thanh toán.
2. **Create** → **Droplets**:
   - Region: **Sydney (SYD1)** — gần nhất với bạn
   - Image: **Ubuntu 22.04 (LTS) x64**
   - Size: **Basic → Regular → cấu hình rẻ nhất** (1 vCPU/512MB-1GB RAM, ~$4-6/tháng) — đủ cho backend nhỏ + MySQL lúc test, nâng cấp sau nếu cần
   - Authentication: **SSH Key** → "New SSH Key" nếu chưa có (tạo bằng `ssh-keygen` ở máy local rồi paste public key vào), tránh dùng password
   - Đặt hostname, bấm **Create Droplet**
3. Copy **Public IP** hiển thị sau khi droplet chạy xong (thường ~1 phút).

### A2. Mở firewall (đơn giản hơn Oracle — chỉ 1 lớp)

DigitalOcean → **Networking → Firewalls → Create Firewall**:
- Inbound rules: SSH (22), HTTP (80), HTTPS (443) — mặc định DO đã thêm sẵn SSH
- Apply vào droplet vừa tạo

### A3. SSH vào droplet

```bash
ssh root@<DROPLET_PUBLIC_IP>
```

### A4. Cài môi trường

```bash
apt update && apt upgrade -y

# Firewall trong OS (thêm 1 lớp phòng thủ, không bắt buộc vì đã có Cloud Firewall)
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable

# Node.js qua nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# PM2
npm install -g pm2

# Nginx
apt install -y nginx

# MySQL
apt install -y mysql-server
mysql_secure_installation

# Certbot (SSL free)
apt install -y certbot python3-certbot-nginx
```

### A5. Domain miễn phí cho API (để lấy SSL)

Dùng **DuckDNS** (free): vào https://www.duckdns.org, đăng nhập, tạo subdomain (vd
`api-furniture.duckdns.org`), trỏ về IP của droplet. Sau này muốn dùng domain thật thì đổi lại 1
bản ghi A trỏ về IP này là xong, không đổi gì ở server.

### A6. Setup MySQL

```bash
mysql
```
```sql
CREATE DATABASE furniture_website;
CREATE USER 'furniture_app'@'localhost' IDENTIFIED BY 'change-me-strong-password';
GRANT ALL PRIVILEGES ON furniture_website.* TO 'furniture_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Đây là `DB_USER`/`DB_PASS`/`DB_NAME` sẽ điền vào `.env` bước sau — không dùng `root` như dev local.

### A7. Clone và chạy backend

Repo là monorepo (gồm cả `frontend/`) nên clone toàn bộ về rồi chỉ chạy phần `backend/`:

```bash
mkdir -p /var/www/furniture-app
cd /var/www/furniture-app
git clone git@github.com:Fekun2509/Furniture_Website.git .
# (dùng HTTPS URL thay vì SSH nếu chưa add Deploy Key cho droplet trên GitHub)

cd backend
npm install
cp .env.production.example .env
nano .env   # điền DB_*, CLOUDINARY_*, GOOGLE_*, FACEBOOK_* thật

npx sequelize-cli db:migrate   # tạo bảng
npm run build                  # babel src -> build
pm2 start ecosystem.config.js
pm2 save
pm2 startup                    # chạy lệnh nó in ra, để PM2 tự khởi động lại khi droplet reboot
```

### A8. Cấu hình Nginx (chỉ proxy API — không serve frontend, frontend nằm ở Vercel)

Vì clone cả repo, `deploy/nginx/furniture-app.conf` đã có sẵn tại
`/var/www/furniture-app/deploy/nginx/furniture-app.conf` trên droplet — vẫn nên paste thẳng qua
heredoc để chắc chắn thay đúng domain, thay `api-furniture.duckdns.org` bằng domain thật của bạn
trước khi chạy:

```bash
cat > /etc/nginx/sites-available/furniture-api <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name api-furniture.duckdns.org;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -s /etc/nginx/sites-available/furniture-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

### A9. Bật HTTPS free

```bash
certbot --nginx -d api-furniture.duckdns.org
```

### A10. Kiểm tra backend

- `https://api-furniture.duckdns.org/api/get-categories` → trả JSON
- `pm2 status` → `furniture-backend` là `online`
- `pm2 logs furniture-backend` → xem log nếu lỗi

---

## Phần B — Frontend trên Vercel

1. Push code lên GitHub (repo `Furniture_Website`, monorepo) nếu chưa push bản mới nhất.
2. Vào https://vercel.com → đăng nhập bằng GitHub → **Add New → Project** → chọn repo
   `Furniture_Website`.
3. **Quan trọng vì là monorepo**: ở bước cấu hình project, mở **Root Directory** → bấm **Edit** →
   chọn thư mục `frontend` — Vercel chỉ build phần này, không đụng vào `backend/`.
4. Vercel tự nhận diện **Framework Preset: Create React App** — để mặc định Build Command
   (`npm run build` hoặc `react-scripts build`) và Output Directory (`build`).
5. **Environment Variables** (trước khi bấm Deploy, hoặc thêm sau rồi redeploy) — lấy giá trị từ
   `frontend/.env.production.example`:
   - `REACT_APP_BACKEND_URL` = `https://api-furniture.duckdns.org`
   - `REACT_APP_GOOGLE_CLIENT_ID`
   - `REACT_APP_FACEBOOK_APP_ID`
   - `REACT_APP_ROUTER_BASE_NAME` (để trống nếu không dùng sub-path)
6. Bấm **Deploy**. Xong sẽ có domain dạng `furniture-app-xxx.vercel.app`.
7. `frontend/vercel.json` trong repo đã có sẵn rewrite rule để React Router hoạt động đúng khi
   refresh ở route con (vd `/product/123`) — không cần cấu hình thêm.

### Kiểm tra

- Mở domain Vercel, thử đăng nhập / load sản phẩm — request phải gọi sang
  `https://api-furniture.duckdns.org/api/...` (xem tab Network trên DevTools).
- Nếu bị lỗi CORS: kiểm tra lại domain Vercel có đúng không, backend đang bật `origin: true` nên
  thường không cần whitelist domain cụ thể.

---

## Cập nhật sau này

**Frontend**: chỉ cần `git push` lên GitHub — Vercel tự build & deploy lại (Root Directory đã cố
định là `frontend`, push đổi gì ở `backend/` cũng không kích hoạt build lại frontend).

**Backend**:
```bash
cd /var/www/furniture-app
git pull
cd backend
npm install
npm run build
pm2 restart furniture-backend
```

## Khi lên VPS/production "xịn" hơn sau này

Vì droplet DigitalOcean này là VPS trả phí thật (không phải free tier có giới hạn), setup này **chính
là** bản production luôn — không cần làm lại gì khi "lên thật", chỉ cần nâng cấp size droplet nếu tải
tăng, và đổi domain DuckDNS sang domain thật (mua ở Namecheap/Cloudflare...) bằng cách trỏ 1 bản ghi A
mới, không đổi gì ở Nginx/PM2/MySQL.
