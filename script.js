const video=document.getElementById("video");
const canvas=document.getElementById("canvas");
const capture=document.getElementById("capture");
const timerText=document.getElementById("timerText");
const flash=document.getElementById("flash");

let timer=0;
let images=[];
let currentFilter="none";


/* CAMERA */

navigator.mediaDevices.getUserMedia({
video:{
width:{ideal:1920},
height:{ideal:1080},
facingMode:"user"
}
})
.then(stream=>video.srcObject=stream);



/* FILTERS — 12 PREMIUM ONES */

/* FILTER CAROUSEL */

const filters = [
{name:"Natural", value:"none"},
{name:"Cloud Soft",
value:"brightness(1.06) contrast(.92) saturate(.95)"},
{name:"Tokyo",
value:"contrast(1.25) saturate(1.35) hue-rotate(-8deg)"},
{name:"Arctic",
value:"brightness(1.12) contrast(1.08) saturate(.85) hue-rotate(8deg)"},
{name:"Peach Glow",
value:"brightness(1.08) contrast(.95) saturate(1.25) sepia(.15)"},
{name:"Obsidian",
value:"grayscale(1) contrast(1.35) brightness(.85)"},
{name:"Emerald Pop",
value:"saturate(1.6) contrast(1.15) hue-rotate(18deg)"},
{name:"Golden Hour",
value:"sepia(.25) saturate(1.4) brightness(1.05) contrast(.95)"},
{name:"Cinema Pro",
value:"contrast(1.4) saturate(1.2) brightness(.95)"},
{name:"Dream Fade",
value:"brightness(1.15) contrast(.85) saturate(.8)"},
{name:"Neon Night",
value:"contrast(1.5) saturate(1.8) hue-rotate(35deg)"},
{name:"Retro Film",
value:"sepia(.35) contrast(1.25) brightness(.9) saturate(1.1)"},
{name:"Ice Blue",
value:"hue-rotate(160deg) saturate(1.2) brightness(1.05)"},
{name:"Ultra Clean",
value:"contrast(1.18) brightness(1.04) saturate(1.08)"}
];


let filterIndex = 0;

const filterName = document.getElementById("filterName");
const nextBtn = document.getElementById("nextFilter");
const prevBtn = document.getElementById("prevFilter");

function applyFilter(){

const selected = filters[filterIndex];

video.style.filter = selected.value;
currentFilter = selected.value;
filterName.innerText = selected.name;

}

nextBtn.onclick = () => {

filterIndex++;

if(filterIndex >= filters.length)
filterIndex = 0;

applyFilter();

};

prevBtn.onclick = () => {

filterIndex--;

if(filterIndex < 0)
filterIndex = filters.length - 1;

applyFilter();

};




/* TIMER */

function toggleTimerMenu(){
document.getElementById("timerMenu")
.classList.toggle("show");
}

function setTimer(e,t){

timer=t;

document.querySelectorAll(".timer-menu span")
.forEach(el=>el.classList.remove("active"));

e.target.classList.add("active");

document.getElementById("timerMenu")
.classList.remove("show");
}



/* CAPTURE */

capture.onclick=()=>{

if(timer===0){
shoot();
return;
}

let count=timer;
timerText.style.display="block";
timerText.innerText=count;

const int=setInterval(()=>{

count--;
timerText.innerText=count;

if(count===0){

clearInterval(int);
timerText.style.display="none";
shoot();

}

},1000);

};


function shoot(){

flash.style.opacity=.9;
setTimeout(()=>flash.style.opacity=0,120);

canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

const ctx=canvas.getContext("2d");

/* draw video */
ctx.filter=currentFilter;
ctx.drawImage(video,0,0);

/* ADD VIGNETTE INTO PHOTO */
const gradient = ctx.createRadialGradient(
canvas.width/2,
canvas.height/2,
canvas.width*.35,
canvas.width/2,
canvas.height/2,
canvas.width*.75
);

gradient.addColorStop(0,"rgba(0,0,0,0)");
gradient.addColorStop(1,"rgba(0,0,0,.35)");

ctx.fillStyle=gradient;
ctx.fillRect(0,0,canvas.width,canvas.height);

/* FILM GRAIN (procedural) */

for(let i=0;i<40000;i++){

ctx.fillStyle=`rgba(255,255,255,${Math.random()*.04})`;

ctx.fillRect(
Math.random()*canvas.width,
Math.random()*canvas.height,
1,
1
);
}

images.push(canvas.toDataURL("image/png"));

}



/* GALLERY */

function openGallery(){

document.getElementById("gallery").classList.add("open");

const grid=document.getElementById("galleryGrid");
grid.innerHTML="";

images.forEach(src=>{

const img=document.createElement("img");
img.src=src;

img.onclick=()=>{
const a=document.createElement("a");
a.href=src;
a.download="photo.png";
a.click();
};

grid.appendChild(img);

});
}

function closeGallery(){
document.getElementById("gallery").classList.remove("open");
}
