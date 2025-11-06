export function ensureKakao(appKey) {
    const K = window.Kakao;
    if (!K) return false;
    if (!K.isInitialized?.()) {
        if (!appKey) return false;
        K.init(appKey);
    }
    return true;
}

export function shareToKakao({lat, lon, title, url}) {
    window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: title || '선택한 좌표',
            description: `lat: ${lat}\nlon: ${lon}`,
            imageUrl: 'https://developers.kakao.com/assets/img/og_image.png',
            link: {mobileWebUrl: url, webUrl: url}
        },
        buttons: [{title: 'YR 날씨 열기', link: {mobileWebUrl: url, webUrl: url}}]
    });
}
