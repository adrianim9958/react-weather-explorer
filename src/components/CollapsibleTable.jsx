import {useMemo, useRef, useState} from 'react';

import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {FilterMatchMode} from 'primereact/api';

import {geocode} from "../lib/geocode.js";
import {useAppStore} from '../store/useAppStore.js';

export function CollapsibleTable({title, data, selectedKey, onSelect}) {
    const toast = useRef(null);

    const [collapsed, setCollapsed] = useState(false);
    const [global, setGlobal] = useState('');
    const [filters, setFilters] = useState({
        global: {value: '', matchMode: FilterMatchMode.CONTAINS},
        name: {value: null, matchMode: FilterMatchMode.CONTAINS},
        address: {value: null, matchMode: FilterMatchMode.CONTAINS},
    });

    const {setInputText, setResult} = useAppStore();

    const selectionObj = useMemo(
        () => data.find(r => r.key === selectedKey) || null,
        [data, selectedKey]
    );

    async function handleSelect(row) {
        const query = row?.name || row?.address || '';
        if (!query) return;

        setInputText(query); // Controls 입력창에 반영

        try {
            const r = await geocode(query); // 즉시 지오코딩
            setResult(r);
            toast.current?.show({severity: 'success', summary: '좌표 조회', detail: '지도로 이동합니다', life: 1000});
        } catch (e) {
            toast.current?.show({severity: 'error', summary: '검색 실패', detail: e?.message || '좌표를 찾지 못했어요', life: 1800});
        }
    }

    const onGlobalChange = (val) => {
        setGlobal(val);
        setFilters((f) => ({...f, global: {value: val, matchMode: FilterMatchMode.CONTAINS}}));
    };

    const onRowSelect = (e) => {
        if (!e.value) {
            onSelect?.(null);
            return;
        }
        onSelect?.(e.value.key)
        handleSelect(e.value);
    }

    return (
        <div className="card p-0 surface-card" style={{overflow: 'hidden'}}>
            <div
                className="grid align-items-center p-3 border-bottom-1 surface-border"
                aria-expanded={!collapsed}
                title={collapsed ? '펼치기' : '접기'}
            >
                <div className="col-3 flex align-items-center gap-2 cursor-pointer"
                     aria-expanded={!collapsed}
                     aria-controls="dt-collapsible-table"
                     aria-haspopup="true"
                     onClick={() => setCollapsed((v) => !v)}
                >
                    <i className={`pi ${collapsed ? 'pi-angle-right' : 'pi-angle-down'}`}/>
                    <span className="font-semibold">{title}</span>
                </div>

                <div className="col-9 p-inputgroup ">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-filter"></i>
                    </span>
                    <InputText
                        value={global}
                        onChange={(e) => onGlobalChange(e.target.value)}
                        placeholder="이름/주소 검색"
                    />
                    <span className="p-inputgroup-addon" onClick={() => onGlobalChange("")}>
                        <i className="pi pi-times" style={{color: 'var(--red-500)'}}></i>
                    </span>

                </div>
            </div>

            {/* 본문: 접힘 시 숨김 */}
            {!collapsed && (
                <DataTable
                    value={data}
                    dataKey="key"
                    size="small"
                    scrollable
                    scrollHeight="340px"
                    filters={filters}
                    globalFilterFields={['name', 'address']}
                    emptyMessage="결과가 없어요"
                    selectionMode="single"
                    selection={selectionObj}
                    onSelectionChange={onRowSelect}
                    className="selectable-table"
                >
                    <Column field="name" header="이름" sortable/>
                    <Column field="address" header="주소"/>
                    <Column
                        field="height"
                        header="높이"
                        body={(r) => (r.height != null ? r.height.toLocaleString() + ' m' : '')}
                        style={{textAlign: 'right', width: '8rem'}}
                        sortable={true}
                    />
                </DataTable>
            )}
        </div>
    );
}
