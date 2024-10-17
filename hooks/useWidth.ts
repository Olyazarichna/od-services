import { useMediaQuery } from '@mui/material';
const useWidth = () => {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isDesktop = useMediaQuery('(min-width: 769px)');
    const isTable = useMediaQuery('(max-height: 640px)');
    const isLargeDesktop = useMediaQuery('(min-width: 1200px)');
    return { isMobile, isDesktop, isTable, isLargeDesktop };
};

export default useWidth;