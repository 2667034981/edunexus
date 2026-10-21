// 简单的 toast 提示函数
export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // 创建 toast 元素
  const toastEl = document.createElement('div');
  toastEl.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-0 ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'
  }`;
  toastEl.textContent = message;
  toastEl.style.animation = 'slideInRight 0.3s ease-out';

  // 添加到页面
  document.body.appendChild(toastEl);

  // 3秒后移除
  setTimeout(() => {
    toastEl.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      document.body.removeChild(toastEl);
    }, 300);
  }, 3000);
}

// 添加动画样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
