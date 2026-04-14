---
title: "Vue.js"
---

# Vue.js

Ссылка: [https://vuejs.org/](https://vuejs.org/)

## 🧠 Суть

Прогрессивный JS-фреймворк для создания UI. Основа VitePress, Nuxt, и множества других инструментов.

## ⚡ Composition API

```vue
<script setup>
import { ref, computed, watch } from "vue";

const count = ref(0);
const doubled = computed(() => count.value * 2);

watch(count, (newVal) => {
  console.log("Count changed:", newVal);
});
</script>

<template>
  <button @click="count++">{{ doubled }}</button>
</template>
```

## 💻 Реактивность

```ts
import { ref, reactive, computed, watch, watchEffect } from "vue";

// ref — для примитивов
const name = ref("Vue");

// reactive — для объектов
const user = reactive({ name: "John", age: 30 });

// computed — вычисляемые значения
const fullName = computed(() => `${user.name} (${user.age})`);

// watch — слежение за изменениями
watch(name, (newVal) => console.log(newVal));

// watchEffect — авто-отслеживание зависимостей
watchEffect(() => {
  console.log(`Hello, ${name.value}!`);
});
```

## 💻 Компоненты

```vue
<!-- Parent.vue -->
<script setup>
import Child from "./Child.vue";

const items = ref([1, 2, 3]);
</script>

<template>
  <Child :items="items" @update="handleUpdate" />
</template>
```

```vue
<!-- Child.vue -->
<script setup>
const props = defineProps({ items: Array });
const emit = defineEmits(["update"]);

const handleClick = (item) => emit("update", item);
</script>

<template>
  <ul>
    <li v-for="item in items" @click="handleClick(item)">{{ item }}</li>
  </ul>
</template>
```

## 💻 Provide / Inject

```vue
<!-- Provider.vue -->
<script setup>
import { provide, ref } from "vue";

const theme = ref("dark");
provide("theme", theme);
</script>

<!-- Consumer.vue -->
<script setup>
import { inject } from "vue";

const theme = inject("theme", "light");
</script>
```

## 💻 Lifecycle

```ts
import { onMounted, onUpdated, onUnmounted } from "vue";

onMounted(() => {
  // DOM готов
});

onUpdated(() => {
  // После обновления
});

onUnmounted(() => {
  // Очистка (таймеры, слушатели)
});
```

## 💻 Slots

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <header><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" /></footer>
  </div>
</template>
```

## ⚠️ Подводные камни

- `ref` нужен `.value` в JS, в шаблоне — автоматически
- `reactive` нельзя заменять целиком (только мутировать свойства)
- `watch` не срабатывает при замене reactive-объекта
- `provide/inject` не реактивен по умолчанию (нужен `ref`/`reactive`)

## 🚀 Best Practice

1. Используй `<script setup>` и Composition API
2. `ref` для примитивов, `reactive` для объектов
3. `onUnmounted` — всегда чисти слушатели и таймеры
4. Компоненты → маленькие и переиспользуемые
