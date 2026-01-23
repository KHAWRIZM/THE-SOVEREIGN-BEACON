// DRAGON403 AI Engine - Forensic Intelligence

const FORENSIC_RESPONSES = {
  jwt: {
    keywords: ['jwt', 'token', 'توكن', 'bearer'],
    icon: '🔐',
    title: 'تحليل JWT',
    response: `**تحليل JWT Token:**

أرسل الـ Token وسأستخرج:
• **Header:** الخوارزمية والنوع
• **Payload:** البيانات والصلاحيات  
• **Timestamps:** iat, exp, nbf
• **Validation:** التحقق من الصلاحية

⚠️ لا ترسل tokens إنتاجية في بيئة غير آمنة.`
  },
  
  ip: {
    keywords: ['ip', 'عنوان', 'آي بي', 'address'],
    icon: '🌐',
    title: 'تحليل IP',
    response: `**تحليل عنوان IP:**

سأجري التحليلات التالية:
• 📍 **Geolocation:** الموقع الجغرافي
• 🏢 **ASN:** رقم النظام المستقل
• 🌍 **ISP:** مزود الخدمة
• ⚠️ **Reputation:** التهديدات المرتبطة
• 📋 **WHOIS:** بيانات التسجيل

أرسل عنوان IP للتحليل.`
  },

  hash: {
    keywords: ['hash', 'sha', 'md5', 'هاش', 'checksum'],
    icon: '🔒',
    title: 'تحليل Hash',
    response: `**التحقق من Hash:**

• **SHA-256/SHA-1/MD5:** مطابقة الأدلة
• **VirusTotal:** فحص الملفات الخبيثة
• **Chain of Custody:** سلامة الأدلة

أرسل الـ Hash أو ارفع الملف.`
  },

  fraud: {
    keywords: ['احتيال', 'نصب', 'fraud', 'سرقة', 'scam'],
    icon: '⚠️',
    title: 'تحقيق احتيال',
    response: `**تحليل حالة احتيال:**

لتحليل القضية، أحتاج:
1. **المعاملات:** تواريخ ومبالغ
2. **القنوات:** تطبيق/موقع/بنك
3. **الأدلة:** روابط، رسائل، حسابات
4. **الضحايا:** عدد المتضررين

📊 **إحصائيات DRAGON403:**
• 8.4M+ ضحية موثقة
• $600K+ خسائر مرصودة
• 47 دليل رقمي مؤكد`
  },

  malware: {
    keywords: ['malware', 'virus', 'فيروس', 'برمجية', 'خبيثة'],
    icon: '🦠',
    title: 'تحليل البرمجيات الخبيثة',
    response: `**تحليل Malware:**

• **Static Analysis:** فحص الكود
• **Dynamic Analysis:** سلوك التنفيذ
• **IoC Extraction:** مؤشرات الاختراق
• **YARA Rules:** قواعد الكشف

ارفع الملف المشبوه للتحليل.`
  },

  phishing: {
    keywords: ['phishing', 'تصيد', 'رابط', 'link', 'مشبوه'],
    icon: '🎣',
    title: 'كشف التصيد',
    response: `**تحليل رابط مشبوه:**

سأفحص:
• **URL Analysis:** تحليل الرابط
• **Domain Age:** عمر النطاق
• **SSL Certificate:** شهادة الأمان
• **Reputation:** السمعة
• **Similar Domains:** نطاقات مشابهة

أرسل الرابط للفحص.`
  },

  logs: {
    keywords: ['log', 'سجل', 'سجلات', 'logs'],
    icon: '📋',
    title: 'تحليل السجلات',
    response: `**تحليل السجلات:**

أحلل:
• **Apache/Nginx:** سجلات الويب
• **Windows Event:** أحداث النظام
• **Firewall:** جدار الحماية
• **Auth Logs:** محاولات الدخول

أرسل نموذج من السجل.`
  }
};

