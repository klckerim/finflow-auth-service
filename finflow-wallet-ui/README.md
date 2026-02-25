# FinFlow Wallet UI (New)

Bu klasör, mevcut `finflow-ui` projesine dokunmadan sıfırdan tasarlanan yeni wallet arayüzünün ilk sürümünü içerir.

## İlk adım kapsamı

- Yeni tema (dark gradient wallet style)
- Responsive layout iskeleti (desktop sidebar + mobile bottom navigation)
- Yeniden kullanılabilir UI blokları (app shell, metric cards, transaction list, settings/actions)
- Temel sayfalar:
  - `/login`
  - `/register`
  - `/dashboard`
  - `/wallet`
  - `/cards`
  - `/transactions`
  - `/settings`

## Responsive hedefler

- Mobilde tek kolon akış ve erişilebilir buton düzeni
- Sabit alt mobil menü ile hızlı gezinme
- Tablet/desktop için iki kolonlu adaptif grid

## Çalıştırma

```bash
npm install --omit=dev
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3001` portunda açılır.
