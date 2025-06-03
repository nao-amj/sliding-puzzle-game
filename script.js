class SlidingPuzzle {
    constructor() {
        this.size = 4;
        this.tiles = [];
        this.emptyIndex = 15;
        this.moveCount = 0;
        this.isComplete = false;
        
        this.puzzleElement = document.getElementById('puzzle');
        this.moveCountElement = document.getElementById('moveCount');
        this.winMessageElement = document.getElementById('winMessage');
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        // 初期状態の配列を作成（1-15と空のスペース）
        this.tiles = Array.from({length: 15}, (_, i) => i + 1);
        this.tiles.push(null); // 空のスペース
        
        this.render();
        this.shuffle();
    }
    
    render() {
        this.puzzleElement.innerHTML = '';
        
        this.tiles.forEach((tile, index) => {
            const tileElement = document.createElement('div');
            
            if (tile === null) {
                tileElement.className = 'tile empty';
                this.emptyIndex = index;
            } else {
                tileElement.className = 'tile';
                tileElement.textContent = tile;
                tileElement.addEventListener('click', () => this.moveTile(index));
                
                // 移動可能なタイルをハイライト
                if (this.canMove(index)) {
                    tileElement.classList.add('movable');
                }
            }
            
            this.puzzleElement.appendChild(tileElement);
        });
        
        this.updateMoveCount();
    }
    
    canMove(index) {
        const row = Math.floor(index / this.size);
        const col = index % this.size;
        const emptyRow = Math.floor(this.emptyIndex / this.size);
        const emptyCol = this.emptyIndex % this.size;
        
        // 同じ行で隣接、または同じ列で隣接
        return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
               (col === emptyCol && Math.abs(row - emptyRow) === 1);
    }
    
    moveTile(index) {
        if (this.isComplete || !this.canMove(index)) {
            return;
        }
        
        // タイルと空のスペースを交換
        [this.tiles[index], this.tiles[this.emptyIndex]] = 
        [this.tiles[this.emptyIndex], this.tiles[index]];
        
        this.moveCount++;
        this.render();
        
        // 勝利条件をチェック
        if (this.checkWin()) {
            this.handleWin();
        }
    }
    
    checkWin() {
        // 1-15が順番に並んでいて、最後が空のスペースかチェック
        for (let i = 0; i < 15; i++) {
            if (this.tiles[i] !== i + 1) {
                return false;
            }
        }
        return this.tiles[15] === null;
    }
    
    handleWin() {
        this.isComplete = true;
        this.winMessageElement.classList.remove('hidden');
        
        // 花火のような効果を追加
        this.addCelebrationEffect();
    }
    
    addCelebrationEffect() {
        // シンプルな祝福効果
        const tiles = document.querySelectorAll('.tile:not(.empty)');
        tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.style.animation = 'celebration 0.6s ease-out';
            }, index * 50);
        });
    }
    
    shuffle() {
        // 解決可能な状態になるようにシャッフル
        const moves = 1000;
        
        for (let i = 0; i < moves; i++) {
            const movableTiles = this.getMovableTiles();
            if (movableTiles.length > 0) {
                const randomIndex = movableTiles[Math.floor(Math.random() * movableTiles.length)];
                [this.tiles[randomIndex], this.tiles[this.emptyIndex]] = 
                [this.tiles[this.emptyIndex], this.tiles[randomIndex]];
                this.emptyIndex = randomIndex;
            }
        }
        
        this.moveCount = 0;
        this.isComplete = false;
        this.winMessageElement.classList.add('hidden');
        this.render();
    }
    
    getMovableTiles() {
        const movableTiles = [];
        
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i] !== null && this.canMove(i)) {
                movableTiles.push(i);
            }
        }
        
        return movableTiles;
    }
    
    reset() {
        this.tiles = Array.from({length: 15}, (_, i) => i + 1);
        this.tiles.push(null);
        this.moveCount = 0;
        this.isComplete = false;
        this.winMessageElement.classList.add('hidden');
        this.render();
    }
    
    updateMoveCount() {
        this.moveCountElement.textContent = this.moveCount;
    }
    
    bindEvents() {
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.shuffle();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.shuffle();
        });
        
        // キーボード操作の追加
        document.addEventListener('keydown', (e) => {
            if (this.isComplete) return;
            
            let targetIndex;
            const emptyRow = Math.floor(this.emptyIndex / this.size);
            const emptyCol = this.emptyIndex % this.size;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (emptyRow < this.size - 1) {
                        targetIndex = this.emptyIndex + this.size;
                    }
                    break;
                case 'ArrowDown':
                    if (emptyRow > 0) {
                        targetIndex = this.emptyIndex - this.size;
                    }
                    break;
                case 'ArrowLeft':
                    if (emptyCol < this.size - 1) {
                        targetIndex = this.emptyIndex + 1;
                    }
                    break;
                case 'ArrowRight':
                    if (emptyCol > 0) {
                        targetIndex = this.emptyIndex - 1;
                    }
                    break;
            }
            
            if (targetIndex !== undefined) {
                e.preventDefault();
                this.moveTile(targetIndex);
            }
        });
    }
}

// ゲームを開始
document.addEventListener('DOMContentLoaded', () => {
    new SlidingPuzzle();
});