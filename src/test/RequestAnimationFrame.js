// var factorial = function fun(num) {
//   if (num === 2) {
//     return 1;
//   }
//   return num * fun(num - 1);
// };
// console.log(factorial(5));

// function widthWiden() {
//   var element = document.getElementById('element');
//   element.style.width = parseInt(element.style.width) - 1 + 'px';

//   if (parseInt(element.style.width) > 10) {
//     window.requestAnimationFrame(widthWiden);
//   }
// }
// window.requestAnimationFrame(widthWiden);

// function fall() {
//   //debugger;
//   var element = document.getElementById('element');
//   // parseInt 解析字符串成为整数；
//   element.style.top = parseInt(element.style.top) + 10 + 'px';

//   window.requestAnimationFrame(fall);
// }
// window.requestAnimationFrame(fall);

var stopId;
var start;
var progress;
var toggle = false;

function boxFall(timeStamp) {
  var box = document.getElementById('div');
  if (!start === true || progress > 500) {
    start = timeStamp;
  }
  progress = (timeStamp - start) / 10 + 50;
  box.style.top = progress + 'px';

  stopId = window.requestAnimationFrame(boxFall);
}
stopId = window.requestAnimationFrame(boxFall);

function toggleBox() {
  debugger;
  if (!toggle) {
    toggle = true;
    window.requestAnimationFrame(boxFall);
  } else {
    debugger;
    toggle = false;
    cancelAnimationFrame(stopId);
  }
}
