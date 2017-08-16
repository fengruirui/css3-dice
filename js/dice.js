/* 
let params = {
    "method": null, //玩法rxfs_rxfs_1z1
    "code": null, //投注号码
    "odds": null, //赔率3.96
    "point": null, //返点    
    "nums": 0, //投注的注数
    "piece": 0, //投注的倍数
    "price": 1, //筹码金额
    "amount": 1, //总金额price*nums    
};
 */

let Elements_forBet = []; //建立一个投注的筹码数组存放这些将要投注的筹码,可以取消投注
let Elements_betted = []; //建立一个投注了的筹码数组存放这些已经投注的筹码,不能取消投注
//投注算投注内容的时候就看桌子上放的筹码
let diceGameContent = $('.diceGameContent');
let balanceAmount = $('.balanceAmount');
let betMoneyAmount = $('.betMoneyAmount');
let cancelButton = $('.cancelButton');
let betButton = $('.betButton');
let pieceButtoon = $('.pieceButtoon');

//屏幕自适应
(function () {
    /* let scale = document.body.clientWidth / 1920;
    diceGameContent.css({
        'zoom': scale,
    }); */
    diceGameContent.css({
        'width': document.body.clientWidth,
    });
})();
let common_param = {
    "method": null,
    "code": null,
    "odds": null, //后台传过来的
    "point": null //后台传过来的
};
let params = {};
let param = { //不同筹码提交的时候算不同的obj
    1: jQuery.extend({
        "nums": 1,
        "piece": 0,
        "price": 1,
        "amount": null
    }, common_param),
    5: jQuery.extend({
        "nums": 1,
        "piece": 0,
        "price": 5,
        "amount": null
    }, common_param),
    10: jQuery.extend({
        "nums": 1,
        "piece": 0,
        "price": 10,
        "amount": null
    }, common_param),
    20: jQuery.extend({
        "nums": 1,
        "piece": 0,
        "price": 20,
        "amount": null
    }, common_param),
    50: jQuery.extend({
        "nums": 1,
        "piece": 0,
        "price": 50,
        "amount": null
    }, common_param),
    100: jQuery.extend({
        "nums": 1,
        "piece": 0,
        "price": 100,
        "amount": null
    }, common_param),
    1000: jQuery.extend({
        "nums": 1,
        "piece": 0,
        "price": 1000,
        "amount": null
    }, common_param),
    5000: jQuery.extend({
        "nums": 1,
        "piece": 0,
        "price": 5000,
        "amount": null
    }, common_param)
};
let totalCount = {}; //总金额，函数calculateIcon要用到
let allValues = [];
$('.wrap div').each(function (index, item) { //获取所有的value值存到数组
    if ($(item).attr('value')) {
        allValues.push($(item).attr('value'));
    }
});
allValues.forEach((item, index) => { //每个value值对应提交对象
    params[item] = JSON.parse(JSON.stringify(param)); //浅复制，消除引用影响
    totalCount[item] = 0; //初始每个选号投的筹码个数为0，投的金额为0
});
let priceNum = null; //筹码,未选择时为null
//确定所用筹码
$('.chips>.chip').off('click').on('click', function (e) {
    $(this).addClass('on').siblings('.chip').removeClass('on');
    priceNum = +$(this).attr('value');
});
//投注
let flyChip = null; //点击筹码飞过去的元素
function createFlyChip(num, value) { //创建飞出去的筹码
    let ele = document.createElement('div');
    $(ele).addClass(`flyChip${+num}`).attr('rel', 'betChip');
    return $(ele);
}

function letChipFly(priceNum, element, Elements_forBet) { //筹码飞出去方法
    let value = element.attr('value');
    flyingChip = createFlyChip(priceNum, value);
    flyingChip.attr('flyTo', `${value}_${priceNum}`);

    flyingChip.css({
        "position": 'absolute',
        "left": $(`.chips>.chip${priceNum}`).offset().left,
        "top": $(`.chips>.chip${priceNum}`).offset().top,
        "transition": 'all 0.2s ease'
    });
    $('body').append(flyingChip);
    flyingChip.css({
        "left": element.offset().left + element[0].offsetWidth / 2 - $('.chips>.chip').width() / 2,
        "top": element.offset().top + element[0].offsetHeight / 2 - $('.chips>.chip').height() / 2,
    });
    Elements_forBet.push({ //存储飞出去的筹码，用在取消投注的时候用
        "chip": flyingChip,
        "value": element.attr('value'),
        "context": element
    });
    setTimeout(() => {
        $(`[flyTo="${value}_${priceNum}"]`).remove();
    }, 300);
}

