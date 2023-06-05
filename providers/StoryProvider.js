import React, { useState, useEffect, createContext } from 'react';
import useAuth from '../hooks/useAuth';
import StoryApi from '../api/story';
// create a context for the Firebase user and ID token
export const StoryContext = createContext();

const StoryProvider = ({ children }) => {
  const [userStories, setUserStories] = useState(null);
  const [likedStories, setLikedStories] = useState(null);
  const [savedStories, setSavedStories] = useState(null);
  const [readStories, setReadStories] = useState(null);
  const { authUser } = useAuth();

  const fetchStories = async () => {
    try {
      console.log('Getting user stories');
      if (authUser) {
        StoryApi.getUserStories(authUser._id)
          .then((response) => {
            setUserStories(response);
          })
          .catch((err) => {
            console.error(err);
          });

        StoryApi.getLikedStories(authUser._id)
          .then((likedResponse) => {
            setLikedStories(likedResponse);
          })
          .catch((err) => {
            console.error(err);
          });
        StoryApi.getReadStories(authUser._id)
          .then((readResponse) => {
            setReadStories(readResponse);
          })
          .catch((err) => {
            console.error(err);
          });
        StoryApi.getSavedStories(authUser._id)
          .then((savedResponse) => {
            setSavedStories(savedResponse);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [authUser]);

  return (
    <StoryContext.Provider
      value={{
        userStories,
        likedStories,
        savedStories,
        readStories,
        fetchStories,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export default StoryProvider;
