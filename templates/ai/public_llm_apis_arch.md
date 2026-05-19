---
title: "Public LLM APIs"
---

# Public LLM APIs (на Arch Linux) — ключи + интеграция

## ✅ Получение API ключей

| API          | Сайт                                                                         | Бесплатный ключ       |
| ------------ | ---------------------------------------------------------------------------- | --------------------- |
| OpenRouter   | [https://openrouter.ai](https://openrouter.ai)                               | ✅ Да (регистрация)   |
| Hugging Face | [https://huggingface.co/inference-api](https://huggingface.co/inference-api) | ✅ Да (регистрация)   |
| Cohere       | [https://platform.cohere.ai](https://platform.cohere.ai)                     | ✅ Да (тестовый ключ) |
| Groq         | [https://groq.com](https://groq.com)                                         | ✅ да (регистрация)   |

---

## 📦 Установка Cherry-Studio на Arch

```bash
yay -S cherry-studio-bin


🧾 Использование через терминал (примеры)


🔹 OpenRouter (GPT-3.5, GPT-4, LLaMA)

curl -H "Authorization: Bearer YOUR_API_KEY" https://openrouter.ai/api/v1/completion \
  -d '{
    "model": "gpt-3.5-turbo",
    "prompt": "Привет, как ты?"
  }'


🔹 Groq (qwen3-32b, undead, etc.)

curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.groq.com/openai/v1/chat/completions \
  -d '{
    "model": "qwen/qwen3-32b",
    "messages": [{"role": "user", "content": "Привет, как ты?"}]
  }'

🔹 Undead + Groq (пример)

curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.groq.com/openai/v1/chat/completions \
  -d '{
    "model": "undead",
    "messages": [{"role": "user", "content": "Привет, как ты?"}]
  }'


Проверяй, что модель поддерживается API (например, undead и qwen/qwen3-32b доступны на Groq).



```
