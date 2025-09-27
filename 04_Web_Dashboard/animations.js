/**
 * Professional Animation Controller
 * Inspired by Nike, Netflix, Apple, and other top companies
 * Author: P2P Team
 */

class AnimationController {
  constructor() {
    this.observers = new Map();
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupRippleEffects();
    this.setupCounterAnimations();
    this.setupParallaxEffects();
    this.setupPageTransitions();
    this.setupLoadingAnimations();
    this.setupFormAnimations();
  }

  // ===== SCROLL ANIMATIONS (Netflix Style) =====
  setupScrollAnimations() {
    if (this.isReducedMotion) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      scrollObserver.observe(el);
    });

    this.observers.set('scroll', scrollObserver);
  }

  animateElement(element) {
    const animationType = element.dataset.animation || 'fade-in';
    const delay = element.dataset.delay || 0;

    setTimeout(() => {
      element.classList.add(animationType);
    }, delay);
  }

  // ===== RIPPLE EFFECTS (Material Design + Nike Style) =====
  setupRippleEffects() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.btn-nike, .ripple-effect');
      if (!button) return;

      this.createRipple(e, button);
    });
  }

  createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
      z-index: 1000;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // ===== COUNTER ANIMATIONS =====
  setupCounterAnimations() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('[data-counter]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.counter);
    const duration = parseInt(element.dataset.duration) || 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  // ===== PARALLAX EFFECTS =====
  setupParallaxEffects() {
    if (this.isReducedMotion) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // ===== PAGE TRANSITIONS =====
  setupPageTransitions() {
    // Smooth page transitions for SPA-like experience - disabled to fix click issues
    // document.addEventListener('click', (e) => {
    //   const link = e.target.closest('a[href]');
    //   if (!link || link.target === '_blank' || link.href.startsWith('mailto:')) return;

    //   e.preventDefault();
    //   this.transitionToPage(link.href);
    // });
  }

  transitionToPage(url) {
    document.body.classList.add('page-slide-out');
    
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }

  // ===== LOADING ANIMATIONS =====
  setupLoadingAnimations() {
    this.createSkeletonLoaders();
    this.setupProgressBars();
  }

  createSkeletonLoaders() {
    document.querySelectorAll('.skeleton-container').forEach(container => {
      const skeletonHTML = `
        <div class="skeleton" style="height: 20px; margin-bottom: 10px; border-radius: 4px;"></div>
        <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: 10px; border-radius: 4px;"></div>
        <div class="skeleton" style="height: 20px; width: 60%; border-radius: 4px;"></div>
      `;
      container.innerHTML = skeletonHTML;
    });
  }

  setupProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const progress = bar.dataset.progress || 0;
      const fill = bar.querySelector('.progress-fill');
      
      if (fill) {
        setTimeout(() => {
          fill.style.width = `${progress}%`;
        }, 100);
      }
    });
  }

  // ===== FORM ANIMATIONS =====
  setupFormAnimations() {
    // Floating labels
    document.querySelectorAll('.input-animated').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });

      // Check if input has value on load
      if (input.value) {
        input.parentElement.classList.add('focused');
      }
    });

    // Form validation animations
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        const invalidInputs = form.querySelectorAll(':invalid');
        invalidInputs.forEach(input => {
          input.classList.add('shake');
          setTimeout(() => {
            input.classList.remove('shake');
          }, 500);
        });
      });
    });
  }

  // ===== NOTIFICATION SYSTEM =====
  showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} notification-slide`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-family: 'Bai Jamjuree', sans-serif;
      font-weight: 500;
      max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, duration);
  }

  getNotificationColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[type] || colors.info;
  }

  // ===== CHART ANIMATIONS =====
  animateChart(chartElement) {
    const bars = chartElement.querySelectorAll('.chart-bar');
    const lines = chartElement.querySelectorAll('.chart-line');

    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.classList.add('bar-grow');
      }, index * 100);
    });

    lines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('chart-draw');
      }, index * 200);
    });
  }

  // ===== UTILITY METHODS =====
  addHoverEffects() {
    document.querySelectorAll('.card-hover, .hover-scale, .hover-rotate').forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (!this.isReducedMotion) {
          element.style.transform = element.classList.contains('hover-scale') 
            ? 'scale(1.05)' 
            : element.classList.contains('hover-rotate') 
            ? 'rotate(5deg)' 
            : 'translateY(-8px) scale(1.02)';
        }
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = '';
      });
    });
  }

  // ===== PERFORMANCE OPTIMIZATION =====
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===== CLEANUP =====
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// ===== ADDITIONAL ANIMATION UTILITIES =====
class AnimationUtils {
  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }

  static fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.max(initialOpacity - (progress / duration), 0);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
      }
    }
    
    requestAnimationFrame(animate);
  }

  static slideUp(element, duration = 300) {
    const height = element.offsetHeight;
    element.style.height = height + 'px';
    element.style.overflow = 'hidden';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newHeight = Math.max(height - (height * progress / duration), 0);
      
      element.style.height = newHeight + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
      }
    }
    
    requestAnimationFrame(animate);
  }

  static slideDown(element, duration = 300) {
    element.style.display = 'block';
    const height = element.scrollHeight;
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newHeight = Math.min(height * progress / duration, height);
      
      element.style.height = newHeight + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.height = '';
        element.style.overflow = '';
      }
    }
    
    requestAnimationFrame(animate);
  }
}

// ===== INITIALIZE ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  // Add page load animation
  document.body.classList.add('fade-in');
  
  // Initialize animation controller
  window.animationController = new AnimationController();
  
  // Add utility classes to existing elements
  setTimeout(() => {
    window.animationController.addHoverEffects();
  }, 100);
  
  // Initialize micro-interactions
  initializeMicroInteractions();
});

// ===== MICRO-INTERACTIONS ===== //

function initializeMicroInteractions() {
    initializeRippleEffects();
    initializeButtonStates();
    initializeFormAnimations();
    initializeTooltips();
    initializeNotifications();
}

// Ripple Effect for Material Design buttons
function initializeRippleEffects() {
    const rippleButtons = document.querySelectorAll('.ripple-effect');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Enhanced Button States
function initializeButtonStates() {
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
        // Add loading state functionality
        if (button.dataset.loading !== undefined) {
            button.addEventListener('click', function() {
                showButtonLoading(this);
                
                // Simulate async operation
                setTimeout(() => {
                    hideButtonLoading(this);
                }, 2000);
            });
        }
        
        // Add success/error states
        button.addEventListener('click', function() {
            if (this.dataset.success !== undefined) {
                showButtonSuccess(this);
            }
        });
    });
}

function showButtonLoading(button) {
    button.classList.add('btn-loading');
    button.disabled = true;
    button.dataset.originalText = button.textContent;
}

function hideButtonLoading(button) {
    button.classList.remove('btn-loading');
    button.disabled = false;
    if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
    }
}

function showButtonSuccess(button) {
    const originalText = button.textContent;
    const originalClass = button.className;
    
    button.textContent = '✓ Success';
    button.classList.add('success-state');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.className = originalClass;
    }, 2000);
}

function showButtonError(button) {
    const originalClass = button.className;
    
    button.classList.add('error-state');
    
    setTimeout(() => {
        button.className = originalClass;
    }, 1000);
}

// Form Animations
function initializeFormAnimations() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add focus animations
        input.addEventListener('focus', function() {
            this.classList.add('input-focused');
            animateLabel(this);
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('input-focused');
            if (!this.value) {
                resetLabel(this);
            }
        });
        
        // Add validation animations
        input.addEventListener('invalid', function() {
            this.classList.add('error-state');
            shakeElement(this);
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error-state');
            if (this.checkValidity()) {
                this.classList.add('success-state');
            }
        });
    });
}

function animateLabel(input) {
    const label = input.parentElement.querySelector('label');
    if (label) {
        label.classList.add('label-animated');
    }
}

function resetLabel(input) {
    const label = input.parentElement.querySelector('label');
    if (label) {
        label.classList.remove('label-animated');
    }
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Tooltip System
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltip = createTooltip(element.dataset.tooltip);
        
        element.addEventListener('mouseenter', function(e) {
            showTooltip(tooltip, e.target);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip(tooltip);
        });
        
        element.addEventListener('mousemove', function(e) {
            positionTooltip(tooltip, e);
        });
    });
}

function createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-custom';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    document.body.appendChild(tooltip);
    return tooltip;
}

function showTooltip(tooltip, target) {
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
}

function hideTooltip(tooltip) {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(10px)';
}

function positionTooltip(tooltip, event) {
    const x = event.clientX;
    const y = event.clientY;
    
    tooltip.style.left = x + 10 + 'px';
    tooltip.style.top = y - 40 + 'px';
}

// Notification System
function initializeNotifications() {
    // Auto-hide notifications
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="hideNotification(this.parentElement)">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// Interactive Element Enhancements
function enhanceInteractiveElements() {
    const cards = document.querySelectorAll('.card, .dashboard-card');
    const buttons = document.querySelectorAll('button, .btn');
    
    // Add hover effects to cards
    cards.forEach(card => {
        card.classList.add('card-hover');
    });
    
    // Add ripple effects to buttons
    buttons.forEach(button => {
        if (!button.classList.contains('ripple-effect')) {
            button.classList.add('ripple-effect');
        }
    });
}

// Progress Bar Animations
function animateProgressBar(progressBar, targetWidth, duration = 1000) {
    const startWidth = 0;
    const startTime = performance.now();
    
    function updateProgress(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentWidth = startWidth + (targetWidth - startWidth) * progress;
        
        progressBar.style.width = currentWidth + '%';
        
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        }
    }
    
    requestAnimationFrame(updateProgress);
}

// Star Rating System
function initializeStarRating() {
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                setStarRating(stars, index + 1);
            });
            
            star.addEventListener('mouseenter', () => {
                highlightStars(stars, index + 1);
            });
        });
        
        rating.addEventListener('mouseleave', () => {
            const currentRating = rating.dataset.rating || 0;
            highlightStars(stars, currentRating);
        });
    });
}

function setStarRating(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    stars[0].parentElement.dataset.rating = rating;
}

function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('hover');
        } else {
            star.classList.remove('hover');
        }
    });
}

// Utility Functions for Micro-Interactions
const MicroInteractions = {
    // Button loading state
    setButtonLoading: showButtonLoading,
    removeButtonLoading: hideButtonLoading,
    
    // Notifications
    showSuccess: (message) => showNotification(message, 'success'),
    showError: (message) => showNotification(message, 'error'),
    showWarning: (message) => showNotification(message, 'warning'),
    showInfo: (message) => showNotification(message, 'info'),
    
    // Form validation
    showFieldError: (field) => {
        field.classList.add('error-state');
        shakeElement(field);
    },
    
    showFieldSuccess: (field) => {
        field.classList.remove('error-state');
        field.classList.add('success-state');
    },
    
    // Progress animation
    animateProgress: animateProgressBar,
    
    // Element animations
    shake: shakeElement,
    pulse: (element) => {
        element.classList.add('pulse-glow');
        setTimeout(() => element.classList.remove('pulse-glow'), 2000);
    },
    
    // Interactive enhancements
    enhance: enhanceInteractiveElements
};

// Make MicroInteractions available globally
window.MicroInteractions = MicroInteractions;

// ===== PAGE TRANSITIONS ===== //

class PageTransitions {
    constructor() {
        this.currentPage = null;
        this.isTransitioning = false;
        this.transitionDuration = 600;
        this.init();
    }

    init() {
        this.bindRouteEvents();
        this.initializeHistory();
    }

    bindRouteEvents() {
        // Handle navigation links
        document.addEventListener('click', (e) => {
            // Don't interfere with team selection clicks
            if (e.target.closest('.team-option') || e.target.closest('.team-color-circle')) {
                return;
            }
            
            const link = e.target.closest('[data-route]');
            if (link && !this.isTransitioning) {
                // Only prevent default for internal route navigation
                // Allow normal links to work (external links, mailto, tel, etc.)
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('/') || href.startsWith('./') || href.includes(window.location.hostname)) {
                    e.preventDefault();
                    const route = link.dataset.route;
                    const transition = link.dataset.transition || 'slide';
                    this.navigateTo(route, transition);
                }
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                this.navigateTo(e.state.route, 'slide', false);
            }
        });
    }

    initializeHistory() {
        const currentPath = window.location.pathname;
        const route = this.pathToRoute(currentPath);
        this.currentPage = route;
        
        if (!window.history.state) {
            window.history.replaceState({ route }, '', currentPath);
        }
    }

    async navigateTo(route, transitionType = 'slide', pushState = true) {
        if (this.isTransitioning || route === this.currentPage) return;

        this.isTransitioning = true;
        
        // Show loading state
        this.showPageLoader();
        
        try {
            // Load new page content
            const newContent = await this.loadPageContent(route);
            
            // Perform transition
            await this.performPageTransition(this.currentPage, route, transitionType, newContent);
            
            // Update browser history
            if (pushState) {
                const url = this.routeToPath(route);
                window.history.pushState({ route }, '', url);
            }
            
            this.currentPage = route;
            
        } catch (error) {
            console.error('Navigation error:', error);
            this.showError('Failed to load page');
        } finally {
            this.isTransitioning = false;
            this.hidePageLoader();
        }
    }

    async loadPageContent(route) {
        // Simulate loading delay for demo
        await this.delay(300);
        
        // In a real app, this would fetch content from server
        return this.getPageContent(route);
    }

    getPageContent(route) {
        const pages = {
            home: '<h1>Home Page</h1><p>Welcome to the home page</p>',
            about: '<h1>About Page</h1><p>Learn more about us</p>',
            services: '<h1>Services Page</h1><p>Our services</p>',
            contact: '<h1>Contact Page</h1><p>Get in touch</p>'
        };
        
        return pages[route] || '<h1>404</h1><p>Page not found</p>';
    }

    async performPageTransition(fromRoute, toRoute, transitionType, newContent) {
        const container = document.querySelector('.page-container') || document.body;
        const fromElement = container.querySelector('.page-active');
        
        // Create new page element
        const toElement = document.createElement('div');
        toElement.className = 'page-transition';
        toElement.innerHTML = newContent;
        
        // Apply initial transition state
        this.applyTransitionStart(toElement, transitionType);
        container.appendChild(toElement);
        
        // Force reflow
        toElement.offsetHeight;
        
        // Perform transition
        await this.executeTransition(fromElement, toElement, transitionType);
        
        // Cleanup
        if (fromElement) {
            fromElement.remove();
        }
        toElement.className = 'page-active';
    }

    applyTransitionStart(element, type) {
        element.style.position = 'absolute';
        element.style.top = '0';
        element.style.left = '0';
        element.style.width = '100%';
        element.style.minHeight = '100vh';
        element.style.transition = `all ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        switch (type) {
            case 'slide-left':
                element.style.transform = 'translateX(100%)';
                break;
            case 'slide-right':
                element.style.transform = 'translateX(-100%)';
                break;
            case 'slide-up':
                element.style.transform = 'translateY(100%)';
                break;
            case 'slide-down':
                element.style.transform = 'translateY(-100%)';
                break;
            case 'fade':
                element.style.opacity = '0';
                break;
            case 'scale':
                element.style.transform = 'scale(0.8)';
                element.style.opacity = '0';
                break;
            case 'flip':
                element.style.transform = 'rotateY(90deg)';
                element.style.transformOrigin = 'center';
                break;
            case 'zoom':
                element.style.transform = 'scale(1.2)';
                element.style.opacity = '0';
                break;
            default:
                element.style.transform = 'translateX(100%)';
        }
    }

    async executeTransition(fromElement, toElement, type) {
        // Start exit animation for current page
        if (fromElement) {
            this.applyExitTransition(fromElement, type);
        }
        
        // Start enter animation for new page
        await this.delay(50);
        this.applyEnterTransition(toElement, type);
        
        // Wait for transition to complete
        await this.delay(this.transitionDuration);
    }

    applyExitTransition(element, type) {
        switch (type) {
            case 'slide-left':
                element.style.transform = 'translateX(-100%)';
                break;
            case 'slide-right':
                element.style.transform = 'translateX(100%)';
                break;
            case 'slide-up':
                element.style.transform = 'translateY(-100%)';
                break;
            case 'slide-down':
                element.style.transform = 'translateY(100%)';
                break;
            case 'fade':
                element.style.opacity = '0';
                break;
            case 'scale':
                element.style.transform = 'scale(1.2)';
                element.style.opacity = '0';
                break;
            case 'flip':
                element.style.transform = 'rotateY(-90deg)';
                break;
            case 'zoom':
                element.style.transform = 'scale(0.8)';
                element.style.opacity = '0';
                break;
            default:
                element.style.transform = 'translateX(-100%)';
        }
    }

    applyEnterTransition(element, type) {
        switch (type) {
            case 'slide-left':
            case 'slide-right':
            case 'slide-up':
            case 'slide-down':
                element.style.transform = 'translateX(0) translateY(0)';
                break;
            case 'fade':
                element.style.opacity = '1';
                break;
            case 'scale':
            case 'zoom':
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
                break;
            case 'flip':
                element.style.transform = 'rotateY(0deg)';
                break;
            default:
                element.style.transform = 'translateX(0)';
        }
    }

    showPageLoader() {
        let loader = document.querySelector('.page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'page-loader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <div class="loader-progress"></div>
            `;
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const spinner = loader.querySelector('.loader-spinner');
            spinner.style.cssText = `
                width: 40px;
                height: 40px;
                border: 3px solid #e5e7eb;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            `;
            
            const progress = loader.querySelector('.loader-progress');
            progress.style.cssText = `
                width: 200px;
                height: 3px;
                background: #e5e7eb;
                border-radius: 2px;
                overflow: hidden;
                position: relative;
            `;
            
            progress.innerHTML = '<div class="progress-bar"></div>';
            const progressBar = progress.querySelector('.progress-bar');
            progressBar.style.cssText = `
                width: 0%;
                height: 100%;
                background: #3b82f6;
                border-radius: 2px;
                transition: width 0.3s ease;
            `;
            
            document.body.appendChild(loader);
        }
        
        loader.style.opacity = '1';
        
        // Animate progress bar
        const progressBar = loader.querySelector('.progress-bar');
        setTimeout(() => {
            progressBar.style.width = '70%';
        }, 100);
        
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 200);
    }

    hidePageLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
    }

    showError(message) {
        if (window.MicroInteractions) {
            window.MicroInteractions.showError(message);
        }
    }

    pathToRoute(path) {
        const routes = {
            '/': 'home',
            '/home': 'home',
            '/about': 'about',
            '/services': 'services',
            '/contact': 'contact'
        };
        return routes[path] || 'home';
    }

    routeToPath(route) {
        const paths = {
            home: '/',
            about: '/about',
            services: '/services',
            contact: '/contact'
        };
        return paths[route] || '/';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Route Animation Effects
class RouteAnimations {
    static slideIn(element, direction = 'right') {
        const directions = {
            right: 'translateX(100%)',
            left: 'translateX(-100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };
        
        element.style.transform = directions[direction];
        element.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translate(0, 0)';
        });
    }

    static fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    static scaleIn(element, duration = 500) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    }

    static flipIn(element, duration = 600) {
        element.style.transform = 'rotateY(90deg)';
        element.style.transition = `transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'rotateY(0deg)';
        });
    }
}

// Initialize page transitions
let pageTransitions;

// Auto-initialize if not already done
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.pageTransitions) {
            window.pageTransitions = new PageTransitions();
        }
    });
}

// Export for use
window.PageTransitions = PageTransitions;
window.RouteAnimations = RouteAnimations;

// ===== DASHBOARD CHARTS ===== //

class DashboardCharts {
    constructor() {
        this.charts = new Map();
        this.animationDuration = 2000;
        this.init();
    }

    init() {
        this.initializeCharts();
        this.bindEvents();
    }

    initializeCharts() {
        // Initialize all chart types
        this.initLineCharts();
        this.initBarCharts();
        this.initDonutCharts();
        this.initProgressRings();
        this.initMetricCards();
    }

    bindEvents() {
        // Chart hover events
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.chart-dot')) {
                this.showTooltip(e.target, e);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.chart-dot')) {
                this.hideTooltip();
            }
        });

        // Chart refresh
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-refresh-chart]')) {
                const chartId = e.target.closest('[data-refresh-chart]').dataset.refreshChart;
                this.refreshChart(chartId);
            }
        });
    }

    // Line Chart Functions
    initLineCharts() {
        const lineCharts = document.querySelectorAll('.animated-line-chart');
        
        lineCharts.forEach((chart, index) => {
            const chartId = `line-chart-${index}`;
            this.charts.set(chartId, {
                type: 'line',
                element: chart,
                data: this.generateLineData()
            });
            
            this.renderLineChart(chartId);
        });
    }

    generateLineData() {
        const points = [];
        for (let i = 0; i < 7; i++) {
            points.push({
                x: i * 60,
                y: Math.random() * 100 + 50,
                value: Math.floor(Math.random() * 1000) + 100
            });
        }
        return points;
    }

    renderLineChart(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        const svg = chart.element.querySelector('svg') || this.createSVG();
        chart.element.appendChild(svg);

        // Create gradient
        const defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        if (!svg.querySelector('defs')) svg.appendChild(defs);

        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', `chartGradient-${chartId}`);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '0%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#3b82f6;stop-opacity:0.3');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#3b82f6;stop-opacity:0');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);

        // Create path
        const pathData = this.createPathData(chart.data);
        
        // Area path
        const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        areaPath.setAttribute('class', 'chart-area');
        areaPath.setAttribute('d', pathData.area);
        areaPath.setAttribute('fill', `url(#chartGradient-${chartId})`);
        svg.appendChild(areaPath);

        // Line path
        const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        linePath.setAttribute('class', 'chart-line');
        linePath.setAttribute('d', pathData.line);
        svg.appendChild(linePath);

        // Data points
        chart.data.forEach((point, index) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', 'chart-dot');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', '4');
            circle.setAttribute('data-value', point.value);
            circle.style.animationDelay = `${2 + index * 0.1}s`;
            svg.appendChild(circle);
        });
    }

    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 400 200');
        svg.style.width = '100%';
        svg.style.height = '100%';
        return svg;
    }

    createPathData(data) {
        if (data.length === 0) return { line: '', area: '' };

        let line = `M${data[0].x},${data[0].y}`;
        let area = `M0,200 L${data[0].x},${data[0].y}`;

        for (let i = 1; i < data.length; i++) {
            const prevPoint = data[i - 1];
            const currPoint = data[i];
            
            const cpx1 = prevPoint.x + (currPoint.x - prevPoint.x) / 3;
            const cpy1 = prevPoint.y;
            const cpx2 = currPoint.x - (currPoint.x - prevPoint.x) / 3;
            const cpy2 = currPoint.y;
            
            line += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${currPoint.x},${currPoint.y}`;
            area += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${currPoint.x},${currPoint.y}`;
        }

        area += ` L400,200 Z`;
        
        return { line, area };
    }

    // Bar Chart Functions
    initBarCharts() {
        const barCharts = document.querySelectorAll('.animated-bar-chart');
        
        barCharts.forEach((chart, index) => {
            const chartId = `bar-chart-${index}`;
            const data = this.generateBarData();
            
            this.charts.set(chartId, {
                type: 'bar',
                element: chart,
                data: data
            });
            
            this.renderBarChart(chartId);
        });
    }

    generateBarData() {
        const data = [];
        for (let i = 0; i < 7; i++) {
            data.push({
                value: Math.floor(Math.random() * 100) + 20,
                label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
            });
        }
        return data;
    }

    renderBarChart(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        chart.element.innerHTML = '';
        
        chart.data.forEach((item, index) => {
            const bar = document.createElement('div');
            bar.className = 'animated-bar';
            bar.style.height = `${item.value}%`;
            bar.setAttribute('data-value', item.value);
            bar.style.animationDelay = `${index * 0.1}s`;
            
            // Add click event
            bar.addEventListener('click', () => {
                this.animateBarClick(bar);
            });
            
            chart.element.appendChild(bar);
        });
    }

    animateBarClick(bar) {
        bar.style.transform = 'scaleY(1) scaleX(1.2)';
        setTimeout(() => {
            bar.style.transform = 'scaleY(1) scaleX(1)';
        }, 200);
    }

    // Donut Chart Functions
    initDonutCharts() {
        const donutCharts = document.querySelectorAll('.animated-donut-chart');
        
        donutCharts.forEach((chart, index) => {
            const chartId = `donut-chart-${index}`;
            const data = this.generateDonutData();
            
            this.charts.set(chartId, {
                type: 'donut',
                element: chart,
                data: data
            });
            
            this.renderDonutChart(chartId);
        });
    }

    generateDonutData() {
        const values = [35, 25, 20, 20];
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
        const labels = ['Desktop', 'Mobile', 'Tablet', 'Other'];
        
        return values.map((value, index) => ({
            value,
            color: colors[index],
            label: labels[index]
        }));
    }

    renderDonutChart(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        const svg = chart.element.querySelector('svg') || this.createSVG();
        svg.setAttribute('viewBox', '0 0 200 200');
        chart.element.appendChild(svg);

        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        let currentOffset = 0;

        chart.data.forEach((segment, index) => {
            const segmentLength = (segment.value / 100) * circumference;
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', `donut-segment segment-${index + 1}`);
            circle.setAttribute('cx', '100');
            circle.setAttribute('cy', '100');
            circle.setAttribute('r', radius);
            circle.setAttribute('stroke', segment.color);
            circle.setAttribute('stroke-dasharray', `${segmentLength} ${circumference}`);
            circle.setAttribute('stroke-dashoffset', -currentOffset);
            circle.style.setProperty('--segment-length', segmentLength);
            circle.style.animationDelay = `${index * 0.2}s`;
            
            svg.appendChild(circle);
            currentOffset += segmentLength;
        });

        // Center value
        const centerDiv = chart.element.querySelector('.donut-center');
        if (centerDiv) {
            const totalValue = chart.data.reduce((sum, item) => sum + item.value, 0);
            const valueElement = centerDiv.querySelector('.donut-value');
            if (valueElement) {
                this.animateCounter(valueElement, totalValue, '%');
            }
        }
    }

    // Progress Ring Functions
    initProgressRings() {
        const progressRings = document.querySelectorAll('.progress-ring');
        
        progressRings.forEach((ring, index) => {
            const value = [75, 80, 65, 70][index] || Math.floor(Math.random() * 100);
            const circumference = 2 * Math.PI * 40; // radius = 40
            const offset = circumference - (value / 100) * circumference;
            
            const fillElement = ring.querySelector('.progress-ring-fill');
            if (fillElement) {
                fillElement.style.setProperty('--ring-offset', offset);
            }
            
            const textElement = ring.querySelector('.progress-text');
            if (textElement) {
                setTimeout(() => {
                    this.animateCounter(textElement, value, '%');
                }, index * 200 + 1000);
            }
        });
    }

    // Metric Card Functions
    initMetricCards() {
        const metricCards = document.querySelectorAll('.metric-card');
        
        metricCards.forEach((card, index) => {
            const valueElement = card.querySelector('.metric-value');
            if (valueElement && valueElement.dataset.target) {
                const target = parseFloat(valueElement.dataset.target);
                const suffix = valueElement.dataset.suffix || '';
                
                setTimeout(() => {
                    this.animateCounter(valueElement, target, suffix);
                }, index * 200 + 500);
            }
        });
    }

    // Utility Functions
    animateCounter(element, target, suffix = '') {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target % 1 !== 0) {
                element.textContent = current.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }
        }, 16);
    }

    showTooltip(element, event) {
        const value = element.getAttribute('data-value');
        if (!value) return;

        let tooltip = document.querySelector('.chart-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'chart-tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = `Value: ${value}`;
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY - 30 + 'px';
        tooltip.classList.add('visible');
    }

    hideTooltip() {
        const tooltip = document.querySelector('.chart-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    refreshChart(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        // Add refresh animation
        chart.element.style.opacity = '0.7';
        chart.element.style.transform = 'scale(0.98)';

        setTimeout(() => {
            // Generate new data
            switch (chart.type) {
                case 'line':
                    chart.data = this.generateLineData();
                    this.renderLineChart(chartId);
                    break;
                case 'bar':
                    chart.data = this.generateBarData();
                    this.renderBarChart(chartId);
                    break;
                case 'donut':
                    chart.data = this.generateDonutData();
                    this.renderDonutChart(chartId);
                    break;
            }

            // Reset animation
            chart.element.style.opacity = '1';
            chart.element.style.transform = 'scale(1)';
        }, 300);
    }

    // Real-time data simulation
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateRealTimeValues();
        }, 5000);
    }

    updateRealTimeValues() {
        const chartValues = document.querySelectorAll('.chart-value');
        
        chartValues.forEach(element => {
            const currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
            const variation = (Math.random() - 0.5) * 0.1;
            const newValue = currentValue * (1 + variation);
            
            // Animate value change
            element.style.transform = 'scale(1.1)';
            element.style.color = variation > 0 ? '#16a34a' : '#dc2626';
            
            setTimeout(() => {
                if (element.textContent.includes('K')) {
                    element.textContent = `$${newValue.toFixed(1)}K`;
                } else if (element.textContent.includes('%')) {
                    element.textContent = `${newValue.toFixed(1)}%`;
                } else {
                    element.textContent = Math.floor(newValue).toLocaleString();
                }
                
                element.style.transform = 'scale(1)';
                element.style.color = '#3b82f6';
            }, 200);
        });
    }

    // Chart export functionality
    exportChart(chartId, format = 'png') {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        // This would implement chart export functionality
        console.log(`Exporting chart ${chartId} as ${format}`);
    }
}

