import { useState } from 'react';

const LAST_FEATURE = 'docs';

const useNewsJoyride = () => {
  const [showNews, setShowNews] = useState<boolean>(
    localStorage.getItem('last-feature')
      ? localStorage.getItem('last-feature') != LAST_FEATURE
      : true,
  );

  const resetState = () => {
    localStorage.removeItem('last-feature');
    setShowNews(true);
  };

  const seeNews = () => {
    localStorage.setItem('last-feature', LAST_FEATURE);
    setShowNews(false);
  };

  return { showNews, seeNews, resetState };
};

export default useNewsJoyride;
