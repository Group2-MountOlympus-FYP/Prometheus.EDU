'use client'
import { Button } from "@mantine/core";
import { useState, useEffect } from "react"
import style from './CookieConsent.module.css'
import { getLocalStorage, setLocalStorage } from "@/app/api/General";
import { getText } from "./language";

export function CookieConsent(){
    const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 页面加载时检测是否已经同意
    const consent = getLocalStorage('cookieConsent')
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    // 用户同意，记录同意状态
    setLocalStorage("cookieConsent", "true")
    setShowBanner(false);
  };

  const handleDecline = () => {
    //console.log("用户拒绝了 Cookie");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
}

  return (
    <div className={style.banner}>
        <table>
            <tbody>
            <tr>
                <td>
                    <p className={style.text}>
                        {getText('cookieDesc')}{" "}
                        <a href="/privacy" className={style.link}>
                        {getText('privacy')}
                        </a>。
                    </p>
                </td>
                <td className={style.buttons}>
                    <Button onClick={handleAccept} className={style.accept}>
                        {getText('agree')}
                    </Button>
                </td>
                <td className={style.buttons}>
                    <Button onClick={handleDecline} className={style.decline}>
                        {getText('decline')}
                    </Button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
  );
}