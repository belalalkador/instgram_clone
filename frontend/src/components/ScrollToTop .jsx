import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300); // Show button after scrolling down 300px
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 text-[30px] right-4 z-20 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        aria-label="Scroll to top"
      >
        TOP
      </button>
    )
  );
};

export default ScrollToTop;