// Data Visualization Utilities
class DataVisualization {
    static createSparkline(data, container) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '30');
        svg.style.display = 'block';
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        
        let path = '';
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 30 - ((value - min) / range) * 30;
            path += index === 0 ? `M${x},${y}` : ` L${x},${y}`;
        });
        
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        pathElement.setAttribute('stroke', '#3b82f6');
        pathElement.setAttribute('stroke-width', '2');
        pathElement.setAttribute('fill', 'none');
        
        svg.appendChild(pathElement);
        container.appendChild(svg);
    }

    static createMiniChart(type, data, container) {
        switch (type) {
            case 'line':
                this.createSparkline(data, container);
                break;
            case 'bar':
                this.createMiniBarChart(data, container);
                break;
            default:
                console.warn('Unknown mini chart type:', type);
        }
    }

    static createMiniBarChart(data, container) {
        const chartDiv = document.createElement('div');
        chartDiv.style.display = 'flex';
        chartDiv.style.alignItems = 'end';
        chartDiv.style.height = '30px';
        chartDiv.style.gap = '2px';
        
        const max = Math.max(...data);
        
        data.forEach(value => {
            const bar = document.createElement('div');
            bar.style.flex = '1';
            bar.style.backgroundColor = '#3b82f6';
            bar.style.height = `${(value / max) * 100}%`;
            bar.style.borderRadius = '1px 1px 0 0';
            chartDiv.appendChild(bar);
        });
        
        container.appendChild(chartDiv);
    }
}

