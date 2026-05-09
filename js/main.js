document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const html = document.documentElement;

    const toggleTheme = () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    };

    const updateThemeIcons = (theme) => {
        const icons = document.querySelectorAll('.theme-icon');
        icons.forEach(icon => {
            icon.setAttribute('stroke', 'currentColor');
            icon.setAttribute('stroke-width', '2');
            icon.setAttribute('stroke-linecap', 'round');
            icon.setAttribute('stroke-linejoin', 'round');
            icon.setAttribute('fill', 'none');
            
            if (theme === 'dark') {
                // Sun icon for dark mode (click to go light)
                icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
            } else {
                // Moon icon for light mode (click to go dark)
                icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
            }
        });
    };

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

    // RTL Toggle
    const rtlToggle = document.getElementById('rtl-toggle');
    const mobileRtlToggle = document.getElementById('mobile-rtl-toggle');

    const toggleRtl = () => {
        const currentDir = document.body.getAttribute('dir');
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        document.body.setAttribute('dir', newDir);
        localStorage.setItem('dir', newDir);
    };

    if (rtlToggle) rtlToggle.addEventListener('click', toggleRtl);
    if (mobileRtlToggle) mobileRtlToggle.addEventListener('click', toggleRtl);

    // Initialize from local storage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);

    const savedDir = localStorage.getItem('dir') || 'ltr';
    document.body.setAttribute('dir', savedDir);

    // Mobile Menu
    const menuBtn = document.getElementById('menu-btn');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            document.body.classList.add('overflow-hidden');
        });
    }

    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
        });
    }

    mobileLinks?.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu?.classList.add('hidden');
            mobileMenu?.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
        });
    });

    // Shop Filters Mobile Toggle
    const filterToggle = document.getElementById('filter-toggle');
    const closeFilters = document.getElementById('close-filters');
    const shopSidebar = document.getElementById('shop-sidebar');

    if (filterToggle && shopSidebar) {
        filterToggle.addEventListener('click', () => {
            shopSidebar.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        });
    }

    if (closeFilters && shopSidebar) {
        closeFilters.addEventListener('click', () => {
            shopSidebar.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }

    // Sticky Header & Active Link
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Sticky behavior
        if (window.scrollY > 50) {
            header?.classList.add('py-3', 'shadow-2xl', 'bg-theme-main/90', 'backdrop-blur-lg');
            header?.classList.remove('py-6');
        } else {
            header?.classList.remove('py-3', 'shadow-2xl', 'bg-theme-main/90', 'backdrop-blur-lg');
            header?.classList.add('py-6');
        }
    });

    // Scroll to Top
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollToTopBtn.classList.add('opacity-100');
            } else {
                scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                scrollToTopBtn.classList.remove('opacity-100');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartContent = document.getElementById('cart-content');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');

    const updateCartUI = () => {
        // Update count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.opacity = totalItems > 0 ? '1' : '0';
        }

        // Update items list
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div id="empty-cart-msg" class="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p class="uppercase tracking-widest text-sm">The archive is empty</p>
                    </div>
                `;
            } else {
                cartItemsContainer.innerHTML = cart.map((item, index) => `
                    <div class="flex gap-6 group">
                        <div class="w-24 h-24 museum-border overflow-hidden flex-shrink-0">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h3 class="font-serif text-lg">${item.name}</h3>
                                <p class="text-primary font-bold text-sm mt-1">$${item.price.toFixed(2)}</p>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="flex items-center border border-primary/20 text-xs">
                                    <button class="px-2 py-1 hover:bg-primary/10" onclick="updateQuantity(${index}, -1)">-</button>
                                    <span class="px-3 py-1 border-x border-primary/20">${item.quantity}</span>
                                    <button class="px-2 py-1 hover:bg-primary/10" onclick="updateQuantity(${index}, 1)">+</button>
                                </div>
                                <button class="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-red-500 transition-all" onclick="removeFromCart(${index})">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalElement) {
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    };

    window.toggleCart = (show) => {
        if (show) {
            cartDrawer?.classList.remove('hidden');
            setTimeout(() => {
                cartContent?.classList.remove('translate-x-full');
            }, 10);
            document.body.classList.add('overflow-hidden');
        } else {
            cartContent?.classList.add('translate-x-full');
            setTimeout(() => {
                cartDrawer?.classList.add('hidden');
            }, 500);
            document.body.classList.remove('overflow-hidden');
        }
    };

    window.addToCart = (name, price, image) => {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }
        updateCartUI();
        window.toggleCart(true);
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    window.updateQuantity = (index, delta) => {
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
        }
        updateCartUI();
    };

    if (cartBtn) cartBtn.addEventListener('click', () => window.toggleCart(true));
    if (closeCart) closeCart.addEventListener('click', () => window.toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => window.toggleCart(false));

    // Initialize UI
    updateCartUI();

    // Bind "Add to Cart" buttons
    const bindAddButtons = () => {
        document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
            btn.onclick = (e) => {
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));
                const image = btn.getAttribute('data-image');
                window.addToCart(name, price, image);
            };
        });
    };
    bindAddButtons();

    // Form Validation (Simple)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                alert('Thank you! Your message has been received.');
                form.reset();
            }
        });
    });

    // Password Toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            const icon = toggle.querySelector('svg');
            if (type === 'text') {
                icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            } else {
                icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            }
        });
    });
});
