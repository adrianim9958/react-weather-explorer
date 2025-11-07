import { useEffect } from "react";

export default function AdBanner() {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "auto"}}
            data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
            data-ad-slot="1234567890"   // 광고 단위 슬롯 ID
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    );
}