function addChip(ele, count) {
    for (let i = 0; i < count; i++) {
        $(ele).appendTo($('body')).css({
            "transform": `translateY(-${i === 0?(5 * Math.random()):i * 5}px)`
        });
        // $('body').append(ele);
    }
}

function letChipFlyBack(Elements_forBet) { //取消投注让筹码飞回来
    if (Elements_forBet.length === 0) {
        return;
    }
    let lastFlyObj = Elements_forBet.splice(Elements_forBet.length - 1, 1)[0];
    let backElement = lastFlyObj['chip'];
    let value = lastFlyObj['value'];
    let context = lastFlyObj['context'];
    $('body').append(backElement);
    let className = backElement.attr('class');
    let price = +className.match(/flyChip(\d+)/)[1];
    totalCount[value] -= price;

    backElement.css({
        "left": $(`.chips>.chip${price}`).offset().left,
        "top": $(`.chips>.chip${price}`).offset().top,
    }).attr('flyBack', `${value}_${price}`);
    setTimeout(() => {
        $(`[flyBack="${value}_${price}"]`).remove();
        renderIcon(calculateIcon(totalCount[value]), context);
    }, 250);
}



let allMethods = ['[method="dxds_dxds_dxds"]', '[method="th2_th2fx_fx"]', '[method="th3_th3_th3dx"]', '[method="th3_th3_th3tx"]', '[method="hz_hz_hz"]', '[method="bth2_bth2_ds"]', '[method="cygh_cygh_cygh"]', '[method="bth3_lh3_dx"]'];

$(String(allMethods)).off('click').on('click', function (e) {
    if (!priceNum) { //如果没有选定筹码，不能下注
        return;
    }
    letChipFly(priceNum, $(this), Elements_forBet);
    let method = $(this).attr('method');
    let value = $(this).attr('value'); //code
    totalCount[value] += priceNum;
    setTimeout(() => {
        renderIcon(calculateIcon(totalCount[value]), $(this));
    }, 250);
    params[value][priceNum].method = method;
    params[value][priceNum].code = value;
    params[value][priceNum].piece = calculateIcon(totalCount[value])[priceNum];
});


/* 计算筹码图标，各种面额硬币并非实体，只有1分这个计量单位。
然后每次投钱或者去掉钱，自动把分换算成相应图标。 */
function calculateIcon(count) { //count 1分钱的个数,chipTypes = [1,5,10,20,50,100,1000,5000]
    //5k筹码的个数
    let result = {};
    result[5000] = Math.floor(count / 5000);
    result[1000] = Math.floor((count - result[5000] * 5000) / 1000);
    result[100] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000) / 100);
    result[50] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100) / 50);
    result[20] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100 - result[50] * 50) / 20);
    result[10] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100 - result[50] * 50 - result[20] * 20) / 10);
    result[5] = Math.floor((count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100 - result[50] * 50 - result[20] * 20 - result[10] * 10) / 5);
    result[1] = Math.floor(count - result[5000] * 5000 - result[1000] * 1000 - result[100] * 100 - result[50] * 50 - result[20] * 20 - result[10] * 10 - result[5] * 5);
    return result;
}
//根据calculateIcon出的钱种个数生成对应图标
function renderIcon(iconObj, clickedElem) {
    let value = clickedElem.attr('value');
    $(`[address_value="${value}"]`).remove();
    for (let key in iconObj) {
        if (iconObj[key]) {
            let elem = createFlyChip(key, value).css({
                "position": 'absolute',
                "left": function () {
                    return clickedElem.offset().left + clickedElem[0].offsetWidth / 2 - $('.chips>.chip').width() / 2; //23是飞盘一半的宽度
                },
                "top": function () {
                    return clickedElem.offset().top + clickedElem[0].offsetHeight / 2 - $('.chips>.chip').height() / 2; //21是飞盘一半的高度
                }
            }).attr('address_value', value);
            addChip(elem[0].outerHTML, iconObj[key]);
        }
    }
}
//计算倍数，投注了的为1倍

function calculatePiece() { //翻倍
    for (let codeValue in params) {
        for (let chipNum in params[paramValue]) {
            if (params[paramValue][chipNum]['piece']) {
                params[paramValue][chipNum]['piece'] *= 2;
            }
        }
    }
}

