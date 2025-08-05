// 自定义图片配置 - 图片放在images子文件夹中
const imageItems = [
    { name: "薄金", url: "images/bj.png" },       
    { name: "典狱长", url: "images/dyz.png" },    
    { name: "隐士", url: "images/hermit.png" },   
    { name: "首席顾问", url: "images/sxgw.png" },
    { name: "升学礼", url: "images/sxl.png" },    
    { name: "乡村牧师", url: "images/xcms.png" }, 
    { name: "游隼", url: "images/ys.png" }       
];
const sequenceLength = imageItems.length;
let targetSequence = [];
let guessCount = 0;
let currentGuess = [...imageItems]; // 初始猜测序列与图片库相同
let firstSelectedIndex = null; // 用于记录第一个选中的元素索引

// DOM元素
const guessContainer = document.getElementById('guess-container');
const targetContainer = document.getElementById('target-container');
const targetSequenceEl = document.getElementById('target-sequence');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const attemptsEl = document.getElementById('attempts');
const correctCountEl = document.getElementById('correct-count');
const historyContainer = document.getElementById('history-container');
const winModal = document.getElementById('win-modal');
const modalContent = document.getElementById('modal-content');
const finalAttemptsEl = document.getElementById('final-attempts');
const modalRestartBtn = document.getElementById('modal-restart');
const selectedIndicator = document.getElementById('selected-indicator');
const selectedName = document.getElementById('selected-name');

// 初始化游戏
function initGame() {
    // 随机生成目标序列
    targetSequence = [...imageItems].sort(() => Math.random() - 0.5);
    
    // 重置猜测次数
    guessCount = 0;
    attemptsEl.textContent = `猜测次数: ${guessCount}`;
    correctCountEl.textContent = `正确数量: 0`;
    
    // 重置当前猜测和选择状态
    currentGuess = [...imageItems];
    firstSelectedIndex = null;
    selectedIndicator.classList.add('hidden');
    
    // 清空历史记录
    historyContainer.innerHTML = '<p class="text-gray-500 text-center italic">暂无历史记录</p>';
    
    // 隐藏目标序列和弹窗
    targetContainer.classList.add('hidden');
    winModal.classList.add('hidden');
    
    // 渲染猜测序列
    renderGuessSequence();
}

// 渲染猜测序列
function renderGuessSequence() {
    guessContainer.innerHTML = '';
    
    currentGuess.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = `color-item ${firstSelectedIndex === index ? 'selected' : ''}`;
        itemEl.dataset.index = index;
        itemEl.title = `点击选择 ${item.name}`;
        
        // 创建图片元素
        const imgEl = document.createElement('img');
        imgEl.src = item.url; // 这里会自动使用images/前缀的路径
        imgEl.alt = item.name;
        imgEl.className = 'color-img';
        
        // 图片加载错误处理
        imgEl.onerror = function() {
            this.src = 'https://picsum.photos/100/100?grayscale';
            this.alt = `无法加载: ${item.name} (路径: ${item.url})`; // 错误信息中显示路径，便于排查
        };
        
        itemEl.appendChild(imgEl);
        
        // 添加点击事件用于交换
        itemEl.addEventListener('click', () => handleItemClick(index));
        
        guessContainer.appendChild(itemEl);
    });
}

// 处理图片项点击
function handleItemClick(index) {
    // 如果是第一次选择
    if (firstSelectedIndex === null) {
        firstSelectedIndex = index;
        selectedName.textContent = currentGuess[index].name;
        selectedIndicator.classList.remove('hidden');
    } 
    // 如果点击的是同一个元素，取消选择
    else if (firstSelectedIndex === index) {
        firstSelectedIndex = null;
        selectedIndicator.classList.add('hidden');
    } 
    // 第二次选择，执行交换
    else {
        // 交换位置
        const temp = currentGuess[firstSelectedIndex];
        currentGuess[firstSelectedIndex] = currentGuess[index];
        currentGuess[index] = temp;
        
        // 重置选择状态
        firstSelectedIndex = null;
        selectedIndicator.classList.add('hidden');
        
        // 重新渲染序列并添加动画效果
        renderGuessSequence();
        addSwapAnimation(index);
        addSwapAnimation(firstSelectedIndex); // 同时为两个交换的元素添加动画
    }
    
    // 更新选中状态
    renderGuessSequence();
}

// 添加交换动画
function addSwapAnimation(index) {
    const items = guessContainer.querySelectorAll('.color-item');
    if (items[index]) {
        items[index].classList.add('ring-4', 'ring-primary');
        setTimeout(() => {
            items[index].classList.remove('ring-4', 'ring-primary');
        }, 500);
    }
}

