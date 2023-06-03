import React, { useState, useEffect, createContext } from 'react';
import useAuth from '../hooks/useAuth';
import useStory from '../hooks/useStory';
import StoryApi from '../api/story';
// create a context for the Firebase user and ID token
export const StoryContext = createContext();

const StoryProvider = ({ children }) => {
  const [userStories, setUserStories] = useState(null);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      StoryApi.getUserStories(authUser._id)
        .then((response) => {
          setUserStories(response);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authUser]);

  return (
    <StoryContext.Provider value={{ userStories }}>
      {children}
    </StoryContext.Provider>
  );
};

export default StoryProvider;
