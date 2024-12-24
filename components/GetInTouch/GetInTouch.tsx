// components/GetInTouch/GetInTouch.jsx
'use client';

import {useState} from 'react';
import {Button, Group, SimpleGrid, Textarea, TextInput,} from '@mantine/core';
import classes from './GetInTouch.module.css';

export function GetInTouch() {
    const [formData, setFormData] = useState({
        companyName: '',
        contactInfo: '',
        transactionType: '',
        transactionQuantity: '',
        expectedPrice: '',
        transactionDate: '',
        notes: '',
    });

    const handleChange = (field) => (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                alert('提交成功！');
                // 重置表单
                setFormData({
                    companyName: '',
                    contactInfo: '',
                    transactionType: '',
                    transactionQuantity: '',
                    expectedPrice: '',
                    transactionDate: '',
                    notes: '',
                });
            } else {
                alert('提交失败，请重试。');
            }
        } catch (error) {
            console.error('提交错误:', error);
            alert('提交错误，请重试。');
        }
    };

    return (
        <div className={classes.wrapper}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <div className={classes.fields}>
                    <SimpleGrid cols={{base: 1, sm: 2}}>
                        <TextInput
                            label="公司名称"
                            placeholder="公司名称"
                            required
                            value={formData.companyName}
                            onChange={handleChange('companyName')}
                        />
                        <TextInput
                            label="联系方式"
                            placeholder="hello@email.com"
                            required
                            value={formData.contactInfo}
                            onChange={handleChange('contactInfo')}
                        />
                    </SimpleGrid>

                    <SimpleGrid cols={{base: 1, sm: 2}}>
                        <TextInput
                            label="交易种类"
                            placeholder="CCER"
                            required
                            value={formData.transactionType}
                            onChange={handleChange('transactionType')}
                        />
                        <TextInput
                            label="交易数量（吨）"
                            placeholder="10"
                            required
                            value={formData.transactionQuantity}
                            onChange={handleChange('transactionQuantity')}
                        />
                    </SimpleGrid>

                    <TextInput
                        mt="md"
                        label="预期交易价格（当前市场价：配额（CEA）100元/吨，CCER 90元/吨）"
                        placeholder="100"
                        required
                        value={formData.expectedPrice}
                        onChange={handleChange('expectedPrice')}
                    />
                    <TextInput
                        mt="md"
                        label="交易时间"
                        placeholder="2024-11-09"
                        required
                        value={formData.transactionDate}
                        onChange={handleChange('transactionDate')}
                    />

                    <Textarea
                        mt="md"
                        label="备注"
                        placeholder="备注信息"
                        minRows={3}
                        value={formData.notes}
                        onChange={handleChange('notes')}
                    />

                    <Group position="right" mt="md">
                        <Button type="submit" className={classes.control}>
                            提交
                        </Button>
                    </Group>
                </div>
            </form>
        </div>
    );
}