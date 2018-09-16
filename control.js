
   //////////////////THIS IS REQUIRED BY Firebase so just place it here
   const firestore = firebase.firestore();
   const settings = {timestampsInSnapshots: true};
   firestore.settings(settings); 
 ///////////////////////////


 
   function myProvin(){
    var list_city = document.querySelector("#myCity");
    list_city.innerHTML = "";
    var list_div = document.querySelector("#list-div");
    list_div.innerHTML = "";

    var prov = document.getElementById("myProvince")
    var strUser = prov.options[prov.selectedIndex].value;
   
    console.log(strUser.toString());
    
if(strUser =="Gauteng"){
  var citylist = document.getElementById("myCity")
  citylist.innerHTML += `<option value="Alberton">Alberton</option>
  <option value="Benoni">Benoni</option>
  <option value="Boksburg">Boksburg</option>
  <option value="Kempton Park">Kempton Park</option>
  <option value="Midrand">Midrand</option>
  <option value="Soweto">Soweto</option>`

}else if(strUser == "Western Cape"){
  //var provlist = document.getElementById("myCity");
  // provlist.innerHTML +="";
  

function cleanlist(){
  var provlist = document.getElementById("myCity")
  return Promise.resolve(  provlist.innerHTML +="")
};


cleanlist().then(
   provlist = document.getElementById("myCity"),
  provlist.innerHTML += `<option value="Durbanville">Durbanville</option>
  <option value="Mossel Bay">Mossel Bay</option>
  <option value="Table View">Table View</option>`
);

}}

   function mycity(){
    var list_div = document.querySelector("#list-div");
    list_div.innerHTML = "";
   }

  


function searchbtn(){
  ///////////THIS IS USED TO GET THE DATA from THE drop List///////
  var e = document.getElementById("myProvince");
  var valProv = e.options[e.selectedIndex].value;

  var f = document.getElementById("myCity");
  var valCity = f.options[f.selectedIndex].value;

///////////THIS IS USED TO GET THE REFERENCE TO THE COLLECTION DATA
  const docref = firestore.collection("CarService").doc(valProv).collection(valCity);
/////////////
  ///////////THIS IS USED TO GET THE DATA from THE REFERENCE///////CODE GET
  var list_div = document.querySelector("#list-div");

  docref.onSnapshot(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshot
   var myShop = (doc.data().Shop);
   var myArea = (doc.data().Area);
          // Code that will run at the end
          
     // THE += WORKS I DONT KNOW THE REASON
list_div.innerHTML += "<div class='card text-white bg-info'>"+
"<div class='card-body'>"+
 "<h4 class='card-Title'>"+myShop+"</h4>"+
 "<p class='card-text'>"+myArea+"</p>"+
"</div>"+
"</div>";
    });
})
}
///////////GET THE NAME ///////////////////////////////////////
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uid = user.uid;
  
const docr = firestore.collection("Users").doc(uid);
docr.onSnapshot(function (name){
  if(name.exists){
  const nameholder = document.getElementById("userN");
  nameholder.innerText = name.data().UserName;
  }else{
    const docr = firestore.collection("Users").doc(uid);
    var nameholder = document.getElementById("userN");
    const disp = user.displayName;
    docr.set({
      UserName: disp,
    })
    
     nameholder.innerText = disp;
     
  }
  
   })
    
  
    
    
  
}
});



//////////GET THE PROFILE IMAGE////////////////////////

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();
var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uid = user.uid;
  
// Create a reference to the file we want to download

var starsRef = storageRef.child("profileImage/"+uid+".jpg");

// Get the download URL
starsRef.getDownloadURL().then(function(url) {
  // Insert url into an <img> tag to "download"
  var getprofileid = document.getElementById("profile")
  getprofileid.innerHTML += `<img class="img-circle rounded-circle" src="${url}" alt="" width="150px" height="150px">`;

}).catch(function(error) {
console.log(error);
  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/object-not-found':
      // File doesn't exist
      var user = firebase.auth().currentUser;
      var photoURL = user.photoURL;
       var getprofileid = document.getElementById("profile")
        getprofileid.innerHTML += `<img class="img-circle rounded-circle" src="${photoURL}" alt="" width="150px" height="150px">`;
      break;

    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

    case 'storage/unknown':
    var user = firebase.auth().currentUser;
    var photoURL = user.photoURL;
     var getprofileid = document.getElementById("profile")
      getprofileid.innerHTML += `<img class="img-circle rounded-circle" src="${photoURL}" alt="" width="150px" height="150px">`;
      // Unknown error occurred, inspect the server response
      break;
  }
});


} 
});




///////////////////// USED TO SIGN OUT (history.back() is used to go back to LOGIN PAGE)
var logoutButton = document.getElementById('sign-out');

  function signOut(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('logedout');
      history.back();
    
  }).catch(function(error) {
      // An error happened.
      console.log(error)
  });
  }
  logoutButton.addEventListener('click',signOut);
  ////////////////////////////////////////////////////////////////




/////////////////////////////UPLOAD IMAGE/////////////////////////
function startupload(){


//let fileUpload = document.querySelector("btn-danger")


var file = document.querySelector('input[type=file]').files[0]
    
var nametext = document.querySelector('input[type=text]').value;

  

// Create the file metadata
var metadata = {
  contentType: 'image/jpeg'
};
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    
    var uid = user.uid;
   
    if(nametext != null && nametext!=""){
    const docr = firestore.collection("Users").doc(uid);
docr.update({
  UserName: nametext,
});
    }
 

    if(file != null && file != ""){
// Upload file and metadata to the object 'images/mountains.jpg'
var uploadTask = storageRef.child('profileImage/' +uid+'.jpg').put(file, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    var options = document.getElementById('myDivId');
    var nanobar = new Nanobar( options );
    nanobar.go(progress);
    nanobar.go(100);
   

    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {

  // A full list of error codes is available at
  // https://firebase.google.com/docs/storage/web/handle-errors
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL
  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    location.reload();
    alert("PROFILE IS UPDATED");
  });
});
    }
}})



}