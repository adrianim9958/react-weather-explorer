// Netlify Function: /api/geocode?q=주소문자열
export async function handler(event) {
    const q = (event.queryStringParameters?.q || '').trim();
    if (!q) {
        return {statusCode: 400, body: JSON.stringify({error: 'q is required'})};
    }

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '5');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('accept-language', 'ko');

    try {
        const res = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'react-weather-explorer/1.0 (contact: akabongee@gmail.com)',
                'Referer': 'https://react-weather-explorer.netlify.app/'
            }
        });

        if (!res.ok) {
            return {statusCode: res.status, body: JSON.stringify({error: 'nominatim error'})};
        }

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('결과가 없어요. 더 구체적으로 입력해보세요.');
        }

        // const item = data[0];
        // console.log(`geocodeDirect:`, data);
        // return {
        //     lat: parseFloat(item.lat),
        //     lon: parseFloat(item.lon),
        //     displayName: String(item.display_name ?? ''),
        // };

        const results = data.map((item) => ({
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            displayName: String(item.display_name ?? ''),
        }));
        return results;
    } catch (e) {
        return {statusCode: 500, body: JSON.stringify({error: e.message})};
    }
}
