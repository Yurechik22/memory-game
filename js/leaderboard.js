const STORAGE_KEY = 'memory-game:leaderboard';
const MAX_RESULTS = 10;

/** Меньше ходов — выше; при равенстве выше более ранняя игра. */
function compareResults(a, b) {
  return a.moves - b.moves || a.date - b.date;
}

function isValidResult(item) {
  return item && Number.isFinite(item.moves) && Number.isFinite(item.date);
}

/** Сохранённые результаты, уже отсортированные. Ошибки хранилища не ломают игру. */
export function loadResults() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isValidResult).sort(compareResults) : [];
  } catch {
    return [];
  }
}

/** Добавляет результат победы и хранит только 10 лучших. */
export function addResult(moves) {
  const results = [...loadResults(), { moves, date: Date.now() }]
    .sort(compareResults)
    .slice(0, MAX_RESULTS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Хранилище недоступно (приватный режим и т. п.) — игра продолжает работать.
  }
  return results;
}

/** Дата в формате ДД.ММ.ГГГГ. */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${date.getFullYear()}`;
}
