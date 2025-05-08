import { Fetch } from "@/app/api/General";

/**
 * 向RAG系统发送查询请求
 * @param query 用户查询问题
 * @returns API响应
 */
export async function generateAnswer(query: string) {
    const payload = { query };
    const url = `/backend/athena/generate`;

    try {
        const response = await Fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (errorData.error === "Invalid form data") {
                throw new Error('Invalid form data. Please check your query content.');
            }
            throw new Error(`Server response error: ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('API request failed:', error);

        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to backend server. Please ensure the Flask server is running at http://localhost:5000');
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
    const payload = { query };
    const url = `/backend/athena/generate_without_rag`;

    try {
        const response = await Fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Server response error: ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('Non-RAG generation request failed:', error);
        throw error;
    }
}

/**
 * 仅检索相关文档
 * @param query 用户查询问题
 * @returns API响应，包含相关文档
 */
export async function retrieveDocumentsOnly(query: string) {
    const payload = { query };
    const url = `/backend/athena/retrieve_documents_only`;

    try {
        const response = await Fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Server response error: ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('Document retrieval request failed:', error);
        throw error;
    }
}

export default {
    generateAnswer,
    generateWithoutRAG,
    retrieveDocumentsOnly,
};
