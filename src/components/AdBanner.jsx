// src/components/AdBanner.jsx
import { useEffect, useRef } from "react";

/**
 * AdSense banner with re-init guards
 * - dev에서는 data-adtest="on"으로 테스트(실제 노출 X)
 * - 동일 ins에 2번 push 방지
 * - StrictMode/리렌더 대비
 */
export default function AdBanner({
                                     slot = "1234567890",       // 실제 data-ad-slot 로 교체
                                     format = "auto",
                                     responsive = "true",
                                     test = process.env.NODE_ENV !== "production",
                                     className,
                                     style,
                                     keySeed,                    // 라우팅 등으로 새 슬롯 강제생성하려면 바꿔주기
                                 }) {
    const insRef = useRef(null);
    const pushedRef = useRef(false); // 같은 컴포넌트에서 중복 push 방지

    useEffect(() => {
        const el = insRef.current;
        if (!el) return;

        // 이미 채워진 슬롯이면(AdSense가 붙이면 data-adsbygoogle-status="done"을 셋팅)
        const alreadyDone = el.getAttribute("data-adsbygoogle-status") === "done";
        if (alreadyDone || pushedRef.current) return;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushedRef.current = true;
        } catch (err) {
            // 동일 슬롯로 재초기화 시 여기서 에러가 나는데, 무시해도 OK
            // 필요하면 console.warn으로만 남기세요.
            // console.warn("AdSense push error:", err);
        }
    }, [keySeed]); // 페이지/경로 변화 시 새로 밀고 싶으면 keySeed 변경

    return (
        <ins
            ref={insRef}
            className={`adsbygoogle ${className || ""}`}
            style={{ display: "block", ...(style || {}) }}
            data-ad-client="ca-pub-5238834608291165"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive}
            {...(test ? { "data-adtest": "on" } : {})}
        />
    );
}
