# WB-Tech Frontend — тестовое задание для стажёров

Приложение для управления пользователями: список с пагинацией, создание/редактирование
через модальное окно, страница детальной информации. Данные хранятся на бесплатном
API-сервисе [mockapi.io](https://mockapi.io).

## Стек

- React 19 + TypeScript
- Vite
- axios — HTTP-запросы
- react-router-dom — навигация (список / деталка)
- Redux Toolkit + встроенные thunk'и (`createAsyncThunk`) — состояние и запросы к API
- redux-persist — сохранение текущей страницы пагинации между перезагрузками
- MUI (Material UI) — компоненты интерфейса
- Обработка ошибок — единый интерсептор axios + вывод ошибок в UI (Alert)

## Структура проекта

```
src/
  api/
    axiosInstance.ts   # настройка axios + обработка ошибок
    usersApi.ts        # CRUD-запросы к mockapi.io
  store/
    store.ts           # конфигурация redux + persist
    usersSlice.ts       # слайс с thunk'ами (загрузка, создание, правка, удаление)
    hooks.ts           # типизированные useAppDispatch/useAppSelector
  components/
    UserTable.tsx       # таблица пользователей
    UserFormModal.tsx   # модалка создания/редактирования
    ErrorBanner.tsx     # вывод ошибок
  pages/
    UsersListPage.tsx    # страница №1: список + пагинация + модалка
    UserDetailPage.tsx   # страница №2: детальная информация
  types/
    user.ts
```

## 1. Настройка mockapi.io

1. Зайти на https://mockapi.io и зарегистрироваться (можно через Google).
2. Создать новый проект (New Project).
3. Внутри проекта создать ресурс с именем **users** и следующей схемой полей:
   - `name` — string
   - `email` — string
   - `phone` — string
   - `city` — string
   - `position` — string
   - `avatar` — string (можно использовать шаблон `https://i.pravatar.cc/150?u={{random_number}}` при генерации моковых данных)
4. Можно сразу сгенерировать несколько тестовых записей через интерфейс mockapi (кнопка генерации моковых данных), чтобы список не был пустым.
5. Скопировать базовый URL проекта — он выглядит так:
   `https://<ваш-id-проекта>.mockapi.io/api/v1`

## 2. Локальный запуск

```bash
git clone <ссылка-на-репозиторий>
cd wb-tech-frontend
npm install

# скопировать пример .env и подставить свой адрес mockapi.io
cp .env.example .env
# отредактировать .env:
# VITE_API_BASE_URL=https://<ваш-id-проекта>.mockapi.io/api/v1

npm run dev
```

Приложение откроется на `http://localhost:5173`.

## 3. Сборка

```bash
npm run build
npm run preview
```

## 4. Деплой (Vercel — бесплатно и без CLI)

1. Запушить проект на GitHub (см. ниже).
2. Зайти на https://vercel.com → Add New → Project → импортировать репозиторий с GitHub.
3. В настройках проекта (Environment Variables) добавить переменную:
   - `VITE_API_BASE_URL` = `https://<ваш-id-проекта>.mockapi.io/api/v1`
4. Framework Preset — Vercel сам определит **Vite**. Build command: `npm run build`,
   Output directory: `dist`.
5. Deploy. В репозитории уже есть `vercel.json` с rewrite-правилом для корректной
   работы клиентского роутинга (react-router-dom).

### Альтернатива — Netlify

1. https://app.netlify.com → Add new site → Import an existing project.
2. Build command: `npm run build`, Publish directory: `dist`.
3. Site settings → Environment variables → добавить `VITE_API_BASE_URL`.
4. В репозитории уже есть `public/_redirects` для корректной работы роутинга.

## 5. Публикация на GitHub

```bash
git init
git add .
git commit -m "WB-Tech test task: users CRUD app"
git branch -M main
git remote add origin https://github.com/<ваш-логин>/<имя-репозитория>.git
git push -u origin main
```

После этого:
- ссылку на репозиторий и ссылку на задеплоенное приложение приложить к заданию.

## Реализованный функционал по чек-листу задания

- [x] Страница списка пользователей: таблица + пагинация (запрос параметров `page`/`limit`
  к mockapi.io, общее количество берётся из заголовка `x-total-count`)
- [x] Кнопка «Добавить пользователя» → модальное окно с формой создания
- [x] Редактирование пользователя через то же модальное окно (кнопка в строке таблицы)
- [x] Удаление пользователя (доп. функциональность, не мешает основным требованиям)
- [x] Переход по клику на пользователя → страница детальной информации
- [x] React + TypeScript
- [x] axios для запросов к API
- [x] react-router-dom для навигации между страницами
- [x] redux + redux-toolkit + thunk (`createAsyncThunk`)
- [x] redux-persist (персистится страница пагинации)
- [x] MUI как UI-библиотека
- [x] Обработка ошибок — единый interceptor в axios + Alert-компоненты в UI на всех
  этапах (загрузка списка, загрузка деталей, создание/редактирование, валидация формы)

## Возможные доработки

- Дебаунс/поиск по пользователям
- Сортировка колонок таблицы
- Оптимистичные обновления в redux
- Разбиение бандла на чанки (code-splitting)
