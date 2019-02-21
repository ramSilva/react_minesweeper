'use strict'

import React, { Component } from 'react';
import { Dimensions, TouchableHighlight, StyleSheet, Text, View, ScrollView } from 'react-native';

export class Tile {
    constructor(x, y, mine) {
        this.x = x
        this.y = y
        this.revealed = false
        this.flagged = false
        this.mine = mine
        this.neighbours = null
    }

    setNeighbours = (neighbours) => {
        this.neighbours = neighbours
    }

    getColor = () => {
        if (this.revealed) {
            if (this.mine) {
                return 'red'
            } else {
                return 'gray'
            }
        } else if (this.flagged) {
            return 'green'
        } else {
            return 'black'
        }
    }

    getAdjacentBombs = () => {
        return this.neighbours.filter(tile => tile.mine).length
    }

    reveal = () => {
        this.revealed = true
    }

    flag = () => {
        this.flagged = !this.flagged
    }
}

export default class TileComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            revealed: false,
            flagged: false
        }
        this.tile = props.tile
    }

    render() {
        return (
            <TouchableHighlight onPress={() => { this.props.onPress(this.props.x, this.props.y) }} onLongPress={this.flag}>
                <Text style={[styles.cell, { backgroundColor: this.tile.getColor() }]}>
                    {this.tile.getAdjacentBombs()}
                </Text>
            </TouchableHighlight>
        )
    }
}


const styles = StyleSheet.create({
    cell: {
        textAlign: 'center',
        flex: 1,
        height: 24,
        width: 24,
        margin: 1
    }
})

