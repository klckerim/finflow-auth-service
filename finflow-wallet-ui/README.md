# FinFlow Wallet UI (New)

Bu klasör, mevcut `finflow-ui` koduna dokunmadan oluşturulmuş bağımsız yeni arayüzdür.

## Tasarım yaklaşımı

Bu UI, `FinFlow.API`, `FinFlow.Application`, `FinFlow.Domain`, `FinFlow.Infrastructure` modüllerindeki iş akışlarına göre kurgulandı:

- Wallet oluşturma / güncelleme / transfer / deposit
- PaymentMethod (card) yönetimi
- Transaction ledger görünümleri (user/wallet/card)
- Bill payment ve Stripe checkout/setup senaryoları
- Auth + refresh token + rate-limiting güvenlik akışları

## Sayfalar

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/wallet`
- `/cards`
- `/transactions`
- `/settings`

## Responsive hedef

- Desktop: sol rail + operasyon paneli
- Mobile: bottom dock navigasyon + tek kolon içerik
- Tablet: adaptif bento/metric grid kırılımı

## Run

```bash
npm install
npm run dev
```

Default: `http://localhost:3001`
