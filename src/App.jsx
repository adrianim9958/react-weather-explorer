import {useEffect} from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {PrimeReactProvider, PrimeReactContext} from 'primereact/api';

import './App.css';

import Home from './pages/Home.jsx';
import {ensureKakao} from "./lib/kakao.js";

export default function App() {
    useEffect(() => {
        const appKey = process.env.REACT_APP_KAKAO_JS_KEY;
        const checkReady = () => {
            if (window.Kakao) ensureKakao(appKey);
            else setTimeout(checkReady, 300); // 0.3초마다 재시도
        };
        checkReady();
    }, []);

    return (
        <PrimeReactProvider value={{ unstyled: false }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </BrowserRouter>3
        </PrimeReactProvider>
    );
}
