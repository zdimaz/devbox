---
title: "Resend — Email API"
---

# Resend — Email for Developers

Ссылка: [https://resend.com/](https://resend.com/)

## 🧠 Суть

Resend — email API для разработчиков. Отправка транзакционных писем через REST API без настройки SMTP.

## ⚡ Быстрый старт

```bash
npm install resend
```

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: "Acme <onboarding@resend.dev>",
  to: ["user@example.com"],
  subject: "Hello World",
  html: "<strong>It works!</strong>",
});
```

## 💻 Attachments

```ts
const { data } = await resend.emails.send({
  from: "Acme <onboarding@resend.dev>",
  to: ["user@example.com"],
  subject: "Report",
  html: "<p>See attached</p>",
  attachments: [
    {
      filename: "report.pdf",
      content: pdfBuffer,
    },
  ],
});
```

## 💻 Multiple recipients

```ts
await resend.emails.send({
  from: "Acme <noreply@yourdomain.com>",
  to: ["alice@example.com", "bob@example.com"],
  subject: "Team update",
  html: "<p>Weekly digest...</p>",
});
```

## ⚠️ Подводные камни

- Бесплатный план: **100 писем/день**, 3000 писем/месяц
- Домен нужно верифицировать (DNS records) для production
- Sandbox-домен `@resend.dev` только для тестов
- HTML-письма — инлайн-стили, таблицы для совместости

## 🚀 Best Practice

1. Верифицируй домен (SPF, DKIM, DMARC) для production
2. HTML-письма — таблицы + инлайн-стили
3. API ключ храни только в `.env`
4. Используй webhook для отслеживания bounce/delivery

## 💻 Vue + Resend

```vue
<!-- components/ContactForm.vue -->
<script setup>
const formData = reactive({ name: "", email: "", message: "" });

const submit = async () => {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
};
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="formData.name" placeholder="Name" />
    <input v-model="formData.email" type="email" placeholder="Email" />
    <textarea v-model="formData.message" />
    <button type="submit">Send</button>
  </form>
</template>
```

## 💻 Vite + Resend (backend)

```ts
// server/email.ts
import { Resend } from "resend";
import express from "express";

const app = express();
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const { data, error } = await resend.emails.send({
    from: `Contact Form <noreply@yourdomain.com>`,
    to: ["you@yourdomain.com"],
    subject: `New message from ${name}`,
    html: `<p><b>${email}</b> says:</p><p>${message}</p>`,
  });

  if (error) return res.status(400).json(error);
  res.json(data);
});
```

### Honeypot (защита от спама)

Добавь невидимое поле — боты его заполнят, а люди нет:

```vue
<script setup>
const form = reactive({ name: "", email: "", message: "", honeypot: "" });

const submit = async () => {
  if (form.honeypot) return; // спам-бот → игнорируем
  await fetch("/api/send-email", { method: "POST", body: JSON.stringify(form) });
};
</script>

<template>
  <form @submit.prevent="submit">
    <!-- Скрытое поле — боты заполнят, люди нет -->
    <input v-model="form.honeypot" style="display:none" tabindex="-1" autocomplete="off" />
    <!-- ...остальные поля -->
  </form>
</template>
```

### Vite config (proxy для dev)

```js
// vite.config.js
export default {
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
};
```
