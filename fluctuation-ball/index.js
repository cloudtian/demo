function copyObj(a, b) {
    Object.keys(b).forEach(k => {
        if (a[k] && typeof b[k] === 'object') {
            a[k] = copyObj(a[k], b[k]);
        } else {
            a[k] = b[k];   
        }
    });
    return a;
}

class Ball {
    defaults = {

        // canvas 画布的id
        canvas: '',

        // 绘制背景圆，每个大小和颜色[{color, radius}]
        circles: [],

        // 波动
        fluctuation: {
            scaleX: 100, // 使用100个px表示一个PI大小，相当于X轴缩放比例
            scaleY: 0.25, // y轴相对于x轴的缩放比例
            step: 2, // 每次重绘x轴方向移动的像素，可用来调整移动速度
            fluctLoc: 0, // 正弦波的初始位置
            color: {
                from: '', // 正弦波渐变的初始颜色
                to: '' // 正弦波渐变的结束颜色
            },
            fluctuations: [] // [offset1, offset2]绘制几个正弦波
        },

        // 气泡
        bubble: {

            // 绘制几个气泡，每个的大小和颜色[{direct方向1|-1 向左|向右, offsetY垂直偏移，影响气泡的位置和显示时间}]
            bubbles: [],

            bubbleLoc: 0, // 气泡的初始位置

            color: 'white',

            radiusRange: [3, 6] // 气泡大小变化
        },

        baseline: 50 // 基准线高度，影响气泡和正弦波位置

    };

    constructor (options) {
        this.options = copyObj(this.defaults, options);
        this.init();
    }

    init () {
        let canvas = document.getElementById(this.options.canvas);
        let context;

        if (canvas) {
            context = canvas.getContext('2d');
        }

        if (!context) {
            return;
        }

        this.width = canvas.width;
        this.height = canvas.height;
        this.context = context;
    }

    draw () {
        if (!this.context) {
            return;
        }

        
        let me = this;

        let { 
            circles, 
            fluctuation: { 
                step: fluctSetp, 
                scaleX: fluctCycle, 
                fluctuations
            }, 
            bubble: {
                bubbles, 
                radiusRange: bubbleRange
            }
        } = this.options;
        fluctCycle *= 4; // 保证完整循环

        this.fluctLoc = this.options.fluctuation.fluctLoc;
        this.bubbleLoc = this.options.bubble.bubbleLoc;

        let loop = this.getRequestAnimationFrame();


        doDraw();
        function doDraw () {
            if (me.stopped) {
                return;
            }
            me.drawCircles(circles);

            fluctuations.forEach((offset) => {
                me.drawSinArea(offset, me.fluctLoc);
            });

            me.fluctLoc = (me.fluctLoc + fluctSetp) % fluctCycle;

            if (me.drawBubbles(bubbles, me.bubbleLoc, bubbleRange)) {
                me.bubbleLoc += 0.2;
            } else {
                me.bubbleLoc = 0;
            }

            if (!me.stopped) {
                loop(doDraw);
            }
        }
    }

    /**
     * 绘制一组同心圆
     * @param circles {Array}: [{color, radius}]
     */
    drawCircles(circles) {
        let ctx = this.context;
        let PI = Math.PI;
        let x = Math.floor(this.width / 2);
        let y = Math.floor(this.height / 2);

        ctx.save();
        circles.forEach((circle) => {
            ctx.beginPath();
            ctx.fillStyle = circle.color;
            ctx.arc(x, y, circle.radius, 0, 2 * PI, false);
            ctx.closePath();
            ctx.fill();
        });
        ctx.restore();
    }

    /**
     * 绘制正弦波动区域，并填充颜色
     * @param offset 正弦相对于(0,0)点的偏移
     * @param baseLoc 基准位置偏移量
     */
    drawSinArea(offset, baseLoc) {
        let ctx = this.context;
        let width = this.width;
        let height = this.height;
        let baseline = this.getBaseline();

        let scaleX = Math.PI / this.options.fluctuation.scaleX;
        let scaleY = this.options.fluctuation.scaleY / scaleX;

        let sin = Math.sin;
        let baseX = 0; // 正弦初始点的x坐标
        let baseY = baseline + sin((baseLoc + offset) * scaleX) * scaleY; // 正弦初始点的y坐标

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);

