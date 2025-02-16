import { fetchArticle } from "./article-content.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded");
  const musingsSection = document.getElementById("musings");

  if (musingsSection) {
    console.log("Found musings section");
    const article = document.createElement("article");
    const content = await fetchArticle("ai-bberwocky");
    console.log("Received content:", content);
    article.innerHTML = content;
    musingsSection.appendChild(article);
    console.log("Article appended");
  }
});

// You can add methods to change articles
export async function displayArticle(id) {
  const musingsSection = document.getElementById("musings");
  if (musingsSection) {
    musingsSection.innerHTML = "";
    const article = document.createElement("article");
    const content = await fetchArticle(id);
    console.log("Received content:", content);
    article.innerHTML = content;
    musingsSection.appendChild(article);
    console.log("Article appended");
  }
}
