import articleContent from "./article-content.js";

document.addEventListener("DOMContentLoaded", () => {
  const musingsSection = document.getElementById("musings");

  if (musingsSection) {
    const article = document.createElement("article");
    article.innerHTML = articleContent;
    musingsSection.appendChild(article);
  }
});
