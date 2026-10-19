# syntax=docker/dockerfile:1
# Static frontend for Coolify. No bundler: the SPA ships as native ES modules.
FROM nginx:stable-alpine

COPY <<'EOF' /etc/nginx/snippets/security-headers.conf
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
EOF

COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    server_tokens off;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css application/javascript image/svg+xml;

    # Unhashed file names: JS/CSS/HTML must revalidate (ETag) so deploys show up at once.
    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache" always;
        include /etc/nginx/snippets/security-headers.conf;
    }

    location ~* \.(?:svg|png|jpe?g|gif|webp|ico)$ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=2592000" always;
        include /etc/nginx/snippets/security-headers.conf;
        access_log off;
    }
}
EOF

# Runtime files only: the .dockerignore whitelist picks them. The demo store turns itself on outside localhost.
COPY . /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1/ || exit 1