// Initialize dashboard charts
let dashboardCharts;

// Auto-initialize if not already done
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.dashboardCharts) {
            window.dashboardCharts = new DashboardCharts();
            
            // Start real-time updates after 3 seconds
            setTimeout(() => {
                window.dashboardCharts.startRealTimeUpdates();
            }, 3000);
        }
    });
}

// Export for use
window.DashboardCharts = DashboardCharts;
window.DataVisualization = DataVisualization;

// ===== PARALLAX EFFECTS & SCROLL ANIMATIONS ===== //

class ParallaxEffects {
    constructor() {
        this.scrollY = 0;
        this.ticking = false;
        this.parallaxElements = [];
        this.scrollProgress = null;
        this.init();
    }

    init() {
        this.setupScrollProgress();
        this.findParallaxElements();
        this.bindEvents();
        this.initIntersectionObserver();
    }

    setupScrollProgress() {
        // Create scroll progress bar if it doesn't exist
        if (!document.querySelector('.scroll-progress')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            document.body.appendChild(progressBar);
        }
        this.scrollProgress = document.querySelector('.scroll-progress');
    }

    findParallaxElements() {
        // Find all parallax elements
        this.parallaxElements = [
            ...document.querySelectorAll('.parallax-layer'),
            ...document.querySelectorAll('.parallax-background'),
            ...document.querySelectorAll('.floating-element'),
            ...document.querySelectorAll('[data-parallax]')
        ];
    }

