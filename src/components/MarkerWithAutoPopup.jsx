import {useEffect, useRef} from 'react';
import {Marker, Popup, useMap} from 'react-leaflet';
import {Button} from 'primereact/button';
import L from 'leaflet';

import {MAKE_YR_URL} from "../lib/geocode";

export default function MarkerWithAutoPopup({position, displayName, onCopy}) {
    const markerRef = useRef(null);
    const map = useMap();

    const getPosition = (position) => {
        if (position === null || position === undefined) return "";
        else return position.toFixed(6)
    }

    useEffect(() => {
        if (!position) return;

        // 1) 클릭 좌표를 LatLng로 만들고 → 화면 픽셀 좌표로 변환
        const latLng = L.latLng(position[0], position[1]);
        const pt = map.latLngToContainerPoint(latLng);

        // 2) 화면 중심보다 '살짝 아래'에 보이도록 Y를 줄여서(=위로 올려서) 재계산
        //    비율 기반(뷰포트 높이의 30%) + 최소/최대 클램프
        const viewH = map.getSize().y;
        const offsetY = Math.max(50, Math.min(160, Math.round(viewH * 0.3)));

        const adjustedPt = L.point(pt.x, pt.y - offsetY);
        const adjustedLatLng = map.containerPointToLatLng(adjustedPt);

        // 3) 부드럽게 이동 (현재 줌 유지)
        map.flyTo(adjustedLatLng, map.getZoom(), {duration: 0.6});

        // 4) 팝업 자동 오픈
        setTimeout(() => markerRef.current?.openPopup(), 60);
    }, [position, map]);


    return (
        <Marker position={position} ref={markerRef}>
            <Popup autoPan={true}>
                <div
                    style={{
                        minWidth: 160,
                        padding: '8px 10px',
                        lineHeight: 1.6,
                        fontSize: '0.9rem',
                        color: '#2d2d2d',
                        textAlign: 'center'
                    }}
                >
                    <div className="flex justify-content-between align-items-center gap-2 mb-2">
                        <Button
                            icon="pi pi-copy"
                            severity="secondary"
                            aria-label="Copy"
                            size="small"
                            text
                            rounded
                            onClick={() => onCopy(position[0], position[1])}
                            tooltip="좌표 복사"
                            tooltipOptions={{position: 'top'}}
                        />
                        <b>{displayName || '선택한 좌표'}</b>
                    </div>

                    <div
                        style={{
                            fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace',
                            background: '#f6f7f9',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            padding: '8px 10px',
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
                            textAlign: 'center',
                        }}
                    >
                        <div>lat: {getPosition(position[0])}</div>
                        <div>lon: {getPosition(position[1])}</div>
                    </div>

                    <a
                        href={MAKE_YR_URL(position[0], position[1])}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: 'inline-block',
                            marginTop: 10,
                            color: '#007ad9',
                            fontWeight: 500,
                            textDecoration: 'none'
                        }}
                    >
                        ☀️ YR 날씨 열기
                    </a>
                </div>
            </Popup>
        </Marker>
    );
}