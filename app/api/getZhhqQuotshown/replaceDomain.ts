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
                    console.log(attrValue)

                    // 正则表达式匹配以 "//www.rockjhzl.com/" 开头的 URL
                    const pattern = /^\.\/(.*)$/;

                    const match = attrValue.match(pattern);
                    let newAttrValue
                    if (match) {
                        // 将匹配的路径部分替换为以 "api/" 开头的相对路径
                        newAttrValue = '../zhhq/' + match[1];
                        console.log(newAttrValue);

                    }
                    element.setAttribute(attr, newAttrValue);
                }
            }
        });
    });


    // 返回修改后的 HTML 字符串
    return dom.serialize();
}