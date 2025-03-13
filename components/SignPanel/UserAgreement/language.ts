import { getLanguage } from "@/app/language";

type Translations = {
    [key: string]: string;
};

const translations: {[ key in 'en' | 'zh' ]: Translations} = {
    en: {
        introduction: "Welcome to our services! In order to protect your legal rights and clarify the rights and obligations of both parties, we have formulated this 'Privacy Policy & User Agreement' (hereinafter referred to as 'this Agreement').",
        definitions: "Definitions",
        we: "We refers to the operator of this platform.",
        user: "User refers to individuals or organizations that register, log in, or use this platform.",
        services: "Services refer to the various products and functions we provide to users.",
        registration: "User Registration & Usage",
        guarantee_info: "Users shall ensure the authenticity, accuracy, and completeness of the registration information.",
        account_usage: "User accounts are for personal use only and shall not be transferred or lent to others.",
        legal_usage: "Users agree to use the platform services legally and not to engage in illegal activities through the platform.",
        privacy_policy: "Privacy Policy",
        info_collection: "We may collect the following information:",
        reg_info: "Registration information (such as username, mobile number, email address, etc.)",
        usage_records: "Usage records, device information, location information (with your consent)",
        info_usage: "The collected information will be used to:",
        provide_service: "Provide and optimize our services",
        personalize_content: "Provide personalized content and recommendations",
        comply_laws: "Comply with laws and regulations",
        info_sharing: "Information Sharing & Disclosure",
        info_security: "We take reasonable technical measures to protect your information from unauthorized access, disclosure, use, or loss.",
        user_rights: "User Rights",
        access_info: "Users have the right to access, correct, or delete their personal information.",
        withdraw_consent: "Users have the right to withdraw previously granted consent.",
        service_changes: "Service Modification, Suspension & Termination",
        adjust_service: "We reserve the right to adjust service content at any time according to operational needs and notify users in advance.",
        suspend_service: "If the user violates this Agreement, we have the right to suspend or terminate services to the user.",
        disclaimer: "Disclaimer",
        user_responsibility: "Users shall be solely responsible for any account information leakage or other losses caused by their own actions.",
        force_majeure: "We shall not be liable for service interruptions or data loss caused by force majeure or third-party reasons.",
        intellectual_property: "Intellectual Property",
        all_content_rights: "All content on the platform (including but not limited to text, images, audio, video, etc.) is owned by us or the respective rights holders.",
        unauthorized_use: "Without authorization, users shall not copy, distribute, or use the content for commercial purposes.",
        agreement_modification: "We reserve the right to modify this Agreement when necessary and notify users via platform announcements or other reasonable means. Continued use of the services shall be deemed acceptance of the modified Agreement.",
        governing_law: "This Agreement shall be governed by the laws of the People's Republic of China.",
        dispute_resolution: "Any dispute arising from this Agreement shall be resolved through negotiation; if negotiation fails, either party may file a lawsuit with the court having jurisdiction over our location.",
        contact: "If you have any questions about this Agreement, please contact us via:",
        effective_date: "Effective Date:",
        agree: 'Agree',
        cancel: 'Cancel',
    },
    zh: {
        introduction: "欢迎您使用我们的服务！为了保障您的合法权益，明确双方权利义务，我们制定了本《隐私政策与用户协议》（以下简称“本协议”）。",
        definitions: "定义",
        we: "“我们”指本平台的运营方。",
        user: "“用户”是指注册、登录、使用本平台的个人或机构。",
        services: "“服务”是指我们向用户提供的各项产品和功能。",
        registration: "用户注册与使用",
        guarantee_info: "用户应保证注册信息的真实性、准确性和完整性。",
        account_usage: "用户账户仅限本人使用，禁止转让或出借。",
        legal_usage: "用户承诺合法使用平台服务，不得利用平台从事违法活动。",
        privacy_policy: "隐私政策",
        info_collection: "我们可能收集您的以下信息：",
        reg_info: "注册信息（如用户名、手机号、电子邮件地址等）",
        usage_records: "使用记录、设备信息、位置信息（经您授权后）",
        info_usage: "我们收集的信息将用于：",
        provide_service: "提供、优化我们的服务",
        personalize_content: "提供个性化内容与推荐",
        comply_laws: "遵守法律法规的规定",
        info_sharing: "信息共享与披露",
        info_security: "我们采取合理的技术措施保护您的信息不被未经授权的访问、披露、使用或丢失。",
        user_rights: "用户权利",
        access_info: "用户有权访问、更正或删除其个人信息。",
        withdraw_consent: "用户有权撤回已授予的同意。",
        service_changes: "服务变更、中止与终止",
        adjust_service: "我们有权根据运营需要随时调整服务内容，并提前通知用户。",
        suspend_service: "用户违反本协议的，我们有权暂停或终止对用户的服务。",
        disclaimer: "免责声明",
        user_responsibility: "因用户自身原因导致的账户信息泄露或其他损失，由用户自行承担责任。",
        force_majeure: "我们不对因不可抗力或第三方原因导致的服务中断或数据丢失承担责任。",
        intellectual_property: "知识产权",
        all_content_rights: "平台中的所有内容（包括但不限于文字、图片、音频、视频等）的知识产权均归我们或相关权利人所有。",
        unauthorized_use: "未经授权，任何用户不得复制、传播或用于商业用途。",
        agreement_modification: "我们有权根据需要对本协议进行修改，并通过平台公告或其他合理方式通知用户。用户继续使用服务视为接受修改后的协议。",
        governing_law: "本协议适用中华人民共和国法律。",
        dispute_resolution: "因本协议产生的争议，双方应协商解决，协商不成的，提交本公司所在地有管辖权的法院诉讼解决。",
        contact: "如对本协议有任何疑问，您可通过以下方式联系我们：",
        effective_date: "生效日期：",
        agree: '同意',
        cancel: '取消',
    },
}

export const getText = (key: string): string => {
    const lang = getLanguage();
    return translations[lang][key] || key; // 如果没有找到对应的文本，返回key本身
};
