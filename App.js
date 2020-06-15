/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import GoogleFit, { Scopes } from 'react-native-google-fit';

const App = () => {
  const [steps, setSteps] = React.useState([]);
  useEffect(() => {
    checkGoogleFitAuthorisation();
  }, []);

  const checkGoogleFitAuthorisation = () => {
    GoogleFit.checkIsAuthorized()
      .then(function (data) {
        if (!GoogleFit.isAuthorized) {
          authorizeGoogleFit();
        } else {
          // do nothing
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  const authorizeGoogleFit = () => {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ_WRITE,
      ],
    }
    GoogleFit.authorize(options)
      .then(authResult => {
        console.log(authResult);
        if (authResult.success) {
          // get daily steps
          fetchDailySteps();

        } else {
          // dispatch("AUTH_DENIED", authResult.message);
        }
      })
      .catch(() => {
        dispatch("AUTH_ERROR");
      });
  }

  const fetchDailySteps = () => {
    // const options = {
    //   startDate: "2020-01-01", // required ISO8601Timestamp
    //   endDate: new Date().toISOString() // required ISO8601Timestamp
    // };

    GoogleFit.getDailyStepCountSamples(new Date())
      .then((res) => {
        console.log('Daily steps >>> ', res);
        const data = (res && res[1]) || { steps: [] };
        const newSteps = data.steps.length ? data.steps : [{ date: '2020-03-01', value: 4000 }];
        setSteps(newSteps);
      })
      .catch((err) => { console.warn(err) });
  }

  GoogleFit.onAuthorize((data) => {
    fetchDailySteps();
  });

  GoogleFit.onAuthorizeFailure((data) => {
    console.log(data);
    // dispatch('AUTH ERROR')
  })

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            <Text>Steps Recorded for the day</Text>
            {
              steps.map((rec, index) => (
                <View key={index}>
                  <Text>{rec.date}: {rec.value}</Text>
                </View>
              ))
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
