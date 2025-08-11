// Handle Like button
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

// Handle Comment button
document.querySelectorAll('.comment-btn').forEach(button => {
  button.addEventListener('click', function() {
    alert('Comment feature coming soon! Start typing your message...');
  });
});

// Handle Share button
document.querySelectorAll('.share-btn').forEach(button => {
  button.addEventListener('click', function() {
    const confirmed = confirm('Share this post with your network?');
    if (confirmed) {
      alert('Post shared! 🌐');
    }
  });
});
