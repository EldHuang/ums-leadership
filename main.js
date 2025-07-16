let pages = [];

// Load the index
fetch("search-index.json")
  .then((res) => res.json())
  .then((data) => {
    pages = data;
  })
  .catch((err) => {
    console.error("Failed to load search index:", err);
  });

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchForm = document.getElementById("searchForm");

// Live search suggestions
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.classList.add("d-none");
    return;
  }

  const matches = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(query) ||
      page.content.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    searchResults.classList.add("d-none");
    return;
  }

  matches.forEach((match) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    const snippetIndex = match.content.toLowerCase().indexOf(query);
    const snippet =
      snippetIndex >= 0
        ? `...${match.content.substring(snippetIndex, snippetIndex + 60)}...`
        : "";

    li.innerHTML = `
      <a href="${match.url}" class="text-decoration-none text-dark">
        <strong>${match.title}</strong><br>
        <small>${snippet}</small>
      </a>
    `;
    searchResults.appendChild(li);
  });

  searchResults.classList.remove("d-none");
});

// "Go" button behavior
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const query = searchInput.value.trim().toLowerCase();
  const match = pages.find(
    (page) =>
      page.title.toLowerCase().includes(query) ||
      page.content.toLowerCase().includes(query)
  );

  if (match) {
    window.location.href = match.url;
  } else {
    alert("No results found.");
  }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!searchForm.contains(e.target)) {
    searchResults.classList.add("d-none");
  }
});
