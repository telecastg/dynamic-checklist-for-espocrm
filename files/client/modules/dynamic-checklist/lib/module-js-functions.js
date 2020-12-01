function decodeHTML(encodedHTML) {
    var workArea = document.createElement('textarea');
    workArea.innerHTML = encodedHTML;
    return workArea.value;    
}

function replaceLabel(objArray,oldLabel,newLabel) {
    let obj = objArray.find((o,i) => {
       if(o.label === oldLabel) {
           objArray[i].label = newLabel;
           return true; // stop searching
       }
    });
    return objArray;
}

function replaceJsonObjectinArrayByReference(objArray,refName,refValue,newObject){
    let obj = objArray.find((o, i) => {
        if (o.refName === refValue) {
            objArray[i] = newObject;
            return true; // stop searching
        }
    });
    return objArray;
}