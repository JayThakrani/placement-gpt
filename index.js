/* =====================================================
   PLACEMENTGPT LANDING PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       MOBILE MENU
    ================================================= */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileMenu =
        document.getElementById("mobileMenu");


    if (mobileMenuBtn && mobileMenu) {

        mobileMenuBtn.addEventListener("click", () => {

            mobileMenu.classList.toggle("open");

            const icon =
                mobileMenuBtn.querySelector("i");

            if (mobileMenu.classList.contains("open")) {

                icon.classList.remove("fa-bars");

                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            }

        });


        /* Close menu after clicking a link */

        const mobileLinks =
            mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");

                const icon =
                    mobileMenuBtn.querySelector("i");

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            });

        });

    }


    /* =================================================
       NAVBAR SCROLL EFFECT
    ================================================= */

    const navbar =
        document.querySelector(".navbar");


    function updateNavbar() {

        if (!navbar) {
            return;
        }

        if (window.scrollY > 20) {

            navbar.style.boxShadow =
                "0 5px 25px rgba(15, 23, 42, 0.07)";

        } else {

            navbar.style.boxShadow = "none";

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );

    updateNavbar();


    /* =================================================
       ACTIVE NAVIGATION
    ================================================= */

    const navLinks =
        document.querySelectorAll(".nav-link");

    const sections =
        document.querySelectorAll("section[id]");


    function updateActiveNavigation() {

        let currentSection = "home";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;

            const sectionBottom =
                sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            const target =
                link.getAttribute("href");

            if (target === `#${currentSection}`) {

                link.classList.add("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();


    /* =================================================
       SMOOTH SCROLL
    ================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* =================================================
       SIMPLE REVEAL ANIMATION
    ================================================= */

    const revealElements =
        document.querySelectorAll(
            ".feature-card, .step, .section-heading"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        element.classList.add("reveal-element");

        observer.observe(element);

    });


    /* =================================================
       PREVENT EMPTY FEATURE LINKS
    ================================================= */

    const emptyLinks =
        document.querySelectorAll(
            'a[href="#"]'
        );


    emptyLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

        });

    });

});