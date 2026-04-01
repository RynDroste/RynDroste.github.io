(function () {
  var STORAGE_KEY = "cg-lab-lang";

  var STR = {
    en: {
      metaDesc: "Computer graphics portfolio — personal projects in rendering, shaders, and visualization.",
      worksMetaDesc: "Selected computer graphics projects — path tracing, real-time rendering, procedural content.",
      siteTitle: "CG Lab",
      titleWorks: "Works · CG Lab",
      skip: "Skip to content",
      skipWorks: "Skip to works",
      navAria: "Primary navigation",
      navWorks: "Works",
      navStack: "Stack",
      navAbout: "About",
      langGroupAria: "Language",
      githubSidebarTitle: "GitHub profile",
      githubViewProfile: "View on GitHub",
      githubPublicRepos: "Public repositories",
      githubBioEmpty: "No bio on GitHub yet.",
      githubLoadError: "Could not load profile from GitHub.",
      contactTitle: "Contact",
      contactEmailAria: "Email chenxu@usi.ch",
      contactXAria: "X (formerly Twitter)",
      contactXHandle: "@RynDroste",
      heroKicker: "Computer Graphics",
      heroTitle: "Experiments in rendering, geometry, and pixels",
      heroLede:
        "A collection of personal projects on ray tracing, real-time rendering, shaders, and visualization. Each project has its own page with source and notes.",
      btnWorks: "View works",
      worksPageTitle: "My works",
      worksPageLede: "Personal projects and experiments.",
      worksTitle: "My works",
      projThumb1Aria: "Placeholder thumbnail — replace with a render screenshot",
      projThumb2Aria: "Placeholder thumbnail",
      projThumb3Aria: "Placeholder thumbnail",
      proj1Title: "USI CG",
      proj1Desc: "Computer graphics at USI — rendering, shaders, and related labs or projects.",
      proj2Title: "USI Image Video Processing",
      proj2Desc: "Image and video processing at USI — algorithms, pipelines, and coursework.",
      proj3Title: "Shallow Water Simulation and Real-Time Rendering — Bachelor project",
      proj3Desc:
        "Real-time shallow water simulation and visualization; parallel numerical solver on CUDA with OpenGL rendering.",
      linkSource: "Source",
      linkNote: "Note",
      wikiTocTitle: "Contents",
      wikiOpenRepo: "Open repository",
      stackTitle: "Stack & Tools",
      aboutSectionTitle: "About",
      aboutP1Html:
        'This site gathers personal work on <strong>real-time and offline graphics pipelines</strong>, shaders, and procedural content. Longer write-ups live on each project page under Note.',
      footerHtml:
        '<a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">GitHub Pages</a>',
      backHome: "← Home",
      backWorks: "← All works",
      workDetailSection: "Project details",
      titleWork1: "USI CG · CG Lab",
      titleWork2: "USI Image Video Processing · CG Lab",
      titleWork3: "Shallow Water Simulation and Real-Time Rendering — Bachelor project · CG Lab",
      work1DetailMetaDesc:
        "USI CG — computer graphics coursework: rendering, shading, and visualization.",
      work2DetailMetaDesc:
        "USI Image Video Processing — image and video algorithms, filters, and pipelines.",
      work3DetailMetaDesc:
        "Shallow water simulation and real-time rendering — CUDA-accelerated solver with OpenGL visualization.",
      work1DetailP1: "This is the work of the USI CG assignments.",
      work2DetailP1:
        "This is the work of the USI Image Video Processing assignments.",
      work3DetailP1:
        "Height-field, flux-based shallow water equations with explicit time integration; coupled to a rendering pipeline using height-field textures and mesh displacement.",
      noteLoading: "Loading notes…",
      noteError: "Could not load notes.",
      noteEmpty: "No notes yet. Edit the Markdown file in the notes folder."
    },
    zh: {
      metaDesc: "计算机图形学作品集 — 渲染、着色器与可视化相关个人项目。",
      worksMetaDesc: "计算机图形学作品 — 路径追踪、实时渲染、程序化内容等个人项目。",
      siteTitle: "CG Lab",
      titleWorks: "作品 · CG Lab",
      skip: "跳到正文",
      skipWorks: "跳到作品列表",
      navAria: "主导航",
      navWorks: "作品",
      navStack: "技术栈",
      navAbout: "关于",
      langGroupAria: "语言",
      githubSidebarTitle: "GitHub 主页",
      githubViewProfile: "在 GitHub 上查看",
      githubPublicRepos: "公开仓库",
      githubBioEmpty: "GitHub 上暂无简介。",
      githubLoadError: "无法从 GitHub 加载资料。",
      contactTitle: "联系方式",
      contactEmailAria: "发送邮件至 chenxu@usi.ch",
      contactXAria: "X（原 Twitter）",
      contactXHandle: "@RynDroste",
      heroKicker: "计算机图形学",
      heroTitle: "渲染、几何与像素的实验记录",
      heroLede:
        "这里整理光线追踪、实时渲染、着色器与可视化相关的个人项目；每个作品有独立页面，内含源码与笔记目录。",
      btnWorks: "浏览作品",
      worksPageTitle: "精选作品",
      worksPageLede: "个人项目与实验。",
      worksTitle: "精选作品",
      projThumb1Aria: "项目占位图：可替换为渲染截图",
      projThumb2Aria: "项目占位图",
      projThumb3Aria: "项目占位图",
      proj1Title: "USI CG",
      proj1Desc: "USI 计算机图形学 — 渲染、着色器与相关实验或课程项目。",
      proj2Title: "USI Image Video Processing",
      proj2Desc: "USI 图像与视频处理 — 算法、管线与课程作业记录。",
      proj3Title: "浅水模拟与实时渲染 — 学士项目",
      proj3Desc: "基于浅水方程的实时模拟与可视化；数值求解在 CUDA 上并行，OpenGL 负责渲染。",
      linkSource: "源码",
      linkNote: "笔记",
      wikiTocTitle: "目录",
      wikiOpenRepo: "打开仓库",
      stackTitle: "技术栈与工具",
      aboutSectionTitle: "关于",
      aboutP1Html:
        '本站用于整理<strong>实时与离线图形管线</strong>、着色器与程序化内容相关的个人项目；更长的说明写在各作品页的「笔记」小节中。',
      footerHtml:
        '<a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">GitHub Pages</a>',
      backHome: "← 首页",
      backWorks: "← 全部作品",
      workDetailSection: "项目详情",
      titleWork1: "USI CG · CG Lab",
      titleWork2: "USI Image Video Processing · CG Lab",
      titleWork3: "浅水模拟与实时渲染 — 学士项目 · CG Lab",
      work1DetailMetaDesc: "USI CG — 计算机图形学课程：渲染、着色与可视化。",
      work2DetailMetaDesc: "USI Image Video Processing — 图像与视频算法、滤波与处理管线。",
      work3DetailMetaDesc: "浅水模拟与实时渲染 — CUDA 加速求解与 OpenGL 实时可视化。",
      work1DetailP1: "这是 USI CG 课程的作业作品。",
      work2DetailP1:
        "这是 USI Image Video Processing 课程的作业作品。",
      work3DetailP1:
        "高度场、通量形式的浅水方程与显式时间积分；与渲染管线耦合，通过高度场纹理与网格位移呈现水面。",
      noteLoading: "正在加载笔记…",
      noteError: "无法加载笔记。",
      noteEmpty: "暂无笔记。请编辑 notes 目录下对应的 Markdown 文件。"
    }
  };

  function getMessages(lang) {
    return STR[lang] || STR.en;
  }

  function applyLang(lang) {
    var L = getMessages(lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll('meta[name="description"][data-i18n-meta]').forEach(function (m) {
      var k = m.getAttribute("data-i18n-meta");
      if (k && L[k] != null) m.setAttribute("content", L[k]);
    });
    if (!document.querySelector('meta[name="description"][data-i18n-meta]')) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta && L.metaDesc != null) meta.setAttribute("content", L.metaDesc);
    }

    var titleKey = document.body.getAttribute("data-i18n-title");
    if (titleKey && L[titleKey] != null) document.title = L[titleKey];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key && L[key] != null) el.textContent = L[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (key && L[key] != null) el.innerHTML = L[key];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      var parts = spec.split(":");
      var attr = parts[0];
      var key = parts.slice(1).join(":");
      if (key && L[key] != null) el.setAttribute(attr, L[key]);
    });

    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === lang ? "true" : "false");
    });
  }

  var stored = localStorage.getItem(STORAGE_KEY);
  var lang = stored === "zh" ? "zh" : "en";

  applyLang(lang);

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      lang = btn.getAttribute("data-set-lang");
      if (lang !== "en" && lang !== "zh") lang = "en";
      localStorage.setItem(STORAGE_KEY, lang);
      applyLang(lang);
    });
  });

  window.cgLabT = function (key) {
    var l = localStorage.getItem(STORAGE_KEY) === "zh" ? "zh" : "en";
    var pack = STR[l] || STR.en;
    return pack[key] != null ? pack[key] : "";
  };
})();
