/*jshint white: false, strict: false, plusplus: false, onevar: false,
  nomen: false */
/*global define: false, console: false, window: false, setTimeout: false */

define( function ( require ) {

    var Cache = function(  ) {
    	
    	var that = this;
      this.resources = new Array();
	    this.noResources;
	   	this.countResources = 0; 
	   	
	    this.onCompleteAll = function () {};
	    this.onComplete = function () {};
	    this.onError = function () {};

	   	
	   	this.extensions = {
	   		image: ['jpg', 'png', 'apng', 'tiff', 'svg', 'jpeg', 'pnga', 'gif'],
	   		audio: new Array()
	   	};
	   	
	   	this.audioElementSupport = !!(document.createElement('audio').canPlayType);
			
			this.audios = {
				'audio/mpeg': ['mp3'],
				'audio/ogg': ['ogg'],
				'audio/wav': ['wav']
			};
	   	
	   	if (this.audioElementSupport) {
				SND = document.createElement('audio');
				
				for (var prop in this.audios) {
					mimeTypes = this.audios;
					if(mimeTypes.hasOwnProperty(prop)) {
						// console.log("prop is: " + prop);
						var mimeExts = mimeTypes[prop];
						if ('no' != SND.canPlayType(prop) && 
								'' != SND.canPlayType(prop)) {
							this.extensions['audio'] = this.extensions['audio'].concat(mimeExts);
						}
					}
				}
			}
			
	    
	    
	    
	    this.get = function(obj) {
	
				var content = obj.content;
				var i;
				
				that.noResources = content.length;
				
				for (i = 0; i < content.length; i++) {
					that.loadResource(content[i], 0);
				}
			    
			};
			
			
			// should return just the data, not the whole resource
			this.find = function(resourceName) {
			//    alert('this.content[i]'); // alert to wait until all the images load
			    var i;
			    for (i = 0; i < that.resources.length; i++) {
			        if (that.resources[i].name === resourceName || that.resources[i].url === resourceName) {
									// console.log('find equal: ' + this.resources[i].name + " === " + resourceName);
			            return that.resources[i];
			        }
			        else {
			        	// console.log('not equal: ' + this.resources[i].name + " !== " + resourceName);
			        }
			    }
			};
		
		
			this.loadResource = function(resource, urlPos) {
				if (urlPos >= resource.url.length) {
					that.onError(resource);
					that.resourceLoaded();
				}
				else {
					var url = resource.url[urlPos];
			    var ext = url.substring(url.lastIndexOf(".")+1);
			    
					console.log("url: " + url);
					console.log("ext: " + ext);
			
			    
					resourceType = that.getType(ext);
					
					// console.log("resourceType: " + resourceType);
					
					switch (resourceType) {
						case "image" : that.loadImage(resource, urlPos);
						break;
						
						case "audio" : 	console.log("loading audio...");
														that.loadAudio(resource, urlPos);
						break;
						
						default :
							urlPos += 1;
							that.loadResource(resource, urlPos);
						break;
			
					}
					
				}
			};


			this.loadImage = function (resource, urlPos){
				console.log('loadImage: ' + resource.name);
			
		    var img = new Image();
		    img.onload = function() {
		        console.log('Image loaded: ' + resource.name);
		        console.log('Image loaded: ' + img);
		        that.resources.push({
		        	name: resource.name,
		        	url: resource.url[urlPos],
		        	data: img //change resource name for a more explicit one
		        });
		        that.onComplete(resource);
		        that.resourceLoaded();
		    };
		    
		    img.onerror = function() {
		        console.log('Error loading the image: ' + resource.name);
		        urlPos += 1;
		        that.loadResource(resource, urlPos);
		    };
		    img.src = resource.url[urlPos];
			};
		
			this.loadAudio = function(resource, urlPos) {
				console.log('Audio loading... ' + resource.name);
			
				var sound;
				
				try // IE9 doesn't support Audio(), and Mozilla doesn't support canplaythrough with document.createElement, so this is what I came up with.
				{
					sound = new Audio();
				}
				catch(e){
					sound = document.createElement('audio');
				}
				
				sound.addEventListener("canplaythrough", function() {
					console.log('Audio loaded: ' + resource.name);
			    console.log('Audio loaded: ' + sound);
			    that.resources.push({
			    	name: resource.name,
			    	url: resource.url[urlPos],
			    	data: sound //change resource name for a more explicit one
			    });
			    that.onComplete(resource);
			    that.resourceLoaded();
				});
				
				sound.onerror = function(e){
					console.log('Error loading the audio: ' + resource.name);
			    urlPos += 1;
			    that.loadResource(resource, urlPos);
				};
			
				sound.src = resource.url[urlPos];
				sound.load();
				console.log('Audio loading... ' + resource.name);
					testSound = sound;
			
			}
		
		
			this.resourceLoaded = function() {
				that.countResources += 1;
				
				console.log('Resource loaded: ' + that.countResources);
				
				if (that.countResources === that.noResources) {
					that.onCompleteAll();
				}
			};
			
			this.getType = function(ext) {
				// console.log("getType");
				for (var prop in that.extensions) {
					exts = that.extensions;
					if(exts.hasOwnProperty(prop)) {
						// console.log("prop is: " + prop);
						
						var typeExt = exts[prop];
						for (var i = 0; i < typeExt.length; i++) {
							if (ext === typeExt[i]) {
								console.log("returning: " + prop);
								return prop;
							}
						}
						
					}
				}
			};

    };

    return Cache;

});
