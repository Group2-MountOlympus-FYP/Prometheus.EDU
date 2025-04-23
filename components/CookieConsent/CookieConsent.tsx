'use client'
import { Button, Modal } from "@mantine/core";
import { useState, useEffect } from "react"
import style from './CookieConsent.module.css'
import { getLocalStorage, setLocalStorage } from "@/app/api/General";
import { getText } from "./language";
import { useDisclosure } from "@mantine/hooks";

export function CookieConsent(){
    const [showBanner, setShowBanner] = useState(false);
    const [opened, {open, close}] = useDisclosure(false);

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
      setLocalStorage("cookieConsent", "false")
      setShowBanner(false);
    };

    const viewPrivacy = (e:any) => {
      e.preventDefault()
      open()
    }

  return (
    <div className={style.banner} hidden={!showBanner}>
        <table>
            <tbody>
            <tr>
                <td>
                    <p className={style.text}>
                        {getText('cookieDesc')}{" "}
                        <a href="" className={style.link} onClick={viewPrivacy}>
                        {getText('privacy')}
                        </a>
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
        <Modal opened={opened} onClose={close} centered title={getText("privacy")}>
          {getText("privacyContent")}
        </Modal>
    </div>
  );
}