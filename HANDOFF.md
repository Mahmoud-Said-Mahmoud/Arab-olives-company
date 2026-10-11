# HANDOFF — حالة التنفيذ

آخر تحديث: 11 أكتوبر 2026 (Codex). المتطلبات في `PROJECT_BRIEF.md` مع التعديلات اللاحقة المطلوبة من المستخدم.

## أحدث تعديل بطلب المستخدم

### ضبط الموبايل والتابلت (Claude، 11 أكتوبر 2026)

كل تنسيقات الشاشات الصغيرة الجديدة في `src/styles/responsive.css` (يُحمَّل آخر ملف في `main.jsx`).

**نُفّذ وفُحص بلقطات Chrome headless (360×640، 375×667، 390×844، 768×1024، 1024×768، عربي وإنجليزي، console نظيف، بلا تمرير أفقي):**
- **مشهد البرطمان (`JarStory.jsx` — فرع compact في `computeLayout`):** المكونات تستقر في منتصف الهامش بجانب البرطمان ولا تركب على الزجاج؛ مواضعها نسب من ارتفاع البرطمان لا أرقام ثابتة. فئة تابلت جديدة (`W >= 700`): برطمان أكبر (حتى 36% من الارتفاع)، مكونات بمقياس 0.82، وأسماء أكبر مع الوصف. الهاتف يعرض الاسم فقط تحت كل مكون. `stage.dataset.size` = phone | tablet | wide.
- **قصة التصدير (`ExportStory.jsx`):** وضع ثالث `play` للهواتف والتابلت بدل الإطارات الأربعة الثابتة: بطاقة واحدة مثبتة يتحرك رسمها مع التمرير (`--p`)، وكاميرا (`camera(p)` تغيّر `viewBox`) تتبع الشحنة، مع عنوان ووصف لكل خطوة وشريط تقدم. الإطارات الثابتة باقية لتقليل الحركة وللنوافذ الأقصر من 520px، وأضيف لها العنوان والوصف.
- **الخريطة (`FactoryMap.jsx`):** بطلب المستخدم تظهر مباشرة على كل الشاشات؛ حُذف زر «عرض الخريطة». ما زالت لا تُحمَّل إلا عند اقتراب القسم من الشاشة. النتيجة: سحب الإصبع فوق الخريطة على الهاتف يحرّك الخريطة لا الصفحة.
- **قائمة الموبايل (`App.jsx`):** سهم (ChevronDown) بجانب «المنتجات» بدل أيقونة الشبكة، يدور عند الفتح.
- **صفحات الفئات على الهاتف (≤600px):** حلقة «اكتشف التشكيلة» تتحول إلى شبكة مرتبة تحت العنوان؛ كانت الدوائر تركب على العنوان في المنتصف وتُخرج المحتوى عن الشاشة عند 360px.
- **إصلاحات أخرى:** الخريطة الكبيرة في «تواصل» و«عن المصنع» كانت أعرض من الشاشة على الهاتف؛ رسالة ترحيب المساعد تختفي بعد أول تمرير على الهاتف والتابلت (كانت تغطي نص فصول البرطمان)؛ مساحة أسفل الفوتر حتى لا يغطي زر المساعد آخر سطر؛ الهيرو على التابلت الطولي ينتهي مع محتواه.

**لم يُفحص:** أجهزة حقيقية وSafari/iOS (خصوصاً `svh` وشريط العنوان المتحرك مع المشهدين المثبتين)، والهاتف بالوضع الأفقي.

### تصميم الكتالوج وصفحات المنتجات

- صفحة `/products` أصبحت بتخطيط فلاتر جانبية على الكمبيوتر، بحث، اختيار الفئة وشكل التحضير، وترتيب المجموعة أو الاسم تصاعدياً وتنازلياً حسب اللغة. على الموبايل تتحول الفلاتر إلى صفوف أعلى شبكة من عمودين.
- كروت المنتجات بصور أكبر وخلفيات هادئة تختلف حسب الفئة، وأسماء واضحة وروابط لصفحات التفاصيل. الأصول نفسها والمنتجات الـ53 باقية.
- صفحات المنتجات تعرض صورة كبيرة قابلة للتكبير في نافذة dialog، مع تنقل للمنتج السابق والتالي من الفئة نفسها، وتفاصيل منظمة وخصائص الصنف وطلب عرض سعر يحمل المنتج المختار. الصورة ثابتة أثناء تصفح التفاصيل على الكمبيوتر، وتتحول إلى عرض عادي على الموبايل. لا توجد أسعار أو أوزان أو مواصفات مخترعة.
- التنسيقات في `src/styles/products.css` وتُحمّل بعد تنسيقات المشروع الحالية. تم الحفاظ على مسارات المنتجات والفئات وRTL/LTR.
- `npm.cmd run build` و`node tools/verify.mjs` ناجحان: إخراج جميع صفحات المنتجات باللغتين، وجود أدوات الفلترة والترتيب ونافذة الصورة والتنقل، وروابط الاستفسار و70 أصل صورة. أُصلحت توقعات الفحص القديمة التي كانت تشترط نصوص الشهادات وعلامة الوجهات القادمة بعد طلب المستخدم حذفهما.
- المعاينة البصرية والتفاعل الفعلي في المتصفح غير مؤكدين في هذه الجلسة: قائمة متصفحات أداة المعاينة فارغة. يلزم تأكيد الفلاتر والترتيب والتكبير وتوافق الهواتف في متصفح.
- الطلبات السابقة الأخرى المنفذة: قسم الشهادات صور وأسماء فقط؛ حُذف قسم نبذة المصنع من الرئيسية وعلامة الوجهات القادمة وسطر عدد المنتجات في رحلة البرطمان. أضيفت 21 قصاصة مكون داخل الزجاج، تتلاشى مجموعاتُها مع خروج المكون وتعود عند عودته.

