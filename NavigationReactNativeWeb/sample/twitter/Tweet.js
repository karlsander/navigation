import React, {useContext} from 'react';
import {StyleSheet, Text, Image, Platform, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, useNavigated} from 'navigation-react-native';
import Tweets from './Tweets';

export default ({tweet: {account: {id: accountId, name, username, logo}, 
  text, time, retweets, likes, replies}}) => {
  const {stateNavigator} = useContext(NavigationContext);
  useNavigated(() => {
    if (Platform.OS === 'web') document.title = 'Tweet';
  });
  return (
    <>
      <NavigationBar
        title="Tweet"
        navigationImage={require('./arrow.png')}
        barTintColor="#fff"
        tintColor={Platform.OS !== 'ios' ? "deepskyblue" : null}
        navigationHref={stateNavigator.historyManager.getHref(
          stateNavigator.getNavigationBackLink(1)
        )}
        onNavigationPress={() => stateNavigator.navigateBack(1)} />
      <Tweets
        tweets={replies}
        renderHeader={(
          <View>
            <View style={styles.heading}>
              <TouchableHighlight
                underlayColor="white"
                accessibilityRole="link"
                href={stateNavigator.historyManager.getHref(
                  stateNavigator.getNavigationLink('timeline', {id: accountId})
                )}
                onPress={(e) => {
                  if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return;
                  e.preventDefault();
                  stateNavigator.navigate('timeline', {id: accountId});
              }}>
                <Image style={styles.logo} source={logo} />
              </TouchableHighlight>
              <View>
                <Text style={styles.name}>{name}</Text>
                <Text>{username}</Text>
              </View>
            </View>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.time}>{time}</Text>
            <View style={styles.interactions}>
              <Text style={styles.count}>{retweets}</Text>
              <Text style={styles.interaction}>RETWEETS</Text>
              <Text style={styles.count}>{likes}</Text>
              <Text style={styles.interaction}>LIKES</Text>
            </View>
          </View>
        )} />
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 2,
  },
  text: {
    fontSize: 18, 
  },
  time: {
    color: '#657786',
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 13,
  },
  interactions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccd6dd',
    paddingTop: 12,
    paddingBottom: 12,
  },
  count: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 5,
  },
  interaction: {
    color: '#657786',
    fontSize: 13,
    marginRight: 10,
  },
});
