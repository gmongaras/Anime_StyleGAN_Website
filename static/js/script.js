var Images; // Array of all images names
var slideNum; // The current slide being displayed
var slideMax; // The highest slideNum possible with the given images
var slide; // The object displaying the image
var slideDiv; // The div around the slide object 
var imageGen = false; // Are images being generated?
var maxImages = 300; // The absolute maximum amount of images that can be created.
var saving = false; // Are images being saved?
var genRequest = null; // The request sent to generate new images



// Returns the names of the image files in the
// image directory
function getDirContents(dir) {
  $.ajax({
    type: "POST",
	url: "/",
	cache:false, 
	async: true, 
	data: { directory: dir }
  }).done(function( output ) {
	Images = output.replace("[", "").replace("]", "").replaceAll("\'", "").split(", ");
	slideMax = Images.length;
  });
}



// Generates a given amount of images up to 100 images
function genNewImgs(c, num) {
  // If images aren't currently being generated and the number
  // of images is less than maxImages, allow the new request.
  if (imageGen == false && (slideMax < maxImages || slideMax == undefined)) {
	// Set imageGen to true so that new image generation requests
	// cannot be taken
	imageGen = true;
	
	
    // Count can only be up to 100 or greater than 0
    if (c < 1) {
	  c = 1;
    }
    else if (c > 100) {
	  c = 100;
    }
    genRequest = $.ajax({
      type: "POST",
	  url: "/",
	  cache:false, 
	  async: true, 
	  data: { count: c, num: num }
    }).done(function( o ) {
	  // Set imageGen to false so that new image generation requests
	  // can be taken
	  imageGen = false;
	  
	  getDirContents("/");
    });
  }
}


// Tests if an image exists
function ImageExist(url) 
{
   var img = new Image();
   img.src = url;
   return img.height != 0;
}



function plusSlides(n) {
  // Only go to the next slide if saving is not in progress
  if (saving == false) {
    //getDirContents("/");
    slideNum += n
    if (slideNum < 1) {
	  slideNum = slideMax;
    }
    if (slideNum > slideMax) {
	  slideNum = 1
    }
  
    // If the slide the user is currently on is 10 less than
    // the max, create 100 more images
    /*
    if (slideNum >= slideMax - 10) {
	  genNewImgs(10);
	  genNewImgs(90);
    }
    */
  
    // If the image does not exist, try to go to the next
    // image.
    ImageExist("/static/img/" + slideNum + ".png")
    if (ImageExist("/static/img/" + slideNum + ".png") == false) {
	  plusSlides(n)
    }
    else {
	  slide.src = "/static/img/" + slideNum + ".png"
      document.getElementById("imgNum").innerHTML = "Current Image Number: " + slideNum;
      getDirContents("/");
    }
  }
}



// Resets the saving variable to false
function resetSaving() {
  saving = false;
  
  
  // Remove the saving message
  document.getElementById("saving").innerHTML = "";
}



// Saves the current image being displayed.
function saveImage() {
  // If files are not currently being saved, start a new process
  if (saving != true) {
	// Don't allow other save processes to start
	saving = true;
	
	
	// Save the image
	s = document.createElement("a")
	s.id = "save";
	document.body.appendChild(s);
	save = document.getElementById("save");
	save.setAttribute("type", "hidden");
	save.setAttribute("href", "./static/img/" + slideNum + ".png")
	save.setAttribute("download", slideNum + ".png")
	save.click();
	
	
	// Allow other save processes to start after 1 second
	setTimeout(() => resetSaving(), 1000);
  }
}





function urlToPromise(url) {
  return new Promise(function(resolve, reject) {
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if(err) {
        reject(err);
      } else {
        resolve(data);
	  }
    });
  });
}


// Creates a zip of the static/img directory and
// downloads it
function saveAllImagesPT2(zip, folder) {
  // Add each file to the zipped folder
  for (f of Images) {
	folder.file(f, urlToPromise("static/img/" + f), {binary:true})
  }
  
  // Generate the zip file asynchronously
  zip.generateAsync({type:"blob"})
  .then(function callback(content) {
    // Force down of the Zip file
    saveAs(content, "Images.zip");
	
	
	// Reload the pictures
	for (let i of Images) {
	  ImageExist("/static/img/" + i);
	}
	
	
	
	// Allow other save processes to start after 100 miliseconds
    setTimeout(() => resetSaving(), 100);
  });
}
function saveAllImages() {
  // If files are not currently being saved, start a new process
  if (saving != true) {
	// Don't allow other save processes to start
	saving = true;
	
	
	// Display a saving message
	document.getElementById("saving").innerHTML = "Saving... Please wait";
	
	
    // Generate new zip object
    var zip = new JSZip();
  
    // Generate a directory within the Zip file structure
    var folder = zip.folder("Images");
  
    // Get the images that currently exist
    setTimeout(() => getDirContents("/"), 4000);
  
    // Add the images to a zip files and download it
    setTimeout(() => saveAllImagesPT2(zip, folder), 2000);
  }
}




// Initialize variables on page load.
window.onload = function() {
  /*
  // If images are being generated
  fetch("/static/helper.txt")
    .then(response => response.text())
	.then(contents => {
	
	if (contents == "true") {
	  setTimeout(() => genNewImgs(15, 6), 100);
	}
  // Initialize the variables
  getDirContents("/")
  slideNum = 1
  slide = document.getElementById("slideImg")
  slideDiv = document.getElementById("slideImgDiv")
  slideDiv.style.display = "block";
  genNewImgs(15, 6);
	});
  */
  // Initialize the variables
  getDirContents("/")
  slideNum = 1
  slide = document.getElementById("slideImg")
  slideDiv = document.getElementById("slideImgDiv")
  slideDiv.style.display = "block";
  Images = ["1.png", "2.png", "3.png", "4.png", "5.png"];
  genNewImgs(15, 6);
};




// When page is reloaded, stop all ajax requests
window.onbeforeunload = onUnload;
function onUnload() {
	if (genRequest) genRequest.abort();
}