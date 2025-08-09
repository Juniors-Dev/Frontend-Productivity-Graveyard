import { api } from '../../../main.js';
import { renderCommentsList } from './commentRenderer.js';


export async function initComments(projectId) {
  const container = document.getElementById('comments-container');
  const errorElement = document.getElementById('comments-error');
  
  if (!container) {
    console.warn('Comments container not found');
    return;
  }
  
  container.innerHTML = '<div class="loading-state">Loading condolences...</div>';
  
  try {
    const response = await api.getProjectComments(projectId, { 
      limit: 10, 
      offset: 0 
    });
    
    if (response.success) {
      const comments = response.data || [];
      
      container.innerHTML = '';
      
      const commentsList = renderCommentsList(comments);
      container.appendChild(commentsList);
    } else {
      throw new Error(response.message || 'Failed to load comments');
    }
  } catch (error) {
    console.error('Error loading comments:', error);
    container.innerHTML = '';
    
    if (errorElement) {
      errorElement.textContent = 'Failed to load condolences. Please try again later.';
      errorElement.style.display = 'block';
    }
  }
}