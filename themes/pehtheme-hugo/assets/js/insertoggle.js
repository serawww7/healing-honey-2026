// TOGGLE BUTTON
(function () {
    const toggleButtons = document.querySelectorAll(".toggle-button");

    function syncExpanded(button, isOpen) {
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (button.hasAttribute("aria-label")) {
            button.setAttribute(
                "aria-label",
                isOpen ? "Закрити меню" : "Відкрити меню"
            );
        }
    }

    function setOpenState(targetElement, isOpen) {
        targetElement.classList.toggle("close", !isOpen);
        targetElement.classList.toggle("open", isOpen);

        toggleButtons.forEach((button) => {
            const targets = (button.getAttribute("data-target") || "").split(" ");
            if (targets.includes(targetElement.id)) {
                syncExpanded(button, isOpen);
            }
        });
    }

    function hideAllExcept(targetElement) {
        document.querySelectorAll(".open").forEach((element) => {
            if (element !== targetElement) {
                setOpenState(element, false);
            }
        });
    }

    function toggleElement(targetElement) {
        const isHidden = targetElement.classList.contains("close");
        hideAllExcept(targetElement);
        setOpenState(targetElement, isHidden);
    }

    toggleButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const targetIds = this.getAttribute("data-target").split(" ");
            targetIds.forEach((targetId) => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    toggleElement(targetElement);
                }
            });
        });
    });

    document.addEventListener("click", function (event) {
        const targetElements = Array.from(document.querySelectorAll(".open"));
        const clickedOutsideAllTargets = targetElements.every((element) => {
            return !element.contains(event.target) && !event.target.closest(".toggle-button");
        });

        if (clickedOutsideAllTargets) {
            targetElements.forEach((element) => {
                setOpenState(element, false);
            });
        }
    });
})();
