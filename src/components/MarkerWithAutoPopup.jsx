import {useEffect, useRef} from 'react';
import {Marker, Popup, useMap} from 'react-leaflet';
import {Button} from 'primereact/button';

import {MAKE_YR_URL} from "../lib/geocode";

export default function MarkerWithAutoPopup({position, displayName, onCopy}) {
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
                        <div>lat: {position[0].toFixed(6)}</div>
                        <div>lon: {position[1].toFixed(6)}</div>
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