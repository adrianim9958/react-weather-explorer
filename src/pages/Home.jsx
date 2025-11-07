import {Divider} from 'primereact/divider';


import Controls from '../components/Controls.jsx';
import MapView from '../components/MapView.jsx';
import FavoritesPanel from '../components/FavoritesPanel.jsx';
import TablesSection from "../components/TablesSection.jsx";

export default function Home() {
    return (
        <div className="p-3 flex flex-column gap-3 w-full">
            <div className="grid">
                <div className="col-12 lg:col-9">
                    <h2 className="m-0">날씨 탐색 프로그램</h2>
                </div>
                <div className="col-12 lg:col-3">
                    <FavoritesPanel/>
                </div>
            </div>

            <div className="grid">
                <div className="col-12">
                    <Controls/>
                </div>
            </div>

            <div className="grid">
                <div className="col-12">
                    <MapView/>
                </div>
            </div>

            <Divider/>

            <TablesSection/>

            <Divider/>

            <div className="footer">
                <div className="text-center">
                    Tip: 엔터키로도 검색돼요. 좌표를 클릭-복사해 다른 앱에 붙여넣기!
                </div>
                <div className="text-center">
                    데이터 출처: OpenStreetMap © 기여자 • Nominatim API(가벼운 개인용도 권장)
                </div>
                <div className="text-center">
                    Copyright© 2025 Adrian. All right reserved.
                </div>
            </div>

            <Divider/>


        </div>
    );
}
