// src/lib/favorites.js
const KEY = 'mtw_favs_v1';
const MAX = 10;

function normalize(list) {
    return (list || []).map((x) => ({ ...x, pinned: !!x.pinned }));
}
function sortFavs(list) {
    // 고정(true) 우선, 그다음 최신 순(at 내림차순)
    return [...list].sort((a, b) => (b.pinned - a.pinned) || ((b.at || 0) - (a.at || 0)));
}

export function loadFavs() {
    try {
        const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
        return sortFavs(normalize(raw));
    } catch {
        return [];
    }
}
export function saveFavs(list) {
    localStorage.setItem(KEY, JSON.stringify(sortFavs(normalize(list || []))));
}
export function addFav(item) {
    const list = loadFavs();
    if (list.length >= MAX) throw new Error(`즐겨찾기는 최대 ${MAX}개까지 가능합니다.`);
    const withMeta = { ...item, at: item.at || Date.now(), pinned: !!item.pinned };
    list.unshift(withMeta);
    saveFavs(list);
    return loadFavs();
}

export function clearFavs() {
    // 고정된 즐겨찾기는 유지하고, 나머지만 삭제
    const list = loadFavs().filter(x => x.pinned);
    saveFavs(list);
    return list;
}

export function removeFavByAt(at) {
    const list = loadFavs().filter((x) => x.at !== at);
    saveFavs(list);
    return loadFavs();
}

export function togglePinByAt(at) {
    const list = loadFavs();
    const i = list.findIndex((x) => x.at === at);
    if (i >= 0) list[i] = { ...list[i], pinned: !list[i].pinned };
    saveFavs(list);
    return loadFavs();
}
