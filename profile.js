document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const logoutBtn = document.getElementById("logoutBtn");
    const editBtn = document.getElementById("editBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const profileForm = document.getElementById("profileForm");
    const formActions = document.getElementById("formActions");

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const headerName = document.getElementById("headerName");

    const fields = document.querySelectorAll(
        "#profileForm input"
    );

    async function loadProfile() {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();
            
            if (data.success && data.profile) {
                const profile = data.profile;
                
                if (profileName) profileName.textContent = profile.name;
                if (headerName) headerName.textContent = profile.name;
                if (profileEmail) profileEmail.textContent = profile.email;

                const fullNameInput = document.getElementById("fullName");
                if (fullNameInput) fullNameInput.value = profile.name;
                const emailInput = document.getElementById("email");
                if (emailInput) emailInput.value = profile.email;
                
                // Assuming you have IDs for these inputs in HTML
                const collegeInput = document.getElementById("college");
                if (collegeInput && profile.college) collegeInput.value = profile.college;
                
                const branchInput = document.getElementById("branch");
                if (branchInput && profile.branch) branchInput.value = profile.branch;
                
                const semesterInput = document.getElementById("semester");
                if (semesterInput && profile.semester) semesterInput.value = profile.semester;
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    loadProfile();


    mobileMenu.addEventListener("click", () => {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("show");
    });

    sidebarOverlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
    });


    editBtn.addEventListener("click", () => {

        fields.forEach(field => {
            field.disabled = false;
            field.classList.add("editing");
        });

        formActions.classList.add("show");

        editBtn.style.display = "none";
    });


    cancelBtn.addEventListener("click", () => {

        fields.forEach(field => {
            field.disabled = true;
            field.classList.remove("editing");
        });

        formActions.classList.remove("show");

        editBtn.style.display = "inline-block";
    });


    profileForm.addEventListener("submit", async event => {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const emailValue = document.getElementById("email").value.trim();
        const collegeValue = document.getElementById("college") ? document.getElementById("college").value.trim() : "";
        const branchValue = document.getElementById("branch") ? document.getElementById("branch").value.trim() : "";
        const semesterValue = document.getElementById("semester") ? document.getElementById("semester").value.trim() : "0";

        if (!name || !emailValue) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: emailValue,
                    college: collegeValue,
                    branch: branchValue,
                    semester: semesterValue
                })
            });

            const data = await response.json();
            if (data.success) {
                if (profileName) profileName.textContent = name;
                if (headerName) headerName.textContent = name;
                if (profileEmail) profileEmail.textContent = emailValue;
                
                sessionStorage.setItem("placementGPTEmail", emailValue);

                fields.forEach(field => {
                    field.disabled = true;
                    field.classList.remove("editing");
                });

                formActions.classList.remove("show");
                editBtn.style.display = "inline-block";

                alert("Profile updated successfully.");
            } else {
                alert(data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating profile.");
        }
    });


    logoutBtn.addEventListener("click", async event => {
        event.preventDefault();

        if (confirm("Are you sure you want to logout?")) {
            try {
                await fetch('/api/logout', { method: 'POST' });
            } catch (err) {
                console.error("Logout failed", err);
            }
            sessionStorage.clear();
            window.location.href = "login.html";
        }
    });

});