function calculateTotalCount() { //计算总金额
    let count = 0;
    for (let codeValue in totalCount) {
        if (totalCount[codeValue]) {
            count += totalCount[codeValue];
        }
    }
    return count;
}
//生成订单，根据桌面上筹码生成订单数据
function createOrder() {

}
//取消投注
cancelButton.off('click').on('click', function (e) {
    letChipFlyBack(Elements_forBet);
});
//翻倍投注
pieceButtoon.off('click').on('click', function (e) {
    calculatePiece();
});
//确认投注
betButton.off('click').on('click', function (e) {

});
//计算随机骰子随机旋转位置
function createDiceRollStyle() {
    let style = document.createElement('style');
    let styleStr_left = ``;
    let styleStr_center = ``;
    let styleStr_right = ``;
    for (let i = 0; i < 99; i += 2) {
        styleStr_left += `${i}%{transform: translate3d(${Math.random()*35}px, ${Math.random()*16-8}px, ${Math.random()*16}px) rotate(${Math.random()*5}deg);}`;
        styleStr_center += `${i}%{transform: translate3d(${Math.random()*36-18}px, ${Math.random()*16-8}px, ${Math.random()*16}px) rotate(${Math.random()*5}deg);}`;
        styleStr_right += `${i}%{transform: translate3d(${Math.random()*35-35}px, ${Math.random()*16-8}px, ${Math.random()*16}px) rotate(${Math.random()*5}deg);}`;
    }
    let results = [
        ['transform: translate3d(4px,0px,0px)', 'transform: translate3d(4px,-8px,0px)', 'transform: translate3d(0px,0px,0px)'],
        ['transform: translate3d(4px,0px,0px)', 'transform: translate3d(10px,4px,0px)', 'transform: translate3d(-15px,-8px,0px)'],
        ['transform: translate3d(30px,0px,0px)', 'transform: translate3d(-16px,0px,0px)', 'transform: translate3d(-18px,6px,-6px)'],
        ['transform: translate3d(30px,0px,0px)', 'transform: translate3d(-16px,0px,0px)', 'transform: translate3d(-18px,-6px,-6px)'],
        ['transform: translate3d(0px,0px,0px)', 'transform: translate3d(0px,0px,0px)', 'transform: translate3d(0px,0px,0px)'],
    ];

    let result = results[Math.floor(Math.random() * 4)];

    styleStr_left += `100% {${result[0]}  rotate(0deg);}`; //最后的位置可以写个数组指定几个位置随机translate3d(-4px,0px,-4px)，translate3d(4px,0px,-4px)，translate3d(-4px,0px,4px)，translate3d(4px,0px,4px)
    styleStr_center += `100% {${result[1]}  rotate(0deg);}`;
    styleStr_right += `100% {${result[2]}  rotate(0deg);}`;
    style.innerHTML = `
        @keyframes diceShake_left {
            ${styleStr_left}
        }
        @keyframes diceShake_center {
            ${styleStr_center}
        }
        @keyframes diceShake_right {
            ${styleStr_right}
        }
    `;
    document.head.appendChild(style);
}
createDiceRollStyle();
//计算开奖后闪烁选好区域
function blinkArea(openCode) {
    let openCode_arr = openCode.split(','); //"1,2,3" => [1,2,3];
    let openCodeValue_3w = openCode_arr.join(''); //[1,2,3] => 123
    let openCodeValue_2w = choose(openCode_arr, 2).map(itemArr => String(itemArr).split(',').join('')); //[1,2,3] =>[12,13,23]
    let openCodeValue_1w = openCode_arr;
    return [...openCodeValue_1w, ...openCodeValue_2w, openCodeValue_3w];
}

//求数组组合的所有组合方式[1,2,3]->[1,2],[1,3],[2,3]
function choose(arr, size) {
    var allResult = [];

    function _choose(arr, size, result) {
        var arrLen = arr.length;
        if (size > arrLen) {
            return;
        }
        if (size == arrLen) {
            allResult.push([].concat(result, arr))
        } else {
            for (var i = 0; i < arrLen; i++) {
                var newResult = [].concat(result);
                newResult.push(arr[i]);

                if (size == 1) {
                    allResult.push(newResult);
                } else {
                    var newArr = [].concat(arr);
                    newArr.splice(0, i + 　1);
                    _choose(newArr, size - 1, newResult);
                }
            }
        }
    }
    _choose(arr, size, []);

    return allResult;
}
//合并method和code相同的对象 订单
function mergeOrder(order) {
    return order.reduce((a, b) => {

        let flagIndex = a.findIndex((item, index) => {
            return item.method === b.method && item.code === b.code;
        });
        if (flagIndex !== -1) {
            a[flagIndex].piece += b.piece;
        } else {
            a.push(b);
        }
        return a;
    }, [{
        method: '',
        code: '',
        count: 0
    }]);
}