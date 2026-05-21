import React from 'react';
import {
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Svg, {
  Defs,
  Mask,
  Rect,
} from 'react-native-svg';

interface FaceMaskOverlayProps {
  frameBorderWidth: number;
  frameCx: number;
  frameCy: number;
  frameWidth: number;
  frameHeight: number;
  color: string;
  style?: ViewStyle;
}

const FaceMaskOverlay: React.FC<FaceMaskOverlayProps> = ({
  frameBorderWidth,
  frameCx,
  frameCy,
  frameWidth,
  frameHeight,
  color,
  style,
}) => {
  return (
    <Svg style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Defs>
        <Mask id="mask">
          <Rect width="100%" height="100%" fill="white" />
          <Rect
            x={frameCx - frameWidth / 2}
            y={frameCy - frameHeight / 2}
            width={frameWidth}
            height={frameHeight}
            rx={frameWidth / 2}
            ry={frameWidth / 2}
            fill="black"
          />
        </Mask>
      </Defs>
      <Rect
        width="100%"
        height="100%"
        fill="rgba(0,0,0,0.6)"
        mask="url(#mask)"
      />
      <Rect
        x={frameCx - frameWidth / 2}
        y={frameCy - frameHeight / 2}
        width={frameWidth}
        height={frameHeight}
        rx={frameWidth / 2}
        ry={frameWidth / 2}
        fill="none"
        stroke={color}
        strokeWidth={frameBorderWidth}
      />
    </Svg>
  );
};

export default FaceMaskOverlay;
