/**
 * Chatbot API 路由函数
 */

/**
 * 向RAG系统发送查询请求
 * @param query 用户查询问题
 * @returns API响应
 */
export async function generateAnswer(query: string) {
    const formData = new FormData();
    formData.append('query', query);

    const url = 'http://127.0.0.1:5000/athena/generate';
    const response = await fetch(url, {
        credentials: 'same-origin',
        cache: 'no-cache',
        method: 'POST',
        body: formData,
        headers: {
        },
    });
    return response;
}

/**
 * 获取聊天历史记录
 * @param userId 用户ID
 * @param page 页码
 * @param per_page 每页记录数
 * @returns API响应
 */
export async function getChatHistory(userId: string, page: number, per_page: number) {
    const data = new URLSearchParams({
        user_id: userId,
        page: page.toString(),
        per_page: per_page.toString()
    });

    const url = `/athena/history?${data.toString()}`;
    const response = await fetch(url, {
        credentials: 'same-origin',
        cache: 'default',
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response;
}

/**
 * 获取推荐问题
 * @param count 推荐问题数量
 * @returns API响应
 */
export async function getSuggestedQuestions(count: number = 5) {
    const data = new URLSearchParams({
        count: count.toString()
    });

    const url = `/athena/suggested_questions?${data.toString()}`;
    const response = await fetch(url, {
        credentials: 'same-origin',
        cache: 'default',
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response;
}

export default {
    generateAnswer,
    getChatHistory,
    getSuggestedQuestions
};
