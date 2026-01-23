
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const messages = {
  ar: {
    langName: 'العربية',
    nav: { home:'الرئيسية', services:'الخدمات', evidence:'الأدلة', contact:'تواصل', users:'المستخدمون', login:'دخول', logout:'خروج', openCase:'فتح بلاغ' },
    hero: { badge:'بوابة سيادية', title:'DRAGON403 – بوابة التحقيق الرقمي السيادية', sub:'منصة مُحكمة لإدارة الأدلة، تتبع شبكات الاحتيال، واستخبارات التهديدات. واجهة تُظهر الحقيقة وتفضح المخالفين… بلا تجميل.', ctaOpen:'فتح بلاغ جديد', ctaDocs:'إرشادات رفع الأدلة' },
    kpi: { victims:'ضحايا موثقون (قضية HILO)', loss:'خسائر مؤكدة – مطالبات مفتوحة', proofs:'دليل تقني موثّق' },
    services: { dfir:'التحقيق الرقمي DFIR', dfirDesc:'سلسلة حفظ الأدلة، استخراج الميتاداتا، خطوط الزمن، وتقارير قابلة للتقاضي.', intel:'استخبارات التهديدات', intelDesc:'تحليل نطاقات/IPs، بصمات البرمجيات الخبيثة، وأنماط الاحتيال.', zt:'بوابة Zero‑Trust', ztDesc:'توثيق مشدد، حصص وصول، ومصادقة متعددة مع سجلات دقيقة.', ev:'مركز الأدلة', evDesc:'رفع الملفات، التجزئة Hash، التدقيق، وربط الأدلة بالبلاغات.' },
    strip: { title:'شريط الأدلة', jwt:'تحقق JWT', req:'طلب أدلة', login:'محاولة دخول' },
    hilo: { title:'قضية HILO – Guangzhou QiaHaoQingChun Information Technology', sub:'استهداف العرب والخليجيين بعمليات احتيال منظمة. أدلة تقنية موثّقة تُثبت النمط والضرر.', follow:'اطلب متابعة قضائية' },
    case: { title:'فتح بلاغ جديد', hint:'املأ الحقول التالية لبدء سلسلة حفظ الأدلة. (يرتبط لاحقًا بـ API)', name:'عنوان البلاغ', pri:'الأولوية', desc:'وصف مختصر', create:'إنشاء البلاغ', attach:'إرفاق أدلة', hash:'سيتم توليد Hash تلقائيًا' },
    footer: { legal:'© 2026 DRAGON403 · CometX · Sovereign Zero‑Trust', hint:'واجهة عرض – الربط بالـ API لاحقًا' },
    theme: { auto:'تلقائي', dark:'داكن', light:'فاتح' },
    login: { title:'تسجيل الدخول', email:'البريد الإلكتروني', password:'كلمة المرور', remember:'تذكرني', submit:'دخول', forgot:'نسيت كلمة المرور؟', or:'أو', back:'العودة للرئيسية' },
    logout: { title:'تسجيل الخروج', sub:'تم إنهاء الجلسة. سيتم تحويلك إلى صفحة الدخول.' },
    notify: { signedInTitle:'تم الدخول', signedInMsg:'مرحبًا بك. الجلسة فعّالة.', signedOutTitle:'تم الخروج', signedOutMsg:'تم تنظيف الجلسة بنجاح.', caseCreatedTitle:'تم إنشاء البلاغ', caseCreatedMsg:'تم تسجيل البلاغ وسيتم توليد Hash.', caseFailedTitle:'فشل العملية', caseFailedMsg:'تحقق من البيانات وأعد المحاولة.', userUpdatedTitle:'تم التحديث', userUpdatedMsg:'تم تطبيق الإجراء على المستخدم.' },
    users: { title:'إدارة المستخدمين', searchPh:'ابحث بالاسم أو البريد…', role:'الدور', status:'الحالة', actions:'إجراءات', roles:{ admin:'مشرف', analyst:'محلل', viewer:'عارض' }, statuses:{ active:'نشط', pending:'معلّق', blocked:'محظور' }, act:{ enable:'تفعيل', disable:'تعطيل', promote:'ترقية لمشرف', demote:'إرجاع لمحلل', view:'عرض' }, empty:'لا يوجد نتائج مطابقة.', pager:{ prev:'السابق', next:'التالي', page:'صفحة' } },
    model: { badge:'نموذج سيادي', title:'DRAGON403 — Sovereign AI Model', sub:'نموذج حوسبة سيادية، سريع ودقيق، مُحسن لمهام DFIR، مكافحة الاحتيال، والذكاء التهديدي.', ctas:{ try:'جرّب الآن', docs:'وثائق API', bench:'عينات مخرجات' }, hints:{ latency:'زمن استجابة مُحسن', privacy:'خصوصية افتراضية', local:'جاهزية تشغيل محلي' } },
    chat: { title:'محادثة التحقيق', send:'إرسال', typing:'يكتب…', memory:'الذاكرة الدائمة', memoryOn:'مفعّلة', memoryOff:'معطّلة', drop:'أسقط الملفات هنا', attach:'إرفاق ملفات', or:'أو', speak:'تحدث', stop:'إيقاف', accept:'كل الصيغ', size:'الحجم', remove:'إزالة', console:'الطرفية', clear:'مسح', hint:'أرسل رسالة، أرفق أدلة، أو أمْلِ شفهيًا.' },
    voice: { in:'إدخال صوتي', out:'صوت النموذج', voice:'الصوت', start:'تشغيل الميكروفون', stop:'إيقاف', tts:'تشغيل الرد صوتيًا', none:'بدون', errMic:'فشل الوصول للميكروفون', errTTS:'تعذر التشغيل الصوتي' },
    files: { tooBig:'الملف كبير جدًا', max:'الحد الأقصى', uploaded:'تم الإرفاق', removed:'تمت الإزالة' },
    console: { title:'الطرفية المخفية', help:'أوامر: /help, /clear, /whoami', who:'DRAGON403 · وضع سيادي' },
    export: { title:'تصدير', copy:'نسخ لـ Markdown', pdf:'PDF' },
    rec: { title:'تسجيل الشاشة', start:'بدء التسجيل', running:'التسجيل يعمل', ready:'الفيديو جاهز', fail:'تعذّر بدء التسجيل', btnStart:'بدء', btnStop:'إيقاف', btnSave:'حفظ', hint:'ابدأ واختر نافذة/تبويب للمشاركة' },
    recAudio: { title:'تسجيل الصوت', start:'بدء التسجيل', running:'جارٍ التسجيل…', ready:'الصوت جاهز', fail:'تعذّر بدء التسجيل', btnStart:'بدء', btnStop:'إيقاف', btnSave:'حفظ', btnAttach:'إرفاق', hint:'ابدأ التسجيل لالتقاط صوت الميكروفون' },
    perm: { denied:'صلاحية مرفوضة', needAdmin:'هذه الميزة تتطلب مشرف', needAnalyst:'هذه الميزة تتطلب محلل أو أعلى' }
  },
  en: {
    langName: 'English',
    nav: { home:'Home', services:'Services', evidence:'Evidence', contact:'Contact', users:'Users', login:'Login', logout:'Logout', openCase:'Open Case' },
    hero: { badge:'Sovereign Portal', title:'DRAGON403 – Sovereign Digital Forensics Portal', sub:'A hardened platform for evidence management, fraud network tracing, and threat intelligence. A UI that exposes facts—no sugarcoating.', ctaOpen:'Open a New Case', ctaDocs:'Evidence Upload Guidelines' },
    kpi: { victims:'Documented Victims (HILO case)', loss:'Confirmed Losses – Open Claims', proofs:'Documented Technical Proofs' },
    services: { dfir:'DFIR Investigations', dfirDesc:'Chain-of-custody, metadata extraction, timelines, litigation-ready reports.', intel:'Threat Intelligence', intelDesc:'Domains/IP analysis, malware fingerprints, and fraud patterns.', zt:'Zero‑Trust Gateway', ztDesc:'Strong auth, quotas, MFA, and precise audit trails.', ev:'Evidence Center', evDesc:'Uploads, hashing, auditing, and case linking.' },
    strip: { title:'Evidence Strip', jwt:'JWT Verification', req:'Evidence Request', login:'Login Attempt' },
    hilo: { title:'HILO Case – Guangzhou QiaHaoQingChun Information Technology', sub:'Targeting Arabs and GCC with organized fraud. Documented technical evidence proves the pattern and harm.', follow:'Request Legal Follow‑Up' },
    case: { title:'Open a New Case', hint:'Fill the fields to start chain-of-custody. (Will connect to API)', name:'Case Title', pri:'Priority', desc:'Short Description', create:'Create Case', attach:'Attach Evidence', hash:'Hash will be generated automatically' },
    footer: { legal:'© 2026 DRAGON403 · CometX · Sovereign Zero‑Trust', hint:'Preview UI – API wiring later' },
    theme: { auto:'Auto', dark:'Dark', light:'Light' },
    login: { title:'Sign In', email:'Email Address', password:'Password', remember:'Remember me', submit:'Sign In', forgot:'Forgot password?', or:'OR', back:'Back to Home' },
    logout: { title:'Sign Out', sub:'Session terminated. You will be redirected to login.' },
    notify: { signedInTitle:'Signed In', signedInMsg:'Welcome back. Session active.', signedOutTitle:'Signed Out', signedOutMsg:'Session cleaned successfully.', caseCreatedTitle:'Case Created', caseCreatedMsg:'Case recorded. Hash will be generated.', caseFailedTitle:'Operation Failed', caseFailedMsg:'Check inputs and try again.', userUpdatedTitle:'Updated', userUpdatedMsg:'Action applied to user.' },
    users: { title:'User Management', searchPh:'Search by name or email…', role:'Role', status:'Status', actions:'Actions', roles:{ admin:'Admin', analyst:'Analyst', viewer:'Viewer' }, statuses:{ active:'Active', pending:'Pending', blocked:'Blocked' }, act:{ enable:'Enable', disable:'Disable', promote:'Promote to Admin', demote:'Demote to Analyst', view:'View' }, empty:'No matching results.', pager:{ prev:'Prev', next:'Next', page:'Page' } },
    model: { badge:'Sovereign Model', title:'DRAGON403 — Sovereign AI Model', sub:'A sovereign compute model—fast, precise, and tuned for DFIR, anti‑fraud, and threat intelligence.', ctas:{ try:'Try Now', docs:'API Docs', bench:'Sample Outputs' }, hints:{ latency:'Optimized Latency', privacy:'Privacy by Default', local:'Local‑Run Ready' } },
    chat: { title:'Investigation Chat', send:'Send', typing:'typing…', memory:'Persistent Memory', memoryOn:'On', memoryOff:'Off', drop:'Drop files here', attach:'Attach Files', or:'or', speak:'Speak', stop:'Stop', accept:'All formats', size:'Size', remove:'Remove', console:'Console', clear:'Clear', hint:'Send a message, attach evidence, or speak.' },
    voice: { in:'Voice In', out:'Model Voice', voice:'Voice', start:'Start Mic', stop:'Stop', tts:'Play Reply', none:'None', errMic:'Mic access failed', errTTS:'TTS failed' },
    files: { tooBig:'File too large', max:'Max', uploaded:'Attached', removed:'Removed' },
    console: { title:'Hidden Console', help:'Commands: /help, /clear, /whoami', who:'DRAGON403 · Sovereign mode' },
    export: { title:'Export', copy:'Copy as Markdown', pdf:'PDF' },
    rec: { title:'Screen Recording', start:'Recording started', running:'Recording…', ready:'Video ready', fail:'Cannot start recording', btnStart:'Start', btnStop:'Stop', btnSave:'Save', hint:'Start and pick a window/tab to share' },
    recAudio: { title:'Audio Recorder', start:'Recording started', running:'Recording…', ready:'Audio ready', fail:'Cannot start recording', btnStart:'Start', btnStop:'Stop', btnSave:'Save', btnAttach:'Attach', hint:'Start recording to capture microphone audio' },
    perm: { denied:'Permission denied', needAdmin:'This feature requires Admin', needAnalyst:'This feature requires Analyst or above' }
  },
  fr: {
    langName: 'Français',
    nav:{ home:'Accueil', services:'Services', evidence:'Preuves', contact:'Contact', users:'Utilisateurs', login:'Connexion', logout:'Déconnexion', openCase:'Ouvrir un dossier' },
    hero:{ badge:'Portail souverain', title:'DRAGON403 – Portail d’investigation numérique souverain', sub:'Plateforme renforcée pour la gestion des preuves, le traçage des fraudes et le renseignement sur les menaces.', ctaOpen:'Ouvrir un nouveau dossier', ctaDocs:'Guide de dépôt des preuves' },
    kpi:{ victims:'Victimes documentées (HILO)', loss:'Pertes confirmées – Réclamations ouvertes', proofs:'Preuves techniques documentées' },
    services:{ dfir:'Enquêtes DFIR', dfirDesc:'Chaîne de possession, extraction de métadonnées, chronologies, rapports aptes aux litiges.', intel:'Renseignement sur les menaces', intelDesc:'Analyse domaines/IP, empreintes de malwares, schémas de fraude.', zt:'Passerelle Zero‑Trust', ztDesc:'Auth forte, quotas, MFA, traçabilité précise.', ev:'Centre de preuves', evDesc:'Téléversements, hachage, audit, liaison aux dossiers.' },
    strip:{ title:'Ruban des preuves', jwt:'Vérification JWT', req:'Demande de preuves', login:'Tentative de connexion' },
    hilo:{ title:'Affaire HILO – Guangzhou QiaHaoQingChun', sub:'Fraudes organisées. Preuves techniques documentées.', follow:'Demander un suivi juridique' },
    case:{ title:'Ouvrir un nouveau dossier', hint:'Remplissez pour initier la chaîne de possession. (API à venir)', name:'Titre du dossier', pri:'Priorité', desc:'Description courte', create:'Créer', attach:'Joindre des preuves', hash:'Le hash sera généré automatiquement' },
    footer:{ legal:'© 2026 DRAGON403 · CometX · Souverain Zero‑Trust', hint:'Interface de prévisualisation – API ultérieure' },
    theme:{ auto:'Auto', dark:'Sombre', light:'Clair' },
    login:{ title:'Connexion', email:'Adresse e‑mail', password:'Mot de passe', remember:'Se souvenir de moi', submit:'Connexion', forgot:'Mot de passe oublié ?', or:'OU', back:'Retour à l’accueil' },
    logout:{ title:'Déconnexion', sub:'Session terminée. Redirection vers la connexion.' },
    notify:{ signedInTitle:'Connecté', signedInMsg:'Bienvenue. Session active.', signedOutTitle:'Déconnecté', signedOutMsg:'Session nettoyée.', caseCreatedTitle:'Dossier créé', caseCreatedMsg:'Enregistré.', caseFailedTitle:'Échec', caseFailedMsg:'Vérifiez.', userUpdatedTitle:'Mise à jour', userUpdatedMsg:'Action appliquée.' },
    users:{ title:'Gestion des utilisateurs', searchPh:'Rechercher par nom ou e‑mail…', role:'Rôle', status:'Statut', actions:'Actions', roles:{ admin:'Admin', analyst:'Analyste', viewer:'Lecteur' }, statuses:{ active:'Actif', pending:'En attente', blocked:'Bloqué' }, act:{ enable:'Activer', disable:'Désactiver', promote:'Promouvoir Admin', demote:'Rétrograder Analyste', view:'Voir' }, empty:'Aucun résultat.', pager:{ prev:'Préc.', next:'Suiv.', page:'Page' } },
    model:{ badge:'Modèle souverain', title:'DRAGON403 — Modèle IA Souverain', sub:'Optimisé pour DFIR, anti‑fraude, renseignement.', ctas:{ try:'Essayer', docs:'Docs API', bench:'Exemples' }, hints:{ latency:'Latence optimisée', privacy:'Confidentialité par défaut', local:'Exéc. locale' } },
    chat:{ title:'Chat d’investigation', send:'Envoyer', typing:'écrit…', memory:'Mémoire persistante', memoryOn:'Activée', memoryOff:'Désactivée', drop:'Déposez les fichiers ici', attach:'Joindre des fichiers', or:'ou', speak:'Parler', stop:'Stop', accept:'Tous formats', size:'Taille', remove:'Retirer', console:'Console', clear:'Effacer', hint:'Envoyez un message, joignez des preuves, ou dictez.' },
    voice:{ in:'Entrée vocale', out:'Voix du modèle', voice:'Voix', start:'Démarrer', stop:'Arrêter', tts:'Lire la réponse', none:'Aucune', errMic:'Micro non accessible', errTTS:'Échec TTS' },
    files:{ tooBig:'Fichier trop volumineux', max:'Max', uploaded:'Ajouté', removed:'Supprimé' },
    console:{ title:'Console cachée', help:'Commandes: /help, /clear, /whoami', who:'DRAGON403 · mode souverain' },
    export:{ title:'Exporter', copy:'Copier en Markdown', pdf:'PDF' },
    rec:{ title:'Capture d’écran', start:'Enregistrement démarré', running:'En cours…', ready:'Vidéo prête', fail:'Impossible de démarrer', btnStart:'Démarrer', btnStop:'Arrêter', btnSave:'Sauver', hint:'Choisissez une fenêtre/onglet' },
    recAudio:{ title:'Enregistreur audio', start:'Début d’enregistrement', running:'Enregistrement…', ready:'Audio prêt', fail:'Échec micro', btnStart:'Démarrer', btnStop:'Arrêter', btnSave:'Sauver', btnAttach:'Joindre', hint:'Enregistrez le micro' },
    perm:{ denied:'Permission refusée', needAdmin:'Nécessite Admin', needAnalyst:'Nécessite Analyste+' }
  },
  tr: {
    langName: 'Türkçe',
    nav:{ home:'Ana Sayfa', services:'Hizmetler', evidence:'Deliller', contact:'İletişim', users:'Kullanıcılar', login:'Giriş', logout:'Çıkış', openCase:'Vaka Aç' },
    hero:{ badge:'Egemen Portal', title:'DRAGON403 – Egemen Dijital Adli Portal', sub:'Kanıt yönetimi, dolandırıcılık takibi ve tehdit istihbaratı için güçlendirilmiş platform.', ctaOpen:'Yeni Vaka Aç', ctaDocs:'Kanıt Yükleme Kılavuzu' },
    kpi:{ victims:'Belgelenmiş Mağdurlar (HILO)', loss:'Doğrulanmış Kayıplar – Açık Talepler', proofs:'Belgelenmiş Teknik Kanıtlar' },
    services:{ dfir:'DFIR Soruşturmaları', dfirDesc:'Mülkiyet zinciri, meta veri çıkarımı, zaman çizelgeleri, dava hazır raporlar.', intel:'Tehdit İstihbaratı', intelDesc:'Alan/IP analizi, zararlı izleri, dolandırıcılık desenleri.', zt:'Zero‑Trust Ağ Geçidi', ztDesc:'Güçlü kimlik doğrulama, kotalar, MFA, hassas kayıtlar.', ev:'Delil Merkezi', evDesc:'Yüklemeler, hash, denetim, vaka bağlantısı.' },
    strip:{ title:'Delil Şeridi', jwt:'JWT Doğrulama', req:'Delil Talebi', login:'Giriş Denemesi' },
    hilo:{ title:'HILO Vakası – Guangzhou QiaHaoQingChun', sub:'Organize dolandırıcılık. Belgelenmiş kanıtlar deseni doğrular.', follow:'Hukuki Takip' },
    case:{ title:'Yeni Vaka Aç', hint:'Mülkiyet zincirini başlatın. (API bağlanacak)', name:'Vaka Başlığı', pri:'Öncelik', desc:'Kısa Açıklama', create:'Oluştur', attach:'Delil Ekle', hash:'Hash otomatik' },
    footer:{ legal:'© 2026 DRAGON403 · CometX · Egemen Zero‑Trust', hint:'Önizleme – API sonra' },
    theme:{ auto:'Oto', dark:'Koyu', light:'Açık' },
    login:{ title:'Giriş Yap', email:'E‑posta', password:'Parola', remember:'Beni hatırla', submit:'Giriş', forgot:'Parolayı mı unuttun?', or:'VEYA', back:'Ana Sayfaya Dön' },
    logout:{ title:'Çıkış', sub:'Oturum kapatıldı. Girişe yönlendirileceksiniz.' },
    notify:{ signedInTitle:'Giriş Başarılı', signedInMsg:'Hoş geldiniz.', signedOutTitle:'Çıkış Yapıldı', signedOutMsg:'Oturum temizlendi.', caseCreatedTitle:'Vaka Oluşturuldu', caseCreatedMsg:'Kaydedildi.', caseFailedTitle:'İşlem Başarısız', caseFailedMsg:'Kontrol edin.', userUpdatedTitle:'Güncellendi', userUpdatedMsg:'Uygulandı.' },
    users:{ title:'Kullanıcı Yönetimi', searchPh:'Ad veya e‑posta ile ara…', role:'Rol', status:'Durum', actions:'İşlemler', roles:{ admin:'Yönetici', analyst:'Analist', viewer:'İzleyici' }, statuses:{ active:'Aktif', pending:'Beklemede', blocked:'Engelli' }, act:{ enable:'Etkinleştir', disable:'Devre Dışı', promote:'Yönetici Yap', demote:'Analiste Dön', view:'Görüntüle' }, empty:'Eşleşme yok.', pager:{ prev:'Önceki', next:'Sonraki', page:'Sayfa' } },
    model:{ badge:'Egemen Model', title:'DRAGON403 — Egemen Yapay Zeka Modeli', sub:'DFIR, dolandırıcılık karşıtı ve tehdit istihbaratı için optimize.', ctas:{ try:'Hemen Dene', docs:'API Dokümanları', bench:'Örnekler' }, hints:{ latency:'Optimize Gecikme', privacy:'Varsayılan Gizlilik', local:'Yerel Çalıştırılabilir' } },
    chat:{ title:'Soruşturma Sohbeti', send:'Gönder', typing:'yazıyor…', memory:'Kalıcı Hafıza', memoryOn:'Açık', memoryOff:'Kapalı', drop:'Dosyaları buraya bırakın', attach:'Dosya Ekle', or:'ya da', speak:'Konuş', stop:'Durdur', accept:'Tüm formatlar', size:'Boyut', remove:'Kaldır', console:'Konsol', clear:'Temizle', hint:'Mesaj gönderin, delil ekleyin veya konuşun.' },
    voice:{ in:'Ses Girişi', out:'Model Sesi', voice:'Ses', start:'Başlat', stop:'Durdur', tts:'Yanıtı Çal', none:'Yok', errMic:'Mikrofon erişimi yok', errTTS:'TTS başarısız' },
    files:{ tooBig:'Dosya çok büyük', max:'Maks', uploaded:'Eklendi', removed:'Kaldırıldı' },
    console:{ title:'Gizli Konsol', help:'Komutlar: /help, /clear, /whoami', who:'DRAGON403 · Egemen mod' },
    export:{ title:'Dışa aktar', copy:'Markdown kopyala', pdf:'PDF' },
    rec:{ title:'Ekran Kaydı', start:'Kayıt başladı', running:'Kayıt…', ready:'Video hazır', fail:'Başlatılamıyor', btnStart:'Başlat', btnStop:'Durdur', btnSave:'Kaydet', hint:'Pencere/Sekme seç' },
    recAudio:{ title:'Ses Kaydı', start:'Kayıt başladı', running:'Kayıt…', ready:'Ses hazır', fail:'Mikrofon hatası', btnStart:'Başlat', btnStop:'Durdur', btnSave:'Kaydet', btnAttach:'Ekle', hint:'Mikrofon kaydı başlat' },
    perm:{ denied:'İzin reddedildi', needAdmin:'Yönetici gerekir', needAnalyst:'Analist veya üzeri gerekir' }
  },
  fa: {
    langName: 'فارسی',
    nav:{ home:'خانه', services:'خدمات', evidence:'مدارک', contact:'ارتباط', users:'کاربران', login:'ورود', logout:'خروج', openCase:'باز کردن پرونده' },
    hero:{ badge:'درگاه حاکمیتی', title:'DRAGON403 – درگاه تحقیقات دیجیتال حاکمیتی', sub:'سکوی سخت‌افزاری برای مدیریت مدارک، ردیابی شبکه‌های کلاهبرداری و اطلاعات تهدید.', ctaOpen:'پرونده جدید', ctaDocs:'راهنمای بارگذاری مدارک' },
    kpi:{ victims:'قربانیان مستندسازی‌شده (پرونده HILO)', loss:'خسارت‌های تأییدشده – مطالبات باز', proofs:'مدارک فنی مستند' },
    services:{ dfir:'تحقیقات DFIR', dfirDesc:'زنجیره مالکیت، استخراج متادیتا، خطوط زمان، گزارش‌های قابل استناد.', intel:'اطلاعات تهدید', intelDesc:'تحلیل دامنه‌ها/IP، اثرانگشت بدافزار، الگوهای کلاهبرداری.', zt:'دروازه Zero‑Trust', ztDesc:'احراز قوی، سهمیه‌ها، MFA، ردگیری دقیق.', ev:'مرکز مدارک', evDesc:'بارگذاری، هش، ممیزی و اتصال به پرونده.' },
    strip:{ title:'نوار مدارک', jwt:'تأیید JWT', req:'درخواست مدارک', login:'تلاش ورود' },
    hilo:{ title:'پرونده HILO – Guangzhou QiaHaoQingChun', sub:'کلاهبرداری سازمان‌یافته. مدارک فنی مستند الگو و آسیب را ثابت می‌کند.', follow:'درخواست پیگیری حقوقی' },
    case:{ title:'باز کردن پرونده', hint:'برای آغاز زنجیره مالکیت پر کنید. (اتصال API بعداً)', name:'عنوان پرونده', pri:'اولویت', desc:'توضیح کوتاه', create:'ایجاد پرونده', attach:'افزودن مدرک', hash:'هش خودکار تولید می‌شود' },
    footer:{ legal:'© 2026 DRAGON403 · CometX · Zero‑Trust حاکمیتی', hint:'نمایش اولیه – اتصال API بعداً' },
    theme:{ auto:'خودکار', dark:'تیره', light:'روشن' },
    login:{ title:'ورود', email:'ایمیل', password:'گذرواژه', remember:'مرا به خاطر بسپار', submit:'ورود', forgot:'فراموشی گذرواژه؟', or:'یا', back:'بازگشت به خانه' },
    logout:{ title:'خروج', sub:'نشست پایان یافت. به صفحه ورود هدایت می‌شوید.' },
    notify:{ signedInTitle:'ورود موفق', signedInMsg:'خوش آمدید. نشست فعال است.', signedOutTitle:'خروج', signedOutMsg:'نشست با موفقیت پاک شد.', caseCreatedTitle:'پرونده ایجاد شد', caseCreatedMsg:'ثبت شد.', caseFailedTitle:'عملیات ناموفق', caseFailedMsg:'ورودی‌ها را بررسی کنید.', userUpdatedTitle:'به‌روزرسانی شد', userUpdatedMsg:'اعمال شد.' },
    users:{ title:'مدیریت کاربران', searchPh:'جستجو با نام یا ایمیل…', role:'نقش', status:'وضعیت', actions:'اقدامات', roles:{ admin:'مدیر', analyst:'تحلیلگر', viewer:'بیننده' }, statuses:{ active:'فعال', pending:'در انتظار', blocked:'مسدود' }, act:{ enable:'فعال‌سازی', disable:'غیرفعال', promote:'ارتقا به مدیر', demote:'بازگشت به تحلیلگر', view:'مشاهده' }, empty:'نتیجه‌ای یافت نشد.', pager:{ prev:'قبلی', next:'بعدی', page:'صفحه' } },
    model:{ badge:'مدل حاکمیتی', title:'DRAGON403 — مدل هوش مصنوعی حاکمیتی', sub:'بهینه برای DFIR، ضدکلاهبرداری و اطلاعات تهدید.', ctas:{ try:'همین حالا امتحان کن', docs:'اسناد API', bench:'نمونه خروجی' }, hints:{ latency:'تأخیر بهینه', privacy:'حریم خصوصی پیش‌فرض', local:'آماده اجرای محلی' } },
    chat:{ title:'گفتگوی تحقیق', send:'ارسال', typing:'در حال تایپ…', memory:'حافظه دائمی', memoryOn:'روشن', memoryOff:'خاموش', drop:'فایل‌ها را اینجا رها کنید', attach:'پیوست فایل', or:'یا', speak:'صحبت', stop:'توقف', accept:'همه قالب‌ها', size:'حجم', remove:'حذف', console:'ترمینال', clear:'پاکسازی', hint:'پیام بفرست، مدرک پیوست کن، یا صوتی صحبت کن.' },
    voice:{ in:'ورودی صوت', out:'صدای مدل', voice:'صدا', start:'شروع میکروفون', stop:'توقف', tts:'پخش پاسخ', none:'بدون', errMic:'دسترسی میکروفون ناموفق', errTTS:'TTS ناموفق' },
    files:{ tooBig:'فایل بسیار بزرگ', max:'حداکثر', uploaded:'پیوست شد', removed:'حذف شد' },
    console:{ title:'ترمینال مخفی', help:'دستورها: /help, /clear, /whoami', who:'DRAGON403 · حالت حاکمیتی' },
    export:{ title:'خروجی', copy:'کپی Markdown', pdf:'PDF' },
    rec:{ title:'ضبط صفحه', start:'ضبط آغاز شد', running:'در حال ضبط…', ready:'ویدیو آماده است', fail:'شروع ضبط ناموفق', btnStart:'شروع', btnStop:'توقف', btnSave:'ذخیره', hint:'شروع و انتخاب پنجره/زبانه' },
    recAudio:{ title:'ضبط صدا', start:'ضبط آغاز شد', running:'در حال ضبط…', ready:'صدا آماده است', fail:'شروع ضبط ناموفق', btnStart:'شروع', btnStop:'توقف', btnSave:'ذخیره', btnAttach:'پیوست', hint:'برای ضبط صدای میکروفون، ضبط را شروع کنید' },
    perm:{ denied:'دسترسی رد شد', needAdmin:'این قابلیت مدیر می‌خواهد', needAnalyst:'این قابلیت تحلیلگر یا بالاتر می‌خواهد' }
  },
  es: {
    langName:'Español',
    nav:{ home:'Inicio', services:'Servicios', evidence:'Evidencias', contact:'Contacto', users:'Usuarios', login:'Entrar', logout:'Salir', openCase:'Abrir Caso' },
    hero:{ badge:'Portal soberano', title:'DRAGON403 – Portal Soberano de Forense Digital', sub:'Plataforma reforzada para gestión de evidencias, rastreo de fraude e inteligencia de amenazas.', ctaOpen:'Abrir nuevo caso', ctaDocs:'Guía de subida de evidencias' },
    kpi:{ victims:'Víctimas documentadas (caso HILO)', loss:'Pérdidas confirmadas – Reclamos abiertos', proofs:'Pruebas técnicas documentadas' },
    services:{ dfir:'Investigaciones DFIR', dfirDesc:'Cadena de custodia, extracción de metadatos, cronologías, reportes litigables.', intel:'Inteligencia de amenazas', intelDesc:'Análisis de dominios/IP, huellas de malware y patrones de fraude.', zt:'Pasarela Zero‑Trust', ztDesc:'Autenticación fuerte, cuotas, MFA y auditoría precisa.', ev:'Centro de evidencias', evDesc:'Subidas, hashing, auditoría y vinculación a casos.' },
    strip:{ title:'Tira de evidencias', jwt:'Verificación JWT', req:'Solicitud de evidencias', login:'Intento de acceso' },
    hilo:{ title:'Caso HILO – Guangzhou QiaHaoQingChun', sub:'Fraude organizado. Las pruebas técnicas demuestran patrón y daño.', follow:'Solicitar seguimiento legal' },
    case:{ title:'Abrir nuevo caso', hint:'Complete para iniciar cadena de custodia. (API luego)', name:'Título del caso', pri:'Prioridad', desc:'Descripción corta', create:'Crear', attach:'Adjuntar evidencia', hash:'Hash se generará automáticamente' },
    footer:{ legal:'© 2026 DRAGON403 · CometX · Zero‑Trust Soberano', hint:'Interfaz previa – API luego' },
    theme:{ auto:'Auto', dark:'Oscuro', light:'Claro' },
    login:{ title:'Iniciar sesión', email:'Correo', password:'Contraseña', remember:'Recuérdame', submit:'Entrar', forgot:'¿Olvidaste la contraseña?', or:'O', back:'Volver al inicio' },
    logout:{ title:'Salir', sub:'Sesión cerrada. Serás redirigido.' },
    notify:{ signedInTitle:'Sesión iniciada', signedInMsg:'Bienvenido.', signedOutTitle:'Sesión cerrada', signedOutMsg:'Limpieza correcta.', caseCreatedTitle:'Caso creado', caseCreatedMsg:'Registrado.', caseFailedTitle:'Error', caseFailedMsg:'Verifica campos.', userUpdatedTitle:'Actualizado', userUpdatedMsg:'Acción aplicada.' },
    users:{ title:'Gestión de usuarios', searchPh:'Buscar por nombre o correo…', role:'Rol', status:'Estado', actions:'Acciones', roles:{ admin:'Admin', analyst:'Analista', viewer:'Lector' }, statuses:{ active:'Activo', pending:'Pendiente', blocked:'Bloqueado' }, act:{ enable:'Habilitar', disable:'Deshabilitar', promote:'Promover a Admin', demote:'Bajar a Analista', view:'Ver' }, empty:'Sin resultados.', pager:{ prev:'Anterior', next:'Siguiente', page:'Página' } },
    model:{ badge:'Modelo soberano', title:'DRAGON403 — Modelo IA Soberano', sub:'Optimizado para DFIR, antifraude e inteligencia de amenazas.', ctas:{ try:'Probar ahora', docs:'API Docs', bench:'Muestras' }, hints:{ latency:'Latencia optimizada', privacy:'Privacidad por defecto', local:'Listo para local' } },
    chat:{ title:'Chat de investigación', send:'Enviar', typing:'escribiendo…', memory:'Memoria persistente', memoryOn:'Activada', memoryOff:'Desactivada', drop:'Suelta archivos aquí', attach:'Adjuntar', or:'o', speak:'Hablar', stop:'Detener', accept:'Todos formatos', size:'Tamaño', remove:'Quitar', console:'Consola', clear:'Limpiar', hint:'Envía un mensaje, adjunta pruebas o habla.' },
    voice:{ in:'Entrada de voz', out:'Voz del modelo', voice:'Voz', start:'Iniciar micro', stop:'Detener', tts:'Reproducir respuesta', none:'Ninguna', errMic:'Sin acceso al micro', errTTS:'Fallo TTS' },
    files:{ tooBig:'Archivo muy grande', max:'Máx', uploaded:'Adjuntado', removed:'Eliminado' },
    console:{ title:'Consola oculta', help:'Comandos: /help, /clear, /whoami', who:'DRAGON403 · modo soberano' },
    export:{ title:'Exportar', copy:'Copiar como Markdown', pdf:'PDF' },
    rec:{ title:'Grabación de pantalla', start:'Grabación iniciada', running:'Grabando…', ready:'Video listo', fail:'No se puede grabar', btnStart:'Iniciar', btnStop:'Detener', btnSave:'Guardar', hint:'Selecciona ventana/pestaña' },
    recAudio:{ title:'Grabación de audio', start:'Grabación iniciada', running:'Grabando…', ready:'Audio listo', fail:'No se puede grabar', btnStart:'Iniciar', btnStop:'Detener', btnSave:'Guardar', btnAttach:'Adjuntar', hint:'Graba el micrófono' },
    perm:{ denied:'Permiso denegado', needAdmin:'Requiere Admin', needAnalyst:'Requiere Analista o superior' }
  },
  zh: {
    langName:'简体中文',
    nav:{ home:'首页', services:'服务', evidence:'证据', contact:'联系', users:'用户', login:'登录', logout:'退出', openCase:'新建案件' },
    hero:{ badge:'主权门户', title:'DRAGON403 – 主权数字取证门户', sub:'用于证据管理、欺诈网络追踪与威胁情报的强化平台。界面直陈事实、拒绝粉饰。', ctaOpen:'新建案件', ctaDocs:'证据上传指南' },
    kpi:{ victims:'已记录受害者（HILO 案）', loss:'确认损失 – 待处理索赔', proofs:'已记录技术证据' },
    services:{ dfir:'DFIR 调查', dfirDesc:'证据保全链、元数据提取、时间线、可诉讼报告。', intel:'威胁情报', intelDesc:'域名/IP 分析、恶意代码指纹、欺诈模式。', zt:'零信任网关', ztDesc:'强鉴权、配额、MFA、精确审计。', ev:'证据中心', evDesc:'上传、哈希、审计、案件关联。' },
    strip:{ title:'证据条', jwt:'JWT 校验', req:'证据请求', login:'登录尝试' },
    hilo:{ title:'HILO 案 – 广州恰好青春信息技术', sub:'针对阿拉伯与海湾地区的组织化欺诈。技术证据证明其模式与危害。', follow:'请求法律跟进' },
    case:{ title:'新建案件', hint:'填写以启动证据保全链。（后续对接 API）', name:'案件标题', pri:'优先级', desc:'简要描述', create:'创建', attach:'附加证据', hash:'将自动生成 Hash' },
    footer:{ legal:'© 2026 DRAGON403 · CometX · 主权零信任', hint:'预览界面 – 稍后接入 API' },
    theme:{ auto:'自动', dark:'深色', light:'浅色' },
    login:{ title:'登录', email:'邮箱', password:'密码', remember:'记住我', submit:'登录', forgot:'忘记密码？', or:'或', back:'返回首页' },
    logout:{ title:'退出', sub:'会话已结束，即将跳转至登录。' },
    notify:{ signedInTitle:'已登录', signedInMsg:'欢迎回来，会话有效。', signedOutTitle:'已退出', signedOutMsg:'会话清理完成。', caseCreatedTitle:'案件已创建', caseCreatedMsg:'已记录，将生成 Hash。', caseFailedTitle:'操作失败', caseFailedMsg:'请检查输入后重试。', userUpdatedTitle:'已更新', userUpdatedMsg:'操作已应用。' },
    users:{ title:'用户管理', searchPh:'按姓名或邮箱搜索…', role:'角色', status:'状态', actions:'操作', roles:{ admin:'管理员', analyst:'分析员', viewer:'查看者' }, statuses:{ active:'活跃', pending:'待定', blocked:'已封禁' }, act:{ enable:'启用', disable:'禁用', promote:'设为管理员', demote:'降为分析员', view:'查看' }, empty:'无匹配结果。', pager:{ prev:'上一页', next:'下一页', page:'页' } },
    model:{ badge:'主权模型', title:'DRAGON403 — 主权 AI 模型', sub:'面向 DFIR、反欺诈与威胁情报优化，快速且精准。', ctas:{ try:'立即试用', docs:'API 文档', bench:'样例输出' }, hints:{ latency:'延迟优化', privacy:'默认隐私', local:'可本地运行' } },
    chat:{ title:'调查对话', send:'发送', typing:'输入中…', memory:'持久记忆', memoryOn:'开', memoryOff:'关', drop:'将文件拖放到此处', attach:'附加文件', or:'或', speak:'说话', stop:'停止', accept:'所有格式', size:'大小', remove:'移除', console:'控制台', clear:'清除', hint:'发送消息、附加证据或语音输入。' },
    voice:{ in:'语音输入', out:'模型语音', voice:'声音', start:'启动麦克风', stop:'停止', tts:'播放回复', none:'无', errMic:'麦克风访问失败', errTTS:'TTS 失败' },
    files:{ tooBig:'文件过大', max:'上限', uploaded:'已附加', removed:'已移除' },
    console:{ title:'隐藏控制台', help:'命令: /help, /clear, /whoami', who:'DRAGON403 · 主权模式' },
    export:{ title:'导出', copy:'复制为 Markdown', pdf:'PDF' },
    rec:{ title:'屏幕录制', start:'录制已开始', running:'录制中…', ready:'视频已就绪', fail:'无法开始录制', btnStart:'开始', btnStop:'停止', btnSave:'保存', hint:'开始并选择窗口/标签页' },
    recAudio:{ title:'音频录制', start:'录音已开始', running:'录音中…', ready:'音频已就绪', fail:'无法开始录音', btnStart:'开始', btnStop:'停止', btnSave:'保存', btnAttach:'附加', hint:'开始录音以捕获麦克风音频' },
    perm:{ denied:'权限被拒绝', needAdmin:'需要管理员', needAnalyst:'需要分析员或以上' }
  }
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const detect = () => {
    const saved = localStorage.getItem('locale')
    if (saved) return saved
    const nav = navigator.language?.toLowerCase() || 'ar'
    if (nav.startsWith('ar')) return 'ar'
    if (nav.startsWith('fa')) return 'fa'
    if (nav.startsWith('fr')) return 'fr'
    if (nav.startsWith('tr')) return 'tr'
    if (nav.startsWith('es')) return 'es'
    if (nav.startsWith('zh')) return 'zh'
    return 'en'
  }
  const [locale, setLocale] = useState(detect)
  useEffect(()=>{
    const rtl = (locale === 'ar' || locale === 'fa')
    document.documentElement.setAttribute('lang', locale)
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr')
    localStorage.setItem('locale', locale)
  }, [locale])
  const value = useMemo(()=>({ locale, setLocale, t: (path) => path.split('.').reduce((o,k)=>o?.[k], messages[locale]) ?? path }), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
