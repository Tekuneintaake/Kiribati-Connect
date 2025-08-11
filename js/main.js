// Load current user
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
  name: 'Guest',
  avatar: '??'
};

// === LIKE BUTTON ===
document.querySelectorAll('.like-btn').forEach(button => {
  // ... rest of your code

// Load current user from localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
  name: 'Guest',
  avatar: '??',
  location: 'Unknown'
};

// === LIKE BUTTON ===
document.querySelectorAll('.like-btn').forEach(button => {
  button.addEventListener('click', function() {
    const postId = this.getAttribute('data-post-id');
    const countSpan = this.querySelector('.like-count');
    let current = parseInt(countSpan.textContent);
    countSpan.textContent = current + 1;
    this.style.color = '#D62828';
    this.style.fontWeight = 'bold';
  });
});

// === COMMENT BUTTON: Show Input ===
document.querySelectorAll('.comment-btn').forEach(button => {
  button.addEventListener('click', function() {
    const postId = this.getAttribute('data-post-id');
    const post = document.getElementById('post-' + postId);
    const inputBox = post.querySelector('.comment-box');
    
    // Scroll to input and focus
    inputBox.scrollIntoView({ behavior: 'smooth' });
    inputBox.querySelector('.comment-input').focus();
  });
});

// === POST COMMENT ===
document.querySelectorAll('.comment-submit').forEach(button => {
  button.addEventListener('click', function() {
    const post = this.closest('.post');
    const input = post.querySelector('.comment-input');
    const value = input.value.trim();

    if (value === '') return;

    const commentsSection = post.querySelector('.comments-section');

    // Create comment element
    const commentEl = document.createElement('div');
    commentEl.className = 'comment-item';

    // Use first two letters of the current user (you can improve this later)
    const userName = currentUser.name;
const userInitials = currentUser.avatar;

    commentEl.innerHTML = `
      <div class="avatar">${userInitials}</div>
      <div class="comment-text"><strong>${userName}</strong>: ${value}</div>
    `;

    // Add to comments
    commentsSection.appendChild(commentEl);

    // Clear input
    input.value = '';
  });
});

// Allow pressing "Enter" to post comment
document.querySelectorAll('.comment-input').forEach(input => {
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const button = this.parentElement.querySelector('.comment-submit');
      button.click();
    }
  });
});
