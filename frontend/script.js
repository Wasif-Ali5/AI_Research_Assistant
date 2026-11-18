document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    const form = document.getElementById("research-form");
    const topicInput = document.getElementById("topic-input");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const errorBox = document.getElementById("error-box");
    const loadingBox = document.getElementById("loading-box");
    const resultsSection = document.getElementById("results-section");
    const keyFindingsList = document.getElementById("key-findings-list");
    const finalSummaryContent = document.getElementById("final-summary-content");
    const sourcesContainer = document.getElementById("sources-container");
    const copyBtn = document.getElementById("copy-btn");

    let currentSummary = "";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const topic = topicInput.value.trim();
        if (!topic) return;

        // Reset UI states
        errorBox.classList.add("hidden");
        resultsSection.classList.add("hidden");
        loadingBox.classList.remove("hidden");
        submitBtn.disabled = true;
        btnText.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin inline mr-2"></i> Researching...';
        lucide.createIcons();

        try {
            const response = await fetch("http://127.0.0.1:8000/research", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ topic: topic })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to fetch research from backend.");
            }

            const data = await response.json();
            currentSummary = data.final_summary;

            // Render Key Findings
            keyFindingsList.innerHTML = "";
            data.key_findings.forEach((finding, index) => {
                const li = document.createElement("li");
                li.className = "flex items-start gap-3 text-slate-300 text-sm leading-relaxed";
                li.innerHTML = `
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 font-semibold flex items-center justify-center text-xs border border-blue-500/20">
                        ${index + 1}
                    </span>
                    <span>${finding}</span>
                `;
                keyFindingsList.appendChild(li);
            });

            // Render Executive Summary
            finalSummaryContent.textContent = data.final_summary;

            // Render Sources
            sourcesContainer.innerHTML = "";
            data.sources.forEach((source) => {
                const isUrl = source.startsWith("http");
                const a = document.createElement("a");
                a.href = isUrl ? source : "#";
                if (isUrl) {
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                }
                a.className = "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all border border-slate-700/50 group";
                a.innerHTML = `
                    <span class="truncate max-w-xs">${source}</span>
                    ${isUrl ? '<i data-lucide="external-link" class="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors"></i>' : ''}
                `;
                sourcesContainer.appendChild(a);
            });

            // Hide loading, show results
            loadingBox.classList.add("hidden");
            resultsSection.classList.remove("hidden");
            lucide.createIcons();

        } catch (err) {
            console.error(err);
            loadingBox.classList.add("hidden");
            errorBox.textContent = err.message || "Failed to connect to the research backend. Make sure FastAPI is running.";
            errorBox.classList.remove("hidden");
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = "Research";
        }
    });

    // Copy Summary Button
    copyBtn.addEventListener("click", () => {
        if (!currentSummary) return;
        navigator.clipboard.writeText(currentSummary);
        copyBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> <span>Copied Report!</span>';
        lucide.createIcons();
        setTimeout(() => {
            copyBtn.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i> <span>Copy Summary</span>';
            lucide.createIcons();
        }, 2000);
    });
});