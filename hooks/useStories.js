import { useContext } from 'react';
import { StoryContext } from '../providers/StoryProvider';

const useStories = () => {
  const { stories } = useContext(StoryContext);

  return { stories };
};

export default useStories;
