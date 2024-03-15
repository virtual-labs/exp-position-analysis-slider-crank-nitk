var simstatus=0; 
var rotstatus=1;
//comments section
var commenttext="Some Text";
var commentloc=0;
//computing section
var trans= new point(100,250);

var o= new point(0,0,"");
var a= new point(0,0,"");
var b= new point(0,0,"");
//var d= new point(0,0,"D");

var theta2 = 40; // all angles to be defined either in degrees only or radians only throughout the program and convert as and when required
var phi=0; // All angles in Degrees. (mention the specification in the script like here) 
var omega2=1; // angular velocity in rad/s
//var omega3=0, omega4=0;

var r=0,l=0;
var flaggrashof=true;
//graphics section
var canvas;
var ctx;
//timing section
var simTimeId = setInterval("",'1000');
var pauseTime = setInterval("",'1000');
var time=0;
//point tracing section
var ptx = [];
var pty = [];
//click status of legend and quick reference
var legendCS = false;
var quickrefCS = false;
//temporary or dummy variables
var temp=0;
var offset=0;


//change simulation specific css content. e.g. padding on top of variable to adjust appearance in variables window
function editcss()
{
$('.variable').css('padding-top','40px');
}

//start of simulation here; starts the timer with increments of 0.1 seconds
function startsim()
{
simTimeId=setInterval("time=time+0.1; varupdate(); ",'100');
}

// switches state of simulation between 0:Playing & 1:Paused
function simstate()
{
  var imgfilename=document.getElementById('playpausebutton').src;
  imgfilename = imgfilename.substring(imgfilename.lastIndexOf('/') + 1, imgfilename.lastIndexOf('.'));
  if (imgfilename=="bluepausedull")
  {
    document.getElementById('playpausebutton').src="images/blueplaydull.svg";
	 clearInterval(simTimeId);
    simstatus=1;
    $('#theta2spinner').spinner("value",theta2);			//to set simulation parameters on pause
    pauseTime=setInterval("varupdate();",'100');
    document.querySelector(".playPause").textContent = "Play";
  }
    if (imgfilename=="blueplaydull")
  {
  	 time=0;			
  	 clearInterval(pauseTime);
    document.getElementById('playpausebutton').src="images/bluepausedull.svg";
    simTimeId=setInterval("time=time+0.1; varupdate(); ",'100');    
    simstatus=0;
    document.querySelector(".playPause").textContent = "Pause";
  } 
}

// switches state of rotation between 1:CounterClockWise & -1:Clockwise
function rotstate()
{
  var imgfilename=document.getElementById('rotationbutton').src;
  imgfilename = imgfilename.substring(imgfilename.lastIndexOf('/') + 1, imgfilename.lastIndexOf('.'));
  if (imgfilename=="bluecwdull")
  {
    document.getElementById('rotationbutton').src="images/blueccwdull.svg";
    rotstatus=-1;
  }
    if (imgfilename=="blueccwdull")
  {
    document.getElementById('rotationbutton').src="images/bluecwdull.svg";
    rotstatus=1;
  } 
}

//Initialise system parameters here
function varinit()
{
varchange();	
//Variable r2 slider and number input types
$('#r2slider').slider("value", 40);	
$('#r2spinner').spinner("value", 40);
//Variable r3 slider and number input types
$('#r3slider').slider("value", 100);	
$('#r3spinner').spinner("value", 100);
//Variable theta2 slider and number input types
$('#theta2slider').slider("value", 40);	
$('#theta2spinner').spinner("value", 40);
//Variable omega2 slider and number input types
$('#omega2slider').slider("value", 1);	
$('#omega2spinner').spinner("value", 1);
}