- البرطمان في مشهد الرحلة يستخدم الآن `public/img/jar/glass-v2.png` الشفاف المولد سابقاً، مع لوجو الشركة الأصلي فوق الزجاج. أزيلت الصورة الممتلئة وطبقتا الملصق والعنق المعتمتان من هذا المشهد. المكونات الأربع الحالية تبدأ ظاهرة في مواضع مستقلة داخل البرطمان وتخرج منها ثم تعود إليها وفق الحركة الحالية.
- أزيل رابطا «تخطي الرحلة» و«عرض كل المنتجات» من مشهد البرطمان ومن بديله الثابت. الكتالوج ومسارات المنتجات الأخرى باقية.
- أزيل رقم 53 من وصف الافتتاحية بالعربية والإنجليزية، كما في الصورة المطلوبة.
- نجح `npm.cmd run build` و`node tools/verify.mjs` بعد تحديث الفحص ليتأكد من غياب روابط التخطي ورقم المنتجات في وصف الافتتاحية ووجود أصل الزجاج الجديد.
- لم تُتحقق التعديلات بصرياً داخل المتصفح في هذه الجولة؛ يلزم تأكيد مواضع المكونات ومحاذاة الغطاء في الموبايل والديسكتوب.

## الحالة باختصار

الموقع صار متعدد الصفحات بمسارات حقيقية: الرئيسية، الكتالوج، أربع صفحات فئات بتكوينات مختلفة، صفحة لكل منتج (53)، عن المصنع، التصدير، تواصل، و404. مشهد البرطمان مبني الآن من **صورة المنتج الفعلية** مقسّمة إلى طبقات (استُبدل بها البرطمان المرسوم SVG)، وقصة التصدير (مصنع ← شاحنة ← ميناء ← سفينة ← خريطة) منفّذة، وأضيف موقع المصنع بخريطة Google في الرئيسية وصفحة التواصل.

الناقص الحقيقي: أصول مصوّرة منفصلة (زجاج أمامي، غطاء من عدة زوايا، مكونات معزولة) وبيانات المصنع (تواصل، مواصفات، تعبئة، علاقة Mano Food).

