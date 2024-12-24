'use client'
import {IconArrowDownRight, IconArrowUpRight, IconCoin, IconDiscount2, IconUserPlus,} from '@tabler/icons-react';
import {Group, Paper, SimpleGrid, Text} from '@mantine/core';
import classes from './StatsGrid.module.css';
import {useEffect, useState} from "react";

const icons = {
    user: IconUserPlus,
    discount: IconDiscount2,
    coin: IconCoin,
};

// 定义 DataItem 接口
interface DataItem {
    title: string;
    icon: string;
    value: string;
    diff: number;
}


export function StatsGrid() {
    // 使用 useState 声明 data 状态
    const [data, setData] = useState<DataItem[]>([]);

    useEffect(() => {
        // 定义异步函数获取 HTML 内容
        async function fetchJson() {
            try {
                // 请求 API 路由
                const response = await fetch('/api/prodinf');
                if (!response.ok) {
                    throw new Error('请求失败');
                }
                const jsonData = await response.json();
                // 使用获取的 jsonData 构造 data 对象
                const newData = [
                    {
                        title: '最高价',
                        icon: 'coin',
                        value: jsonData.today.highLimit, // 假设 jsonData 包含这些字段
                        diff: jsonData.today.highLimit - jsonData.yesterday.highLimit,
                    },
                    {
                        title: '最低价',
                        icon: 'discount',
                        value: jsonData.today.lowLimit,
                        diff: jsonData.today.lowLimit - jsonData.yesterday.lowLimit,
                    },
                    {
                        title: '现价',
                        icon: 'user',
                        value: jsonData.today.lastPrice,
                        diff: jsonData.today.lastPrice - jsonData.yesterday.lastPrice,
                    },
                ];

                // 更新 data 状态
                setData(newData);

            } catch (error) {
                console.error("API 请求错误:", error);
            }
        }

        fetchJson(); // 调用 fetchJson 函数

    }, []);

    const stats = data.map((stat) => {
        const Icon = icons[stat.icon];
        const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group justify="space-between">
                    <Text size="xs" c="dimmed" className={classes.title}>
                        {stat.title}
                    </Text>
                    <Icon className={classes.icon} size="1.4rem" stroke={1.5}/>
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text className={classes.value}>{stat.value}</Text>
                    <Text c={stat.diff > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
                        <span>{stat.diff}%</span>
                        <DiffIcon size="1rem" stroke={1.5}/>
                    </Text>
                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    较前一天相比
                </Text>
            </Paper>
        );
    });
    return (
        <div className={classes.root}>
            <SimpleGrid cols={{base: 1, xs: 2, md: 3}}>{stats}</SimpleGrid>
        </div>
    );
}
