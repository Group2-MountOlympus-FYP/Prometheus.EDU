export async function getNotifications() {
  const url = "/backend/post/get_notifications";  // 注意路径是否需要加 /backend

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // 如果需要发送 cookie，比如登录态
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  return await response.json();  // 注意这里直接返回 JSON 数据
}

export async function markNotificationAsRead(id: number) {
  const url = `/backend/post/read/${id}`;  // 路径根据你实际部署前缀调整

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // 携带 cookie，适用于需要登录态的请求
  });

  if (!response.ok) {
    throw new Error(`Failed to mark notification as read: ${response.status}`);
  }

  return await response.text();  // 返回的是 "success" 字符串
}
