/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import BoardComponent, {Game} from './Board'
import { Platform, StyleSheet, Text, View } from 'react-native';

export default class App extends Component{
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View>
        <BoardComponent game={new Game(10, 10, 10)} />
      </View>)
  }
}