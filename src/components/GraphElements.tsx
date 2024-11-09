/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View} from 'react-native';
import {DataPoint} from '../types';
import {format} from 'date-fns';

console.log(new Date('2024-11-09T20:08:32Z').toString());
export const PointerLabelComponent = (items: DataPoint[]) => {
  const date = items[0].date;
  // fix time to have UTC 0 val
  const utcDate = `${date.replace(' ', 'T')}Z`;
  const dateLabel = format(utcDate, 'do MMM eee p');

  console.log(utcDate.toString());
  return (
    <View
      style={{
        height: 90,
        width: 100,
        justifyContent: 'center',
        marginTop: -50,
        marginLeft: -40,
      }}>
      <Text
        style={{
          color: 'black',
          fontSize: 14,
          marginBottom: 6,
          textAlign: 'center',
        }}>
        {dateLabel}
      </Text>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 16,
          backgroundColor: 'green',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
          }}>
          {items[0].value}%
        </Text>
      </View>
    </View>
  );
};