    bindEvents() {
        window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        window.addEventListener('resize', this.onResize.bind(this));
        
        // Mouse parallax for interactive elements
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onScroll() {
        this.scrollY = window.pageYOffset;
        
        if (!this.ticking) {
            requestAnimationFrame(this.updateParallax.bind(this));
            this.ticking = true;
        }
    }

    updateParallax() {
        this.updateScrollProgress();
        this.updateParallaxElements();
        this.ticking = false;
    }

    updateScrollProgress() {
        if (!this.scrollProgress) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (this.scrollY / scrollHeight) * 100;
        this.scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    updateParallaxElements() {
        this.parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const direction = element.dataset.direction || 'vertical';
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = -(this.scrollY * speed);
                
                switch (direction) {
                    case 'vertical':
                        element.style.transform = `translateY(${yPos}px)`;
                        break;
                    case 'horizontal':
                        element.style.transform = `translateX(${yPos}px)`;
                        break;
                    case 'scale':
                        const scale = 1 + (this.scrollY * speed * 0.001);
                        element.style.transform = `scale(${scale})`;
                        break;
                    case 'rotate':
                        element.style.transform = `rotate(${yPos * 0.1}deg)`;
                        break;
                }
            }
        });
    }

    onMouseMove(e) {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        
        // Apply mouse parallax to floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.02;
            const x = mouseX * speed * 100;
            const y = mouseY * speed * 100;
            
            element.style.transform += ` translate(${x}px, ${y}px)`;
        });
    }

    onResize() {
        this.findParallaxElements();
    }

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'revealed');
                }
            });
        }, observerOptions);

        // Observe scroll reveal elements
        const elementsToObserve = [
            ...document.querySelectorAll('.scroll-reveal'),
            ...document.querySelectorAll('.fade-in-up'),
            ...document.querySelectorAll('.fade-in-left'),
            ...document.querySelectorAll('.fade-in-right'),
            ...document.querySelectorAll('.zoom-in'),
            ...document.querySelectorAll('.stagger-container'),
            ...document.querySelectorAll('.text-reveal'),
            ...document.querySelectorAll('.char-reveal')
        ];

        elementsToObserve.forEach(el => observer.observe(el));
    }
}

class ScrollAnimations {
    constructor() {
        this.scrollTriggers = [];
        this.counters = [];
        this.init();
    }

    init() {
        this.setupTextReveal();
        this.setupCounters();
        this.setupScrollTriggers();
        this.setupSmoothScroll();
    }

    setupTextReveal() {
        // Convert text to spans for word-by-word animation
        const textReveals = document.querySelectorAll('.text-reveal');
        textReveals.forEach(element => {
            const text = element.textContent;
            const words = text.split(' ');
            element.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
        });

        // Convert text to spans for character-by-character animation
        const charReveals = document.querySelectorAll('.char-reveal');
        charReveals.forEach(element => {
            const text = element.textContent;
            const chars = text.split('');
            element.innerHTML = chars.map(char => 
                char === ' ' ? ' ' : `<span class="char">${char}</span>`
            ).join('');
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target) || 0;
            const duration = parseInt(counter.dataset.duration) || 2000;
            const suffix = counter.dataset.suffix || '';
            
            this.counters.push({
                element: counter,
                target,
                duration,
                suffix,
                started: false
            });
        });
    }

    setupScrollTriggers() {
        const triggers = document.querySelectorAll('[data-scroll-trigger]');
        triggers.forEach(trigger => {
            const animation = trigger.dataset.scrollTrigger;
            const delay = parseInt(trigger.dataset.delay) || 0;
            
            this.scrollTriggers.push({
                element: trigger,
                animation,
                delay,
                triggered: false
            });
        });
    }

    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    animateCounter(counterObj) {
        if (counterObj.started) return;
        counterObj.started = true;
        
        const { element, target, duration, suffix } = counterObj;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            element.classList.add('counting');
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
    }

    triggerScrollAnimation(triggerObj) {
        if (triggerObj.triggered) return;
        triggerObj.triggered = true;
        
        const { element, animation, delay } = triggerObj;
        
        setTimeout(() => {
            switch (animation) {
                case 'fadeIn':
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    element.style.transition = 'all 0.6s ease';
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 50);
                    break;
                case 'slideIn':
                    element.style.transform = 'translateX(-100%)';
                    element.style.transition = 'transform 0.6s ease';
                    setTimeout(() => {
                        element.style.transform = 'translateX(0)';
                    }, 50);
                    break;
                case 'scaleIn':
                    element.style.transform = 'scale(0)';
                    element.style.transition = 'transform 0.6s ease';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 50);
                    break;
            }
        }, delay);
    }

    checkScrollTriggers() {
        this.scrollTriggers.forEach(trigger => {
            if (!trigger.triggered) {
                const rect = trigger.element.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.8) {
                    this.triggerScrollAnimation(trigger);
                }
            }
        });

        this.counters.forEach(counter => {
            if (!counter.started) {
                const rect = counter.element.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.8) {
                    this.animateCounter(counter);
                }
            }
        });
    }
}

