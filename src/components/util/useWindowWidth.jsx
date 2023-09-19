import React from 'react';

function useWindowWidth() {
  const [screenWidth, setScreenWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const getScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', getScreenWidth);
    getScreenWidth();
    return () => window.removeEventListener('resize', getScreenWidth);
  }, []);
  return screenWidth;
}

export default useWindowWidth;
