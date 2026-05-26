/* ==========================================================================
   KALATMAK CREATIVE STUDIO - MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Preloader & Entrance Animation ---
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  const preloaderPercent = document.getElementById('preloaderPercent');
  
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
          triggerHeroEntrance();
        }
      });
    }
    preloaderProgress.style.width = `${loadProgress}%`;
    preloaderPercent.textContent = `${loadProgress}%`;
  }, 100);

  function triggerHeroEntrance() {
    const tl = gsap.timeline();
    
    // Reveal Navbar
    tl.to('#navbar', {
      top: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Reveal Hero Title
    tl.fromTo('.hero-title', {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5');

    // Fade in Hero Description & Actions
    tl.to(['.animate-fade-in', '.animate-fade-in-delayed'], {
      opacity: 1,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4');
  }


  // --- Custom Cursor ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorCircle = document.getElementById('cursorCircle');
  
  let mouseX = 0;
  let mouseY = 0;
  let circleX = 0;
  let circleY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor dot position
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth damping animation for the cursor circle
  function animateCursor() {
    const damping = 0.15;
    circleX += (mouseX - circleX) * damping;
    circleY += (mouseY - circleY) * damping;
    
    cursorCircle.style.left = `${circleX}px`;
    cursorCircle.style.top = `${circleY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Handle Cursor Hover states on interactive elements
  const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .tab-btn, .pricing-toggle');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-link');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.add('hovering-link');
      document.body.classList.remove('hovering-link');
    });
  });


  // --- Navigation & Mobile Menu ---
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  
  // Scrolled state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Update Scroll Progress Bar
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scrollProgressBar').style.width = `${scrolled}%`;
  });

  // Toggle Hamburger
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navLinks.classList.toggle('mobile-active');
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navLinks.classList.remove('mobile-active');
    });
  });


  // --- Sine Wave Carousel Engine & Lightbox Trigger ---
  const heroSection = document.getElementById('home');
  const track = document.getElementById('sineTrack');
  const cards = document.querySelectorAll('.sine-card');
  
  if (track && cards.length > 0) {
    let scrollOffset = 0;
    let autoSpeed = 0.6; // Slow automatic scroll speed from right to left
    let isDragging = false;
    let startX = 0;
    let dragOffset = 0;
    let targetSpeed = 0;
    
    // Hover tracking
    let hoveredCardIndex = null;
    let hoverProgress = Array(cards.length).fill(0);
    
    // Wave layout variables
    let cardWidth, spacing, totalWidth, slant, centerY, wrapMargin;
    
    function updateParams() {
      const width = window.innerWidth;
      const container = document.getElementById('sine-carousel');
      const containerHeight = container ? container.clientHeight : window.innerHeight;

      if (width < 576) {
        // Mobile phones - smaller cards shifted higher to clear mobile hero text column
        cardWidth = 90;
        spacing = 65;
        slant = 0.05;
        centerY = containerHeight * 0.20;
        wrapMargin = 150;
        if (container) container.style.perspective = "400px";
      } else if (width < 992) {
        // Tablets - optimized card size and spacing
        cardWidth = 130;
        spacing = 90;
        slant = 0.10;
        centerY = containerHeight * 0.25;
        wrapMargin = 200;
        if (container) container.style.perspective = "600px";
      } else {
        // Desktop / 2K / 4K layout matching creativecue.co spacing and centering
        cardWidth = 290;
        wrapMargin = 400;
        spacing = Math.max(Math.ceil(0.08 * width), Math.ceil((width + 2 * wrapMargin) / cards.length));
        slant = 0.30;
        centerY = containerHeight * 0.50; // Use true center because the sine wave is centered at 0
        if (container) container.style.perspective = "1200px";
      }
      
      totalWidth = spacing * cards.length;
      if (container) {
        container.style.pointerEvents = 'auto';
      }
    }
    
    updateParams();
    window.addEventListener('resize', updateParams);
    
    // Lightbox click variables
    let mousedownX = 0;
    let mousedownY = 0;
    let mousedownTime = 0;
    
    // Card Hover & Tap/Click Listeners for Pause, Zoom, and Lightbox Modal
    cards.forEach((card, index) => {
      card.style.pointerEvents = 'auto';
      
      card.addEventListener('mouseenter', () => {
        hoveredCardIndex = index;
        document.body.classList.add('hovering-link');
      });
      
      card.addEventListener('mouseleave', () => {
        if (hoveredCardIndex === index) {
          hoveredCardIndex = null;
        }
        document.body.classList.remove('hovering-link');
      });
      
      // Click logic to distinguish from drag/swipe
      card.addEventListener('mousedown', (e) => {
        mousedownX = e.clientX;
        mousedownY = e.clientY;
        mousedownTime = Date.now();
      });
      
      card.addEventListener('mouseup', (e) => {
        const deltaX = Math.abs(e.clientX - mousedownX);
        const deltaY = Math.abs(e.clientY - mousedownY);
        const deltaTime = Date.now() - mousedownTime;
        
        // If mouse moved very little and click was quick, trigger zoom lightbox
        if (deltaX < 6 && deltaY < 6 && deltaTime < 300) {
          openLightbox(card);
        }
      });
      
      // Touch support for mobile tap zoom
      let touchstartX = 0;
      let touchstartY = 0;
      let touchstartTime = 0;
      
      card.addEventListener('touchstart', (e) => {
        touchstartX = e.touches[0].clientX;
        touchstartY = e.touches[0].clientY;
        touchstartTime = Date.now();
      }, { passive: true });
      
      card.addEventListener('touchend', (e) => {
        const deltaX = Math.abs(e.changedTouches[0].clientX - touchstartX);
        const deltaY = Math.abs(e.changedTouches[0].clientY - touchstartY);
        const deltaTime = Date.now() - touchstartTime;
        
        if (deltaX < 6 && deltaY < 6 && deltaTime < 300) {
          openLightbox(card);
        }
      });
    });
    
    // Drag and swipe control events
    heroSection.addEventListener('mousedown', (e) => {
      if (e.target.closest('.btn') || e.target.closest('#navbar') || e.target.closest('.hamburger') || e.target.closest('.lightbox-modal')) return;
      isDragging = true;
      startX = e.clientX;
      dragOffset = 0;
    });
    
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const x = e.clientX;
      const dx = x - startX;
      startX = x;
      scrollOffset -= dx * 1.5;
      targetSpeed = -dx * 0.5;
    });
    
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
 
    window.addEventListener('mouseleave', () => {
      isDragging = false;
    });
 
    // Touch controls for mobile
    heroSection.addEventListener('touchstart', (e) => {
      if (e.target.closest('.btn') || e.target.closest('#navbar') || e.target.closest('.hamburger') || e.target.closest('.lightbox-modal')) return;
      isDragging = true;
      startX = e.touches[0].clientX;
    }, { passive: true });
 
    heroSection.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const x = e.touches[0].clientX;
      const dx = x - startX;
      startX = x;
      scrollOffset -= dx * 1.5;
      targetSpeed = -dx * 0.5;
    }, { passive: true });
 
    heroSection.addEventListener('touchend', () => {
      isDragging = false;
    });
    
    function renderWave() {
      const width = window.innerWidth;
      
      // Return smoothly to auto-scroll speed or pause on hover/release
      if (!isDragging) {
        let activeSpeed = (hoveredCardIndex !== null) ? 0 : autoSpeed;
        targetSpeed += (activeSpeed - targetSpeed) * 0.04;
        scrollOffset += targetSpeed;
      }
      
      cards.forEach((card, i) => {
        // Interpolate individual hover progress
        if (hoveredCardIndex === i) {
          hoverProgress[i] += (1 - hoverProgress[i]) * 0.06;
        } else {
          hoverProgress[i] += (0 - hoverProgress[i]) * 0.08;
        }

        // Horizontal loop positioning with safe wrap margin
        let x = ((i * spacing - scrollOffset) % totalWidth + totalWidth) % totalWidth - wrapMargin;

        let finalScale, finalY, finalZ, finalOpacity, finalRotation, zIndex;

        if (width >= 992) {
          // Desktop / 2K / 4K layout matching creativecue.co exactly
          let centerX = x + cardWidth * 0.5;
          let dx = centerX - width * 0.56; // Shift wave center to the right to clear left text column
          let s = width * 0.5;
          let U = 0.6 * Math.PI;
          
          // Sine wave vertical position relative to center with 110px amplitude
          let y_offset = 110 * Math.sin(dx / s * U) + 0.2 * dx;
          
          // Distance from center in index units
          let l = Math.abs(dx) / spacing;
          
          // Scale down towards edges
          finalScale = 0.4 + 0.4 * Math.exp(-0.8 * l);
          
          // Center card vertically
          let cardHeight = card.classList.contains('landscape') ? 290 : 390;
          finalY = centerY + y_offset - cardHeight / 2;
          
          // Stack center card on top of outer cards
          zIndex = Math.round(100 - 10 * l);
          
          finalZ = 30 * hoverProgress[i];
          finalRotation = 0;
          finalOpacity = 0.95 + 0.05 * hoverProgress[i];
        } else {
          // Mobile & Tablet layout (original behavior)
          let y = slant * (x - width * 0.5);
          let cardHeight = (width < 576) ? (card.classList.contains('landscape') ? 120 : 165) 
                                         : (card.classList.contains('landscape') ? 160 : 220);
          finalY = centerY + y - cardHeight / 2;
          finalScale = 1.0;
          finalRotation = 0;
          finalZ = 30 * hoverProgress[i];
          finalOpacity = 0.95 + 0.05 * hoverProgress[i];
          zIndex = Math.round(x);
        }

        // Apply styles
        card.style.transform = `translate3d(${x}px, ${finalY}px, ${finalZ}px) rotateZ(${finalRotation}deg) scale(${finalScale})`;
        card.style.opacity = finalOpacity;
        card.style.zIndex = zIndex + Math.round(hoverProgress[i] * 1000);
      });
      
      requestAnimationFrame(renderWave);
    }
    
    renderWave();
  }


  // --- GSAP ScrollTrigger Animations ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Section reveal-element (About text, contact details, headers)
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

    // Staggered reveal of Service cards & Process cards
    const cardSections = ['.capabilities-grid', '.process-grid', '.pricing-grid', '.benefits-grid'];
    cardSections.forEach(sectionSelector => {
      const section = document.querySelector(sectionSelector);
      if (section) {
        const cards = section.querySelectorAll('.reveal-card');
        gsap.fromTo(cards, {
          opacity: 0,
          y: 40
        }, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    });

    // Staggered Portfolio reveal
    const grid = document.getElementById('portfolioGrid');
    if (grid) {
      const items = grid.querySelectorAll('.reveal-item');
      gsap.fromTo(items, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
    }
  }


  // --- Portfolio Filter Functionality ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          // Show
          item.classList.remove('fade-out');
          item.classList.add('fade-in');
          setTimeout(() => {
            item.style.display = 'block';
          }, 300);
        } else {
          // Hide
          item.classList.remove('fade-in');
          item.classList.add('fade-out');
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
      
      // Refresh ScrollTrigger so coordinates remain aligned
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });


  // --- Pricing Toggle Interaction ---
  const pricingToggle = document.getElementById('pricingToggle');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelSubscription = document.getElementById('labelSubscription');
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
      pricingToggle.classList.toggle('active');
      
      const isRetainer = pricingToggle.classList.contains('active');
      
      if (isRetainer) {
        labelMonthly.classList.remove('active');
        labelSubscription.classList.add('active');
      } else {
        labelMonthly.classList.add('active');
        labelSubscription.classList.remove('active');
      }
      
      pricingCards.forEach(card => {
        const priceVal = card.querySelector('.price-val');
        const pricePeriod = card.querySelector('.price-period');
        
        // Grab rates from data attributes
        const monthlyRate = card.getAttribute('data-monthly-price');
        const subRate = card.getAttribute('data-sub-price');
        
        // Animating price transition
        gsap.to(priceVal, {
          scale: 0.8,
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            if (isRetainer) {
              priceVal.textContent = subRate;
              pricePeriod.textContent = '/month';
              
              // Enable retainer-only bullet tags
              card.querySelectorAll('[data-sub-only]').forEach(bullet => {
                bullet.classList.remove('disabled');
                const bulletIcon = bullet.querySelector('i');
                if (bulletIcon) {
                  bulletIcon.setAttribute('data-lucide', 'check');
                  bulletIcon.style.color = 'var(--accent-indigo)';
                }
              });
            } else {
              priceVal.textContent = monthlyRate;
              pricePeriod.textContent = '/project';
              
              // Disable retainer-only bullets
              card.querySelectorAll('[data-sub-only]').forEach(bullet => {
                bullet.classList.add('disabled');
                const bulletIcon = bullet.querySelector('i');
                if (bulletIcon) {
                  bulletIcon.setAttribute('data-lucide', 'x');
                  bulletIcon.style.color = 'var(--text-muted)';
                }
              });
            }
            
            // Re-render icons if changed
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
            
            gsap.to(priceVal, {
              scale: 1,
              opacity: 1,
              duration: 0.25,
              ease: 'back.out(1.5)'
            });
          }
        });
      });
    });
  }


  // --- Contact Form Submission Interaction ---
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
      
      // Simulate API submit delay
      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.disabled = false;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        
        // Success Mock Response
        formResponse.className = 'form-response success';
        formResponse.innerHTML = '✨ Inquiry received! We will reach out to you within 24 hours.';
        
        // Reset form fields
        contactForm.reset();
        
        // Clear message after 5 seconds
        setTimeout(() => {
          formResponse.innerHTML = '';
          formResponse.className = 'form-response';
        }, 5000);
      }, 1500);
    });
  }


  // --- Back to Top Click Handler ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // --- Lightbox Modal Logic ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  
  function openLightbox(cardElement) {
    const img = cardElement.querySelector('img');
    if (!img) return;
    
    lightboxImage.src = img.src;
    lightboxCaption.textContent = img.alt || "Studio Portfolio Masterpiece";
    
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling
    
    // Animate active state icons in case lucide loads icons dynamically
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Clear src after transition to avoid flash on next open
    setTimeout(() => {
      if (!lightboxModal.classList.contains('active')) {
        lightboxImage.src = '';
      }
    }, 400);
  }
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });


  // --- Responsive 3D Particle Orb Canvas Engine ---
  const orbCanvas = document.getElementById('particleOrbCanvas');
  if (orbCanvas) {
    const ctx = orbCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 90 : 140;
    let fov = 800; // Let fov and orbRadius be mutable for responsiveness
    let orbRadius = window.innerWidth < 768 ? 110 : 165;
    
    let angleX = 0.003; // Base continuous orbital rotation speeds
    let angleY = 0.003;
    
    let mouse = { x: 0, y: 0, active: false, targetX: 0, targetY: 0 };
    
    class Particle3D {
      constructor() {
        // Generate uniform points on a 3D sphere using Archimedes' method
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        this.x = orbRadius * Math.sin(phi) * Math.cos(theta);
        this.y = orbRadius * Math.sin(phi) * Math.sin(theta);
        this.z = orbRadius * Math.cos(phi);
      }
      
      rotate(ax, ay) {
        // Rotate on Y axis
        let cosY = Math.cos(ay);
        let sinY = Math.sin(ay);
        let x1 = this.x * cosY - this.z * sinY;
        let z1 = this.z * cosY + this.x * sinY;
        
        // Rotate on X axis
        let cosX = Math.cos(ax);
        let sinX = Math.sin(ax);
        let y2 = this.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + this.y * sinX;
        
        this.x = x1;
        this.y = y2;
        this.z = z2;
      }
      
      project() {
        // Standard perspective scale
        const scale = fov / (fov + this.z);
        const projX = (width / 2) + this.x * scale;
        const projY = (height / 2) + this.y * scale;
        
        return { x: projX, y: projY, scale: scale, depth: (fov - this.z) / (fov * 2) };
      }
    }
    
    function initOrb() {
      resizeOrbCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle3D());
      }
    }
    
    function resizeOrbCanvas() {
      const rect = orbCanvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height || (window.innerWidth < 992 ? 300 : 450);
      orbCanvas.width = width;
      orbCanvas.height = height;
      
      // Update responsive dimensions dynamically
      orbRadius = window.innerWidth < 768 ? 110 : 165;
      fov = 800;
    }
    
    // Mouse interaction tracking for rotational tilt/gravity effects
    orbCanvas.addEventListener('mousemove', (e) => {
      const rect = orbCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Center relative mouse positions [-1, 1]
      mouse.targetX = (x - width / 2) / (width / 2);
      mouse.targetY = (y - height / 2) / (height / 2);
      mouse.active = true;
    });
    
    orbCanvas.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.active = false;
    });
    
    window.addEventListener('resize', () => {
      initOrb();
    });
    
    function animateOrb() {
      ctx.clearRect(0, 0, width, height);
      
      // Interpolate mouse effect for smooth rotational lag
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      
      // Tilt the rotation angle based on mouse positions
      let currentAngleY = angleY + mouse.x * 0.015;
      let currentAngleX = angleX + mouse.y * 0.015;
      
      // Project all coordinates
      const projected = [];
      particles.forEach(p => {
        p.rotate(currentAngleX, currentAngleY);
        projected.push({ p: p, coords: p.project() });
      });
      
      // Sort projected points by depth (painter's algorithm)
      projected.sort((a, b) => b.coords.depth - a.coords.depth);
      
      // Draw connecting plexus lines between close particles
      const connectionDist = window.innerWidth < 768 ? 55 : 75;
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].coords.x - projected[j].coords.x;
          const dy = projected[i].coords.y - projected[j].coords.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDist) {
            // Calculate transparency based on distance and depth
            const alpha = (1 - (dist / connectionDist)) * 0.15 * projected[i].coords.scale;
            
            // Faint network line using brand color tint
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].coords.x, projected[i].coords.y);
            ctx.lineTo(projected[j].coords.x, projected[j].coords.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw particle points
      projected.forEach(item => {
        const { coords } = item;
        const size = (coords.scale * 2.5) * (1.2 + 0.8 * coords.depth);
        
        // Brand color transition: further away is indigo/purple, closer is magenta/pink
        const colorRatio = Math.min(Math.max(coords.depth, 0), 1);
        const r = Math.round(88 + colorRatio * 129);  // 88 (indigo) to 217 (magenta)
        const g = Math.round(80 - colorRatio * 10);   // 80 to 70
        const b = Math.round(236 + colorRatio * 23);  // 236 to 259
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + coords.depth * 0.6})`;
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw subtle glow halo for closer items
        if (coords.depth > 0.6) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(coords.depth - 0.6) * 0.15})`;
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      requestAnimationFrame(animateOrb);
    }
    
    initOrb();
    animateOrb();
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
      const heroContainer = document.getElementById('home');
      height = heroContainer ? heroContainer.clientHeight : window.innerHeight;
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
      const rect = bgDotCanvas.getBoundingClientRect();
      localMouse.x = e.clientX - rect.left;
      localMouse.y = e.clientY - rect.top;
      localMouse.active = true;
    });
    
    document.addEventListener('mouseleave', () => {
      localMouse.active = false;
    });
    
    window.addEventListener('resize', resizeBgCanvas);
    
    function animateDotField() {
      ctx.clearRect(0, 0, width, height);
      
      // 1. Draw glowing background radial gradient centered at the cursor
      if (localMouse.active) {
        const glowGrad = ctx.createRadialGradient(
          localMouse.x, localMouse.y, 0,
          localMouse.x, localMouse.y, glowRadius
        );
        glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.16)'); // Gradient glow center (purple gradientFrom)
        glowGrad.addColorStop(0.5, 'rgba(180, 151, 207, 0.06)'); // Glow outer edge (purple gradientTo)
        glowGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
        
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(localMouse.x, localMouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 2. Calculate bulge math and draw dots
      dots.forEach(dot => {
        let drawX = dot.baseX;
        let drawY = dot.baseY;
        let dist = 9999;
        
        if (localMouse.active) {
          const dx = dot.baseX - localMouse.x;
          const dy = dot.baseY - localMouse.y;
          dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < cursorRadius) {
            // Bulge displacement math
            const factor = (1 - dist / cursorRadius) * bulgeStrength;
            const angle = Math.atan2(dy, dx);
            drawX += Math.cos(angle) * factor;
            drawY += Math.sin(angle) * factor;
          }
        }
        
        // Draw the dot
        ctx.beginPath();
        ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2);
        
        // Highlight dots near the cursor using brand purple glow ratio
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

});