// فك تشفير JWT
export function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp ? payload.exp < now : false;
    
    return {
      success: true,
      header,
      payload,
      isExpired,
      issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleString('ar-SA') : null,
      expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString('ar-SA') : null
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// تحليل IP
export async function analyzeIP(ip) {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return { success: false, error: 'Invalid IP' };
  
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    return {
      success: true,
      ip,
      country: data.country_name,
      city: data.city,
      isp: data.org,
      asn: data.asn,
      timezone: data.timezone
    };
  } catch (e) {
    return {
      success: true,
      ip,
      country: 'غير متاح',
      city: 'غير متاح',
      isp: 'غير متاح',
      note: 'استخدم VPN أو API خارجي للنتائج الكاملة'
    };
  }
}

// توليد الرد
export function generateResponse(message, files = []) {
  const msg = message.toLowerCase();
  
  // كشف JWT وتحليله مباشرة
  const jwtMatch = message.match(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  if (jwtMatch) {
    const decoded = decodeJWT(jwtMatch[0]);
    if (decoded.success) {
      return {
        icon: '🔐',
        title: 'نتيجة تحليل JWT',
        text: `**Header:**
\`\`\`json
${JSON.stringify(decoded.header, null, 2)}
\`\`\`

**Payload:**
\`\`\`json
${JSON.stringify(decoded.payload, null, 2)}
\`\`\`

**التحليل:**
• الخوارزمية: \`${decoded.header.alg}\`
• صدر في: ${decoded.issuedAt || 'غير محدد'}
• ينتهي في: ${decoded.expiresAt || 'غير محدد'}
• الحالة: ${decoded.isExpired ? '❌ **منتهي الصلاحية**' : '✅ **صالح**'}`,
        type: 'analysis'
      };
    }
  }
  
  // كشف IP وتحليله
  const ipMatch = message.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/);
  if (ipMatch) {
    return {
      icon: '🌐',
      title: `تحليل IP: ${ipMatch[1]}`,
      text: `جاري تحليل العنوان **${ipMatch[1]}**...

سيتم عرض:
• الموقع الجغرافي
• مزود الخدمة (ISP)
• رقم ASN
• مستوى الخطر

💡 للتحليل المتقدم، استخدم أدوات OSINT.`,
      type: 'ip',
      data: { ip: ipMatch[1] }
    };
  }
  
  // البحث في قاعدة المعرفة
  for (const [key, item] of Object.entries(FORENSIC_RESPONSES)) {
    if (item.keywords.some(kw => msg.includes(kw))) {
      return {
        icon: item.icon,
        title: item.title,
        text: item.response,
        type: key
      };
    }
  }
  
  // رد ترحيبي/افتراضي
  if (msg.includes('مرحبا') ; msg.includes('هلا') ; msg.includes('السلام') ; msg.length < 5) {
    return {
      icon: '🛡️',
      title: 'مرحباً بك في DRAGON403',
      text: `أنا مساعد التحقيق الرقمي السيادي.

**خدماتي:**
• 🔐 تحليل JWT Tokens
• 🌐 فحص عناوين IP
• 🔒 التحقق من Hash
• ⚠️ تحقيقات الاحتيال
• 🦠 تحليل البرمجيات الخبيثة
• 🎣 كشف روابط التصيد
• 📋 تحليل السجلات

**جرب:**
"حلل JWT: eyJhbGciOiJIUzI1NiJ9..."
"فحص IP: 8.8.8.8"
"تحقيق احتيال مالي"`,
      type: 'welcome'
    };
  }
  
  // رد ذكي افتراضي
  return {
    icon: '🛡️',
    title: 'DRAGON403',
    text: `استلمت: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"

للحصول على تحليل متخصص:
• اكتب **"jwt"** لتحليل Tokens
• اكتب **"ip"** لفحص العناوين
• اكتب **"احتيال"** للتحقيقات
• اكتب **"hash"** للتحقق من الملفات

أو أرسل JWT/IP مباشرة للتحليل الفوري.`,
    type: 'default'
  };
}

export default { generateResponse, decodeJWT, analyzeIP };
