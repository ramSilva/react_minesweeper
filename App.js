/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import BoardComponent, { Game } from './Board'
import { Platform, StyleSheet, Text, View, Button } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      game: new Game(10, 10, 5),
      flagsLeft: 0,
      end: { won: false, lost: false },
      boardHash: null
    }
    this.state.game.onFlagsChanged = this.onFlagsChanged
    this.state.game.onGameLost = this.onGameLost
    this.state.game.onGameWon = this.onGameWon
  }

  onFlagsChanged = (flagsLeft) => {
    this.setState({ flagsLeft: flagsLeft })
  }

  onGameLost = () => {
    this.setState({ end: { won: false, lost: true } })
  }

  onGameWon = () => {
    this.setState({ end: { won: true, lost: false } })
  }

  gameOverLayout = () => {

    if (this.state.end.lost || this.state.end.won) {
      return (<View>
        <Text style={{ fontSize: 24 }}>{this.endText()}</Text>
        <Button title="restart" onPress={this.restart} />
      </View>)
    }
  }

  restart = () => {
    this.state.game.startGame()
    this.setState({ boardHash: this.state.game.boardHash() })
    this.setState({ end: { won: false, lost: false } })
  }

  endText = () => {
    return this.state.end.won ? "Noice" : (this.state.end.lost ? "Try again" : "")
  }

  render() {
    return (
      <View>
        <BoardComponent key={this.state.boardHash} game={this.state.game} />
        <Text>Flags left: {this.state.game.flagsLeft}</Text>
        {this.gameOverLayout()}
      </View>)
  }
}