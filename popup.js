document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggleBtn');
  
  toggleBtn.addEventListener('click', function() {
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggle-reading-mode'
      });
      
      // Close popup
      window.close();
    });
  });
});