class ScrollIndicators {
    constructor() {
        this.sections = [];
        this.indicators = [];
        this.currentSection = 0;
        this.init();
    }

    init() {
        this.findSections();
        this.createIndicators();
        this.bindEvents();
    }

    findSections() {
        this.sections = [
            ...document.querySelectorAll('section'),
            ...document.querySelectorAll('.scroll-snap-section'),
            ...document.querySelectorAll('[data-section]')
        ];
    }

    createIndicators() {
        if (this.sections.length === 0) return;
        
        const container = document.createElement('div');
        container.className = 'scroll-indicators';
        
        this.sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot';
            if (index === 0) dot.classList.add('active');
            dot.dataset.section = index;
            
            dot.addEventListener('click', () => {
                this.scrollToSection(index);
            });
            
            container.appendChild(dot);
            this.indicators.push(dot);
        });
        
        document.body.appendChild(container);
    }

    bindEvents() {
        window.addEventListener('scroll', this.updateActiveIndicator.bind(this), { passive: true });
    }

    updateActiveIndicator() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollY >= sectionTop - windowHeight / 2 && scrollY < sectionBottom - windowHeight / 2) {
                if (this.currentSection !== index) {
                    this.setActiveIndicator(index);
                }
            }
        });
    }

    setActiveIndicator(index) {
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
            this.currentSection = index;
        }
    }

    scrollToSection(index) {
        if (this.sections[index]) {
            this.sections[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

class ParticleSystem {
    constructor(container) {
        this.container = container || document.body;
        this.particles = [];
        this.maxParticles = 50;
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 3 + 's';
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
            }
        }, 3000);
    }

    animate() {
        // Continuously create new particles
        setInterval(() => {
            if (this.particles.length < this.maxParticles) {
                this.createParticle();
            }
        }, 200);
    }
}

class MagneticElements {
    constructor() {
        this.magneticElements = [];
        this.init();
    }

    init() {
        this.findMagneticElements();
        this.bindEvents();
    }

    findMagneticElements() {
        this.magneticElements = document.querySelectorAll('.magnetic');
    }

    bindEvents() {
        this.magneticElements.forEach(element => {
            element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
            element.addEventListener('mousemove', this.onMouseMove.bind(this));
            element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        });
    }

    onMouseEnter(e) {
        e.target.style.transition = 'transform 0.3s ease';
    }

    onMouseMove(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = 0.3;
        const moveX = x * strength;
        const moveY = y * strength;
        
        e.target.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    }

    onMouseLeave(e) {
        e.target.style.transform = 'translate(0px, 0px) scale(1)';
    }
}

// Initialize all scroll and parallax effects
let parallaxEffects, scrollAnimations, scrollIndicators, particleSystem, magneticElements;

// Auto-initialize if not already done
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize parallax effects
        if (!window.parallaxEffects) {
            window.parallaxEffects = new ParallaxEffects();
        }
        
        // Initialize scroll animations
        if (!window.scrollAnimations) {
            window.scrollAnimations = new ScrollAnimations();
            
            // Check scroll triggers on scroll
            window.addEventListener('scroll', () => {
                window.scrollAnimations.checkScrollTriggers();
            }, { passive: true });
        }
        
        // Initialize scroll indicators
        if (!window.scrollIndicators) {
            window.scrollIndicators = new ScrollIndicators();
        }
        
        // Initialize magnetic elements
        if (!window.magneticElements) {
            window.magneticElements = new MagneticElements();
        }
        
        // Initialize particle system for hero sections
        const heroSections = document.querySelectorAll('.hero, .parallax-container');
        heroSections.forEach(section => {
            if (!section.dataset.particles) {
                new ParticleSystem(section);
                section.dataset.particles = 'true';
            }
        });
    });
}

// Export for use
window.ParallaxEffects = ParallaxEffects;
window.ScrollAnimations = ScrollAnimations;
window.ScrollIndicators = ScrollIndicators;
window.ParticleSystem = ParticleSystem;
window.MagneticElements = MagneticElements;

// ===== LOADING ANIMATIONS & SKELETON SCREENS ===== //

class LoadingManager {
    constructor() {
        this.activeLoaders = new Map();
        this.defaultOptions = {
            type: 'spinner', // spinner, dots, bars, pulse
            size: 'medium', // small, medium, large
            color: '#3498db',
            text: 'Loading...',
            overlay: true,
            backdrop: true
        };
        this.init();
    }

    init() {
        this.createLoadingStyles();
        this.setupGlobalLoader();
    }

    createLoadingStyles() {
        // Inject additional loading styles if needed
        const style = document.createElement('style');
        style.textContent = `
            .loading-manager-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(2px);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .loading-manager-overlay.visible {
                opacity: 1;
            }
            
            .loading-manager-content {
                text-align: center;
                padding: 40px;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                max-width: 300px;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            
            .loading-manager-overlay.visible .loading-manager-content {
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);
    }

    setupGlobalLoader() {
        // Create global loading overlay
        this.globalOverlay = document.createElement('div');
        this.globalOverlay.className = 'loading-manager-overlay';
        this.globalOverlay.innerHTML = `
            <div class="loading-manager-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(this.globalOverlay);
    }

    show(options = {}) {
        const config = { ...this.defaultOptions, ...options };
        const loaderId = this.generateId();
        
        if (config.target) {
            return this.showTargetLoader(config.target, config, loaderId);
        } else {
            return this.showGlobalLoader(config, loaderId);
        }
    }

    showGlobalLoader(config, loaderId) {
        const content = this.globalOverlay.querySelector('.loading-manager-content');
        const spinner = content.querySelector('.loading-spinner');
        const text = content.querySelector('.loading-text');
        
        // Update spinner type
        spinner.className = `loading-${config.type} ${config.size}`;
        spinner.style.borderTopColor = config.color;
        
        // Update text
        text.textContent = config.text;
        
        // Show overlay
        this.globalOverlay.classList.add('visible');
        
        this.activeLoaders.set(loaderId, {
            element: this.globalOverlay,
            type: 'global'
        });
        
        return loaderId;
    }

    showTargetLoader(target, config, loaderId) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return null;
        
