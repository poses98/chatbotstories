import React, { useState, useEffect, createContext } from 'react';
import useAuth from '../hooks/useAuth';
import useStory from '../hooks/useStory';
import StoryApi from '../api/story';
// create a context for the Firebase user and ID token
export const StoryContext = createContext();

const StoryProvider = ({ children }) => {
  const [userStories, setUserStories] = useState(null);
  const [likedStories, setLikedStories] = useState(null);
  const [savedStories, setSavedStories] = useState(null);
  const [readStories, setReadStories] = useState(null);
  const { authUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authUser) {
          const userStories = await StoryApi.getUserStories(authUser._id);
          setUserStories(userStories);

          const likedStories = await StoryApi.getLikedStories(authUser._id);
          setLikedStories(likedStories);

          const readStories = await StoryApi.getReadStories(authUser._id);
          setReadStories(readStories);

          const savedStories = await StoryApi.getSavedStories(authUser._id);
          setSavedStories(savedStories);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [authUser]);

  return (
    <StoryContext.Provider
      value={{ userStories, likedStories, savedStories, readStories }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export default StoryProvider;
