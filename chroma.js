video = document.getElementById("video");
c1 = document.getElementById("canvas1");
ctx1 = this.c1.getContext("2d");

// Get video
navigator.mediaDevices.getUserMedia({video: true})
  .then(function (stream) {
    // Put video input into video tag
    video.srcObject = stream;

    let self = this;
    
    this.video.addEventListener("loadeddata", function() {
      self.width = self.video.videoWidth;
      self.height = self.video.videoHeight;

      self.time_callback();

    }, false);
  })
  .catch(function (error) {
      console.log("Error:", error);
  });

function draw () {
  ctx1.drawImage(video, 0, 0, this.width, this.height);
}

function time_callback () {
  if (video.paused || video.ended) {
    return;
  }

  draw();
  findColor(color);

  // Update
  setTimeout(function () {
    this.time_callback();
  }, 0);
};


function pickedFilter () {
	var selector = document.getElementById("colorFilter");
  color = selector.options[selector.selectedIndex].value;

  time_callback();
}

// Which color? Green or blue?
pickedFilter();
colorFilter.addEventListener("change", pickedFilter);

function findColor (color) {
  let frame = this.ctx1.getImageData(0, 0, this.width, this.height);

  let l = frame.data.length / 4;
  
	if (color === "Green") {
    for (let i = 0; i < l; i++) {
    
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];

      if (g > r && g > b) {
        // If it's too dark it's probably not right
        if (g > 100 ) {
          // Alpha value to 0
          frame.data[i * 4 + 3] = 0;
        }
      }
    }
  } else {
    for (let i = 0; i < l; i++) {
    
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];

      if (b > r && b > g) {
        if (b > 100 ) {
          frame.data[i * 4 + 3] = 0;
        }
      }
    }
  }

  this.ctx1.putImageData(frame, 0, 0);
  return;
}
