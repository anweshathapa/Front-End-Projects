document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.getElementById("bookmark-list");
    const nameInp = document.getElementById("bookmark-name");
    const urlInp = document.getElementById("bookmark-url");
    const sortSel = document.getElementById("sort-select");
    const searchInp = document.getElementById("search-input");
    const themeCheckbox = document.getElementById("theme-checkbox");
    let currentFilter = 'all';

    const catIconMap = { 'General': 'fa-globe', 'Work': 'fa-briefcase', 'Social': 'fa-users', 'Study': 'fa-book' };

    const showToast = (msg) => {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast"; toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    };

    const render = () => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        const term = searchInp.value.toLowerCase();
        
        let filtered = bookmarks.filter(b => 
            (currentFilter === 'all' || b.category === currentFilter) &&
            b.name.toLowerCase().includes(term)
        );

        listEl.innerHTML = "";
        
        if (filtered.length === 0) {
            listEl.innerHTML = `
                <div class="empty-note">
                    <i class="fas fa-folder-open"></i>
                    <p>There are no bookmarks yet. Add your bookmarks!</p>
                </div>
            `;
            return;
        }

        if (sortSel.value === "az") filtered.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        else if (sortSel.value === "oldest") filtered.sort((a,b) => a.id - b.id);
        else if (sortSel.value === "category") filtered.sort((a,b) => a.category.localeCompare(b.category));
        else filtered.sort((a,b) => b.id - a.id);

        filtered.forEach(b => {
            const li = document.createElement("li");
            const iconClass = catIconMap[b.category] || 'fa-bookmark';
            const fav = `https://icons.duckduckgo.com/ip3/${new URL(b.url).hostname}.ico`;

            li.innerHTML = `
                <div style="display:flex; align-items:center; flex:1; overflow:hidden">
                    <div style="margin-right:12px; flex-shrink:0">
                        <img src="${fav}" class="favicon" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <div class="favicon-fallback" style="display:none">${b.name[0].toUpperCase()}</div>
                    </div>
                    <div style="overflow:hidden">
                        <a href="${b.url}" target="_blank" style="text-decoration:none; color:inherit; font-weight:600; display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${b.name}</a>
                        <div style="font-size:0.65rem; opacity:0.7">
                            <i class="fas ${iconClass} cat-icon-list"></i> ${b.category}
                        </div>
                    </div>
                </div>
                <div class="btn-icon-group">
                    <button onclick="copyToClipboard('${b.url}')" class="btn-copy"><i class="fas fa-copy"></i></button>
                    <button onclick="deleteItem(${b.id})" class="btn-delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
            listEl.appendChild(li);
        });
    };

    window.copyToClipboard = (url) => { navigator.clipboard.writeText(url).then(() => showToast("Copied! 📋")); };

    window.deleteItem = (id) => {
        const b = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        const item = b.find(x => x.id === id);
        if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
            localStorage.setItem("bookmarks", JSON.stringify(b.filter(x => x.id !== id)));
            render();
            showToast("Bookmark deleted.");
        }
    };

    document.getElementById("add-bookmark").addEventListener("click", () => {
        if (!nameInp.value || !urlInp.value) return showToast("Fill both fields!");
        const b = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        const category = document.getElementById("bookmark-category").value;
        b.push({ id: Date.now(), name: nameInp.value, url: urlInp.value, category });
        localStorage.setItem("bookmarks", JSON.stringify(b));
        nameInp.value = ""; urlInp.value = "";
        render();
        showToast("Added! ✨");
    });

    themeCheckbox.addEventListener("change", () => {
        const t = themeCheckbox.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", t);
        localStorage.setItem("theme", t);
    });

    document.querySelectorAll(".pill").forEach(p => {
        p.addEventListener("click", () => {
            document.querySelector(".pill.active").classList.remove("active");
            p.classList.add("active");
            currentFilter = p.dataset.category;
            render();
        });
    });

    sortSel.addEventListener("change", render);
    searchInp.addEventListener("input", render);

    document.getElementById("clear-all").addEventListener("click", () => {
        if(confirm("Clear all bookmarks?")) { localStorage.removeItem("bookmarks"); render(); showToast("All data cleared."); }
    });

    document.getElementById("export-btn").addEventListener("click", () => {
        const data = localStorage.getItem("bookmarks");
        const blob = new Blob([data], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "bookmarks_backup.json"; a.click();
        showToast("Backup exported!");
    });

    document.getElementById("import-trigger").addEventListener("click", () => document.getElementById("import-btn").click());
    document.getElementById("import-btn").addEventListener("change", (e) => {
        const reader = new FileReader();
        reader.onload = () => { localStorage.setItem("bookmarks", reader.result); render(); showToast("Restored!"); };
        reader.readAsText(e.target.files[0]);
    });

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeCheckbox.checked = savedTheme === "dark";
    render();
});


