import {useEffect, useRef} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from 'react-leaflet';
import {Button} from 'primereact/button';

import {useAppStore} from '../store/useAppStore.js';

const YR = (lat, lon) =>
    `https://www.yr.no/en/forecast/daily-table/${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;

// 지도 클릭 시 전역 상태에 좌표 저장
function ClickHandler() {
    const setResult = useAppStore(s => s.setResult);
    useMapEvents({
        click(e) {
            setResult({lat: e.latlng.lat, lon: e.latlng.lng, displayName: ''});
        }
    });
    return null;
}

// result가 바뀔 때마다 지도 이동 + 팝업 자동 오픈
function MarkerWithAutoPopup({position, displayName}) {
    const markerRef = useRef(null);
    const map = useMap();

    useEffect(() => {
        if (!position) return;
        // 지도 부드럽게 이동 (줌은 유지)
        map.flyTo(position, map.getZoom(), {duration: 0.6});
        // 마커 팝업 열기
        // react-leaflet v4: markerRef.current?.openPopup()
        // (ref에는 Leaflet Marker 인스턴스가 들어옴)
        const m = markerRef.current;
        if (m && m.openPopup) m.openPopup();
    }, [position?.[0], position?.[1]]); // lat/lon 변할 때만

    return (
        <Marker position={position} ref={markerRef}>
            <Popup autoPan={true}>
                <b>{displayName || '선택한 좌표'}</b><br/>
                lat: {position[0]}<br/>
                lon: {position[1]}<br/>
                <a href={YR(position[0], position[1])} target="_blank" rel="noreferrer">YR 날씨 열기</a>
            </Popup>
        </Marker>
    );
}

export default function MapView() {
    const {result, setResult, setInputText} = useAppStore();
    const center = [37.5665, 126.978]; // 초기 서울

    const pos = result ? [result.lat, result.lon] : null;

    const onDelete = () => {
        setResult(null)
        setInputText("")
    }

    return (
        <div className="flex flex-column gap-2">
            <div className="flex justify-content-end">
                <Button label="선택삭제" severity="danger" size="small" disabled={!result} onClick={onDelete}/>
            </div>
            <MapContainer center={center} zoom={11} style={{height: 480}}>
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickHandler/>
                {pos && <MarkerWithAutoPopup position={pos} displayName={result?.displayName}/>}
            </MapContainer>
        </div>
    );
}
