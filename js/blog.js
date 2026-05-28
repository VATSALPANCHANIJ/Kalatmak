/* ==========================================================================
   KALATMAK CREATIVE STUDIO - JOURNAL & BLOG LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Preloader Screen ---
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  const preloaderPercent = document.getElementById('preloaderPercent');
  
  if (preloader && preloaderProgress && preloaderPercent) {
    let loadProgress = 0;
    const loadInterval = setInterval(() => {
      loadProgress += Math.floor(Math.random() * 15) + 5;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadInterval);
        
        // Animate Preloader Out
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
          }
        });
      }
      preloaderProgress.style.width = `${loadProgress}%`;
      preloaderPercent.textContent = `${loadProgress}%`;
    }, 100);
  }

  // --- Custom Cursor ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorCircle = document.getElementById('cursorCircle');
  
  let mouseX = 0;
  let mouseY = 0;
  let circleX = 0;
  let circleY = 0;
  let isMobileOrTablet = window.innerWidth < 992;

  window.addEventListener('resize', () => {
    isMobileOrTablet = window.innerWidth < 992;
    if (isMobileOrTablet) {
      if (cursorDot) cursorDot.style.display = 'none';
      if (cursorCircle) cursorCircle.style.display = 'none';
    } else {
      if (cursorDot) cursorDot.style.display = 'block';
      if (cursorCircle) cursorCircle.style.display = 'block';
    }
  });

  // Hide initially on load if mobile or tablet
  if (isMobileOrTablet) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorCircle) cursorCircle.style.display = 'none';
  }
  
  document.addEventListener('mousemove', (e) => {
    if (isMobileOrTablet) return;
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor dot position
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Smooth damping animation for the cursor circle
  function animateCursor() {
    if (!isMobileOrTablet && cursorCircle) {
      const damping = 0.15;
      circleX += (mouseX - circleX) * damping;
      circleY += (mouseY - circleY) * damping;
      
      cursorCircle.style.left = `${circleX}px`;
      cursorCircle.style.top = `${circleY}px`;
    }
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Handle Cursor Hover states on interactive elements
  const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .tab-btn, .pricing-toggle');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (isMobileOrTablet) return;
      document.body.classList.add('hovering-link');
    });
    el.addEventListener('mouseleave', () => {
      if (isMobileOrTablet) return;
      document.body.classList.remove('hovering-link');
    });
  });

  // --- Mobile Navigation Menu ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
      navbar.classList.toggle('mobile-menu-active');
      
      const isActive = navLinks.classList.contains('active');
      document.body.style.overflow = isActive ? 'hidden' : 'scroll';
    });
  }

  // Scrolled state
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- Blog Articles Data Source ---
  const blogArticles = [
    {
      id: "cyberpunk-design",
      category: "Poster Design",
      date: "May 20, 2026",
      title: "The Rise of Neo-Tokyo Cyberpunk Design in Modern Posters",
      excerpt: "Exploring how high-contrast neon palettes, vertical typography, and futuristic themes are redefining visual key art in graphic design.",
      image: "images/cyberpunk_poster.png",
      intro: "In a design landscape increasingly saturated by corporate flat design, a powerful counter-movement has emerged from the dark, rain-slicked alleys of virtual cityscapes. Neo-Tokyo cyberpunk aesthetics are no longer relegated to niche science fiction; they are driving mainstream key art, event design, and editorial layouts.",
      contentHtml: `
        <p>At the core of the <strong>Neo-Tokyo cyberpunk</strong> visual movement is a reliance on contrasting light and shadow. The design language utilizes deep, pure black backdrops—often treated with noise overlays or subtle grid alignments—as a canvas for striking neon accent strokes. It represents an architecture of high-contrast glowing elements slicing through structural grid lines.</p>
        
        <h2>Vertical Typography & Multi-Lingual Hierarchies</h2>
        <p>One of the most defining details of this layout style is the integration of multi-lingual copy. Mixing english geometric sans-serifs with vertical columns of Japanese Katakana or Kanji characters creates an immediate aesthetic displacement. By treating vertical typography blocks as graphical pillars rather than mere reading text, designers anchor the visual layout structure while generating structural balance.</p>
        
        <div class="blog-pullquote">
          "In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear."
        </div>
        
        <h2>High Contrast Neon Color Palettes</h2>
        <p>Generic primaries are cast aside. The color palette of the modern cyberpunk poster is dominated by curated, high-vibrancy hex codes: HSL-tuned electric magenta, cyan glows, and deep ultraviolet shades. These gradients do not just fill space; they function as light sources that cast environmental reflections on nearby artwork assets.</p>
        
        <img src="images/nature_mountains.png" alt="Futuristic Terrain Visual" class="blog-article-img">
        
        <h2>Integrating Glowing Visual Accents</h2>
        <p>To implement this in your own work, start by establishing a rich dark layout environment. Integrate subtle glassmorphic card overlays, then apply soft radial glows behind key visual elements. Anchor the graphics using thin geometric borders, and ensure all typography leverages sharp-cornered serif initial capitals contrasting with lightweight sans-serif details.</p>
      `,
      interviewee: {
        name: "Lucy Midas",
        title: "Head of Brand, CrafteCuriosity",
        avatar: "images/brand_identity.png"
      },
      interviewers: [
        { name: "Mia di Silva", title: "Contributing Editor", avatar: "images/social_post.png" },
        { name: "Frankie Sutton", title: "Creative Lead", avatar: "images/minimal_brochure.png" }
      ],
      sections: [
        { id: "intro", title: "Introduction" },
        { id: "vertical-typo", title: "Vertical Typography" },
        { id: "neon-palette", title: "Neon Color Palettes" },
        { id: "glowing-accents", title: "Glowing Visual Accents" }
      ]
    },
    {
      id: "glassmorphic-uis",
      category: "UI/UX & Banners",
      date: "May 15, 2026",
      title: "Designing Glowing Interfaces: Glassmorphic Displays & glows",
      excerpt: "A deep dive into creating glowing glass overlays, soft radial shadows, and grid layouts that feel organic and alive.",
      image: "images/tech_banner.png",
      intro: "Interfaces are shedding their flat, clinical skins in favor of layers that mimic physical properties. Glassmorphism—when layered with organic glowing backgrounds—creates a responsive three-dimensional depth that invites physical interaction.",
      contentHtml: `
        <p>The magic of modern UI/UX banners is the illusion of refraction. By combining a blurred, translucent backdrop with thin, sharp borders and layered glow fields, graphics transition from two-dimensional vectors into tangible, premium assets.</p>
        
        <h2>The Core Ingredients of Glassmorphic Layers</h2>
        <p>To establish a clean glass overlay, three CSS properties must work in harmony: a semi-transparent background color, a blurred backdrop-filter, and a thin, light border. This border acts as the bevel, catching the environmental light and giving the panel structural definition.</p>
        
        <div class="blog-pullquote">
          "Depth is achieved not by adding shadows, but by allowing background details to filter through distorted translucent foreground layers."
        </div>
        
        <h2>Layering Soft Radial Glows</h2>
        <p>Behind the translucent panels, load subtle colored glow blobs. In our designs, we place glowing circles with a blur radius of 60px behind cards. As these cards slide or hover, they distort and diffuse the glows, making the digital canvas feel alive and dynamic.</p>
        
        <img src="images/nature_ocean.png" alt="Diffusion Wave" class="blog-article-img">
        
        <h2>Responsive Hover Micro-Animations</h2>
        <p>To draw users in, hover effects must feel organic. Use GSAP or CSS transitions to slightly straighten card rotations and lift elements in Z-depth. This combination of glass refraction and physical motion generates a highly premium aesthetic that elevates user engagement.</p>
      `,
      interviewee: {
        name: "Aris Thorne",
        title: "3D UI Architect",
        avatar: "images/cyberpunk_poster.png"
      },
      interviewers: [
        { name: "Frankie Sutton", title: "Creative Lead", avatar: "images/minimal_brochure.png" }
      ],
      sections: [
        { id: "intro", title: "Introduction" },
        { id: "core-ingredients", title: "Core Ingredients" },
        { id: "radial-glows", title: "Layering Radial Glows" },
        { id: "micro-animations", title: "Hover Micro-Animations" }
      ]
    },
    {
      id: "editorial-grids",
      category: "Layout Design",
      date: "May 10, 2026",
      title: "Editorial Grid Systems: Balancing Serif Typography & White Space",
      excerpt: "How modern brochure layouts utilize whitespace, large initial serif caps, and structured grids to achieve timeless architectural layouts.",
      image: "images/minimal_brochure.png",
      intro: "Achieving a premium editorial layout is not about packing the viewport with visual weight. It is an exercise in restraint—structuring layout grids to give typography and content room to breathe.",
      contentHtml: `
        <p>Timeless brochure layouts rely on a rigorous grid system. By establishing clear column guides and margin bounds, we create a stable architecture that permits bold, asymmetrical content placements without feeling chaotic.</p>
        
        <h2>The Power of Serif Initial Capitals</h2>
        <p>A classic editorial design cue is starting paragraphs with a large, stylized initial letter. Drawing from vintage print aesthetics, starting a block with a grand, high-contrast serif initial cap (like <strong>Cormorant Garamond</strong> or <strong>Hermaiona</strong>) creates an immediate focal point that anchors the reading flow.</p>
        
        <div class="blog-pullquote">
          "Whitespace is not empty space; it is active spacing that guides the eye, establishes hierarchy, and creates a sense of luxury."
        </div>
        
        <h2>Balancing Visual Weight & Contrast</h2>
        <p>Contrast is key. Pair large, thin headline weights with lightweight body copy. This contrast in scale generates an immediate editorial authority. When placing imagery, ensure text columns align perfectly with image boundaries, keeping the margins unified.</p>
        
        <img src="images/nature_foliage.png" alt="Editorial Grid Mockup" class="blog-article-img">
        
        <h2>Creating Flexible Editorial Templates</h2>
        <p>When designing digital journals, ensure your grid structure remains fluid. Column systems should collapse to single columns on mobile devices, but retain the large initial capitals and elegant serif details to keep the editorial feel consistent across all viewports.</p>
      `,
      interviewee: {
        name: "Elena Rostova",
        title: "Lead Typography Designer",
        avatar: "images/fitness_banner.png"
      },
      interviewers: [
        { name: "Mia di Silva", title: "Contributing Editor", avatar: "images/social_post.png" }
      ],
      sections: [
        { id: "intro", title: "Introduction" },
        { id: "serif-caps", title: "Serif Initial Capitals" },
        { id: "visual-weight", title: "Balancing Visual Weight" },
        { id: "flexible-templates", title: "Flexible Grid Templates" }
      ]
    },
    {
      id: "brand-continuity",
      category: "Brand Identity",
      date: "May 5, 2026",
      title: "Aesthetic Brand Continuity: From Social Grid to Stationery Mockups",
      excerpt: "Tips for maintaining color palette and typography consistency across print and digital touchpoints to reinforce brand authority.",
      image: "images/brand_identity.png",
      intro: "A brand is not a single mark; it is a complete sensory environment. Consistency in layout structure, color palettes, and typographic accents across all digital and print mediums is what establishes trust.",
      contentHtml: `
        <p>For modern creative agencies, maintaining a unified design language is crucial. From the quick, scrolling social media post to the tactile stationery mockup, every asset must look like it belongs to the same aesthetic universe.</p>
        
        <h2>Color Palette Rigor & Hex Lockups</h2>
        <p>Establishing brand authority starts with color. Pick a core accent tone (like our neon magenta) and use it sparingly as a highlighting tool. Keeping secondary panels neutral ensures that when you do use your brand color, it draws maximum attention.</p>
        
        <div class="blog-pullquote">
          "Consistent aesthetics build subconscious recognition. A brand's visual identity should feel unified before the logo is even read."
        </div>
        
        <h2>Typography Lockups & Hierarchy</h2>
        <p>Use a strict typographic grid. Designate a heading font for display titles, a sans-serif for secondary metadata tags, and an extremely readable body font for reading copy. Save files with these hierarchy structures so that all assets, digital or physical, look cohesive.</p>
        
        <img src="images/social_post.png" alt="Brand Stationery Suite" class="blog-article-img">
        
        <h2>Physical Mockups & Tactility</h2>
        <p>To elevate brand value, mock up your designs in realistic, high-fidelity physical environments. Clean stationery displays with soft lighting and drop shadows simulate real-world value, translating digital layout files into premium tangibles.</p>
      `,
      interviewee: {
        name: "David K.",
        title: "Principal Brand Strategist",
        avatar: "images/brand_identity.png"
      },
      interviewers: [
        { name: "Frankie Sutton", title: "Creative Lead", avatar: "images/minimal_brochure.png" }
      ],
      sections: [
        { id: "intro", title: "Introduction" },
        { id: "color-rigor", title: "Color Palette Rigor" },
        { id: "typo-lockups", title: "Typography Lockups" },
        { id: "mockups-tactility", title: "Mockups & Tactility" }
      ]
    }
  ];

  // --- Dynamic Blog Grid Rendering ---
  const blogGrid = document.getElementById('blogGrid');
  const blogReaderModal = document.getElementById('blogReaderModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContentInject = document.getElementById('modalContentInject');

  if (blogGrid) {
    blogGrid.innerHTML = ''; // Clear skeleton markup
    
    blogArticles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.setAttribute('data-id', article.id);
      
      card.innerHTML = `
        <div class="blog-card-img-wrap">
          <img src="${article.image}" alt="${article.title}" class="blog-card-img" loading="lazy">
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span class="blog-card-tag">${article.category}</span>
            <span>●</span>
            <span>${article.date}</span>
          </div>
          <h3 class="blog-card-title">${article.title}</h3>
          <p class="blog-card-excerpt">${article.excerpt}</p>
          <span class="blog-card-link">
            Read Article <i data-lucide="arrow-right"></i>
          </span>
        </div>
      `;
      
      card.addEventListener('click', () => {
        openArticle(article);
      });
      
      blogGrid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // --- Modal Open/Close Transitions (GSAP) ---
  function openArticle(article) {
    if (!blogReaderModal || !modalContentInject) return;

    // Generate Interviewers profiles block
    const interviewersHtml = article.interviewers.map(inter => `
      <div class="participant-card">
        <img src="${inter.avatar}" alt="${inter.name}" class="participant-avatar">
        <div class="participant-info">
          <h5>${inter.name}</h5>
          <p>${inter.title}</p>
        </div>
      </div>
    `).join('');

    // Generate Table of Contents items
    const tocHtml = article.sections.map((sec, index) => `
      <div class="toc-item" data-target="sec-${article.id}-${index}">${sec.title}</div>
    `).join('');

    // Inject Editorial Layout structure
    modalContentInject.innerHTML = `
      <div class="blog-article-header">
        <i data-lucide="sparkle" class="sparkle-icon"></i>
        <span class="blog-card-tag" style="display: block; margin-bottom: 1rem; font-size: 0.9rem;">${article.category}</span>
        <h1 class="blog-article-headline">${article.title}</h1>
        <p class="blog-article-intro">${article.intro}</p>
        <div class="blog-card-meta" style="margin-bottom: 0;">
          <span style="font-weight: 500; color: var(--text-primary);">By ${article.interviewers[0].name}</span>
          <span>●</span>
          <span>Published on ${article.date}</span>
        </div>
      </div>

      <div class="blog-layout">
        <!-- Left content column -->
        <div class="blog-article-body">
          <img src="${article.image}" alt="${article.title}" class="blog-article-img" style="margin-top: 0;">
          ${article.contentHtml}
        </div>

        <!-- Right sticky sidebar column -->
        <div class="blog-sidebar">
          <div class="blog-sidebar-sticky">
            <!-- Table of Contents Widget -->
            <div class="blog-widget">
              <h4 class="blog-widget-title">Table of Contents</h4>
              <div class="toc-list">
                ${tocHtml}
              </div>
            </div>

            <!-- Interviewee Widget -->
            <div class="blog-widget">
              <h4 class="blog-widget-title">Interviewee</h4>
              <div class="participant-card">
                <img src="${article.interviewee.avatar}" alt="${article.interviewee.name}" class="participant-avatar">
                <div class="participant-info">
                  <h5>${article.interviewee.name}</h5>
                  <p>${article.interviewee.title}</p>
                </div>
              </div>
            </div>

            <!-- Interviewers Widget -->
            <div class="blog-widget">
              <h4 class="blog-widget-title">Interviewers</h4>
              ${interviewersHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Assign anchor IDs to content subheadings dynamically for TOC jump clicks
    const subheaders = modalContentInject.querySelectorAll('.blog-article-body h2');
    subheaders.forEach((sub, index) => {
      sub.setAttribute('id', `sec-${article.id}-${index + 1}`);
    });

    // Wire up TOC jumps
    const tocItems = modalContentInject.querySelectorAll('.toc-item');
    tocItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        const targetId = index === 0 ? 'sine-carousel' : `sec-${article.id}-${index}`;
        const targetElement = index === 0 
          ? modalContentInject.querySelector('.blog-article-img')
          : modalContentInject.querySelector(`#${targetId}`);
        
        if (targetElement) {
          blogReaderModal.scrollTo({
            top: targetElement.offsetTop + 40,
            behavior: 'smooth'
          });
        }
      });
    });

    // Open Modal Animate
    document.body.style.overflow = 'hidden';
    gsap.set(blogReaderModal, { display: 'block' });
    gsap.to(blogReaderModal, {
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out'
    });
  }

  function closeArticle() {
    if (!blogReaderModal) return;
    
    gsap.to(blogReaderModal, {
      opacity: 0,
      duration: 0.4,
      ease: 'power3.inOut',
      onComplete: () => {
        blogReaderModal.style.display = 'none';
        // Only restore body scroll if the mobile menu overlay isn't open
        if (!navLinks.classList.contains('active')) {
          document.body.style.overflow = 'scroll';
        }
      }
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeArticle);
  }

  // Close modal when clicking outside the container content
  if (blogReaderModal) {
    blogReaderModal.addEventListener('click', (e) => {
      if (e.target === blogReaderModal) {
        closeArticle();
      }
    });
  }


  // --- Interactive Background DotField Canvas Engine ---
  const bgDotCanvas = document.getElementById('bgDotField');
  if (bgDotCanvas) {
    const ctx = bgDotCanvas.getContext('2d');
    let width, height;
    let dots = [];
    const dotSpacing = 24; // Grid spacing between dots
    const dotRadius = 1.5; // Radius of each grid dot
    const cursorRadius = 350; // Influence circle size
    const bulgeStrength = 45; // Max displacement shift distance
    const glowRadius = 160; // Size of glowing radial shadow aura
    
    let localMouse = { x: -1000, y: -1000, active: false };
    
    function resizeBgCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      bgDotCanvas.width = width;
      bgDotCanvas.height = height;
      
      initDots();
    }
    
    function initDots() {
      dots = [];
      const cols = Math.ceil(width / dotSpacing) + 1;
      const rows = Math.ceil(height / dotSpacing) + 1;
      
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          dots.push({
            x: c * dotSpacing,
            y: r * dotSpacing,
            baseX: c * dotSpacing,
            baseY: r * dotSpacing
          });
        }
      }
    }
    
    document.addEventListener('mousemove', (e) => {
      localMouse.x = e.clientX;
      localMouse.y = e.clientY;
      localMouse.active = true;
    });
    
    document.addEventListener('mouseleave', () => {
      localMouse.active = false;
    });
    
    window.addEventListener('resize', resizeBgCanvas);
    
    function animateDotField() {
      ctx.clearRect(0, 0, width, height);
      
      if (localMouse.active) {
        const glowGrad = ctx.createRadialGradient(
          localMouse.x, localMouse.y, 0,
          localMouse.x, localMouse.y, glowRadius
        );
        glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
        glowGrad.addColorStop(0.5, 'rgba(180, 151, 207, 0.06)');
        glowGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
        
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(localMouse.x, localMouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      dots.forEach(dot => {
        let drawX = dot.baseX;
        let drawY = dot.baseY;
        let dist = 9999;
        
        if (localMouse.active) {
          const dx = dot.baseX - localMouse.x;
          const dy = dot.baseY - localMouse.y;
          dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < cursorRadius) {
            const factor = (1 - dist / cursorRadius) * bulgeStrength;
            const angle = Math.atan2(dy, dx);
            drawX += Math.cos(angle) * factor;
            drawY += Math.sin(angle) * factor;
          }
        }
        
        ctx.beginPath();
        ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2);
        
        if (dist < glowRadius) {
          const alpha = 0.08 + (1 - dist / glowRadius) * 0.45;
          ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        }
        ctx.fill();
      });
      
      requestAnimationFrame(animateDotField);
    }
    
    resizeBgCanvas();
    animateDotField();
  }

  // --- ScrollTrigger Reveal Animations ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal-element').forEach(element => {
      gsap.fromTo(element, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // --- Contact Form & EmailJS Integration ---
  const EMAILJS_PUBLIC_KEY = 'ppVR-NH4Lan6M92l5'; 
  const EMAILJS_SERVICE_ID = 'service_tn2620k'; 
  const EMAILJS_TEMPLATE_ID = 'template_anznhij'; 

  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  }

  const contactForm = document.getElementById('contactForm');
  const formResponse = document.getElementById('formResponse');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... <i class="animate-spin" data-lucide="loader"></i>';
      submitBtn.disabled = true;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      
      const isConfigured = typeof emailjs !== 'undefined' && 
                           EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
                           EMAILJS_SERVICE_ID && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                           EMAILJS_TEMPLATE_ID && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';

      if (!isConfigured) {
        setTimeout(() => {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          
          formResponse.className = 'form-response success';
          formResponse.innerHTML = '✨ Inquiry received! (Demo Mode: EmailJS keys not configured)';
          contactForm.reset();
          
          setTimeout(() => {
            formResponse.innerHTML = '';
            formResponse.className = 'form-response';
          }, 5000);
        }, 1500);
      } else {
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
          .then(() => {
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
            
            formResponse.className = 'form-response success';
            formResponse.innerHTML = '✨ Inquiry sent successfully! We will reach out to you within 24 hours.';
            contactForm.reset();
            
            setTimeout(() => {
              formResponse.innerHTML = '';
              formResponse.className = 'form-response';
            }, 5000);
          })
          .catch((error) => {
            console.error('EmailJS Error:', error);
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
            formResponse.className = 'form-response error';
            formResponse.innerHTML = '❌ An error occurred. Please try again or email us directly.';
            
            setTimeout(() => {
              formResponse.innerHTML = '';
              formResponse.className = 'form-response';
            }, 5000);
          });
      }
    });
  }

});
