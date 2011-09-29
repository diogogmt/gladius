
var Cache = function() {
    
    this.content = [];
    this.fileTypes = [
        ['jpg', 'png', 'gif', 'svg', 'apng', 'tiff', 'jpeg', 'pnga'], // image
        ['mp4', 'mpeg', 'mpg', 'ogv', 'oga', 'dvx', 'divx', 'xdiv'], // video
        ['mp3', 'ogg', 'wav'] // audio
    ]
    
    this.fileCategories = ['image', 'video', 'audio'];
    
    this.onCompleteAll = function () {};
    this.onComplete = function () {};
    this.onError = function () {};
    
};

Cache.prototype.supports = function(ext) {
    var index = 0;
    var that = this;
    
    var loopExtensions = function() {
        var i;
        var type = that.fileTypes[index];
//        alert(type);
        for (i = 0; i < type.length; i++) {
            if (ext === type[i]){
                return i;
            }
        }
        if (that.fileTypes[index+1]) {
            index += 1;
            loopExtensions();
        }
    }
    
    return loopExtensions();
    
}

Cache.prototype.get = function(obj) {
    var i, j;
    var content = obj.content;
    for (i = 0; i < obj.content.length; i++) {
        
        var resource = obj.content[i];
        for (j = 0; j < resource.url.length; j++) {

            var url = resource.url[j];
            var ext = url.substring(url.lastIndexOf(".")+1);
            
            switch (this.supports('jpg')) {
                case 0 :resource.type = this.fileCategories[0];
                            this.loadImage(resource)
                break;
                case 1 :resourceType = this.fileCategories[1];
                break;
                case 2 :resourceType = this.fileCategories[2];
                break;
                default:
                    // Check for alternates
                    // Callback error function
            }
//            resource.data = this.loadImage(url,resource.name);
//            alert(resource.data);
        }
        

//        this.onComplete(resource.name);    
        
    }
    
    this.onCompleteAll();
};


Cache.prototype.find = function(resourceName) {
//    alert('this.content[i]'); // alert to wait until all the images load
    var i;
    for (i = 0; i < this.content.length; i++) {
        if (this.content[i].name === resourceName || this.content[i].url === resourceName) {
//            alert(this.content[i]);
            return this.content[i];
        }
    }
};

Cache.prototype.clear = function(resource) {
    if (resource === undefined) {
        this.content = null
    }
    else {
        for (i = 0; i < this.content.length; i++) {
            if (this.content[i].name === resource || this.content[i].url === resource) {
                this.content[i].data = null;
                this.content.splice(i,1);
            }
        }
    }
    
};



Cache.prototype.loadImage = function (resource)
{
    var that = this;
    var loading = function() {
        var img = new Image();
        img.onload = function() {
            console.log('Image loaded');
            resource.data = img;
            that.content.push(resource);
            that.onComplete(resource);
        };
        img.onerror = function() {
            console.log('Error loading the image');
        };
        img.src = resource.url;
        img.id = resource.name;
        console.log('loadImage method:' + img.id);
    }
    loading();
    
    
}


