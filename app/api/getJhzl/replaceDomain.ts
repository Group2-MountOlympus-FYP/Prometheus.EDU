import {JSDOM} from 'jsdom';

export default function replaceDomain(htmlString: string): string {
    // 使用 jsdom 解析 HTML
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    // 定义可能包含 URL 的属性
    const urlAttributes = ['href', 'src', 'action', 'data-src', 'data-href'];

    // 遍历所有元素
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        urlAttributes.forEach(attr => {
            if (element.hasAttribute(attr)) {
                const attrValue = element.getAttribute(attr);
                if (attrValue) {
                    // 正则表达式匹配以 "//www.rockjhzl.com/" 开头的 URL
                    const pattern = /^\/\/www\.rockjhzl\.com\/(.*)$/;

                    const match = attrValue.match(pattern);
                    if (match) {
                        // 将匹配的路径部分替换为以 "api/" 开头的相对路径
                        const newAttrValue = 'api/' + match[1];
                        element.setAttribute(attr, newAttrValue);
                    }
                }
            }
        });
    });

    // 仅保留 <div class="market"> 元素及 <script>, <style>, 和 <link>
    const marketDivs = document.querySelectorAll('div.market');
    const scripts = document.querySelectorAll('script');
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');

    // 清空整个 HTML，但保留必要的脚本和样式
    document.body.innerHTML = '';  // 清空 body

    // 重新添加 <div class="market">, <script>, <style>, <link>
    document.body.appendChild(marketDivs[1].cloneNode(true));
    scripts.forEach(script => document.body.appendChild(script.cloneNode(true)));
    styles.forEach(style => document.body.appendChild(style.cloneNode(true)));

    // 返回修改后的 HTML 字符串
    return dom.serialize();
}