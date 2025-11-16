// 1) 로컬(CRA dev)에서: 브라우저가 Nominatim을 직접 호출
async function geocodeDirect(query) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', String(query || '').trim());
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('accept-language', 'ko');

    const res = await fetch(url.toString(), {
        headers: {Accept: 'application/json'},
    });
    if (!res.ok) throw new Error(`검색 실패: ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('결과가 없어요. 더 구체적으로 입력해보세요.');
    }

    const item = data[0];
    return {
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        displayName: String(item.display_name ?? ''),
    };
}

// 2) 배포(Netlify)에서: Netlify Function(/api/geocode) 호출
async function geocodeViaFunction(query) {
    const url = new URL('/api/geocode', window.location.origin);
    url.searchParams.set('q', String(query || '').trim());

    const res = await fetch(url.toString(), {
        headers: {Accept: 'application/json'},
    });
    if (!res.ok) throw new Error(`검색 실패: ${res.status}`);

    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('결과가 없어요. 더 구체적으로 입력해보세요.');
    }

    const item = arr[0];
    return {
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        displayName: String(item.display_name ?? ''),
    };
}

// 3) 환경에 따라 알아서 분기
// CRA에서는 NODE_ENV를 자동으로 넣어줌: 'development' | 'production' | 'test'
const IS_DEV = process.env.NODE_ENV === 'development';

export async function geocode(query) {
    const q = String(query || '').trim();
    if (!q) {
        throw new Error('검색어를 입력해 주세요.');
    }

    if (IS_DEV) {
        // 로컬: Nominatim 직접 호출
        return geocodeDirect(q);
    }
    // 배포(Netlify): Functions 경유
    return geocodeViaFunction(q);
}

// 기존처럼 쓰고 있는 YR 링크 유틸
export function MAKE_YR_URL(lat, lon) {
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
        return 'https://www.yr.no/';
    }
    // 필요하면 여기 포맷은 이전에 쓰던대로 맞춰서 수정해도 됨
    return `https://www.yr.no/en/forecast/daily-table/${latNum.toFixed(3)},${lonNum.toFixed(3)}`;
}
