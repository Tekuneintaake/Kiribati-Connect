// Load current user
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
  name: 'Guest',
  avatar: '??',
  location: 'Unknown'
};

// Load posts from localStorage
let posts = JSON.parse(localStorage.getItem('kiribati-posts')) || [];

// ✅ 1. Define renderPosts() — fully, without interruption
function renderPosts() {
  const feed = document.querySelector('.feed');

  // Clear all posts except the form
  const children = Array.from(feed.children);
  children.forEach(child => {
    if (!child.classList.contains('post-form')) {
      feed.removeChild(child);
    }
  });

  // Add each post
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';

    postEl.innerHTML = `
      <div class="post-header">
        <div class="avatar">${post.avatar}</div>
        <div>
          <span class="post-name">${post.name}</span>
          <span class="post-location">from ${post.location}</span>
          <div class="post-time">${formatTime(post.timestamp)}</div>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
      ${post.photo ? `<img src="uploads/${post.photo}" style="max-width:100%; border-radius:8px; margin:10px 0;">` : ''}
      <div class
