import { useContext } from 'react';
import { SmoothScrollContext } from '../components/LocomotiveScroll';

export const useSmoothScroll = () => {
  return useContext(SmoothScrollContext);
};

export default useSmoothScroll; 