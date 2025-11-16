// Netlify Function: /api/geocode?q=주소문자열
export async function handler(event) {
    const q = (event.queryStringParameters?.q || '').trim();
    if (!q) {
        return {statusCode: 400, body: JSON.stringify({error: 'q is required'})};
    }

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
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
        return {
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };
    } catch (e) {
        return {statusCode: 500, body: JSON.stringify({error: e.message})};
    }
}