## التشغيل والفحص

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # dist/
npm run preview
node tools/verify.mjs   # بعد build، ومع خادم يعمل. VERIFY_URL لتغيير العنوان (الافتراضي localhost:5173)
```

على PowerShell استخدم `npm.cmd`. لا يوجد lint ولا إطار اختبارات.

## الاستضافة: SPA fallback

المسارات تُحل في المتصفح (`BrowserRouter`)، فالخادم يجب أن يعيد `index.html` لأي مسار غير ملف. `base` في `vite.config.js` صار `/` (الموقع يُنشر على جذر الدومين).

| الاستضافة | الإعداد |
|---|---|
| Netlify / Cloudflare Pages | جاهز: `public/_redirects` يحتوي `/*  /index.html  200` |
| Vercel | `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` |
| Nginx | `try_files $uri /index.html;` |
| Apache | `FallbackResource /index.html` |
| GitHub Pages | لا يدعم fallback؛ انسخ `index.html` إلى `404.html` أو انتقل إلى `HashRouter` |

للنشر تحت مسار فرعي: غيّر `base` وأضف `basename` إلى `BrowserRouter` في `src/App.jsx`.

## 1) منفّذ ومُتحقق منه

بلقطات Chrome headless على خادم التطوير و`vite preview`، console نظيف وبلا تمرير أفقي في كل لقطة.

| البند | ما تم التحقق منه |
|---|---|
| المسارات | كل مسار يفتح مباشرة (`/products/pickles`، صفحة منتج، `/export?...`، `/nope`) ويعيد 200 من `vite preview` |
| التحديث والرجوع | تحديث صفحة منتج يبقى عليها؛ `history.back()` يعيد للمنتج |
| اللغة | الإنجليزية بقيت بعد التحديث وعلى نفس صفحة المنتج (localStorage) |
| الافتتاحية | 1440×880 و390×760، عربي وإنجليزي |
| الفئات الأربع في الرئيسية | موزاييك بأربع بلاطات تفتح صفحاتها |
| مشهد البرطمان | ديسكتوب وموبايل: البرطمان هو صورة المنتج (نفس الشكل والغطاء والملصق). الغطاء يُفك ويرتفع أولاً؛ حلقة تُبرز الفئة داخل البرطمان؛ المجموعة تصعد خلف الزجاج من وراء الملصق، تختفي خلف العنق وتخرج فوق الحافة (لقطات مقرّبة عند العنق)، ثم تنحني لمكانها بسهم واسم وجملة ورابط. الأربع تبقى عائمة ثم تعود ويُغلق الغطاء. التمرير العكسي يعكس الحركة. الارتفاع 42% من المشهد (ديسكتوب) و31% (موبايل) |
| موقع المصنع | الرئيسية وصفحة التواصل: خريطة Google حقيقية تحمّلت وعليها الدبوس عند 30.446131, 30.60756؛ زرّا الاتجاهات والفتح؛ على الموبايل بطاقة ثم «عرض الخريطة» قبل تحميل أي شيء؛ عربي وإنجليزي |
| قصة التصدير | ديسكتوب: المراحل الأربع عند مواضع تمرير مختلفة حتى الخريطة (مصر، البرتغال، إسبانيا). موبايل وتقليل الحركة: أربع لقطات ثابتة |
| الكتالوج | 53 بطاقة، بحث، فلتر فئة، فلتر تحضير، مسح |
| صفحات الفئات | الأربع على الديسكتوب؛ الأخضر والأسود والمخللات على الموبايل |
| صفحة المنتج | ديسكتوب وموبايل، اسمان بلغتين، 4 منتجات ذات صلة |
| `/export` | الرابط من صفحة المنتج يملأ الفئة والمنتج والتحضير في الملخص |
| `/about`، `/contact`، 404 | ديسكتوب |
| قائمة الموبايل | تعرض الفئات الأربع وباقي الصفحات |
| تقليل الحركة | نسخة ثابتة من الرحلة ومن قصة التصدير |
| فشل تحميل الأنيميشن | حُجب ملف `JarStory`: بقيت النسخة الثابتة بلا أخطاء |
| `npm run build` | ناجح؛ ملف لكل مسار |
| `node tools/verify.mjs` | ناجح: يرسم كل المسارات باللغتين (53 صفحة منتج، 4 فئات، حالات 404)، ويتأكد من نسبة الوثائق، وأن البرتغال وإسبانيا هما الوجهتان الوحيدتان، وأنه لا تظهر بيانات تواصل وهمية، ومن 68 صورة |

**أحجام البناء (gzip):** الأساس المشترك 69KB، الرئيسية 4KB، مشهد البرطمان مع GSAP 52KB (يُحمَّل عند الاقتراب)، CSS 14KB، وباقي الصفحات أقل من 3KB لكل واحدة. `dist/` كله 3.4MB.

**قياسات فعلية** من `vite preview` محلياً بلا throttling (ليست Lighthouse ولا تمثل شبكة حقيقية): first-contentful-paint ≈ 550ms للرئيسية على الديسكتوب و≈ 300ms بمحاكاة موبايل؛ الرئيسية 29 طلباً و≈ 1MB على الديسكتوب، و20 طلباً و≈ 485KB على الموبايل؛ `/products` على الموبايل ≈ 570KB.

## 2) منفّذ بانتظار مراجعة بصرية أو فحص أوسع

- **متصفحات وأجهزة:** Safari/iOS، Firefox، أجهزة حقيقية. قصة التصدير تعتمد على `clamp()` و`calc()` بأرقام بلا وحدات داخل `transform` و`opacity`، ومشهد الفئات على `mask-composite` و`translate` المنفردة — كلها لم تُختبر خارج Chrome.
- **مقاسات لم تُلتقط:** 820×1100، 1100×640، 320px، والإنجليزية على الموبايل لغير صفحة المنتج.
- **الحركات الزمنية:** دخول بلاطات الفئات، تنقّل إطار الأشكال في صفحة الأخضر، دوران عنقود الأسود، تجمّع حلقة المخللات، وانزلاق الفلفل القُطري — التُقطت حالتها النهائية لا حركتها.
- **التفاعل داخل صفحات الفئات:** اختيار حشوة/نوع لون/خضار/صنف وتأثيره على الشبكة يعمل في الكود، ولم يُلتقط بعد النقر. صفحة الفلفل لم تُلتقط على الموبايل.
- **التمرير العكسي لقصة التصدير:** مشتق من موضع التمرير فهو معكوس بالبناء، لكنه لم يُلتقط صعوداً.
- **يدوي:** لوحة المفاتيح داخل القائمة المنسدلة والنوافذ، قارئات الشاشة، زر «انسخ الملخص»، وتكبير الوثائق باللمس.

## 3) غير مكتمل لنقص أصول أو معلومات مؤكدة

**بصرياً**
- **مشهد البرطمان: الجسم والملصق نهائيان، وثلاث طبقات مؤقتة.** الجسم والملصق هما صورة المنتج دون تعديل. المؤقت (معلَّم في `LAYERS` داخل `JarStory.jsx`):
  - **الزجاج الأمامي** مُستخرَج من لمعات الصورة نفسها مع غلالة خفيفة منها، لا تصوير زجاج منفصل؛ يكفي ليبدو ما خلفه «داخل البرطمان» دون انكسار حقيقي.
  - **العنق/الحافة** من الصورة الأمامية، فالفوهة تُرى من الجانب (خط) لا بيضاوية؛ المجموعة تخرج من خلف الحافة لا عبر فتحة مرئية.
  - **الغطاء** قصّة أمامية واحدة: يرتفع ويدور بلمعة متحركة، ولا يميل ولا يُرى باطنه.
- **المجموعة التي تخرج ليست المكوّن نفسه الظاهر في الصورة.** محتويات الصورة ثابتة؛ الحلقة تشير للفئة داخل البرطمان ثم تصعد مجموعة ممثِّلة كانت مخفية خلف الملصق. لا تكرار ولا ظهور مفاجئ، لكن البرطمان لا «ينقص».
- **المكونات قصاصات** بيضاوية من صور منتجات أخرى خلف الزجاج (حواف تقريبية وانعكاسات)، بنفس مقياس البرطمان لأنها من نفس قالب التصوير. المستخدم أربع: زيتون أخضر، زيتون أسود، فلفل أحمر، خيار. **لا يوجد** قرنبيط ولا فلفل أخضر ولا بصل ولا ليمون معزول بجودة كافية.
- **«الكاميرا تبتعد» بعد إغلاق الغطاء** غير منفّذة؛ قصة التصدير قسم يلي المشهد.
- **صفحات الفئات تستخدم صور البرطمانات** (لقطات مقرّبة دائرية) بدل مكونات معزولة للمخلي والمحشي والأنصاف، وللخضروات والفلفل. هذا بديل، والمطلوب الأصلي أصول معزولة.
- **حشوات الزيتون** أسماء نصية بلا صورة لكل حشوة.
- **دوران عنقود الزيتون الأسود** تمايل لصورة مسطحة مع ضوء متحرك، لا دوران ثلاثي الأبعاد.

**معلومات**
- **بيانات التواصل:** لا هاتف ولا بريد ولا واتساب مؤكد. المعروض رابط الخريطة فقط.
- **إرسال الطلب:** لا backend؛ المتاح «انسخ الملخص» مع جملة صريحة بذلك.
- **المواصفات والتعبئة لكل منتج:** الحقلان يعرضان «تُؤكَّد من المصنع عند الاستفسار».
- **خيارات التعبئة:** المذكور فقط أن الصور تُظهر برطمانات زجاجية.
- **الصنف** غير مذكور في أسماء بعض المنتجات فيظهر «غير محدد في اسم المنتج». و5 منتجات زيتون أسود لا يحدد اسمها طبيعي/مؤكسد فتبقى بلا تصنيف.
- **نبذة المصنع:** سطر واحد مما ورد في التوجيه. لا تاريخ ولا طاقة ولا صور.
- **جولة المصنع:** مدخل نصي في `/about`. لقطة القمر الصناعي غير موجودة في المشروع.
- **درجات Lighthouse:** لم تُقَس (الأداة غير مثبتة).

## الأصول المطلوبة بالتحديد

| الملف | الصيغة | الاستخدام |
|---|---|---|
| نفس البرطمان من زاوية مرتفعة 10–15° تُظهر الفوهة بيضاوية، ممتلئاً وفارغاً | PNG شفاف ≥2000px | يستبدل `jar/body.webp` و`jar/neck.webp` ويعطي فتحة مرئية |
| الزجاج الأمامي كطبقة انعكاسات فقط، بنفس الزاوية | PNG شفاف بنفس المقاس | يستبدل `jar/glass.webp` |
| الغطاء منفرداً: جانبي، ثلاثة أرباع، ومن الأسفل | PNG شفاف ≥1000px | يستبدل `jar/lid.webp` ويسمح بالإمالة |
| رابط embed رسمي لقائمة «Arab Olive Foundation» (اختياري) | من Google Maps ← Share ← Embed a map | يُعاد من `LOCATION.embedUrl` في `config.js` بدل الرابط الحالي |
| مكونات معزولة: زيتون أخضر، أسود، خيار، ليمون، بصل، قرنبيط، فلفل أحمر، فلفل أخضر | PNG/WebP شفاف ≥1000px، زاويتان | البرطمان، الافتتاحية، بلاطات الفئات |
| أشكال الزيتون: سليم، مخلي، شرائح، أنصاف، محشي (ولكل حشوة) | PNG/WebP شفاف ≥800px | إطار الأشكال وقوس الحشوات في صفحة الأخضر |
| ملصق العلامة المسطّح | SVG أو PNG | على البرطمان والكرتونة |
| اللوجو بدقة عالية | SVG أو PNG ≥1000px | الحالي 294×208 ويظهر ناعماً على retina |
| صور المنتجات بخلفية شفافة أو بيضاء نقية | PNG/WebP | تزيل الفرق اللوني الخفيف على العاجي |
| بديل عن الثلاثة الأولى | تسلسل 60–120 صورة، أو glTF <1MB | مشهد برطمان واقعي |
| تصوير المصنع | صور/فيديو | `/about` وجولة المصنع |

## بنية الكود

```
index.html
vite.config.js              base '/'، وplugin يحذف dist/images/products
public/_redirects           SPA fallback
assets-src/                 مصادر غير منشورة (silhouette البرطمان، الزجاج المولَّد القديم، اللوجو المقصوص)
tools/verify.mjs
tools/build_jar_layers.py   يبني طبقات البرطمان في public/img/jar من صورة المنتج (py، يحتاج Pillow وnumpy)
src/
  main.jsx
  App.jsx                   المسارات، الهيكل (هيدر/قائمة/فوتر)، lazy لكل صفحة
  lang.jsx                  LangProvider (حفظ اللغة)، useLang، useInView
  i18n.js                   النصوص الأساسية ar/en
  copy.js                   نصوص الصفحات والمسارات؛ تُدمج فوق i18n.js (مفتاحها يَغلِب)
  config.js                 BRAND، LOGO، LOCATION_URL، DESTINATIONS
  inquiry.js                نقطة ربط إرسال الطلبات (CHANNELS)، الوحدات، التعبئة
  data/products.js          الـ53 منتجاً (slug، variety، tone، veg)، الفئات ومساراتها، describe()، STORY
  data/awards.js            الوثائق السبع
  styles.css                الأساس ومشهد البرطمان والفوتر
  styles/v2.css             الافتتاحية، أدوات الكتالوج، نموذج الطلب، عارض الوثائق
  styles/v3.css             الهيكل متعدد الصفحات، الموزاييك، قصة التصدير، صفحات الفئات والمنتج
  pages/                    Home, Products, Category, Product, About, Export, Contact, NotFound
  components/
    Hero.jsx                الافتتاحية
    FamilyIntro.jsx         موزاييك الفئات الأربع
    Story.jsx               يحمّل JarStory عند الاقتراب، وStaticStory بديلاً
    JarStory.jsx            محرك مشهد البرطمان (GSAP ScrollTrigger)
    FactoryMap.jsx          خريطة موقع المصنع وزرّا الاتجاهات، وقسم الرئيسية
    StaticStory.jsx         النسخة الثابتة
    ExportStory.jsx         قصة التصدير (SVG واحد يقوده --p)
    Discovery.jsx           مشاهد الاكتشاف الأربعة لصفحات الفئات
    Catalog.jsx             البحث والفلاتر والشبكة
    Inquiry.jsx             «جهّز طلبك»
    Awards.jsx              الجوائز والوثائق والعارض
    Page.jsx                usePage، Breadcrumbs، ProductCard
    Sections.jsx            الفوتر
```

## كيف تعمل الأجزاء المتحركة

**مشهد البرطمان (`JarStory.jsx`).** قسم طويل بداخله `.stage` لاصق. ScrollTrigger واحد (`scrub: 0.6`) يحرك رقماً 0→1، و`render` تحسب كل شيء منه كل frame، وتتوقف خارج الشاشة وعند إخفاء التبويب، وتُنظَّف عند مغادرة الصفحة. الميزانية: `INTRO` 1.6 + فصل لكل فئة + `OUTRO` 2 (عودة وإغلاق)، بـ36svh للفصل ≈ 2.7 شاشة. الطبقات بترتيب z (ملفاتها في `LAYERS`): ظل ← `body` (صورة المنتج كاملة) ← المجموعة وهي بالداخل ← `glass` ثم `neck` ثم `label` ← حلقة الإشارة ← المجموعة بعد خروجها ← `lid` ← الأسهم ← النصوص. كل الطبقات على نفس لوحة 816×950 فتتراكب بلا إزاحات. المجموعة تنتظر خلف الملصق (معتم)، وزمن فصلها: إشارة 0–0.2، صعود في العنق 0.14–0.44، انحناء للخارج 0.42–0.8، النص والسهم 0.72–0.94. على الموبايل 28svh للفصل وتصغير المجموعة بعد خروجها فقط. العودة = زمن الخروج معكوساً، فالمسار واحد في الاتجاهين.

**قصة التصدير (`ExportStory.jsx`).** رسم SVG واحد؛ كل موضع فيه دالة من `--p` في `v3.css` (ابحث عن `.xs-`). على الشاشات العريضة: قسم بارتفاع 290svh ومسرح لاصق، و`--p` يتبع التمرير عبر `requestAnimationFrame` ما دام القسم ظاهراً. غير ذلك: أربع نسخ من الرسم نفسه بـ`--p` ثابت و`viewBox` مقصوص. مواضع الخريطة من خطوط الطول والعرض على شبكة واحدة.

**صفحات الفئات (`Discovery.jsx`).** كل مشهد يظهر مرة عند دخوله الشاشة (`useInView` ← `.is-in`) بانتقالات CSS. الاختيار داخله يُرفع كـ`pick` (`{ key, label, test }`) إلى `Category.jsx` ثم `Catalog.jsx` ليضيّق الشبكة.

**موقع المصنع (`FactoryMap.jsx`).** البيانات في `LOCATION` داخل `config.js` (الاسم، الإحداثيات، رابط الخريطة، رابط الاتجاهات، رابط الـembed). الـiframe لا يُنشأ إلا عند اقتراب الإطار من الشاشة، وعلى شاشات اللمس بعد الضغط على «عرض الخريطة». الإطار بنسبة ثابتة، وتحته بطاقة بالاسم والإحداثيات تبقى ظاهرة إن لم يُحمَّل الـembed. الروابط الخارجية بـ`rel="noopener noreferrer"`، ولا يُطلب موقع الزائر.

**إعداد الـembed:** المستخدم حالياً رابط Google Maps بلا مفتاح (`maps?q=<lat>,<lng>&output=embed`) ويعمل دون إعداد. هو يضع دبوساً على الإحداثيات ولا يعرض بطاقة القائمة «Arab Olive Foundation»؛ لعرضها استبدله برابط الـembed الرسمي (Share ← Embed a map).

## نقطة ربط الإرسال

`src/inquiry.js` يبني `CHANNELS.whatsapp` و`CHANNELS.email` من `config.js` ويعيد `null` لكل قناة قيمتها placeholder. عندها يعرض النموذج «انسخ الملخص» فقط. للتفعيل: رقم دولي حقيقي وبريد حقيقي في `config.js`. لربط API: أضف قناة هناك واستدعِها من `Inquiry.jsx`. `verify.mjs` يتأكد حالياً أن القناتين `null`، فحدّثه عند التفعيل.

## قرارات تحتاج صاحب المشروع

1. **Arab Olives وMano Food:** الوثائق السبع باسم Mano Food والموقع ينسبها لها صراحة. إن تأكدت العلاقة يُعدَّل `awards.holder` في `i18n.js`.
2. **الاسم العربي للعلامة:** يُستخدم «Arab Olives» في اللغتين.
3. **وثيقة FDA 2023:** معروضة كوثيقة تسجيل منشأة لعام 2023 مع «ليست اعتماداً للمنتجات». إبقاء أم حذف؟
4. **جائزة زيت الزيتون وجائزة «تونسي»:** لا يقابلهما منتج في الكتالوج.
5. **بيانات التواصل الحقيقية** لتفعيل الإرسال وصفحة التواصل.
6. **«للسوق المحلي وللتصدير»** في نص الافتتاحية: تُراجَع.

## مشاكل متبقية وتنظيف

- **كود ميت.** `styles.css` فيه تنسيقات أقسام حُذفت (الافتتاحيات القديمة، المصنع/الجملة/الجودة، نموذج التواصل القديم، طبقات البرطمان المصوّر). `i18n.js` فيه مفاتيح غير مستخدمة (`hero`, `final`, `about`, `wholesale`, `quality`، وأغلب `contact`). CSS الكلي 62KB (14KB gzip).
- **`public/images/products`** (~100MB) ما زالت في `public/`؛ الـplugin يحذفها من `dist/` فقط.
- **صور المنتجات** 520×598 بمقاس واحد بلا `srcset`.
- **صور الوثائق** JPEG بحجمها الأصلي (790KB للسبع، lazy).
- **تحديث الصفحة** لا يحفظ فلاتر الكتالوج (ليست في الرابط).
- **`<title>` و`meta description`** في `index.html` ثابتان بالعربية؛ العنوان يتحدث بعد التحميل، ولا توجد وسوم Open Graph.
- **Git:** `web/` و`tools/` غير متتبَّعين ولم يُعمل commit، فلا سجل للرجوع.

## ما تغيّر في هذه الجلسة

**جديد:** `react-router-dom`، `src/lang.jsx`، `src/copy.js`، `src/pages/*` (8 ملفات)، `components/{FamilyIntro, ExportStory, Discovery, JarArt, Page}.jsx`، `styles/v3.css`، `public/_redirects`.

**أُعيدت كتابته:** `App.jsx`، `Catalog.jsx` (بطاقات روابط بدل نافذة)، `Awards.jsx` (مجموعتان)، `Sections.jsx` (الفوتر فقط)، `tools/verify.mjs`.

**عُدِّل:** `JarStory.jsx` (هندسة البرطمان المرسوم، مجموعات ثابتة، نصوص الفصول)، `Hero.jsx` و`Inquiry.jsx` (روابط وسياق اللغة)، `data/products.js` (slugs، أصناف، نوع اللون، الخضار، مسارات)، `config.js`، `vite.config.js`، `index.html`، `main.jsx`.

**حُذف:** `ExportBridge.jsx` (استُبدل بـ`ExportStory.jsx`)، وأقسام المصنع/الجملة/الجودة ذات الـplaceholders.

**آخر تعديلين:** (1) البرطمان المرسوم `JarArt.jsx` حُذف، وحلّت محله طبقات فوتوغرافية يبنيها `tools/build_jar_layers.py` في `public/img/jar/{body,glass,neck,label,lid}.webp` (≈355KB معاً). (2) أضيف `FactoryMap.jsx`، قسم «مكان المصنع» في الرئيسية، الخريطة في `/contact`، ورابط الفوتر.

**في `assets-src/`:** `jar/body.webp` (مصدر الـsilhouette)، `jar/lid.webp`، والملفات غير المستخدمة `jar/{glass-v2.png, glass-v2.webp, empty.webp}` و`logo.webp`.

**بقي كما هو من عمل سابق:** تصميم الفوتر (شارة اللوجو، معاينة الفئات عند hover)، محرك مشهد البرطمان، شريط التقدم وأزرار الفصول.

## قائمة تحقق يدوي مقترحة

1. افتح `/products/black-olives` مباشرة وحدّث الصفحة.
2. في الرئيسية: انزل في مشهد البرطمان ثم اصعد، وراقب خروج كل مجموعة عند العنق، واضغط «تخطي الرحلة».
2b. افتح «مكان المصنع»: الخريطة تظهر، و«الاتجاهات للمصنع» يفتح Google Maps على الإحداثيات. على الهاتف: «عرض الخريطة» أولاً.
3. مرّ على قصة التصدير نزولاً وصعوداً، ثم «تخطي».
4. في كل صفحة فئة: اختر حشوة/نوع لون/خضاراً/صنفاً وتأكد أن الشبكة تضيق، ثم «مسح الفلاتر».
5. من صفحة منتج: «استفسر عن المنتج» ← تأكد من الملخص.
6. بدّل اللغة داخل صفحة منتج وحدّث الصفحة.
7. افتح وثيقة ← تكبير ← أسهم ← Esc.
8. كرر على هاتف حقيقي، خصوصاً iOS Safari.
## About Page Update - 2026-10-11

- Removed the current range and current export destinations sections from `/about` in both languages.
- Added a short factory introduction using existing project information; retained the location link, documents, and other page elements.
- Production build and automated Arabic/English route checks passed. Browser visual verification remains unavailable in this session.

## Export Destinations Correction - 2026-10-11

The owner confirmed Brazil, Spain, Italy and France as export destinations, with Brazil and Spain the main markets. Updated both languages and the conceptual export scene. This supersedes older references to Portugal. The removed destination section on `/about` stays removed.

## Export Scene Completion - 2026-10-11

Fixed staggered route timing: all four destination paths now finish before scroll progress reaches 1 (previous timing only supported two). Added complete subtle route tracks, destination rings, factory logo and bilingual primary-market labels for Brazil and Spain. Expanded the mobile final frame to retain labels. Build and route checks run; visual browser review unavailable.

## Company Product Showcase - 2026-10-11

Removed product counts from the homepage family tiles in Arabic and English. Replaced the all-products sidebar/filter/sorting layout with four category galleries displaying all 53 original images and names linked to their detail pages. Added category anchor navigation and responsive three/two-column layouts. Category pages remain unchanged. Browser visual verification is unavailable; production build and automated bilingual checks run separately.

## Interactive Family Selection - 2026-10-11

Jar clusters now remain outside at the end, with the lid open, and become keyboard-accessible category links once settled. Scrolling backward still reverses their release. The products showcase now selects one family at a time with accessible buttons; no sorting, sidebar or commerce controls. Build and bilingual automated checks run; actual browser motion verification remains pending.

## Factory Assistant - 2026-10-11

Added a compact bilingual local factory assistant with suggested topics, keyword-based text questions, confirmed factory/export copy and links to product families, documents and contact. It does not call an AI service or send/store conversations remotely. Supports Escape, focus restoration and bounded mobile layout. Live-browser interaction testing remains pending.

## Assistant Visibility - 2026-10-11

Added an initially visible bilingual welcome invitation above the assistant launcher. Clicking opens the assistant; visitors can dismiss it, and it stays dismissed during navigation for the current mount. Production build checked.

## About Factory Map - 2026-10-11

Removed the factory tour teaser in both languages. Replaced the plain location column with the existing large Google Maps embed and directions/map links beneath a cleaner factory introduction. The embed uses the owner-supplied coordinates; touch users enable the map explicitly to preserve page scrolling. Build and bilingual route checks run; live map rendering still needs browser verification.

## WhatsApp Requests - 2026-10-11

Owner-confirmed WhatsApp number: +201288518544. Inquiry action now opens wa.me/201288518544 with the encoded order summary. The visitor must confirm sending in WhatsApp; no automatic sending or backend delivery is implied. URL number and Arabic/English message encoding are covered by automated checks. Email remains unconfigured.

## Factory Copy Cleanup - 2026-10-11

Removed the factory introduction subheading and its top divider in both languages, retaining the paragraph and map. Updated request-form verification for the newly configured WhatsApp channel.

## Temporary WhatsApp Number - 2026-10-11

Latest owner instruction overrides the previous recipient: requests now open WhatsApp at +201012661145 (local 01012661145). This is temporary; change BRAND.whatsapp in src/config.js when the owner supplies the final recipient. No test message was sent.

## Latest WhatsApp Recipient - 2026-10-11

The owner restored 01288518544 (+201288518544) as the request recipient. This supersedes the temporary 01012661145 number. No message was sent.

## About Subtitle Removal - 2026-10-11

Removed the short factory subtitle below Arab Olives in both languages, retaining the main factory paragraph and Google Maps section.

## About Spacing - 2026-10-11

Tightened the about-page title-to-paragraph spacing, paragraph-to-location gap and location-header-to-map gap. Removed the map action row's inherited top margin for aligned desktop controls; added scoped mobile spacing. No other pages changed.

## Pepper Dimensions - 2026-10-11

Added owner-supplied screenshot dimensions in src/data/pepperSpecs.js: whole jalapenos 4-8 cm, cherry peppers 25-50 mm, Mexican medium 3-6 cm and large 6-10 cm; red jalapeno slices diameter 1.5-3.5 cm and thickness 1 cm; green slices diameter 1.5-3 cm and thickness 0.5 cm. Shown on matching product detail pages in both languages. Retained company photos; no other supplier logo, manufacturing/price claims or unspecified dimensions copied. Lombardi, plain red peppers and harissa remain without dimensional claims.

## Pepper Specifications Visibility - 2026-10-11

Specifications were initially visible only on product detail pages. They now appear below matching pepper names on shared product cards, including the pepper category and all-products showcase. No dimensions invented for unspecified products.

## Product Packaging Row Removed - 2026-10-11

Removed the Packaging options / confirmed-on-enquiry row from every product detail page in both languages. Other product specifications remain unchanged. Automated checks cover its absence across all 53 products.

## Descriptions for All Eleven Peppers - 2026-10-11

Following the owner's explicit request, every pepper now includes the shared production description supplied in the screenshots, translated into English, prefixed with its own product name and preparation. Modern production and competitive-price statements are owner-supplied, not independently verified. Existing matched dimensions remain; unspecified measurements are not invented. Removed generic pending technical row for peppers. Automated bilingual checks cover description presence for all eleven products.

## Unspecified Variety Row - 2026-10-11

Removed the variety row when no variety is stated in the product name, in both languages. Known varieties remain visible. Automated checks verify the placeholder is absent across all products.

## Assistant Contact Topic - 2026-10-11

Added bilingual Contact & WhatsApp topic and contact keyword recognition. Replies show the latest configured number (+201288518544) with telephone and direct WhatsApp links, sourced from BRAND.whatsapp so future recipient updates propagate automatically. No message is sent automatically.

## Reference Product Details - 2026-10-11

The owner confirmed the reference products/descriptions/specifications match their catalog. Downloaded the site's public JS bundle and parsed it with Babel (not executed). Extracted 245 multilingual product records to docs/reference-extracted.json; tools/extract-reference.mjs and build-product-tables.mjs reproduce the extraction and 23 matching grading tables in src/data/productTables.json.

Expanded descriptions across all 53 products in both languages with original wording. Added exact-match olive grading tables, stuffed-olive grading, cucumber size tables, onion count and yellow-lemon dimensions alongside existing pepper measurements. No invented dimensions for products whose source has none; no supplier branding, contact details, factory history or extra products imported. Removed generic pending technical rows. Descriptions and basic dimensions are visible on product pages; basic dimensions also appear on cards. Source site does not provide tables for every variety (e.g. green Aggizi/Dolce), and some ranges overlap; retained source values rather than guessing corrections. Live browser QA remains unavailable.

## Unified Category Opening - 2026-10-11

Applied the requested pickle-page circular discovery layout to all four category pages, retaining each headline and description. Green circles select preparations; black circles select varieties; pickle circles select vegetables; pepper circles select varieties or harissa. Selections toggle the category catalog below. Removed the former separate category compositions and their timers. Responsive typography is scoped to the shared layout; visual browser QA remains pending.

## Navbar Refresh - 2026-10-11

Refined the shared navbar with a larger logo, restrained near-white surface, balanced spacing, compact quote/language controls and category colour markers. Product dropdown is explicitly toggled and supports Escape, outside click and route-close; mobile uses an expandable category list. All existing links retained. Build and route checks run; live visual/interaction QA remains pending.

## Confirmed Contact Numbers - 2026-10-11

Owner supplied telephone 01092178421 (+201092178421), with WhatsApp remaining +201288518544. Contact page and assistant now distinguish both channels and link to the appropriate tel/wa.me destinations. Removed outdated contact-page pending notice. No calls or messages initiated.

## Navbar Hover Previews - 2026-10-11

Removed the products arrow. Desktop product dropdown now opens on hover or keyboard focus, with a fixed-size thumbnail preview for each category on hover/focus. Mobile retains an explicit Categories button without an arrow; existing expand/collapse and links retained. Production build and route checks run; live hover QA pending.

## Footer Contact Numbers - 2026-10-11

Added owner-confirmed telephone 01092178421 and WhatsApp +201288518544 to the shared footer in Arabic/English, linked to tel and wa.me respectively. No calls or messages initiated.

## Icon Controls - 2026-10-11

WhatsApp remains 01288518544 (+201288518544). Added lucide-react and replaced suitable utility text/symbol controls with labelled, titled icons: phone/WhatsApp, language, mobile menu/categories, copy/email, map/directions, image/document zoom/close/previous/next, footer top, assistant launcher/send/topic shortcuts. Product/family names, headings and primary quote/browse commands retain text for clarity. WhatsApp uses a chat icon (Lucide does not include the branded WhatsApp logo). Dependency install reported 4 audit findings (3 moderate, 1 high); no force upgrades applied. Browser visual checks pending.

