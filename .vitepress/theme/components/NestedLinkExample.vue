	<div class="link-example">
		<div class="example-section">
			<h3>Примеры ссылок с Nesting CSS</h3>

			<div class="link-grid">
				<a href="#" class="example-link primary">Основная ссылка</a>
				<a href="#" class="example-link secondary">Второстепенная ссылка</a>
				<a href="#" class="example-link success">Успешная ссылка</a>
				<a href="#" class="example-link warning">Предупреждение</a>
				<a href="#" class="example-link danger">Опасная ссылка</a>
				<a href="#" class="example-link info">Информационная ссылка</a>
			</div>

			<div class="link-group">
				<h4>Группа ссылок</h4>
				<div class="link-list">
					<a href="#" class="group-link">Ссылка 1</a>
					<a href="#" class="group-link">Ссылка 2</a>
					<a href="#" class="group-link active">Активная ссылка</a>
					<a href="#" class="group-link disabled">Отключенная ссылка</a>
				</div>
			</div>

			<div class="button-group">
				<a href="#" class="btn-example primary">Кнопка 1</a>
				<a href="#" class="btn-example secondary">Кнопка 2</a>
				<a href="#" class="btn-example outline">Обводка</a>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Примеры использования Nesting CSS */

.link-example {
	@apply p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg;
}

.example-section {
	@apply space-y-6;
}

h3 {
	@apply text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4;
}

h4 {
	@apply text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3;
}

/* Сетка ссылок с адаптивностью */
.link-grid {
	@apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

.example-link {
	@apply block px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105;

	&.primary {
		@apply bg-blue-600 hover:bg-blue-700;
	}

	&.secondary {
		@apply bg-gray-600 hover:bg-gray-700;
	}

	&.success {
		@apply bg-green-600 hover:bg-green-700;
	}

	&.warning {
		@apply bg-yellow-600 hover:bg-yellow-700;
	}

	&.danger {
		@apply bg-red-600 hover:bg-red-700;
	}

	&.info {
		@apply bg-blue-500 hover:bg-blue-600;
	}
}

/* Группа ссылок */
.link-group {
	@apply p-4 bg-gray-50 dark:bg-gray-700 rounded-lg;
}

.link-list {
	@apply flex flex-wrap gap-3;
}

.group-link {
	@apply px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors duration-300;

	&.active {
		@apply bg-blue-600 text-white;
	}

	&.disabled {
		@apply opacity-50 cursor-not-allowed hover:bg-transparent;
	}
}

/* Группа кнопок */
.button-group {
	@apply flex flex-wrap gap-3;
}

.btn-example {
	@apply px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105;

	&.primary {
		@apply bg-blue-600 hover:bg-blue-700;
	}

	&.secondary {
		@apply bg-gray-600 hover:bg-gray-700;
	}

	&.outline {
		@apply border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white;
	}
}

/* Адаптивность */
@media (max-width: 640px) {
	.link-grid {
		@apply grid-cols-1 gap-3;
	}

	.link-list {
		@apply flex-col gap-2;
	}

	.button-group {
		@apply flex-col gap-2;
	}

	.btn-example {
		@apply w-full text-center;
	}
}

/* Темная тема поддержка */
.dark {
	.link-example {
		@apply bg-gray-800;
	}

	.example-section h3 {
		@apply text-gray-100;
	}

	.example-section h4 {
		@apply text-gray-200;
	}

	.link-group {
		@apply bg-gray-700;
	}

	.group-link {
		@apply text-gray-300 bg-gray-600 hover:bg-gray-500;
	}
}

/* Интерактивные состояния */
.example-link:hover {
	@apply shadow-lg;
}

.group-link:hover:not(.disabled) {
	@apply shadow-md;
}

.btn-example:hover {
	@apply shadow-lg;
}
</style>
