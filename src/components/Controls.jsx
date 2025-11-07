import {useState, useRef, useEffect, useMemo} from 'react';

import {Tooltip} from 'primereact/tooltip';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';

import {geocode, MAKE_YR_URL} from '../lib/geocode.js';
import {shareToKakao} from "../lib/kakao.js";
import {useAppStore} from '../store/useAppStore.js';

export default function Controls() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const {inputText, setInputText, result, setResult} = useAppStore();


    const [localText, setLocalText] = useState(inputText);
    // 외부에서 전역값이 바뀌면 로컬도 동기화 (예: 테이블 클릭)
    useEffect(() => setLocalText(inputText), [inputText]);

    const commit = () => {
        setInputText(localText);
        onSearch()
            .then((res) => {
            })
            .catch((err) => {
            })
    }


    async function onSearch() {
        if (!localText.trim()) return;

        setLoading(true);
        try {
            const r = await geocode(localText);
            setResult(r);
            toast.current?.show({
                severity: 'success',
                summary: '완료',
                detail: '좌표를 찾았어요',
                life: 1500,
            });
        } catch (e) {
            toast.current?.show({
                severity: 'error',
                summary: '오류',
                detail: e?.message || '검색 실패',
                life: 2200,
            });
        } finally {
            setLoading(false);
        }
    }

    function onShare() {
        if (!result) {
            toast.current?.show({
                severity: 'warn',
                summary: '공유할 좌표 없음',
                detail: '먼저 좌표를 조회해주세요.',
                life: 1500,
            });
            return;
        }
        const {lat, lon} = result;
        const url = MAKE_YR_URL(lat, lon)
        shareToKakao({lat, lon, title: inputText, url});
    }

    function onChange(e) {
        const {value} = e.target;
        setLocalText(value);
    }

    function onKeyDown(e) {
        if (e.key === 'Enter') {
            commit();
        }
    }

    function onClear() {
        setInputText('');
    }

    function onAddFav() {
        console.log('addFav');
    }

    return (
        <div className="p-3 border-bottom-1 surface-border flex flex-column gap-2">
            <Toast ref={toast} position="top-left"/>
            <Tooltip
                target=".add-fav-btn"
                position="top"
                event="both"
                showDelay={300}
                hideDelay={100}
                appendTo="body"
            />

            <div className="grid align-items-center">
                <div className="p-inputgroup col-12 lg:col-8 gap-1">
                    <Button icon="pi pi-search"
                            severity="secondary"
                            outlined
                            onClick={onAddFav}
                            disabled={true}
                    />

                    <InputText
                        value={localText}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        onBlur={commit}
                        placeholder="예: 제주특별자치도 제주시 첨단로 242"
                        className="w-full"
                    />

                    <Button
                        icon="pi pi-times"
                        severity="danger"
                        outlined
                        onClick={onClear}
                        disabled={!inputText}
                        tooltip={!inputText ? '검색어를 먼저 입력하세요' : undefined}
                        tooltipOptions={{
                            position: 'mouse',
                            showDelay: 300,
                            hideDelay: 100,
                            showOnDisabled: true,
                        }}
                    />
                </div>

                <div className="col-12 lg:col flex justify-content-end align-items-end gap-2">
                    <Button
                        icon="pi pi-search"
                        size="small"
                        severity="primary"
                        label="좌표 조회"
                        outlined={true}
                        onClick={onSearch}
                        loading={loading}
                        disabled={!inputText.trim()}
                        tooltip={!inputText ? '검색어를 먼저 입력하세요' : undefined}
                        tooltipOptions={{
                            position: 'left',
                            showDelay: 300,
                            hideDelay: 100,
                            showOnDisabled: true,
                        }}
                    />

                    <Button
                        icon="pi pi-share-alt"
                        size="small"
                        label="공유"
                        outlined={true}
                        severity="warning"
                        //style={{backgroundColor:'var(--yellow-500)', color: 'var(--gray-900)', border: '1px solid var(--yellow-500)'}}
                        onClick={onShare}
                        disabled={!result}
                        tooltip={!result ? '좌표를 먼저 선택하세요' : undefined}
                        tooltipOptions={{
                            position: 'left',
                            showDelay: 300,
                            hideDelay: 100,
                            showOnDisabled: true,
                        }}
                    />

                    {/*<Button label="예시" severity="secondary" onClick={() => setInputText('제주특별자치도 제주시 첨단로 242')}/>*/}
                </div>
            </div>
        </div>
    );
}
