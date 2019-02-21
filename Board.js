'use strict'

import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Text, View, ScrollView } from 'react-native';
import TileComponent, { Tile } from './Tile'

export class Game {
    constructor(rows, cols, mines) {
        this.rows = rows
        this.cols = cols
        this.mines = mines
        this.startGame()
    }

    startGame = () => {
        let board = []
        for (let i = 0; i < this.rows; i++) {
            let row = []
            for (let j = 0; j < this.cols; j++) {
                let tile = new Tile(i, j, false)
                row.push(tile)
            }
            board.push(row)
        }

        const min = 0;
        const maxRows = this.rows;
        const maxCols = this.cols;
        let minesLeft = this.mines

        while (minesLeft > 0) {
            const randomRow = Math.floor(Math.random() * (maxRows - min)) + min
            const randomCol = Math.floor(Math.random() * (maxCols - min)) + min

            if (!board[randomRow][randomCol].mine) {
                minesLeft--
                board[randomRow][randomCol].mine = true
            }
        }

        this.board = board

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let tile = this.board[i][j]
                tile.setNeighbours(this.calculateNeighbours(i, j))
                this.board[i][j] = tile
            }
        }
    }

    calculateNeighbours = (x, y) => {
        let maxRows = this.board.length
        let maxCols = this.board[0].length
        let neighbours = []
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if ((i >= 0 && i < maxRows) && (j >= 0 && j < maxCols)) {
                    if ((i != x && j != y) || (i == x && j != y) || (i != x && j == y)) {
                        neighbours.push(this.board[i][j])
                    }
                }
            }
        }
        return neighbours
    }
}

export default class BoardComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boardComponent: this.createBoardComponent()
        }
        this.checked = []
    }

    createBoardComponent = () => {
        let board = this.props.game.board
        let rows = [];
        for (let i = 0; i < board.length; i++) {
            let cols = []
            for (let j = 0; j < board[i].length; j++) {
                const tile = board[i][j]
                cols.push(
                    <TileComponent key={j} x={i} y={j} tile={tile} onPress={this.revealTile} />
                );
            }
            rows.push(<View style={styles.row} key={i}>{cols}</View>)
        }

        return rows;
    }

    revealTile = (x, y) => {
        let key = x.toString() + y.toString()
        if (this.checked.includes(key)) {
            return
        }
        this.checked.push(key)

        let tile = this.props.game.board[x][y]
        tile.reveal()

        if (tile.getAdjacentBombs() == 0) {
            tile.neighbours.forEach(neighbour => {
                this.revealTile(neighbour.x, neighbour.y)
            });
        }
        this.setState({ boardComponent: this.createBoardComponent() })
    }

    render() {
        console.log("hello")
        return (
            <ScrollView style={styles.board}>{this.state.boardComponent}</ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    board: {
        width: 340,
        height: 340,
    },
    row: {
        flexDirection: 'row'
    }
})