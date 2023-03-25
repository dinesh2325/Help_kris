const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});


$(document).ready (function(){
	$("#success-alert").hide();
	$("#myWish").click(function showAlert() {
	   $("#success-alert").alert();
	   window.setTimeout(function () { 
		  $("#success-alert").alert('close'); 
	   }, 2000);             
	});      
 });