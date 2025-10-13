# Blog-list
Fullstack-приложение, написанное на Vue.js + Nest.js + Prisma/PostgreSQL


## 🚀 Технологии

- **Frontend**: Vue 3, TypeScript, Pinia, Vue Router
- **Backend**: Nest.js, TypeScript, Prisma ORM  
- **Database**: PostgreSQL
- **Authentication**: JWT


## 📦 Установка и запуск

##### Frontend:
1. ___npm install___
2. Создаем .env, заполняем переменную окружения VITE_API_URL - для связи с локальным бэкендом, пример в .env.example
3. Готово 👍

##### Backend:
1. ___npm install___
2. Создаем .env, заполняем переменные, FRONTEND_DOMAIN - для связи с локальным фронтендом, PORT - порт на котором запустится бэкенд, DATABASE_URL - локальная бд, /postgres - юзер, :123456 - пароль, @localhost:5432 - хост + порт, /blogs - название бд, пример в .env.example 
3. БД: Заходим под юзером которого указали в переменной DATABASE_URL,создаем локальную бд, называем ее точно так же, как в переменной DATABASE_URL, указываем порт из переменной DATABASE_URL
4. Применяем миграции prisma: ___npx prisma db push___
5. Готово 👍