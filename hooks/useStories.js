import { useContext } from 'react';
import { StoryContext } from '../providers/StoryProvider';

const useStories = () => {
  const { userStories, likedStories, savedStories, readStories, fetchStories } =
    useContext(StoryContext);

  return { userStories, likedStories, savedStories, readStories, fetchStories };
};

export default useStories;