// Initialise and Monitor variable containing user inputs of system parameters.
//change #id and repeat block for new variable. Make sure new <div> with appropriate #id is included in the markup
function varchange()
{
//Variable r2 slider and number input types
$('#r2slider').slider({ max : 60, min : 20, step : 2 });		// slider initialisation : jQuery widget
$('#r2spinner').spinner({ max : 60, min : 20, step : 2 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#r2slider" ).on( "slide", function( e, ui ) { $('#r2spinner').spinner("value",ui.value); ptx=[]; pty=[]; r2change(); } );
$( "#r2spinner" ).on( "spin", function( e, ui ) { $('#r2slider').slider("value",ui.value); ptx=[]; pty=[]; } );
$( "#r2spinner" ).on( "change", function() {  varchange() } );

//Variable r3 slider and number input types
$('#r3slider').slider({ max : 240, min : 80, step : 2 });		// slider initialisation : jQuery widget
$('#r3spinner').spinner({ max : 240, min : 80, step : 2 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#r3slider" ).on( "slide", function( e, ui ) { $('#r3spinner').spinner("value",ui.value); ptx=[]; pty=[]; } );
$( "#r3spinner" ).on( "spin", function( e, ui ) { $('#r3slider').slider("value",ui.value); ptx=[]; pty=[]; } );
$( "#r3spinner" ).on( "change", function() {  varchange() } );

//Variable theta2 slider and number input types
$('#theta2slider').slider({ max : 360, min : 0, step : 2 });		// slider initialisation : jQuery widget
$('#theta2spinner').spinner({ max : 360, min : 0, step : 2 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#theta2slider" ).on( "slide", function( e, ui ) { $('#theta2spinner').spinner("value",ui.value); ptx=[]; pty=[]; } );
$( "#theta2spinner" ).on( "spin", function( e, ui ) { $('#theta2slider').slider("value",ui.value); ptx=[]; pty=[]; } );
$( "#theta2spinner" ).on( "change", function() {  varchange() } );

//Variable omega2 slider and number input types
$('#omega2slider').slider({ max : 1.8, min : 0.2, step : 0.2 });		// slider initialisation : jQuery widget
$('#omega2spinner').spinner({ max : 1.8, min : 0.2, step : 0.2 });		// number initialisation : jQuery widget			
// monitoring change in value and connecting slider and number
// setting trace point coordinate arrays to empty on change of link length
$( "#omega2slider" ).on( "slide", function( e, ui ) { $('#omega2spinner').spinner("value",ui.value); ptx=[]; pty=[]; } );
$( "#omega2spinner" ).on( "spin", function( e, ui ) { $('#omega2slider').slider("value",ui.value); ptx=[]; pty=[]; } );
$( "#omega2spinner" ).on( "change", function() {  varchange() } );

varupdate();

}

//Computing of various system parameters
function varupdate()
{

$('#r2slider').slider("value", $('#r2spinner').spinner('value'));  //updating slider location with change in spinner(debug)
$('#r3slider').slider("value", $('#r3spinner').spinner('value'));
$('#theta2slider').slider("value", $('#theta2spinner').spinner('value')); 

r=$('#r2spinner').spinner("value");
l=$('#r3spinner').spinner("value");
$('#omega2set').hide(); 
$('#r3slider').slider({max: 6*$('#r2slider').slider('value')});
$('#r3slider').slider({min: 2.5*$('#r2slider').slider('value')});
$('#r3spinner').spinner({max: 6*$('#r2slider').slider('value')});
$('#r3spinner').spinner({min:2.5*$('#r2slider').slider('value')});
if(!simstatus)
{
$('#theta2slider').slider("disable"); 
$('#theta2spinner').spinner("disable"); 
printcomment("",2);
theta2=theta2+(rotstatus*0.1*deg(omega2));
theta2=theta2%360;
if(theta2<0)theta2+=360;

}
if(simstatus)
{
$('#theta2slider').slider("enable"); 
$('#theta2spinner').spinner("enable");
theta2=$('#theta2spinner').spinner("value");
printcomment("Crank at "+theta2+"&deg; <br>Position of slider from Crank Center = "+roundd(b.xcoord-o.xcoord,2)+"cm",2);
}
phi=deg(Math.asin((r*Math.sin(rad(theta2)))/l));
o.xcoord=0;
o.ycoord=0;
a.xcoord=o.xcoord+r*Math.cos(rad(theta2));
a.ycoord=o.ycoord+r*Math.sin(rad(theta2));
b.xcoord=a.xcoord+l*Math.cos(rad(phi));
b.ycoord=o.ycoord;

printcomment("Limits of l for the set r : "+$('#r3spinner').spinner("option","min")+" and\n "+$('#r3spinner').spinner("option","max")+" ",1);

draw();

}

//Simulation graphics
function draw()
{
  canvas = document.getElementById("simscreen");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,550,400);  //clears the complete canvas#simscreen everytime
  
  pointtrans(o,trans);
  pointtrans(a,trans);
  pointtrans(b,trans);
  
//Crank Center and Sliding base 
   ctx.beginPath();  
   ctx.strokeStyle="#000000";
   ctx.lineWidth=20;
	ctx.moveTo(o.xcoord,o.ycoord);
	ctx.lineTo(o.xcoord,o.ycoord+10);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
   ctx.lineWidth=10;
	ctx.strokeStyle= "#666666";
	ctx.moveTo(75,o.ycoord+15);
	ctx.lineTo(530,o.ycoord+15);
	ctx.stroke();
	ctx.closePath();	
	
  pointjoin(o,a,ctx,"#CCCC00",12);

  pointdisp(o,ctx,2,"#000000","#003366",'','','');
  ctx.strokeStyle="#000";
  ctx.arc(o.xcoord,o.ycoord,6,0,2*Math.PI,false);  
  ctx.stroke();
 
  pointjoin(a,b,ctx,"#CCCC00",12);
  
  pointdisp(a,ctx,2,"#000000","#003366",'','','');
  ctx.strokeStyle="#000";
  ctx.arc(a.xcoord,a.ycoord,5,0,2*Math.PI,false);
  ctx.stroke(); 
  pointdisp(b,ctx,5,"#000000","#003366",'','','');

  drawrem(ctx);

// slider element  
  ctx.globalAlpha=0.8; 
  drawrect(b,50,20,10,ctx,"#CC9933","#CC9933",1);  
  ctx.globalAlpha=1;  
}

function drawrem(context)
{	

// positioning dimension display  
   if(theta2%360<=180)
	  offset=-45;
	else
	  offset=20;

// dimension line      
   context.save();
   context.moveTo(o.xcoord,o.ycoord-offset);
	context.lineWidth=3;
   context.strokeStyle="#000000";
	context.lineTo(b.xcoord,o.ycoord-offset);
	context.moveTo(o.xcoord,o.ycoord-offset+5);
	context.lineTo(o.xcoord,o.ycoord-offset-5);
	context.moveTo(b.xcoord,o.ycoord-offset+5);
	context.lineTo(b.xcoord,o.ycoord-offset-5);
	context.stroke();
	
// arrows at dimension
  drawArrow(b.xcoord,b.ycoord-offset,context,180,15,30,'#000','',"#000");
  drawArrow(o.xcoord,o.ycoord-offset,context,0,15,30,'#000','',"#000");
	

// Position Analysis Title	
	context.save();
   context.lineWidth=1;
   context.font="20px 'Nunito', sans-serif";
   context.fillStyle="#000000";
   context.fillText("Position Analysis", 180,45);
   context.restore();

// r, l, d display
	context.save();
	context.lineWidth=1;
	context.strokeStyle="#000000";
	context.font = "10px Arial";
	context.strokeText('d', (o.xcoord+b.xcoord)/2,o.ycoord-offset-10);	
	context.strokeText('r',(o.xcoord+a.xcoord)/2-1,(o.ycoord+a.ycoord)/2+1);
	context.strokeText('l',(a.xcoord+b.xcoord)/2-1,(a.ycoord+b.ycoord)/2+3);
	context.restore();
}

// prints comments passed as 'commenttext' in location specified by 'commentloc' in the comments box;
// 0 : Single comment box, 1 : Left comment box, 2 : Right comment box
function printcomment(commenttext,commentloc)
{
  if(commentloc==0)
  {
  document.getElementById('commentboxright').style.visibility='hidden';
  document.getElementById('commentboxleft').style.width='570px';
  document.getElementById('commentboxleft').innerHTML = commenttext;
  }
  else if(commentloc==1)
  {
  document.getElementById('commentboxright').style.visibility='visible';
  document.getElementById('commentboxleft').style.width='285px';
  document.getElementById('commentboxleft').style.marginLeft = '50px';
  document.getElementById('commentboxright').style.marginLeft = '50px';
  document.getElementById('commentboxleft').innerHTML = commenttext;
  }
  else if(commentloc==2)
  {
  document.getElementById('commentboxright').style.visibility='visible';
  document.getElementById('commentboxleft').style.width='285px';
  document.getElementById('commentboxright').innerHTML = commenttext;
  }
  else
  {
  document.getElementById('commentboxright').style.visibility='hidden';
  document.getElementById('commentboxleft').style.width='570px';
  document.getElementById('commentboxleft').innerHTML = "<center>please report this issue to adityaraman@gmail.com</center>"; 
  // ignore use of deprecated tag <center> . Code is executed only if printcomment function receives inappropriate commentloc value
  }
}