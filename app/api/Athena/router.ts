/**
 * 向RAG系统发送查询请求
 * @param query 用户查询问题
 * @returns API响应
 */
export async function generateAnswer(query: string) {
    
    // 使用JSON格式而不是form-urlencoded
    // 许多Flask RESTful API更习惯处理JSON数据
    const payload = { query };
    
    // 尝试适应项目现有的API路径模式
    const url = `/backend/athena/generate`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            cache: 'no-cache',
        });
        
        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (errorData.error === "Invalid form data") {
                throw new Error('提交的表单数据无效，请检查查询内容');
            }
            throw new Error(`服务器响应错误: ${response.status} ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        console.error('API 请求失败:', error);
       
        // 重新抛出错误
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('无法连接到后端服务器。请确保 Flask 服务器已启动并运行在 http://localhost:5000');
        }
        throw error;
    }
}

/**
 * 获取不使用RAG的生成回答
 * @param query 用户查询问题
 * @returns API响应
 */
export async function generateWithoutRAG(query: string) {
    // 使用JSON格式
    const payload = { query };
    
    const url = `/backend/athena/generate_without_rag`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            cache: 'no-cache',
        });
        
        return response;
    } catch (error) {
        console.error('非RAG生成请求失败:', error);
        throw error;
    }
}

/**
 * 仅检索相关文档
 * @param query 用户查询问题
 * @returns API响应，包含相关文档
 */
export async function retrieveDocumentsOnly(query: string) {
    // 使用JSON格式
    const payload = { query };
    
    const url = `/backend/athena/retrieve_documents_only`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            cache: 'no-cache',
        });
        
        return response;
    } catch (error) {
        console.error('文档检索请求失败:', error);
        throw error;
    }
}

/**
 * 生成PDF报告
 * @param query 用户查询问题
 * @returns 返回PDF文件流
 */
export async function generateReport(query: string) {
    // 使用JSON格式
    const payload = { query };
    
    const url = `/backend/athena/generate_report`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            cache: 'no-cache',
        });
        
        return response;
    } catch (error) {
        console.error('报告生成请求失败:', error);
        throw error;
    }
}

export default {
    generateAnswer,
    generateWithoutRAG,
    retrieveDocumentsOnly,
    generateReport
};
