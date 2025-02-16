import { marked } from "marked";

// Configure marked
marked.use({
  gfm: true,
  breaks: true,
});

const cache = new Map();

async function fetchArticle(id) {
  console.log("Fetching article:", id);
  if (cache.has(id)) {
    console.log("Returning from cache");
    return cache.get(id);
  }

  try {
    const response = await fetch("/js/content-store/musings.json");
    const data = await response.json();
    console.log("Fetched data:", data);

    const article = data.articles.find((a) => a.id === id);
    console.log("Found article:", article);

    if (!article) throw new Error("Article not found");

    const htmlContent = marked(article.content);
    console.log("Converted HTML:", htmlContent);

    cache.set(id, htmlContent);
    return htmlContent;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return "<p>Article temporarily unavailable</p>";
  }
}

export { fetchArticle };
