import {useEffect, useRef, useState} from 'react';

import {OverlayPanel} from 'primereact/overlaypanel';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';

import {addFav, loadFavs, clearFavs, removeFavByAt, togglePinByAt} from '../lib/favorites.js';
import {useAppStore} from '../store/useAppStore.js';
import {MAKE_YR_URL} from "../lib/geocode";


export default function FavoritesPanel() {
    const op = useRef(null);
    const toast = useRef(null);

    const [list, setList] = useState([]);
    const {result, setResult} = useAppStore();

    useEffect(() => {
        setList(loadFavs());
    }, []);

    function onAdd() {
        if (!result) return;
        try {
            const next = addFav({...result, at: Date.now()});
            setList(next);
            toast.current?.show({severity: 'success', summary: '추가', detail: '즐겨찾기에 추가했어요', life: 1200});
        } catch (e) {
            toast.current?.show({severity: 'warn', summary: '제한', detail: e?.message || '제한됨', life: 2000});
        }
    }

    function onClearAll() {
        confirmDialog({
            message: '고정된 항목을 제외하고 모두 삭제할까요?',
            header: '전체삭제',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const next = clearFavs();
                setList(next);
                toast.current?.show({
                    severity: 'info',
                    summary: '삭제 완료',
                    detail: '고정된 즐겨찾기는 유지되었습니다.',
                    life: 1500
                });
            }
        });
    }

    function onView(item) {
        setResult({lat: item.lat, lon: item.lon, displayName: item.displayName || ''});
        toast.current?.show({severity: 'info', summary: '보기', detail: '지도로 이동합니다', life: 1000});
        op.current?.hide(); // 패널 닫기 (선택)
    }

    function onPin(at) {
        const next = togglePinByAt(at);
        setList(next);
        const pinned = next.find(x => x.at === at)?.pinned;
        toast.current?.show({severity: 'success', summary: pinned ? '고정됨' : '고정 해제', life: 900});
    }

    function onDelete(at) {
        confirmDialog({
            message: '이 즐겨찾기를 삭제할까요?',
            header: '삭제',
            icon: 'pi pi-trash',
            acceptClassName: 'p-button-danger',
            accept: () => {
                setList(removeFavByAt(at));
            }
        });
    }

    return (
        <div className="flex align-items-center justify-content-end gap-2">
            <Toast ref={toast} position="bottom-right"/>
            <ConfirmDialog/>

            <Button size="small" severity="warning" onClick={(e) => op.current.toggle(e)}>
                <i className="pi pi-star-fill mr-2" style={{color: 'var(--yellow-500)'}}/>
                <span>즐겨찾기</span>
            </Button>

            <Button
                icon="pi pi-plus"
                size="small"
                severity="success"
                onClick={onAdd}
                disabled={!result}
                tooltip={!result ? '좌표를 먼저 선택하세요' : undefined}
                tooltipOptions={{
                    position: 'left',
                    showDelay: 300,
                    hideDelay: 100,
                    showOnDisabled: true,
                }}
            />

            <OverlayPanel ref={op} dismissable>
                <header className="flex align-items-center justify-content-between gap-3 mb-2">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-star-fill"/>
                        <span>즐겨찾기</span>
                    </div>
                    <Button size="small" label="전체삭제" onClick={onClearAll} severity="danger" outlined/>
                </header>

                <ul className="m-0 p-0" style={{listStyle: 'none', minWidth: 320}}>
                    {list.length === 0 && <li className="text-500">아직 항목이 없어요</li>}

                    {list.map((it) => (
                        <li key={it.at} className="py-2 border-bottom-1 surface-border">
                            <div className="grid">
                                <div className="col-12 lg:col-3 flex flex-column">
                                    <div className="text-sm">
                                        {it.pinned && <i className="pi pi-thumbtack mr-2" title="고정됨"/>}
                                        {it.displayName || '좌표'}
                                    </div>
                                    <div className="text-xs text-500">
                                        lat {it.lat.toFixed(3)}, lon {it.lon.toFixed(3)}
                                    </div>
                                </div>

                                <div className="col-12 lg:col-9 flex align-items-center justify-content-end gap-2">
                                    <Button
                                        size="small"
                                        label="보기"
                                        icon="pi pi-eye"
                                        severity="primary"
                                        outlined={true}
                                        onClick={() => onView(it)}
                                    />
                                    <Button
                                        size="small"
                                        label={it.pinned ? '고정 해제' : '고정'}
                                        icon="pi pi-thumbtack"
                                        severity="help"
                                        outlined={!it.pinned}
                                        onClick={() => onPin(it.at)}
                                    />
                                    <Button
                                        size="small"
                                        label="삭제"
                                        icon="pi pi-trash"
                                        severity="danger"
                                        outlined={true}
                                        onClick={() => onDelete(it.at)}
                                    />
                                </div>
                            </div>

                            {/* (선택) 바로가기 링크 */}
                            <div className="mt-1">
                                <a className="text-xs" href={MAKE_YR_URL(it.lat, it.lon)} target="_blank"
                                   rel="noreferrer">
                                    YR 날씨 열기
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            </OverlayPanel>
        </div>
    );
}
