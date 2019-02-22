'use strict'

import React, { Component } from 'react';
import { TouchableHighlight, StyleSheet, Text, View, ScrollView } from 'react-native';
import TileComponent, { Tile } from './Tile'

export class Game {
    constructor(rows, cols, mines) {
        this.rows = rows
        this.cols = cols
        this.mines = mines
        this.resetState()
        this.startGame()
    }

    resetState = () => {
        this.flagsLeft = this.mines
        this.minesLeft = this.mines
        this.lost = false
        this.won = false
        this.board = []
        this.checked = []
    }

    boardHash = () => {
        let hash = ""
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let tile = this.board[i][j]
                hash += tile.revealed
                hash += tile.mine
                hash += tile.flagged
            }
        }

        return hash
    }

    loseGame = () => {
        this.lost = true
        this.onGameLost()
    }

    checkGameWon = () => {
        if (this.minesLeft == 0) {
            this.won = true
            this.onGameWon()
        }
    }

    canPlay = () => {
        return !(this.lost || this.won)
    }

    startGame = () => {
        this.resetState()
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

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let tile = board[i][j]
                tile.setNeighbours(this._calculateNeighbours(board, i, j))
                board[i][j] = tile
            }
        }

        this.board = board
    }

    _calculateNeighbours = (board, x, y) => {
        let maxRows = board.length
        let maxCols = board[0].length
        let neighbours = []
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if ((i >= 0 && i < maxRows) && (j >= 0 && j < maxCols)) {
                    if ((i != x && j != y) || (i == x && j != y) || (i != x && j == y)) {
                        neighbours.push(board[i][j])
                    }
                }
            }
        }
        return neighbours
    }

    calculateNeighbours = (x, y) => {
        return this._calculateNeighbours(this.board, x, y)
    }

    revealTile = (x, y) => {
        if (!this.canPlay()) {
            return
        }

        let tile = this.board[x][y]
        if (tile.flagged) {
            return
        }

        let key = x.toString() + y.toString()
        if (this.checked.includes(key)) {
            return
        }
        this.checked.push(key)

        this.lost = tile.reveal()
        if (this.lost) {
            this.loseGame()
        }

        if (tile.getAdjacentBombs() == 0) {
            tile.neighbours.forEach(neighbour => {
                this.revealTile(neighbour.x, neighbour.y)
            });
        }
    }

    flagTile = (x, y) => {
        if (!this.canPlay()) {
            return
        }

        let tile = this.board[x][y]
        if (tile.flagged) {
            if (tile.isCoveredMine()) {
                this.minesLeft++
            }
            this.flagsLeft++
        } else {
            if (this.flagsLeft <= 0) {
                return
            }
            this.flagsLeft--
        }
        tile.flag()
        this.onFlagsChanged(this.flagsLeft)

        if (tile.isCoveredMine()) {
            this.minesLeft--
        }

        this.checkGameWon()
    }
}

export default class BoardComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boardComponent: this.createBoardComponent()
        }
    }

    createBoardComponent = () => {
        let board = this.props.game.board
        let rows = [];
        for (let i = 0; i < board.length; i++) {
            let cols = []
            for (let j = 0; j < board[i].length; j++) {
                const tile = board[i][j]
                cols.push(
                    <TileComponent key={j} x={i} y={j} tile={tile} onPress={this.revealTile} onLongPress={this.flagTile} />
                );
            }
            rows.push(<View style={styles.row} key={i}>{cols}</View>)
        }

        return rows;
    }

    revealTile = (x, y) => {
        this.props.game.revealTile(x, y)
        this.setState({ boardComponent: this.createBoardComponent() })
    }

    flagTile = (x, y) => {
        this.props.game.flagTile(x, y)
        this.setState({ boardComponent: this.createBoardComponent() })
    }

    render() {
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