import { useMediaQuery } from '@chakra-ui/react';
import HomeDesktopView from './HomeDesktopView';
import HomeMobileView from './HomeMobileView';

function Home() {
  const [isMobile] = useMediaQuery('(max-width: 800px)');

  return isMobile ? <HomeMobileView /> : <HomeDesktopView />;
}

export default Home;
