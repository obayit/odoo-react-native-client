import React, { useState, useRef, Dispatch } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  LinearTransition,
  SequencedTransition,
  FadingTransition,
  FadeOut,
  JumpingTransition,
  CurvedTransition,
  EntryExitTransition,
  FlipOutYLeft,
  FlipInEasyY,
  Easing,
} from 'react-native-reanimated';
import { Dropdown } from 'react-native-paper-dropdown';

const INITIAL_LIST = [
  { id: 1, emoji: '🍌', color: '#b58df1' },
  { id: 2, emoji: '🍎', color: '#ffe780' },
  { id: 3, emoji: '🥛', color: '#fa7f7c' },
  { id: 4, emoji: '🍙', color: '#82cab2' },
  { id: 5, emoji: '🍇', color: '#fa7f7c' },
  { id: 6, emoji: '🍕', color: '#b58df1' },
  { id: 7, emoji: '🍔', color: '#ffe780' },
  { id: 8, emoji: '🍟', color: '#b58df1' },
  { id: 9, emoji: '🍩', color: '#82cab2' },
];

interface TRANSITION {
  label: string;
  value: any;
}

const LAYOUT_TRANSITIONS = [
  { label: 'Linear Transition', value: 'LinearTransition' },
  { label: 'Sequenced Transition', value: 'SequencedTransition' },
  { label: 'Fading Transition', value: 'FadingTransition' },
  { label: 'Jumping Transition', value: 'JumpingTransition' },
  {
    label: 'Curved Transition',
    value: 'CurvedTransition'//.easingX(Easing.sin).easingY(Easing.exp),
  },
  {
    label: 'Entry/Exit Transition',
    value: 'EntryExitTransition'//.entering(FlipInEasyY).exiting(FlipOutYLeft),
  },
];

interface SelectProps {
  value: string;
  onChange: any;
  options: TRANSITION[];
  disabled?: boolean;
  disabledOptions?: string[];
}

export function SelectOption({
  value,
  onChange,
  options,
  disabled,
  disabledOptions,
}: SelectProps) {
  return (
    <View style={{ width: '100%', margin: 20 }}>
      <Dropdown
        label='Animation Type'
        value={value}
        onSelect={onChange}
        options={options}
      />
    </View>
  );
}

export default function AnimatedFlatlist() {
  const [items, setItems] = useState(INITIAL_LIST);
  const [selected, setSelected] = useState(LAYOUT_TRANSITIONS[0]);

  const removeItem = (idToRemove) => {
    const updatedItems = items.filter((item) => item.id !== idToRemove);
    setItems(updatedItems);
  };

  const onSelect = (value) => {
    const item = LAYOUT_TRANSITIONS.find(x => x.value === value)
    setSelected(item);
    setItems(INITIAL_LIST);
  };

  return (
    <>
      <View style={styles.dropdownContainer}>
        <SelectOption
          value={selected.value}
          onChange={onSelect}
          options={LAYOUT_TRANSITIONS}
        />
      </View>
      <View>
        <Items selected={selected} items={items} onRemove={removeItem} />
      </View>
    </>
  );
}

function Items({ selected, items, onRemove }) {
  function getTransition() {
    if (selected.value === 'LinearTransition')
      return LinearTransition
    if (selected.value === 'SequencedTransition')
      return SequencedTransition
    if (selected.value === 'FadingTransition')
      return FadingTransition
    if (selected.value === 'JumpingTransition')
      return JumpingTransition
    if (selected.value === 'CurvedTransition')
      return CurvedTransition.easingX(Easing.sin).easingY(Easing.exp)
    if (selected.value === 'EntryExitTransition')
      return EntryExitTransition.entering(FlipInEasyY).exiting(FlipOutYLeft)
  }
  return (
    <View style={styles.gridContainer}>
      {items.map((item) => (
        <Animated.View
          key={item.id}
          layout={getTransition()}
          exiting={FadeOut}
          style={[styles.tileContainer, { backgroundColor: item.color }]}>
          <Tile emoji={item.emoji} onRemove={() => onRemove(item.id)} />
        </Animated.View>
      ))}
    </View>
  );
}

function Tile({ emoji, onRemove }) {
  return (
    <TouchableOpacity onPress={onRemove} style={styles.tile}>
      <Animated.Text style={styles.tileLabel}>{emoji}</Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    width: 'auto',
    display: 'flex',
    minHeight: 300,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tileContainer: {
    width: '20%',
    margin: '1%',
    borderRadius: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tile: {
    flex: 1,
    height: '100%',
    width: ' 100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileLabel: {
    color: '#f8f9ff',
    fontSize: 24,
  },
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
});
