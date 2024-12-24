// 例如在管理页面 components/AdminPanel.jsx
'use client';

import {Button} from '@mantine/core';

export function AdminPanel() {
    const handleExport = () => {
        window.open('/api/submissions/export', '_blank');
    };

    return (
        <div>
            <Button onClick={handleExport}>导出为 Excel</Button>
            {/* 其他管理内容 */}
        </div>
    );
}