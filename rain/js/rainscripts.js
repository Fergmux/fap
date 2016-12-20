$(function(){
  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  var canvas = document.getElementById('myCanvas');
  var gl = initWebGL();
  reset();
  
  function initWebGL() {
    gl = null;
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("2d")
    // If we don't have a GL context, give up now
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    return gl;
  }

  // reset slider values to defualt
  function reset() {
    $('#speed').val(6);
    $('#density').val(8);
    $('#width').val(4);
    $('#length').val(40);
  }

  // create a drop and insert into drop array
  function makeDrop(drops) {
    var randVals = [];
    var width = parseInt($('#width').val());
    var length = parseInt($('#length').val());
    for (var i = 0; i < 4; i++) {
      randVals.push(Math.random());
    }
    var drop = {
      x: randVals[0]*canvas.width,
      y: -200,
      w: randVals[1]*width,
      l: randVals[2]*length+length,
      v: randVals[1]/2 + 0.5
    }
    drops.push(drop);
    return drops;
  }

  // draw a line passing in a drop object
  function drawLine(drop) {
    gl.beginPath();
    gl.moveTo(drop.x, drop.y);
    gl.lineTo(drop.x, drop.y+drop.l);
    gl.lineWidth = drop.w;
    gl.strokeStyle = '#4B0082';
    gl.stroke();
  }

  function drawLines(drops) {
    for (i in drops) {
      drawLine(drops[i]);
    }
  }

  // update the positions of all the drops
  function updateDrops(drops, time) {
    var liveDrops = [];
    var speed = $('#speed').val();
    for (i in drops) {
      var drop = drops[i]
      drop.y = drop.y + drop.v * time * speed/10;
      if (drop.y < canvas.height) {
        liveDrops.push(drop);
      }
    }
    return liveDrops;
  }

  // used to fit the density slider values to useful fractions of a second for drop creation
  var incs = [1,2,5,20,50,200,500];
  function animate(drops, startTime, prevTime, lastSpawn) {
    var elapsedTime = (new Date()).getTime() - startTime;
    
    // time since the previous loop started
    var deltaTime = elapsedTime - prevTime

    drops = updateDrops(drops, deltaTime);

    gl.clearRect(0, 0, canvas.width, canvas.height);

    drawLines(drops);

    var density = $("#density").val();
    // value on the density slider to switch from less than one to multiple drops per loop
    var switchPoint = 7;
    // time since the last drop was created
    var timeSince = elapsedTime - lastSpawn;

    // if density is less than one per animation loop, create drops at some rate
    if (density < switchPoint && timeSince > 1000/(incs[density])) {
      drops = makeDrop(drops);
      lastSpawn = elapsedTime;
    } else if (density >= switchPoint) {
      // else make multiple drops each animation loop
      var count = density - switchPoint + 1;
      for (var i = 0; i < count; i++) {
        drops = makeDrop(drops);
      }
      lastSpawn = elapsedTime;
    }
    
    // request new frame
    requestAnimFrame(function() {
      animate(drops, startTime, elapsedTime, lastSpawn);
    });
  }

  // wait one second before starting animation
  setTimeout(function() {
    var startTime = (new Date()).getTime();
    animate([], startTime, startTime, 0);
    
  }, 1000);

  $( "#showbutton" ).click(function() {
    // if controls are currrently showing
    if (out) {
      var position = "-150px";
      var text = "Show";
      var out = false;
      var showpacity = 0.3;
    } else {
      var position = "20px";
      var text = "Hide";
      var out = true;
      var showpacity = 1;
    }
    // bring control panel into view
    $( "#controls" ).animate({
      right: position,
    }, 500);
    // hide or fade out 'show' button
    $( "#showbutton" ).animate({
      opacity: showpacity,
    }, 500);

    $( "#showbutton" ).text(text);
    $( "#reset" ).fadeToggle(500);

  });
});



