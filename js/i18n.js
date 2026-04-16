(function () {
  var STR = {
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
      "A collection of personal projects on ray tracing, real-time rendering, shaders, and visualization. Each project page lists an outline of the write-up and links to the source.",
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
    linkReference: "References",
    referencePlaceholder: "Add citations or links in the page HTML when needed.",
    linkNote: "Note",
    wikiTocTitle: "Contents",
    wikiTocAsideAria: "On this page",
    wikiTocExpand: "Expand section",
    wikiTocCollapse: "Collapse section",
    wikiOpenRepo: "Open repository",
    stackTitle: "Stack & Tools",
    aboutSectionTitle: "About",
    aboutP1Html:
      'This site gathers personal work on <strong>real-time and offline graphics pipelines</strong>, shaders, and procedural content. Longer write-ups use an on-page table of contents on each project page.',
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
    noteEmpty: "No notes yet. Edit the Markdown file in the notes folder.",
    wikiArticleSectionAria: "Article"
  };

  document.documentElement.lang = "en";

  document.querySelectorAll('meta[name="description"][data-i18n-meta]').forEach(function (m) {
    var k = m.getAttribute("data-i18n-meta");
    if (k && STR[k] != null) m.setAttribute("content", STR[k]);
  });
  if (!document.querySelector('meta[name="description"][data-i18n-meta]')) {
    var meta = document.querySelector('meta[name="description"]');
    if (meta && STR.metaDesc != null) meta.setAttribute("content", STR.metaDesc);
  }

  var titleKey = document.body.getAttribute("data-i18n-title");
  if (titleKey && STR[titleKey] != null) document.title = STR[titleKey];

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var key = el.getAttribute("data-i18n");
    if (key && STR[key] != null) el.textContent = STR[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    var key = el.getAttribute("data-i18n-html");
    if (key && STR[key] != null) el.innerHTML = STR[key];
  });
  document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
    var spec = el.getAttribute("data-i18n-attr");
    if (!spec) return;
    var parts = spec.split(":");
    var attr = parts[0];
    var key = parts.slice(1).join(":");
    if (key && STR[key] != null) el.setAttribute(attr, STR[key]);
  });

  window.cgLabT = function (key) {
    return STR[key] != null ? STR[key] : "";
  };
})();