        // Create loader element
        const loader = document.createElement('div');
        loader.className = 'loading-target-overlay';
        loader.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            border-radius: inherit;
        `;
        
        const content = document.createElement('div');
        content.style.textAlign = 'center';
        
        const spinner = document.createElement('div');
        spinner.className = `loading-${config.type} ${config.size}`;
        spinner.style.borderTopColor = config.color;
        
        const text = document.createElement('div');
        text.className = 'loading-text';
        text.textContent = config.text;
        text.style.marginTop = '15px';
        
        content.appendChild(spinner);
        if (config.text) content.appendChild(text);
        loader.appendChild(content);
        
        // Make target relative if needed
        const originalPosition = getComputedStyle(element).position;
        if (originalPosition === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(loader);
        
        this.activeLoaders.set(loaderId, {
            element: loader,
            target: element,
            originalPosition,
            type: 'target'
        });
        
        return loaderId;
    }

    hide(loaderId) {
        const loader = this.activeLoaders.get(loaderId);
        if (!loader) return;
        
        if (loader.type === 'global') {
            this.globalOverlay.classList.remove('visible');
        } else if (loader.type === 'target') {
            loader.element.remove();
            // Restore original position if we changed it
            if (loader.originalPosition === 'static') {
                loader.target.style.position = '';
            }
        }
        
        this.activeLoaders.delete(loaderId);
    }

    hideAll() {
        this.activeLoaders.forEach((loader, id) => {
            this.hide(id);
        });
    }

    generateId() {
        return 'loader_' + Math.random().toString(36).substr(2, 9);
    }

    // Utility methods
    showSpinner(target, options = {}) {
        return this.show({ ...options, type: 'spinner', target });
    }

    showDots(target, options = {}) {
        return this.show({ ...options, type: 'dots', target });
    }

    showBars(target, options = {}) {
        return this.show({ ...options, type: 'bars', target });
    }

    showPulse(target, options = {}) {
        return this.show({ ...options, type: 'pulse', target });
    }
}

class SkeletonLoader {
    constructor() {
        this.templates = new Map();
        this.activeSkeletons = new Map();
        this.init();
    }

    init() {
        this.registerDefaultTemplates();
    }

    registerDefaultTemplates() {
        // Social media post template
        this.registerTemplate('social', `
            <div class="skeleton-card">
                <div class="skeleton-header" style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div class="skeleton skeleton-avatar" style="margin-right: 15px;"></div>
                    <div style="flex: 1;">
                        <div class="skeleton skeleton-text short"></div>
                        <div class="skeleton skeleton-text medium"></div>
                    </div>
                </div>
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text medium"></div>
            </div>
        `);

        // Article template
        this.registerTemplate('article', `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text medium"></div>
                <div class="skeleton skeleton-text short"></div>
            </div>
        `);

        // Profile template
        this.registerTemplate('profile', `
            <div class="skeleton-card" style="text-align: center;">
                <div class="skeleton skeleton-avatar large" style="margin: 0 auto 20px;"></div>
                <div class="skeleton skeleton-text medium" style="margin: 0 auto 10px;"></div>
                <div class="skeleton skeleton-text short" style="margin: 0 auto 20px;"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text medium"></div>
            </div>
        `);

        // Product template
        this.registerTemplate('product', `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-button" style="margin-top: 15px;"></div>
            </div>
        `);

        // Table row template
        this.registerTemplate('table-row', `
            <tr>
                <td><div class="skeleton skeleton-text medium"></div></td>
                <td><div class="skeleton skeleton-text short"></div></td>
                <td><div class="skeleton skeleton-text long"></div></td>
                <td><div class="skeleton skeleton-text short"></div></td>
            </tr>
        `);

        // List item template
        this.registerTemplate('list-item', `
            <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
                <div class="skeleton skeleton-avatar small" style="margin-right: 15px;"></div>
                <div style="flex: 1;">
                    <div class="skeleton skeleton-text medium"></div>
                    <div class="skeleton skeleton-text short"></div>
                </div>
            </div>
        `);
    }

    registerTemplate(name, html) {
        this.templates.set(name, html);
    }

    show(target, template = 'article', count = 1) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return null;

        const skeletonId = this.generateId();
        const templateHtml = this.templates.get(template);
        
        if (!templateHtml) {
            console.warn(`Skeleton template '${template}' not found`);
            return null;
        }

        // Store original content
        const originalContent = element.innerHTML;
        
        // Generate skeleton content
        let skeletonContent = '';
        for (let i = 0; i < count; i++) {
            skeletonContent += templateHtml;
        }
        
        element.innerHTML = skeletonContent;
        element.classList.add('skeleton-loading');
        
        this.activeSkeletons.set(skeletonId, {
            element,
            originalContent,
            template,
            count
        });
        
        return skeletonId;
    }

    hide(skeletonId, fadeOut = true) {
        const skeleton = this.activeSkeletons.get(skeletonId);
        if (!skeleton) return;

        if (fadeOut) {
            skeleton.element.style.transition = 'opacity 0.3s ease';
            skeleton.element.style.opacity = '0';
            
            setTimeout(() => {
                skeleton.element.innerHTML = skeleton.originalContent;
                skeleton.element.style.opacity = '';
                skeleton.element.style.transition = '';
                skeleton.element.classList.remove('skeleton-loading');
            }, 300);
        } else {
            skeleton.element.innerHTML = skeleton.originalContent;
            skeleton.element.classList.remove('skeleton-loading');
        }
        
        this.activeSkeletons.delete(skeletonId);
    }

    hideAll(fadeOut = true) {
        this.activeSkeletons.forEach((skeleton, id) => {
            this.hide(id, fadeOut);
        });
    }

    generateId() {
        return 'skeleton_' + Math.random().toString(36).substr(2, 9);
    }

    // Utility methods
    showSocial(target, count = 3) {
        return this.show(target, 'social', count);
    }

    showArticle(target, count = 1) {
        return this.show(target, 'article', count);
    }

    showProfile(target, count = 1) {
        return this.show(target, 'profile', count);
    }

    showProduct(target, count = 6) {
        return this.show(target, 'product', count);
    }

    showList(target, count = 5) {
        return this.show(target, 'list-item', count);
    }
}

class ProgressManager {
    constructor() {
        this.activeProgress = new Map();
        this.init();
    }

    init() {
        this.createProgressStyles();
    }

    createProgressStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .progress-manager {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
            }
            
            .progress-manager-bar {
                height: 100%;
                background: #3498db;
                border-radius: 4px;
                transition: width 0.3s ease;
                position: relative;
            }
            
            .progress-manager-bar.animated::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: progressShine 2s ease-in-out infinite;
            }
            
            @keyframes progressShine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }

    create(target, options = {}) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return null;

        const progressId = this.generateId();
        const config = {
            color: '#3498db',
            animated: true,
            showText: false,
            ...options
        };

        const container = document.createElement('div');
        container.className = 'progress-manager';
        
        const bar = document.createElement('div');
        bar.className = `progress-manager-bar ${config.animated ? 'animated' : ''}`;
        bar.style.backgroundColor = config.color;
        bar.style.width = '0%';
        
        container.appendChild(bar);
        element.appendChild(container);

        this.activeProgress.set(progressId, {
            container,
            bar,
            element,
            config
        });

        return progressId;
    }

    update(progressId, percentage, text = '') {
        const progress = this.activeProgress.get(progressId);
        if (!progress) return;

        progress.bar.style.width = Math.min(Math.max(percentage, 0), 100) + '%';
        
        if (progress.config.showText && text) {
            if (!progress.textElement) {
                progress.textElement = document.createElement('div');
                progress.textElement.style.cssText = `
                    text-align: center;
                    margin-top: 8px;
                    font-size: 0.9rem;
                    color: #666;
                `;
                progress.container.appendChild(progress.textElement);
            }
            progress.textElement.textContent = text;
        }
    }

    complete(progressId, callback) {
        this.update(progressId, 100);
        
        setTimeout(() => {
            if (callback) callback();
            this.remove(progressId);
        }, 500);
    }

    remove(progressId) {
        const progress = this.activeProgress.get(progressId);
        if (!progress) return;

        progress.container.remove();
        this.activeProgress.delete(progressId);
    }

    generateId() {
        return 'progress_' + Math.random().toString(36).substr(2, 9);
    }
}

class LazyLoader {
    constructor() {
        this.observer = null;
        this.elements = new Set();
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    threshold: 0.1,
                    rootMargin: '50px'
                }
            );
        }
        
        this.findLazyElements();
    }

    findLazyElements() {
        const elements = document.querySelectorAll('.lazy-load, [data-lazy]');
        elements.forEach(el => this.observe(el));
    }

    observe(element) {
        if (this.observer) {
            this.observer.observe(element);
            this.elements.add(element);
        }
    }

    unobserve(element) {
        if (this.observer) {
            this.observer.unobserve(element);
            this.elements.delete(element);
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
                this.unobserve(entry.target);
            }
        });
    }

    loadElement(element) {
        // Handle images
        if (element.tagName === 'IMG') {
            const src = element.dataset.src;
            if (src) {
                element.src = src;
                element.removeAttribute('data-src');
            }
        }
        
        // Handle background images
        const bgImage = element.dataset.bgImage;
        if (bgImage) {
            element.style.backgroundImage = `url(${bgImage})`;
            element.removeAttribute('data-bg-image');
        }
        
        // Handle content loading
        const contentUrl = element.dataset.contentUrl;
        if (contentUrl) {
            this.loadContent(element, contentUrl);
        }
        
        // Add loaded class
        element.classList.add('loaded');
        
        // Trigger custom event
        element.dispatchEvent(new CustomEvent('lazy-loaded'));
    }

    async loadContent(element, url) {
        try {
            const response = await fetch(url);
            const content = await response.text();
            element.innerHTML = content;
        } catch (error) {
            console.error('Failed to load lazy content:', error);
            element.innerHTML = '<p>Failed to load content</p>';
        }
    }
}

// Initialize loading systems
let loadingManager, skeletonLoader, progressManager, lazyLoader;

// Auto-initialize if not already done
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize loading manager
        if (!window.loadingManager) {
            window.loadingManager = new LoadingManager();
        }
        
        // Initialize skeleton loader
        if (!window.skeletonLoader) {
            window.skeletonLoader = new SkeletonLoader();
        }
        
        // Initialize progress manager
        if (!window.progressManager) {
            window.progressManager = new ProgressManager();
        }
        
        // Initialize lazy loader
        if (!window.lazyLoader) {
            window.lazyLoader = new LazyLoader();
        }
    });
}

// Export for use
window.LoadingManager = LoadingManager;
window.SkeletonLoader = SkeletonLoader;
window.ProgressManager = ProgressManager;
window.LazyLoader = LazyLoader;

// ===== HOVER EFFECTS & INTERACTIVE ELEMENTS ===== //

class HoverEffects {
    constructor() {
        this.magneticElements = new Set();
        this.tiltElements = new Set();
        this.rippleElements = new Set();
        this.init();
    }

    init() {
        this.setupMagneticEffect();
        this.setupTiltEffect();
        this.setupRippleEffect();
        this.setupTooltips();
        this.setupCursorFollower();
    }

    setupMagneticEffect() {
        const magneticElements = document.querySelectorAll('.interactive-magnetic');
        
        magneticElements.forEach(element => {
            this.magneticElements.add(element);
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                element.style.setProperty('--mouse-x', `${moveX}px`);
                element.style.setProperty('--mouse-y', `${moveY}px`);
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.setProperty('--mouse-x', '0px');
                element.style.setProperty('--mouse-y', '0px');
            });
        });
    }

    setupTiltEffect() {
        const tiltElements = document.querySelectorAll('.card-hover-tilt, .interactive-tilt');
        
        tiltElements.forEach(element => {
            this.tiltElements.add(element);
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    setupRippleEffect() {
        const rippleElements = document.querySelectorAll('.btn-hover-ripple, .interactive-ripple');
        
        rippleElements.forEach(element => {
            this.rippleElements.add(element);
            
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: 20px;
                    height: 20px;
                    margin-left: -10px;
                    margin-top: -10px;
                    pointer-events: none;
                `;
                
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add ripple animation keyframes
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            if (!element.classList.contains('tooltip-hover')) {
                element.classList.add('tooltip-hover');
            }
        });
    }

    setupCursorFollower() {
        // Create custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(52, 152, 219, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            display: none;
        `;
        document.body.appendChild(cursor);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.display = 'block';
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
        });
        
        // Smooth cursor animation
        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX - 10 + 'px';
            cursor.style.top = cursorY - 10 + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
        
        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .interactive-cursor, [data-cursor]');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(231, 76, 60, 0.8)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(52, 152, 219, 0.8)';
            });
        });
    }

    // Utility methods
    addMagneticEffect(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element && !this.magneticElements.has(element)) {
            element.classList.add('interactive-magnetic');
            this.magneticElements.add(element);
            this.setupMagneticEffect();
        }
    }

    addTiltEffect(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element && !this.tiltElements.has(element)) {
            element.classList.add('interactive-tilt');
            this.tiltElements.add(element);
            this.setupTiltEffect();
        }
    }

    addRippleEffect(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element && !this.rippleElements.has(element)) {
            element.classList.add('interactive-ripple');
            this.rippleElements.add(element);
            this.setupRippleEffect();
        }
    }
}

class InteractiveAnimations {
    constructor() {
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupScrollTriggers();
        this.setupClickAnimations();
        this.setupHoverAnimations();
        this.setupFormAnimations();
    }

    setupScrollTriggers() {
        const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animation = entry.target.dataset.animateOnScroll;
                        this.triggerAnimation(entry.target, animation);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            animatedElements.forEach(el => observer.observe(el));
            this.observers.set('scroll', observer);
        }
    }

    setupClickAnimations() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-click-animation]');
            if (target) {
                const animation = target.dataset.clickAnimation;
                this.triggerAnimation(target, animation);
            }
        });
    }

    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll('[data-hover-animation]');
        
        hoverElements.forEach(element => {
            const animation = element.dataset.hoverAnimation;
            
            element.addEventListener('mouseenter', () => {
                this.triggerAnimation(element, animation);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetAnimation(element);
            });
        });
    }

    setupFormAnimations() {
        const formElements = document.querySelectorAll('input, textarea, select');
        
        formElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('input-focused');
                this.animateLabel(element);
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('input-focused');
                if (!element.value) {
                    this.resetLabel(element);
                }
            });
        });
    }

    triggerAnimation(element, animation) {
        switch (animation) {
            case 'bounce':
                element.classList.add('interactive-bounce');
                setTimeout(() => element.classList.remove('interactive-bounce'), 1000);
                break;
            case 'shake':
                element.classList.add('interactive-shake');
                setTimeout(() => element.classList.remove('interactive-shake'), 500);
                break;
            case 'pulse':
                element.classList.add('interactive-pulse');
                setTimeout(() => element.classList.remove('interactive-pulse'), 2000);
                break;
            case 'wobble':
                element.classList.add('interactive-wobble');
                setTimeout(() => element.classList.remove('interactive-wobble'), 1000);
                break;
            case 'fadeIn':
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    element.style.transition = 'all 0.5s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 10);
                break;
            case 'slideIn':
                element.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    element.style.transition = 'transform 0.5s ease';
                    element.style.transform = 'translateX(0)';
                }, 10);
                break;
            case 'zoomIn':
                element.style.transform = 'scale(0)';
                setTimeout(() => {
                    element.style.transition = 'transform 0.5s ease';
                    element.style.transform = 'scale(1)';
                }, 10);
                break;
            case 'rotateIn':
                element.style.transform = 'rotate(-180deg) scale(0)';
                setTimeout(() => {
                    element.style.transition = 'transform 0.5s ease';
                    element.style.transform = 'rotate(0deg) scale(1)';
                }, 10);
                break;
        }
    }

    resetAnimation(element) {
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
    }

    animateLabel(element) {
        const label = element.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            label.style.transform = 'translateY(-20px) scale(0.8)';
            label.style.color = '#3498db';
        }
    }

    resetLabel(element) {
        const label = element.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            label.style.transform = '';
            label.style.color = '';
        }
    }

    // Utility methods
    animate(element, animation, duration = 1000) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            this.triggerAnimation(element, animation);
            if (duration > 0) {
                setTimeout(() => this.resetAnimation(element), duration);
            }
        }
    }

    addScrollAnimation(element, animation) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.dataset.animateOnScroll = animation;
            this.setupScrollTriggers();
        }
    }
}

class ButtonEffects {
    constructor() {
        this.loadingButtons = new Map();
        this.init();
    }

    init() {
        this.setupButtonStates();
        this.setupLoadingButtons();
    }

    setupButtonStates() {
        const buttons = document.querySelectorAll('button, .btn');
        
        buttons.forEach(button => {
            // Add default hover class if none exists
            if (!button.className.includes('btn-hover-')) {
                button.classList.add('btn-hover-lift');
            }
            
            // Add click feedback
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = '';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    setupLoadingButtons() {
        const loadingButtons = document.querySelectorAll('[data-loading-text]');
        
        loadingButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setLoading(button, true);
            });
        });
    }

    setLoading(button, isLoading) {
        if (typeof button === 'string') {
            button = document.querySelector(button);
        }
        
        if (!button) return;
        
        if (isLoading) {
            const originalText = button.textContent;
            const loadingText = button.dataset.loadingText || 'Loading...';
            
            this.loadingButtons.set(button, originalText);
            button.textContent = loadingText;
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            const originalText = this.loadingButtons.get(button);
            if (originalText) {
                button.textContent = originalText;
                this.loadingButtons.delete(button);
            }
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }

    // Utility methods
    addGlowEffect(button, color = '#3498db') {
        if (typeof button === 'string') {
            button = document.querySelector(button);
        }
        if (button) {
            button.style.boxShadow = `0 0 20px ${color}`;
            setTimeout(() => {
                button.style.boxShadow = '';
            }, 2000);
        }
    }

    addSuccessState(button, duration = 2000) {
        if (typeof button === 'string') {
            button = document.querySelector(button);
        }
        if (button) {
            const originalBg = button.style.backgroundColor;
            const originalText = button.textContent;
            
            button.style.backgroundColor = '#2ecc71';
            button.textContent = '✓ Success';
            
            setTimeout(() => {
                button.style.backgroundColor = originalBg;
                button.textContent = originalText;
            }, duration);
        }
    }

    addErrorState(button, duration = 2000) {
        if (typeof button === 'string') {
            button = document.querySelector(button);
        }
        if (button) {
            const originalBg = button.style.backgroundColor;
            const originalText = button.textContent;
            
            button.style.backgroundColor = '#e74c3c';
            button.textContent = '✗ Error';
            button.classList.add('interactive-shake');
            
            setTimeout(() => {
                button.style.backgroundColor = originalBg;
                button.textContent = originalText;
                button.classList.remove('interactive-shake');
            }, duration);
        }
    }
}

// Initialize interactive systems
let hoverEffects, interactiveAnimations, buttonEffects;

// Auto-initialize if not already done
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize hover effects
        if (!window.hoverEffects) {
            window.hoverEffects = new HoverEffects();
        }
        
        // Initialize interactive animations
        if (!window.interactiveAnimations) {
            window.interactiveAnimations = new InteractiveAnimations();
        }
        
        // Initialize button effects
        if (!window.buttonEffects) {
            window.buttonEffects = new ButtonEffects();
        }
    });
}

// Export for use
window.HoverEffects = HoverEffects;
window.InteractiveAnimations = InteractiveAnimations;
window.ButtonEffects = ButtonEffects;

// ===== MOBILE & TOUCH INTERACTIONS =====

class TouchGestureManager {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.maxSwipeTime = 300;
        this.touchStartTime = 0;
        this.longPressTimeout = null;
        this.longPressDelay = 500;
        
        this.init();
    }
    
    init() {
        this.setupSwipeGestures();
        this.setupLongPress();
        this.setupTouchFeedback();
        this.setupPullToRefresh();
    }
    
    setupSwipeGestures() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.touchStartTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe(e.target);
        }, { passive: true });
    }
    
    handleSwipe(element) {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const deltaTime = Date.now() - this.touchStartTime;
        
        if (deltaTime > this.maxSwipeTime) return;
        
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        if (absDeltaX > this.minSwipeDistance || absDeltaY > this.minSwipeDistance) {
            let direction;
            
            if (absDeltaX > absDeltaY) {
                direction = deltaX > 0 ? 'right' : 'left';
            } else {
                direction = deltaY > 0 ? 'down' : 'up';
            }
            
            this.triggerSwipeAnimation(element, direction);
            this.dispatchSwipeEvent(element, direction, { deltaX, deltaY, deltaTime });
        }
    }
    
    triggerSwipeAnimation(element, direction) {
        if (element.classList.contains('swipeable')) {
            element.classList.add(`swipe-${direction}`);
            setTimeout(() => {
                element.classList.remove(`swipe-${direction}`);
            }, 300);
        }
    }
    
    dispatchSwipeEvent(element, direction, details) {
        const event = new CustomEvent('swipe', {
            detail: { direction, ...details }
        });
        element.dispatchEvent(event);
    }
    
    setupLongPress() {
        document.addEventListener('touchstart', (e) => {
            const element = e.target.closest('.long-press');
            if (element) {
                this.longPressTimeout = setTimeout(() => {
                    element.classList.add('pressing');
                    this.dispatchLongPressEvent(element);
                    navigator.vibrate && navigator.vibrate(50);
                }, this.longPressDelay);
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const element = e.target.closest('.long-press');
            if (element) {
                clearTimeout(this.longPressTimeout);
                element.classList.remove('pressing');
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            clearTimeout(this.longPressTimeout);
            const element = e.target.closest('.long-press');
            if (element) {
                element.classList.remove('pressing');
            }
        }, { passive: true });
    }
    
    dispatchLongPressEvent(element) {
        const event = new CustomEvent('longpress');
        element.dispatchEvent(event);
    }
    
    setupTouchFeedback() {
        document.addEventListener('touchstart', (e) => {
            const element = e.target.closest('.touch-feedback');
            if (element) {
                this.createTouchRipple(element, e.touches[0]);
            }
        }, { passive: true });
    }
    
    createTouchRipple(element, touch) {
        const rect = element.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let isPulling = false;
        
        document.addEventListener('touchstart', (e) => {
            const element = e.target.closest('.pull-to-refresh');
            if (element && window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            const element = e.target.closest('.pull-to-refresh');
            if (element) {
                currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                
                if (pullDistance > 0 && pullDistance < 100) {
                    element.style.transform = `translateY(${pullDistance * 0.5}px)`;
                    
                    if (pullDistance > 60) {
                        element.classList.add('pulling');
                    } else {
                        element.classList.remove('pulling');
                    }
                }
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!isPulling) return;
            
            const element = e.target.closest('.pull-to-refresh');
            if (element) {
                const pullDistance = currentY - startY;
                
                if (pullDistance > 60) {
                    element.classList.add('refreshing');
                    element.classList.remove('pulling');
                    
                    // Dispatch refresh event
                    const event = new CustomEvent('pullrefresh');
                    element.dispatchEvent(event);
                    
                    // Reset after 2 seconds (or when manually reset)
                    setTimeout(() => {
                        this.resetPullToRefresh(element);
                    }, 2000);
                } else {
                    this.resetPullToRefresh(element);
                }
                
                isPulling = false;
            }
        }, { passive: true });
    }
    
    resetPullToRefresh(element) {
        element.style.transform = '';
        element.classList.remove('pulling', 'refreshing');
    }
}

class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTouch = this.detectTouch();
        this.init();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    init() {
        if (this.isMobile) {
            this.optimizeForMobile();
        }
        
        if (this.isTouch) {
            this.setupTouchOptimizations();
        }
        
        this.setupViewportHandler();
        this.setupOrientationHandler();
    }
    
    optimizeForMobile() {
        // Disable complex animations on mobile
        document.body.classList.add('mobile-device');
        
        // Reduce animation complexity
        const style = document.createElement('style');
        style.textContent = `
            .mobile-device .particle-system,
            .mobile-device .complex-animation {
                display: none !important;
            }
            
            .mobile-device .parallax-element {
                transform: none !important;
            }
            
            .mobile-device .scroll-reveal {
                animation-duration: 0.3s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupTouchOptimizations() {
        // Replace hover effects with touch effects
        document.body.classList.add('touch-device');
        
        // Disable hover effects on touch devices
        const style = document.createElement('style');
        style.textContent = `
            .touch-device *:hover {
                /* Disable hover effects on touch devices */
            }
        `;
        document.head.appendChild(style);
    }
    
    setupViewportHandler() {
        // Handle viewport changes (keyboard show/hide on mobile)
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            if (heightDifference > 150) {
                // Keyboard is likely open
                document.body.classList.add('keyboard-open');
            } else {
                // Keyboard is likely closed
                document.body.classList.remove('keyboard-open');
            }
        });
    }
    
    setupOrientationHandler() {
        window.addEventListener('orientationchange', () => {
            // Handle orientation change
            setTimeout(() => {
                // Recalculate layouts after orientation change
                window.dispatchEvent(new Event('resize'));
            }, 100);
        });
    }
}

