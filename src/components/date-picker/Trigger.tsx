import {useTheme} from '@react-navigation/native';

import React, {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {DateData} from 'react-native-calendars';

import {Colors} from '../../styles/Themes';
import Icon from '../icon';
import Typography from '../typography';
import CustomDatePicker from './';
import DatePickerTriggerStyles from './TriggerStyles';

const CAL_WIDTH = 300;
const V_SPACING = 6;

interface DatePickerTriggerProps {
  id?: string;
  currentCalendarId?: string;
  onInstanceSelect?: (id: string) => void;
  label?: string;
  selectedDate?: string; // 'YYYY-MM-DD'
  onDaySelect?: (day: DateData) => void;
}

const DatePickerTrigger: React.FC<DatePickerTriggerProps> = ({
  id,
  currentCalendarId,
  onInstanceSelect,
  label,
  selectedDate,
  onDaySelect,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = DatePickerTriggerStyles(colors);

  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({left: 0, top: 0});
  const [positionReady, setPositionReady] = useState(false);
  const triggerRef = useRef<View>(null);

  const measureAndPosition = () => {
    setPositionReady(false);
    requestAnimationFrame(() => {
      triggerRef.current?.measureInWindow((x, y, w, h) => {
        const {width: SW, height: SH} = Dimensions.get('window');
        const desiredLeft = x + w / 2 - CAL_WIDTH / 2;
        const left = Math.max(8, Math.min(SW - CAL_WIDTH - 8, desiredLeft));
        const top = Math.min(y + h + V_SPACING, SH - 320);
        setPos({left, top});
        setPositionReady(true);
      });
    });
  };

  const open = () => {
    onInstanceSelect?.(id ?? '');
    setVisible(true);
    measureAndPosition();
  };

  const close = () => {
    setVisible(false);
    setPositionReady(false);
    onInstanceSelect?.('');
  };

  useEffect(() => {
    if (!visible && !(currentCalendarId && currentCalendarId === id)) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, currentCalendarId, id]);

  const handleSelect = (day: DateData) => {
    onDaySelect?.(day);
    close();
  };

  const isMeOpen = currentCalendarId ? currentCalendarId === id : visible;

  useEffect(() => {
    if (!isMeOpen) return;
    const sub = Dimensions.addEventListener('change', measureAndPosition);
    return () => sub.remove();
  }, [isMeOpen]);

  useEffect(() => {
    if (currentCalendarId && currentCalendarId === id) {
      measureAndPosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCalendarId, id]);

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <TouchableOpacity
          onPress={isMeOpen ? close : open}
          style={styles.container}>
          {label && (
            <Typography color="textSecondary" fontSize={9} style={styles.label}>
              {label}
            </Typography>
          )}
          <Typography
            color={selectedDate ? 'textPrimary' : 'secondaryLight'}
            fontSize={12}
            style={styles.selectedDate}>
            {selectedDate || 'DD-MM-AAAA'}
          </Typography>
          <Icon
            name="calendar"
            fill={colors.secondaryLight}
            width={20}
            height={21}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isMeOpen}
        transparent
        animationType="none"
        onRequestClose={close}
        statusBarTranslucent>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={close}
          pointerEvents={positionReady ? 'auto' : 'none'}
        />
        <View
          style={{
            position: 'absolute',
            width: CAL_WIDTH,
            left: pos.left,
            top: pos.top,
            opacity: positionReady ? 1 : 0,
          }}
          renderToHardwareTextureAndroid
          onStartShouldSetResponder={() => true}
          pointerEvents={positionReady ? 'auto' : 'none'}>
          <View style={[styles.calendarContainer, {width: CAL_WIDTH}]}>
            <CustomDatePicker
              selectedDate={selectedDate}
              onDaySelect={handleSelect}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DatePickerTrigger;
