import axios from 'axios'

// Базовый URL сервиса перевода.
// При необходимости замените на свой backend или другой API.
// Например, можно использовать собственный сервер‑обёртку над любым переводчиком.
const TRANSLATE_API_URL = 'https://libretranslate.de/translate'

// Соответствие внутренних кодов языка кодам сервиса перевода.
const LANGUAGE_CODE_MAP = {
  kk: 'kk',
  ru: 'ru',
  en: 'en',
}

/**
 * Переводит текст с помощью внешнего API.
 * Минимальная реализация, чтобы сохранить смысл текста.
 *
 * @param {string} text        Оригинальный текст
 * @param {string} sourceLang  'kk' | 'ru' | 'en' и т.п.
 * @param {string} targetLang  'kk' | 'ru' | 'en' и т.п.
 * @returns {Promise<string>}  Переведённый текст или исходный при ошибке
 */
export async function translateText(text, sourceLang, targetLang) {
  if (!text || sourceLang === targetLang) {
    return text
  }

  const source = LANGUAGE_CODE_MAP[sourceLang] || sourceLang
  const target = LANGUAGE_CODE_MAP[targetLang] || targetLang

  try {
    const response = await axios.post(
      TRANSLATE_API_URL,
      {
        q: text,
        source,
        target,
        format: 'text',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Если ваш API требует ключ, добавьте его здесь:
          // 'Authorization': 'Bearer ВАШ_API_КЛЮЧ',
        },
      }
    )

    if (response.data && response.data.translatedText) {
      return response.data.translatedText
    }

    return text
  } catch (error) {
    console.error('Translation API error:', error)
    return text
  }
}

