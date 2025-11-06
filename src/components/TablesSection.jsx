import {useState} from "react";

import {CollapsibleTable} from "./CollapsibleTable.jsx";

import {BLACKYAK_DATA} from '../data/blackyak.js';
import {NATIONAL_DATA} from '../data/national.js';

export default function TablesSection() {
    const [selected, setSelected] = useState({source: null, key: null});

    return (
        <div className="grid">
            <div className="col-12 lg:col-6">
                <CollapsibleTable
                    title="블랙야크"
                    data={BLACKYAK_DATA}
                    selectedKey={selected.source === 'yak' ? selected.key : null}
                    onSelect={(key) => setSelected(key ? {source: 'yak', key} : {source: null, key: null})}
                />
            </div>
            <div className="col-12 lg:col-6">
                <CollapsibleTable
                    title="국립공원"
                    data={NATIONAL_DATA}
                    selectedKey={selected.source === 'nat' ? selected.key : null}
                    onSelect={(key) => setSelected(key ? {source: 'nat', key} : {source: null, key: null})}
                />
            </div>
        </div>
    );
}