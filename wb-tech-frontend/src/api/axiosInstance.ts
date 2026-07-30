import axios from 'axios';

// Базовый URL берётся из .env (VITE_API_BASE_URL)
// Пример: https://<your-project-id>.mockapi.io/api/v1
const baseURL = import.meta.env.VITE_API_BASE_URL as string;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_API_BASE_URL не задан. Создай файл .env на основе .env.example и укажи адрес твоего mockapi.io проекта.'
  );
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Общий обработчик ошибок — приводим ошибку к единому читаемому виду
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Произошла неизвестная ошибка';

    if (error.response) {
      // Сервер ответил с кодом ошибки
      message = `Ошибка сервера: ${error.response.status} ${
        error.response.data?.message || error.response.statusText
      }`;
    } else if (error.request) {
      // Запрос ушёл, но ответа нет
      message = 'Сервер не отвечает. Проверь подключение к интернету или адрес API.';
    } else {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
