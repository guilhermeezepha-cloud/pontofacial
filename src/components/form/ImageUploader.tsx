import {useTheme} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageURISource,
  TouchableOpacity,
  View,
} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

import {useImageAspectRatio} from '../../hooks/useImageAspectRatio';
import {Colors} from '../../styles/Themes';
import Icon from '../icon';
import Typography from '../typography';
import ImageUploaderStyles from './ImageUploaderStyles';

interface ImageUploaderProps {
  onImageChange?: (imageData: Asset | null) => void;
  initialBase64?: string | null;
}

const toPngDataUri = (maybeBase64?: string | null): string | null => {
  if (!maybeBase64) return null;
  const s = maybeBase64.trim();
  if (s.startsWith('data:')) return s;
  return `data:image/png;base64,${s}`;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const getExtFromNameOrUri = (name?: string | null, uri?: string | null) => {
  const s = (name ?? uri ?? '').toLowerCase();
  const i = s.lastIndexOf('.');
  return i >= 0 ? s.slice(i + 1) : '';
};

const isPng = (asset: Asset) => {
  const mime = (asset.type ?? '').toLowerCase();
  const ext = getExtFromNameOrUri(asset.fileName, asset.uri);
  return mime.includes('image/png') || ext === 'png';
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  initialBase64,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(
    toPngDataUri(initialBase64),
  );
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);

  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = ImageUploaderStyles(colors);

  useEffect(() => {
    setImageUri(toPngDataUri(initialBase64));
  }, [initialBase64]);

  const {ratio} = useImageAspectRatio(imageUri);

  const validate = (asset: Asset): string | null => {
    if (!isPng(asset)) return 'Formato inválido. Use PNG.';
    if (asset.fileSize != null && asset.fileSize > MAX_IMAGE_SIZE) {
      return 'Máximo de 2MB por arquivo.';
    }
    return null;
  };

  const pickImage = async () => {
    setLoading(true);
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
        includeBase64: true,
      });

      if (!response.assets?.length) return;

      const asset = response.assets[0];

      const error = validate(asset);
      if (error) {
        setShowError(error);
        setTimeout(() => setShowError(null), 3000);
        return;
      }

      const dataUri = asset.base64
        ? `data:image/png;base64,${asset.base64}`
        : null;

      if (!dataUri) return;

      setImageUri(dataUri);

      onImageChange?.({...asset, uri: dataUri});
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageUri(null);
    onImageChange?.(null);
  };

  if (!imageUri) {
    return (
      <View style={styles.placeholderContainer}>
        <TouchableOpacity
          style={styles.placeholder}
          onPress={loading ? undefined : pickImage}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <Icon
                name="circleAdd"
                width={28}
                height={27}
                fill={colors.primary}
              />
              <Typography
                fontSize={12}
                color="primary"
                fontFamily="Poppins-SemiBold"
                fontWeight="600"
                textAlign="center"
                style={styles.placeholderText}>
                Carregar imagem
              </Typography>
            </>
          )}
        </TouchableOpacity>

        <Typography
          fontSize={10}
          color={showError ? 'red' : 'secondaryDark'}
          textAlign="center"
          style={styles.subText}>
          {showError ??
            'Arraste sua foto ou clique aqui para carregar uma imagem.'}
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.previewContainer}>
      <Image
        source={{uri: imageUri} as ImageURISource}
        style={[styles.image, {aspectRatio: ratio}]}
        resizeMode="contain"
      />

      <TouchableOpacity
        onPress={removeImage}
        style={styles.deleteButton}
        accessibilityLabel="Remover imagem">
        <Icon
          name="trashCan"
          width={18}
          height={26}
          fill={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ImageUploader;