// 提交猜测
function submitGuess() {
    guessCount++;
    attemptsEl.textContent = `猜测次数: ${guessCount}`;
    
    // 计算正确数量
    let correctCount = 0;
    currentGuess.forEach((item, index) => {
        // 通过比较url判断是否相同（因为文件名是唯一的）
        if (item.url === targetSequence[index].url) {
            correctCount++;
        }
    });
    
    correctCountEl.textContent = `正确数量: ${correctCount}`;
    
    // 添加到历史记录
    addToHistory(currentGuess, correctCount);
    
    // 检查是否猜对
    if (correctCount === sequenceLength) {
        // 显示目标序列
        renderTargetSequence();
        targetContainer.classList.remove('hidden');
        
        // 显示胜利弹窗
        showWinModal();
    } else {
        // 添加提交反馈动画
        submitBtn.classList.add('bg-green-500');
        setTimeout(() => {
            submitBtn.classList.remove('bg-green-500');
        }, 300);
    }
}

// 渲染目标序列
function renderTargetSequence() {
    targetSequenceEl.innerHTML = '';
    
    targetSequence.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'color-item';
        
        // 创建图片元素
        const imgEl = document.createElement('img');
        imgEl.src = item.url; // 使用images/前缀的路径
        imgEl.alt = item.name;
        imgEl.className = 'color-img';
        
        // 图片加载错误处理
        imgEl.onerror = function() {
            this.src = 'https://picsum.photos/100/100?grayscale';
            this.alt = `无法加载: ${item.name}`;
        };
        
        itemEl.appendChild(imgEl);
        targetSequenceEl.appendChild(itemEl);
    });
}

// 添加到历史记录
function addToHistory(guess, correctCount) {
    // 如果是第一条记录，先清空提示文本
    if (historyContainer.querySelector('p.italic')) {
        historyContainer.innerHTML = '';
    }
    
    const historyItem = document.createElement('div');
    historyItem.className = 'bg-gray-50 p-3 rounded-lg flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300';
    
    // 历史猜测序列
    const guessEl = document.createElement('div');
    guessEl.className = 'flex gap-1';
    
    guess.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'w-8 h-8 rounded-full overflow-hidden';
        itemEl.title = item.name;
        
        const imgEl = document.createElement('img');
        imgEl.src = item.url; // 使用images/前缀的路径
        imgEl.alt = item.name;
        imgEl.className = 'w-full h-full object-cover';
        
        // 图片加载错误处理
        imgEl.onerror = function() {
            this.src = 'https://picsum.photos/100/100?grayscale';
        };
        
        itemEl.appendChild(imgEl);
        guessEl.appendChild(itemEl);
    });
    
    // 正确数量
    const correctEl = document.createElement('div');
    correctEl.className = 'bg-primary/10 text-primary font-bold px-3 py-1 rounded-full';
    correctEl.textContent = `正确: ${correctCount}`;
    
    historyItem.appendChild(guessEl);
    historyItem.appendChild(correctEl);
    
    // 添加到历史容器顶部
    historyContainer.prepend(historyItem);
    
    // 触发动画
    setTimeout(() => {
        historyItem.classList.remove('opacity-0', 'translate-y-2');
    }, 10);
}

// 显示胜利弹窗
function showWinModal() {
    // 胜利弹窗中使用jl.png（同样放在images文件夹）
    const winImage = document.createElement('img');
    winImage.src = 'images/jl.png'; // 胜利图片路径
    winImage.alt = '胜利庆祝';
    winImage.className = 'mx-auto mb-4 rounded-lg shadow-lg max-w-full h-48 object-cover';
    
    // 清除弹窗中可能已有的图片，添加新图片
    const modalImageContainer = modalContent.querySelector('.modal-image-container') || document.createElement('div');
    modalImageContainer.className = 'modal-image-container';
    modalImageContainer.innerHTML = '';
    modalImageContainer.appendChild(winImage);
    
    // 将图片容器插入弹窗
    modalContent.insertBefore(modalImageContainer, modalContent.firstChild);
    
    finalAttemptsEl.textContent = guessCount;
    winModal.classList.remove('hidden');
    
    // 触发动画
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// 隐藏胜利弹窗
function hideWinModal() {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        winModal.classList.add('hidden');
    }, 300);
}

// 事件监听
submitBtn.addEventListener('click', submitGuess);
restartBtn.addEventListener('click', initGame);
modalRestartBtn.addEventListener('click', () => {
    hideWinModal();
    initGame();
});

// 初始化游戏
window.addEventListener('DOMContentLoaded', initGame);