        // 绘制正弦区域
        for (let x = baseX + 1; x <= width; x++) {
            let y = sin((x + baseLoc + offset) * scaleX) * scaleY;
            ctx.lineTo(x, baseline + y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(baseX, height);
        ctx.lineTo(baseX, baseY);
        ctx.closePath();

        // 绘制放射性渐变填充色
        let gradient = ctx.createRadialGradient(width / 2, height, 0, width /2, height, height - baseline);
        let color = this.getSinColor();

        gradient.addColorStop(0, color.from);
        gradient.addColorStop(1, color.to);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    /**
     * 绘制气泡，按照抛物线上升，顶点在球的最底部
     */
    drawBubbles(bubbles, bubbleLoc, radRange) {
        let ctx = this.context;
        let width = this.width;
        let height = this.height;
        let baseline = this.getBaseline();
        let minRadius = radRange[0];
        let range = radRange[1] - minRadius;
        let maxOffsetY = 0;
        let minBubbleY = Number.MAX_VALUE;
        let PI = Math.PI;

        ctx.save();

        // 画出一组气泡，只有在合适范围内的才显示
        bubbles.forEach(bubble => {
            let bubbleX = bubble.direct * bubbleLoc + width / 2; // 气泡x坐标
            let bubbleY = height - bubbleLoc * bubbleLoc / 8 + bubble.offsetY; // 气泡y坐标
            let percent = (height - bubbleY) / (height - baseline);
            let radius = percent * range + minRadius; // 气泡大小

            minBubbleY = Math.min(bubbleY, minBubbleY);
            maxOffsetY = Math.max(bubble.offsetY, maxOffsetY);

            // 显示气泡的范围
            if (bubbleY < height && bubbleY >= baseline) {
                ctx.beginPath();
                ctx.arc(bubbleX, bubbleY, radius, 2 * PI, false);
                ctx.closePath();
                ctx.fillStyle = this.getBubbleColor(percent);
                ctx.fill();
            }
        });

        ctx.restore();

        return minBubbleY + maxOffsetY >= baseline; // 是否有气泡在显示
    }

    // 重绘定时器
    getRequestAnimationFrame () {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (cb) {
                    
                    // 17ms comes from professional js for web developers
                    setTimeout(cb, 17);
                }
    }
    setBaseline(baseline) {
        this.baseline = baseline;
    }
    getBaseline() {
        return this.baseline || this.options.baseline;
    }
    getSinColor() {
        return this.options.fluctuation.color;
    }
    setSinColor (color) {
        this.options.fluctuation.color = color;
    }
    getBubbleColor (percent) {
        switch (this.options.bubble.color) {
            case 'white':
                return `rgba(255, 255, 255, ${(1 - percent) * 0.3 + 0.1})`;
            case 'blue':
                return `rgba(23, 193, 197, ${(1 - percent) * 0.3 + 0.1}))`;
            default: return '';      
        }
    }
    setbubbleColor (color) {
        this.options.bubble.color = color;
    }
    stop () {
        this.stopped = true;
    }
    destroy () {
        this.stop();
    }
}

let ball = new Ball({
    canvas: 'canvas',
    circles: [{
        color: '#eaeaea',
        radius: 73
    }, {
        color: '#f7f5f5',
        radius: 60
    }, {
        color: '#fbfbfb',
        radius: 42
    }, {
        color: '#fdfdfd',
        radius: 20
    }],
    fluctuation: {
        scaleX: 100,
        scaleY: 0.25,
        step: 2,
        color: {
            from: 'rgba(14, 139, 163, 1)',
            to: 'rgba(42, 195, 199, 0.8)'
        },
        fluctuations: [0, 30]
    },
    bubble: {
        bubbles: [{
            direct: 1, offsetY: -10
        }, {
            direct: -1, offsetY: 0
        }, {
            direct: 1, offsetY: 40
        }],
        radiusRange: [2, 8]
    },
    baseline: 75
});

ball.draw();