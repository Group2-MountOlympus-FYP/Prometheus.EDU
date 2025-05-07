'use client'
import { useState, useEffect } from "react";
import { setLanguage, getLanguage } from "@/app/language";
import { getText } from './Language'
import { ActionIcon, Group, Image, Menu, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { reloadWindow } from "@/app/api/General"; 
import classes from "./LanguageSwitcher.module.css";

const data = [
  { label: getText("en"), code: "GB", lang: "en", image: "/lang/gb.png" },
  { label: getText("zh"), code: "CN", lang: "zh", image: "/lang/cn.png" },
];

export function LanguageSwitcher() {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(data[0]);

  // 在组件加载时，根据 getLanguage() 设置默认选中的语言
  useEffect(() => {
    const currentLang = getLanguage();
    const selectedLang = data.find((item) => item.lang === currentLang) || data[0];
    setSelected(selectedLang);
  }, []);

  // 处理语言切换
  const handleLanguageChange = (item: any) => {
    console.log(item.lang)
    setSelected(item.lang); // 更新选中的语言
    setLanguage(item.lang); // 切换语言
    reloadWindow();
  };

  const items = data.map((item) => (
    <Menu.Item
      leftSection={<img src={item.image} width={18} height={18} />}
      onClick={() => handleLanguageChange(item)}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <div className={classes.buttonBox}>
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal = {false}
    >

      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            <img className={classes.circle} src={selected.image} alt={`${selected.label} Flag`} width={22} height={22} />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
    </div>
  );
}