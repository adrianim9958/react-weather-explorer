import {useRef} from 'react';
import {MapContainer, TileLayer, useMapEvents} from 'react-leaflet';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';

import MarkerWithAutoPopup from "./MarkerWithAutoPopup";

import {useAppStore} from '../store/useAppStore.js';


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


export default function MapView() {
    const toast = useRef(null);

    const {result, setResult, setInputText} = useAppStore();
    const center = [37.5665, 126.978]; // 초기 서울

    const pos = result ? [result.lat, result.lon] : null;

    const onDelete = () => {
        setResult(null)
        setInputText("")
    }

    const onCopy = async (lat, lon) => {
        const text = `lat:${lat.toFixed(6)}, lon:${lon.toFixed(6)}`;
        try {
            await navigator.clipboard.writeText(text);

            toast.current?.show({
                severity: 'success',
                summary: '복사되었습니다',
                detail: text,
                life: 1500,
            });
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
    }

    return (
        <div className="flex flex-column gap-2">
            <Toast ref={toast} position="bottom-right"/>

            {result && (
                <div className="flex justify-content-end">
                    <Button label="선택해제" severity="danger" size="small" disabled={!result} onClick={onDelete}
                            icon="pi pi-times" outlined={true}/>
                </div>
            )}

            <MapContainer center={center} zoom={11} style={{height: 480}}>
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickHandler/>
                {pos && <MarkerWithAutoPopup position={pos} displayName={result?.displayName} onCopy={onCopy}/>}
            </MapContainer>
        </div>
    );
}
