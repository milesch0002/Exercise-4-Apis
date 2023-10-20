// https://jsonplaceholder.typicode.com/guide/

async function downloadPosts(page = 1) {
  const postsURL = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
  const response = await fetch(postsURL);
  const articles = await response.json();
  return articles;
}

async function downloadComments(postId) {
  const commentsURL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
  const response = await fetch(commentsURL);
  const comments = await response.json();
  return comments;
}

async function getUserName(userId) {
  const userURL = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(userURL);
  const user = await response.json();
  return user.name;
}

function getArticleId(comments) {
  const article = comments.previousElementSibling;
  const data = article.dataset;
  return data.postId;
}

const details = document.getElementsByTagName("details");
for (const detail of details) {
  detail.addEventListener("toggle", async (event) => {
    if (detail.open) {
      const asides = detail.getElementsByTagName("aside");
      const commentsWereDownloaded = asides.length > 0;
      if (!commentsWereDownloaded) {
        const articleId = getArticleId(detail);
        const comments = await downloadComments(articleId);
        console.log(comments);
      }
    }
  });
}

const posts = await downloadPosts(1);
console.log(posts);

// display data from api

let main = document.querySelector("main");

let article = "";

for (let i = 0; i < posts.length; i++) {
  article = `<article data-post-id=${posts[i].id}><h2>${posts[i].title}</h2>`;
  let username = await getUserName(posts[i].userId);
  article += `<aside>by <span class="author">${username}</span></aside>`;
  let body = posts[i].body;
  body = body.replaceAll("\n", "<br>");
  article += `<p>${body}</p>`;
  article += `</article>`;

  article += `<details>`;
  article += `<summary>See what our readers had to say...</summary>
  <section>
    <header>
      <h3>Comments</h3>
    </header>`;
  let comment = await downloadComments(posts[i].id);
  for (let i = 0; i < comment.length; i++) {
    article += `<aside><p>${comment[i].body}</p><br><p><small>${comment[i].name}</small></p></aside>`;
  }

  article += `</section>`;
  article += `</details>`;

  main.innerHTML += article;
}
