import React, {useState, useRef} from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
//import Vimeo from 'react-native-vimeo';
//import WebViewBridge from 'react-native-webview-bridge';

import {Icon} from 'react-native-elements';
import {CustomHeader} from '../CustomHeader';
const Youtube = (props) => {
  //console.log('props = ', props.route.params.url);
  const [playing, setPlaying] = useState(false);

  const [isMute, setMute] = useState(false);
  const [URL, setURL] = useState(
    props.route.params
      ? props.route.params.url
        ? props.route.params.url
        : ''
      : '',
  );
  //console.log('URL = ', URL);

  const controlRef = useRef();

  const onStateChange = (state) => {
    if (state === 'ended') {
      setPlaying(false);

      //  Alert.alert('video has finished playing!');
    }

    if (state !== 'playing') {
      setPlaying(false);
    }
  };

  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const seekBackAndForth = (control) => {
    //console.log('currentTime');

    controlRef.current?.getCurrentTime().then((currentTime) => {
      control === 'forward'
        ? controlRef.current?.seekTo(currentTime + 15, true)
        : controlRef.current?.seekTo(currentTime - 15, true);
    });
  };

  const muteVideo = () => setMute(!isMute);

  const ControlIcon = ({name, onPress}) => (
    <Icon onPress={onPress} name={name} size={40} color="#fff" />
  );

  return (
    <View style={styles.container}>
      {/*<CustomHeader
        isHome={false}
        title="YouTube Player"
        navigation={props.navigation}
      />*/}
      {/*<YoutubePlayer
        height={250}
        ref={controlRef}
        play={playing}
        mute={isMute}
        //videoId={'2dEBvAzh_Lo'}
        videoId={URL}
        //videoId={'84WIaK3bl_s'}
        onChangeState={onStateChange}
      />*/}
      {/*<Video
        source={{
          uri:
            'https://player.vimeo.com/external/207277102.hd.mp4?s=6939b93ae3554679b57f5e7fa831eef712a74b3c&profile_id=119&oauth2_token_id=57447761',
        }} // Can be a URL or a local file.
        ref={(ref) => {
          this.player = ref;
        }} // Store reference
        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
        // onError={this.videoError}               // Callback when video cannot be loaded
        style={styles.backgroundVideo}
      />*/}
      <VideoPlayer
        source={{uri: URL}}
        //source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
        navigator={props.navigation}
      />
      {/*<Vimeo
        ref="video"
        videoId="2619976" // Vimeo video ID
        onReady={() => //console.log('Video is ready')}
        onPlay={() => //console.log('Video is playing')}
        onPlayProgress={(data) => //console.log('Video progress data:', data)}
        onFinish={() => //console.log('Video is finished')}
      />*/}
      <View style={{height: 10, width: 10}}></View>
      {/*<View style={styles.controlContainer}>
        <ControlIcon
          onPress={() => seekBackAndForth('rewind')}
          name="skip-previous"
        />

        <ControlIcon
          onPress={togglePlaying}
          name={playing ? 'pause' : 'play-arrow'}
        />

        <ControlIcon
          onPress={() => seekBackAndForth('forward')}
          name="skip-next"
        />
      </View>*/}
      {/*<ControlIcon
        onPress={muteVideo}
        name={isMute ? 'volume-up' : 'volume-off'}
      />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    //alignItems: 'center',
    backgroundColor: '#EFEFEF',
    //backgroundColor: 'rgba(121, 210, 209, 0.498)',
  },

  controlContainer: {
    flexDirection: 'row',

    justifyContent: 'space-around',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Youtube;