class HapticFeedback {
    constructor() {
        this.isSupported = 'vibrate' in navigator;
    }
    
    light() {
        if (this.isSupported) {
            navigator.vibrate(10);
        }
        this.visualFeedback('haptic-light');
    }
    
    medium() {
        if (this.isSupported) {
            navigator.vibrate([10, 10, 10]);
        }
        this.visualFeedback('haptic-medium');
    }
    
    heavy() {
        if (this.isSupported) {
            navigator.vibrate([20, 10, 20]);
        }
        this.visualFeedback('haptic-heavy');
    }
    
    success() {
        if (this.isSupported) {
            navigator.vibrate([10, 5, 10]);
        }
        this.visualFeedback('haptic-light');
    }
    
    error() {
        if (this.isSupported) {
            navigator.vibrate([50, 10, 50, 10, 50]);
        }
        this.visualFeedback('haptic-heavy');
    }
    
    visualFeedback(className) {
        document.body.classList.add(className);
        setTimeout(() => {
            document.body.classList.remove(className);
        }, 200);
    }
}

class SwipeCardManager {
    constructor() {
        this.cards = [];
        this.currentIndex = 0;
        this.threshold = 100;
        this.init();
    }
    
    init() {
        this.setupSwipeCards();
    }
    
    setupSwipeCards() {
        const cards = document.querySelectorAll('.swipe-card');
        cards.forEach(card => {
            this.setupCardGestures(card);
        });
    }
    
