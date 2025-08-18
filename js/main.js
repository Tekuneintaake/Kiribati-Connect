// Load current user
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
  name: 'Guest',
  avatar: '??',
  location: 'Unknown'
};

// Load posts from localStorage
let posts = JSON.parse(localStorage.getItem('kiribati-posts')) || [
  {
    id: 1,
    name: "Teish Adam",
    avatar: "TA",
    location: "Tarawa",
    content: "Welcome to Kiribati Connect! I built this for us — to share stories, photos, and pride. Be the second voice. 💬",
    timestamp: new Date().toISOString(),
    likes: 0,
    photo: null
  }
];

// Display all posts
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
      ${post.photo ? `<img src="${post.photo}" style="max-width:100%; border-radius:8px; margin:10px 0;">` : ''}
      <div class="post-actions">
        <div class="like-btn" data-id="${post.id}">Like 💖 <span class="like-count">${post.likes || 0}</span></div>
        <div class="comment-btn">Comment 💬</div>
        <div class="share-btn">Share ↪️</div>
      </div>

      <!-- Edit/Delete Controls (only for current user) -->
      ${post.name === currentUser.name ? `
      <div class="post-controls" style="margin-top: 5px; font-size: 12px; color: #65676b; text-align: right;">
        <button class="edit-post-btn" data-id="${post.id}" style="background: none; border: none; color: #003D79; cursor: pointer; font-size: 12px;">Edit</button>
        <span> • </span>
        <button class="delete-post-btn" data-id="${post.id}" style="background: none; border: none; color: #D62828; cursor: pointer; font-size: 12px;">Delete</button>
      </div>
      ` : ''}
      
      <div class="comments-section"></div>
    `;

    feed.appendChild(postEl);
  });

  // Re-add event listeners
  addPostInteractions();
}

// Format time (e.g., "2 hours ago")
function formatTime(timestamp) {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  return postTime.toLocaleDateString();
}

// Add interactions (likes, comments, edit, delete)
function addPostInteractions() {
  // Like button
  document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const post = posts.find(p => p.id == id);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        localStorage.setItem('kiribati-posts', JSON.stringify(posts));
        renderPosts();
      }
    });
  });

  // Comment button
  document.querySelectorAll('.comment-btn').forEach(button => {
    button.addEventListener('click', function() {
      const post = this.closest('.post');
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Write a comment...';
      input.style.width = '100%';
      input.style.padding = '8px';
      input.style.margin = '10px 0';
      input.style.border = '1px solid #ddd';
      input.style.borderRadius = '4px';

      const submit = document.createElement('button');
      submit.textContent = 'Post';
      submit.style.background = '#003D79';
      submit.style.color = 'white';
      submit.style.border = 'none';
      submit.style.padding = '6px 12px';
      submit.style.borderRadius = '4px';
      submit.style.cursor = 'pointer';

      const commentsSection = post.querySelector('.comments-section');
      commentsSection.appendChild(input);
      commentsSection.appendChild(submit);

      submit.onclick = function() {
        if (input.value.trim()) {
          const commentEl = document.createElement('div');
          commentEl.className = 'comment-item';
          commentEl.innerHTML = `
            <div class="avatar">${currentUser.avatar}</div>
            <div class="comment-text"><strong>${currentUser.name}</strong>: ${input.value}</div>
          `;
          commentsSection.appendChild(commentEl);
          input.value = '';
        }
      };
    });
  });

  // ✅ Edit Post Button
  document.querySelectorAll('.edit-post-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const post = posts.find(p => p.id == id);
      if (!post) return;

      const newContent = prompt('Edit your post:', post.content);
      if (newContent !== null && newContent.trim() !== '') {
        post.content = newContent.trim();
        localStorage.setItem('kiribati-posts', JSON.stringify(posts));
        renderPosts();
      }
    });
  });

  // ✅ Delete Post Button
  document.querySelectorAll('.delete-post-btn').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const confirmed = confirm('Are you sure you want to delete this post?');
      if (confirmed) {
        posts = posts.filter(p => p.id != id);
        localStorage.setItem('kiribati-posts', JSON.stringify(posts));
        renderPosts();
      }
    });
  });
}

// Update navigation (Log In / Log Out)
function updateAuthLinks() {
  const authLinks = document.getElementById('auth-links');
  if (!authLinks) return;

  if (currentUser && currentUser.name !== 'Guest') {
    authLinks.innerHTML = '';
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.textContent = 'Log Out';
    logoutLink.onclick = function(e) {
      e.preventDefault();
      alert('You have been logged out.');
      window.location.href = 'login.html';
    };
    authLinks.appendChild(logoutLink);
  } else {
    authLinks.innerHTML = `<a href="login.html">Log In</a>`;
  }
}

// ✅ Run on load – This is where the post button listener should be
document.addEventListener('DOMContentLoaded', function() {
  renderPosts();
  updateAuthLinks();

  // ✅ Now the DOM is ready – safe to query the button
  const postBtn = document.querySelector('.post-btn');
  if (postBtn) {
    postBtn.addEventListener('click', async function() {
      const input = document.querySelector('.post-input');
      const content = input.value.trim();
      const fileInput = document.getElementById('post-photo');
      const file = fileInput.files[0];

      if (!content) return;

      const newPost = {
        id: Date.now(),
        name: currentUser.name,
        avatar: currentUser.avatar,
        location: currentUser.location,
        content: content,
        timestamp: new Date().toISOString(),
        likes: 0,
        photo: null
      };

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        await new Promise((resolve) => {
          reader.onload = () => {
            newPost.photo = reader.result; // Data URL (Base64)
            resolve();
          };
        });
      }

      posts.unshift(newPost);
      localStorage.setItem('kiribati-posts', JSON.stringify(posts));
      input.value = '';
      fileInput.value = ''; // Clear file input
      renderPosts();
    });
  } else {
    console.error('Post button not found!');
  }
});
