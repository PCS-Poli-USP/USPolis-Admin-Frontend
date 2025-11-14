import { useEffect, useState } from 'react';

const useNewsJoyride = () => {
  const [showNews, setShowNews] = useState<boolean>(
    localStorage.getItem('show-news')
      ? localStorage.getItem('show-news')?.toLowerCase() == 'true'
      : false,
  );

  useEffect(() => {
    const show = localStorage.getItem('show-news');
    if (typeof show == 'string') {
      setShowNews(show == 'true');
    } else {
      resetState();
    }
  }, []);

  const resetState = () => {
    localStorage.setItem('show-news', 'true');
    setShowNews(true);
  };

  const seeNews = () => {
    localStorage.setItem('show-news', 'false');
    setShowNews(false);
  };

  return { showNews, seeNews, resetState };
};

export default useNewsJoyride;