    setupCardGestures(card) {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isDragging = false;
        
        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            card.classList.add('swiping');
        }, { passive: true });
        
        card.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            const rotation = deltaX * 0.1;
            
            card.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`;
            card.style.opacity = 1 - Math.abs(deltaX) / 300;
        }, { passive: true });
        
        card.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const deltaX = currentX - startX;
            
            card.classList.remove('swiping');
            
            if (Math.abs(deltaX) > this.threshold) {
                // Swipe away
                const direction = deltaX > 0 ? 'right' : 'left';
                card.classList.add(`swipe-${direction}-exit`);
                
                // Dispatch swipe event
                const event = new CustomEvent('cardswipe', {
                    detail: { direction, card }
                });
                card.dispatchEvent(event);
                
                setTimeout(() => {
                    card.remove();
                }, 300);
            } else {
                // Snap back
                card.style.transform = '';
                card.style.opacity = '';
            }
            
            isDragging = false;
        }, { passive: true });
    }
}

class BottomSheetManager {
    constructor() {
        this.sheets = new Map();
        this.init();
    }
    
    init() {
        this.setupBottomSheets();
    }
    
    setupBottomSheets() {
        const sheets = document.querySelectorAll('.bottom-sheet');
        sheets.forEach(sheet => {
            this.setupSheet(sheet);
        });
    }
    
    setupSheet(sheet) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        let initialTransform = 0;
        
        // Handle drag to dismiss
        sheet.addEventListener('touchstart', (e) => {
            if (e.target === sheet || sheet.contains(e.target)) {
                startY = e.touches[0].clientY;
                isDragging = true;
                
                const transform = getComputedStyle(sheet).transform;
                if (transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    initialTransform = matrix.m42; // translateY value
                }
            }
        }, { passive: true });
        
        sheet.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) { // Only allow downward drag
                const newTransform = initialTransform + deltaY;
                sheet.style.transform = `translateY(${newTransform}px)`;
            }
        }, { passive: true });
        
        sheet.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const deltaY = currentY - startY;
            
            if (deltaY > 100) {
                // Dismiss sheet
                this.hideSheet(sheet);
            } else {
                // Snap back
                sheet.style.transform = '';
            }
            
            isDragging = false;
        }, { passive: true });
        
        this.sheets.set(sheet.id || 'default', sheet);
    }
    
    showSheet(sheetId = 'default') {
        const sheet = this.sheets.get(sheetId) || document.querySelector('.bottom-sheet');
        if (sheet) {
            sheet.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideSheet(sheetId = 'default') {
        const sheet = typeof sheetId === 'string' 
            ? this.sheets.get(sheetId) || document.querySelector('.bottom-sheet')
            : sheetId;
            
        if (sheet) {
            sheet.classList.remove('show');
            sheet.style.transform = '';
            document.body.style.overflow = '';
        }
    }
}

// Initialize mobile and touch classes
let touchGestureManager, mobileOptimizer, hapticFeedback, swipeCardManager, bottomSheetManager;

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize mobile and touch classes
        touchGestureManager = new TouchGestureManager();
        mobileOptimizer = new MobileOptimizer();
        hapticFeedback = new HapticFeedback();
        swipeCardManager = new SwipeCardManager();
        bottomSheetManager = new BottomSheetManager();
        
        console.log('Mobile and touch interactions initialized');
    });
}

// Export mobile classes
window.TouchGestureManager = TouchGestureManager;
window.MobileOptimizer = MobileOptimizer;
window.HapticFeedback = HapticFeedback;
window.SwipeCardManager = SwipeCardManager;
window.BottomSheetManager = BottomSheetManager;

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationController, AnimationUtils };
}