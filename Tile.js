'use strict'

import React, { Component } from 'react';
import { styles } from './Board'
import { Dimensions, TouchableWithoutFeedback, StyleSheet, Text, View, ScrollView } from 'react-native';

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
        return this.mine
    }

    flag = () => {
        this.flagged = !this.flagged
    }

    isCoveredMine = () => {
        return this.mine && this.flagged
    }
}

export default class TileComponent extends Component {
    constructor(props) {
        super(props)
        this.tile = props.tile
    }

    tileContent = () => {
        if (!this.tile.revealed || this.tile.mine) {
            return ""
        } else {
            return this.tile.getAdjacentBombs()
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.props.onPress(this.props.x, this.props.y)
                }}

                onLongPress={() => {
                    this.props.onLongPress(this.props.x, this.props.y)
                }}>
                <Text style={[styles.cell, { backgroundColor: this.tile.getColor() }]}>
                    {this.tileContent()}
                </Text>
            </TouchableWithoutFeedback>
        )
    }
}
