var numberOfEls = 500;
const speed = 1000;
const radius = 500;
const starSize = 10;
let sizeVar = ["5px", "25px"];
var midScreenX = window.innerWidth / 2;
var midScreenY = window.innerHeight / 2;
var oldradius = Math.sqrt(midScreenX * midScreenX + midScreenY * midScreenY);
var stars = document.getElementById('stars');

prepareStars = function(){
    let elements = [];
    for (var i = 0; i < numberOfEls; i++) {
        var hue = Math.round(360 / numberOfEls * i);
        var angle = Math.random() * Math.PI * 2;
        var el = document.createElement('div');
        el.classList.add('particle', 'star');
        el.style.backgroundColor = 'white';
        el.style.width = starSize + 'px';
        el.style.height = starSize + 'px';
        var angle = Math.random()*Math.PI*2;
        var dist = Math.random()*radius;
        x = Math.cos(angle)*dist + midScreenX + 'px'; 
        y = Math.sin(angle)*dist + midScreenY + 'px'; 
        el.style.left = x;
        el.style.bottom = y;
        elements.push(el);
        stars.appendChild(el);
    }
    return elements;
}

randomMovement = function(elements){
    for(var i = 0; i < elements.length; i++){
        anime({
            targets: elements[i],
            translateX: 100,
            duration: speed,
            easing: 'linear',
            loop: true
        });
    }
}


createCircle = function(x, y, radius, fill = "#646464"){
    let svgContainer = document.createElement('div');
    svgContainer.style.cssText = 'position:absolute';
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    circ.setAttribute('cx', x);
    circ.setAttribute('cy', y);
    circ.setAttribute('r', radius);
    circ.setAttribute('stroke', 'black');
    circ.setAttribute('stroke-width', 5);
    circ.setAttribute('fill', fill);
    svgContainer.appendChild(svg);
    svg.appendChild(circ);
    return svgContainer;
}

createBackground = function(x, y, radius, fill = '#646464'){
    let svgContainer = document.createElement('div');
    svgContainer.style.cssText = 'position:absolute';
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let maskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let maskCirc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    let circSmall = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    mask.setAttribute('id', 'hole');
    
    rect.setAttribute('mask', 'url(#hole)');
    rect.setAttribute('fill', '#646464');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');

    maskRect.setAttribute('fill', 'white');
    maskRect.setAttribute('width', '100%');
    maskRect.setAttribute('height', '100%');

    maskCirc.setAttribute('cx', x);
    maskCirc.setAttribute('cy', y);
    maskCirc.setAttribute('r', radius);
    maskCirc.setAttribute('fill', 'black');

    circSmall.setAttribute('cx', x);
    circSmall.setAttribute('cy', y);
    circSmall.setAttribute('r', '50px');
    circSmall.setAttribute('fill', '#646464');

    svgContainer.appendChild(svg);
    svg.appendChild(defs);
    defs.appendChild(mask);
    mask.appendChild(maskRect);
    mask.appendChild(maskCirc);
    svg.appendChild(rect);
    svg.appendChild(circSmall);
    return svgContainer;
}

let elements = prepareStars();
randomMovement(elements);
//stars.appendChild(createCircle(midScreenX, midScreenY, 100));
stars.appendChild(createBackground(midScreenX, midScreenY, radius));
