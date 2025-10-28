import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageViewer from 'react-native-image-zoom-viewer';

const ZoomableImage = ({images}) => {
  const [imageOpener, setImageOpener] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(undefined);
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setImageOpener(true);
          setOpenImage([
            {
              url: images,
              freeHeight: true,
            },
          ]);
        }}>
        <Image
          style={styles.image}
          source={{
            uri: images,

            // uri: allDataobj.customerInfo[array_index]
            //   .customer_img,
          }}></Image>
      </TouchableOpacity>
      <Modal visible={imageOpener} transparent={true}>
        <View style={{flex: 1, backgroundColor: '#000'}}>
          <Pressable
            style={{alignSelf: 'flex-end', padding: 10}}
            onPress={() => setImageOpener(false)}>
            <AntDesign name="close" size={20} color="#fff" />
          </Pressable>
          <ImageViewer imageUrls={[{url: images, freeHeight: true}]} />
        </View>
      </Modal>
    </>
  );
};
export default ZoomableImage;
const styles = StyleSheet.create({
  image: {
    height: 150,
    width: 150,
    margin: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
