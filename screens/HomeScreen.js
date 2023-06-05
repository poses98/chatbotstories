import * as React from 'react';
import { View, Text } from 'react-native';
import GENRES from '../constants/Genres_';
import useAuth from '../hooks/useAuth';
import StoryApi from '../api/story';
import LoadingScreen from './LoadingScreen';
import StoriesLibraryView from '../components/StoriesLibraryView';
import { ScrollView } from 'react-native-gesture-handler';

export default ({ route, navigation }) => {
  const [feed, setFeed] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const { authUser } = useAuth();
  const onRefresh = () => {
    setRefreshing(true);
    // Fetch the updated feed data here
    if (authUser) {
      StoryApi.getPersonalizedFeed(authUser._id)
        .then((response) => {
          setFeed(response.feed);
          setRefreshing(false);
        })
        .catch((err) => {
          console.error(err);
          setRefreshing(false);
        });
    }
  };
  React.useEffect(() => {
    if (authUser) {
      StoryApi.getPersonalizedFeed(authUser._id)
        .then((response) => {
          setFeed(response.feed);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authUser]);
  React.useEffect(() => {
    if (feed) {
      setLoading(false);
    }
  }, [feed]);
  return (
    <ScrollView>
      {feed &&
        !loading &&
        feed.map((section) => {
          const str = 'g-';
          console.log(/^g-/.test(section.sectionTitle));

          section.name = /^g-/.test(section.sectionTitle)
            ? 'Genero'
            : section.name;
          return (
            section.stories.length > 0 && (
              <StoriesLibraryView
                libraryTitle={
                  /^g-/.test(section.sectionTitle)
                    ? GENRES[section.sectionTitle.split('g-')[1]].name
                    : section.sectionTitle
                }
                storyList={section.stories}
                navigation={navigation}
              />
            )
          );
        })}

      {!feed && <LoadingScreen />}
    </ScrollView>
  );
};
