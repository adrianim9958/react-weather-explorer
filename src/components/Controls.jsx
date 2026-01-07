import {useEffect, useRef, useState} from "react";

import {Tooltip} from "primereact/tooltip";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {ListBox} from "primereact/listbox";

import {geocode, MAKE_YR_URL} from "../lib/geocode.js";
import {shareToKakao} from "../lib/kakao.js";
import {useAppStore} from "../store/useAppStore.js";

export default function Controls() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const {inputText, setInputText, result, setResult} = useAppStore();

    const [localText, setLocalText] = useState(inputText);
    // 외부에서 전역값이 바뀌면 로컬도 동기화 (예: 테이블 클릭)
    useEffect(() => setLocalText(inputText), [inputText]);

    const commit = () => {
        // 변경되지 않았다면 검색도 안 한다
        const trimmedOld = inputText.trim();
        const trimmedNew = localText.trim();

        if (trimmedOld === trimmedNew) return;

        setInputText(localText);
        onSearch()
            .then((res) => {
            })
            .catch((err) => {
            });
    };

    async function onSearch() {
        if (!localText.trim()) return;

        setLoading(true);
        try {
            const results = await geocode(localText);

            console.log("geocode results:", results);

            if (Array.isArray(results) && results.length > 0) {
                setSuggestions(results);
            } else if (results && !Array.isArray(results)) {
                setSuggestions([results]);
            } else {
                setSuggestions([]);
                toast.current?.show({
                    severity: "warn",
                    summary: "결과 없음",
                    detail: "검색 결과가 없습니다.",
                    life: 1500,
                });
            }

            toast.current?.show({
                severity: "success",
                summary: "완료",
                detail: "좌표를 찾았어요",
                life: 1500,
            });
        } catch (e) {
            toast.current?.show({
                severity: "error",
                summary: "오류",
                detail: e?.message || "검색 실패",
                life: 2200,
            });
        } finally {
            setLoading(false);
        }
    }

    function onSelectSuggestion(e) {
        const selected = e.value;
        if (!selected) return;

        setResult(selected); // 지도 마커 및 이동 트리거
        setInputText(selected.displayName || localText); // 입력창 텍스트 업데이트
        setSuggestions([]); // 리스트 닫기
    }

    function onShare() {
        if (!result) {
            toast.current?.show({
                severity: "warn",
                summary: "공유할 좌표 없음",
                detail: "먼저 좌표를 조회해주세요.",
                life: 1500,
            });
            return;
        }
        const {lat, lon} = result;
        const url = MAKE_YR_URL(lat, lon);
        shareToKakao({lat, lon, title: inputText, url});
    }

    function onChange(e) {
        const {value} = e.target;
        setLocalText(value);
    }

    function onKeyDown(e) {
        if (e.key === "Enter") {
            commit();
        }
    }

    function onClear() {
        setInputText("");
        setLocalText("");
        setSuggestions([]);
        setResult(null);
    }

    function onAddFav() {
        console.log("addFav");
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
                <div className="col-12 lg:col-8 flex flex-column relative">
                    <div className="p-inputgroup gap-1">
                        <Button
                            icon="pi pi-search"
                            severity="secondary"
                            outlined
                            onClick={onAddFav}
                            disabled={true}
                        />

                        <InputText
                            value={localText}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                            placeholder="예: 제주특별자치도 제주시 첨단로 242"
                            className="w-full"
                        />

                        <Button
                            icon="pi pi-times"
                            severity="danger"
                            outlined
                            onClick={onClear}
                            disabled={!inputText}
                            tooltip={!inputText ? "검색어를 먼저 입력하세요" : undefined}
                            tooltipOptions={{
                                position: "mouse",
                                showDelay: 300,
                                hideDelay: 100,
                                showOnDisabled: true,
                            }}
                        />
                    </div>

                    {suggestions.length > 0 && (
                        <div
                            className="shadow-4 surface-overlay border-round overflow-hidden"
                            style={{
                                position: "absolute",
                                top: "100%" /* 입력창 바로 아래 */,
                                left: "5%" /* 부모 div의 왼쪽 끝 */,
                                width: "calc(95% - 0.5rem)" /* grid 시스템의 패딩/간격 고려 조정 */,
                                zIndex: 1000 /* 지도보다 위에 표시 */,
                                marginTop: "4px",
                            }}
                        >
                            <ListBox
                                options={suggestions}
                                optionLabel="displayName"
                                onChange={onSelectSuggestion}
                                className="w-full border-none"
                                listStyle={{maxHeight: "250px"}}
                                // 리스트 내부 항목 디자인 (필요 시)
                                itemTemplate={(option) => (
                                    <div className="flex flex-column py-1">
                    <span className="font-bold text-sm">
                      {option.displayName}
                    </span>
                                        {option.address && (
                                            <small className="text-500">{option.address}</small>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    )}
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
                        tooltip={!inputText ? "검색어를 먼저 입력하세요" : undefined}
                        tooltipOptions={{
                            position: "left",
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
                        tooltip={!result ? "좌표를 먼저 선택하세요" : undefined}
                        tooltipOptions={{
                            position: "left",
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
