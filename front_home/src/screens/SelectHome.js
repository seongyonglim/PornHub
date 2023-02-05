import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View, useWindowDimensions, Pressable, Alert, Platform, Image} from 'react-native';
import { GRAY, WHITE } from '../colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { getLocalUri } from '../components/ImagePicker';
import ImageSwiper from '../components/ImageSwiper';
import PickerScreen from './PickerScreen';

const SelectHome = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const width = useWindowDimensions().width;

  const [photos, setPhotos] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params) {
      setPhotos(params.selectedPhotos ?? []);
    }
  }, [params]);

  useEffect(() => {
    setDisabled(isLoading || !photos.length);
  }, [isLoading, photos.length]);

  const onSubmit = useCallback(async () => {
    if (!disabled) {
      setIsLoading(true);
      try {
        const localUris = await Promise.all(
          photos.map((photo) =>
            Platform.select({
              ios: getLocalUri(photo.id),
              android: photo.uri,
            })
          )
        );
        navigation.replace(PickerScreen.WRITE_TEXT, {
          photoUris: localUris,
        });
      } catch (e) {
        Alert.alert('사진 정보 조회 실패', e.message);
        setIsLoading(false);
      }
    }
  }, [disabled, photos, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.selectContainer}>
        <Text style={styles.selectTitle}>{'편집하고 싶은 사진을\n앨범에서 선택해줘!'}</Text>
        <Image source={require('../../assets/selectadot.gif')} style={styles.selectAdot} />
      </View>
      <Text style={styles.description}>
        이미지는 최대 4장까지 선택 가능합니다.
      </Text>
      <View style={{ width, height: width,}}>
        {photos.length ? (
          <ImageSwiper photos={photos} />
        ) : (
          <Pressable
            style={styles.photoButton}
            onPress={() =>
              navigation.navigate(PickerScreen, { maxCount: 4 })
            }
          >
            <MaterialCommunityIcons
              name="image-plus"
              size={80}
              color={GRAY.DEFAULT}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  selectContainer:{
    flexDirection: 'row'
  },
  description: {
    color: GRAY.DARK,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  photoButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GRAY.LIGHT,
  },
  selectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 20,
    textAlignVertical: 'center'
  },
  selectAdot: {
    width: 200,
    height: 250,
  },
});

export default SelectHome;
