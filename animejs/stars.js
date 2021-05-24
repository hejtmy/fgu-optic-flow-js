var numberOfEls = 100;
var duration = 10000;
const speed = 10;
const radius = 500;
const starSize = 10;
var midScreenX = window.innerWidth / 2;
var midScreenY = window.innerHeight / 2;
var oldradius = Math.sqrt(midScreenX * midScreenX + midScreenY * midScreenY);
var stars = document.getElementById('stars');

for (var i = 0; i < numberOfEls; i++) {
    var hue = Math.round(360 / numberOfEls * i);
    var angle = Math.random() * Math.PI * 2;
    var el = document.createElement('div');
    el.classList.add('particle', 'star');
    el.style.backgroundColor = 'hsl(' + hue + ', 40%, 60%)';
    el.style.width = starSize + 'px';
    el.style.height = starSize + 'px';
    var angle = Math.random()*Math.PI*2;
    var dist = Math.random()*radius;
    x = Math.cos(angle)*dist + midScreenX + 'px'; 
    y = Math.sin(angle)*dist + midScreenY + 'px'; 
    el.style.left = x;
    el.style.bottom = y;
    stars.appendChild(el);
}

    anime({
        targets: 'asd',
        width: ['1px', '10px'],
        height: ['1px', '10px'],
        left: [midScreenX + 'px', Math.cos(angle) * oldradius + midScreenX + 'px'],
        top: [midScreenY + 'px', Math.sin(angle) * oldradius + midScreenY + 'px'],
        delay: (duration / numberOfEls) * i,
        duration: duration,
        easing: 'easeInExpo',
        loop: true
    });


createCircle = function(x, y, radius){
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    circ.setAttribute('cx', x);
    circ.setAttribute('cy', y);
    circ.setAttribute('r', radius);
    circ.setAttribute('stroke', 'black');
    circ.setAttribute('stroke-width', 5);
    circ.setAttribute('fill', 'white');
    svg.appendChild(circ);
    return svg;
}

stars.appendChild(createCircle(midScreenX, midScreenY, radius));

document.getElementById('stars').appendChild(fragment);