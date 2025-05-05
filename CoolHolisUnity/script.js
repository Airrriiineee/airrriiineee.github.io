
const judul = document.getElementById("judul");
const poster = document.querySelector(".poster");
poster.addEventListener("mouseenter", function(){
    poster.style.opacity = 0.5;
});
poster.addEventListener("mouseleave", function(){
    poster.style.opacity = 1;
});