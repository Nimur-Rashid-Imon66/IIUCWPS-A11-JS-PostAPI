const promise = fetch("https:jsonplaceholder.typicode.com/posts");
const commentPromise = fetch("https://jsonplaceholder.typicode.com/comments");
let postComment = [];
let allPost=[];
let favoriteArray = [];
let allFpost = [];

let editState = {
    id: -1,
    body: "",
    title: ""
}
let commentState = {
    id : -1,
    flag : false
}

const commentPromiseJson = commentPromise.then((data) => {
    return data.json();
});
commentPromiseJson.then((response) => {
    postComment = response;
});
commentPromiseJson.catch((err) =>{
    consolelog(err);
});


const promiseJson = promise.then((data) => {
    return data.json();
});

function render(e,from){
    const post = document.getElementById("post");
    let postList = ""; 
    let fBtn = [
            "",
            `<button id="favorite-btn" class="self-center rounded p-2 bg-green-300 hover:bg-green-500">
            Add Favourite
          </button>`
        ]
    for(let item of e){
        postList += `<div id="post-${item.id}" class="flex flex-col gap-2 mx-auto p-3 max-w-3xl">
        <h1 id="post-title" class="text-3xl text-center uppercase font-semibold">${item.title}</h1>
        <p id="post-body" class="text-[#37352F]">${item.body}</p>
        ${fBtn[from]}
    </div>`
    }

    post.innerHTML=postList;

}


promiseJson.then((response) => {
    allPost = response;
    render(allPost,1);
});

promise.catch((err) =>{
    consolelog(err);
});


function addFavorite(e){
    const parentId = e.parentElement.id;
    const idSplits = parentId.split("-");
    const idx = parseInt(idSplits.pop());
    if(!favoriteArray.find((item) => item === idx )){
        const parentValue = allPost.filter((item) => item.id === idx );
        editState={
            id: idx,
            body: parentValue[0].body,
            title: parentValue[0].title
        }
        allFpost.push(editState);
        favoriteArray.push(idx);
    }
    else{
        alert("Item already added in Favorite list");
    }

    
}

function commentRender(items){
    const idx = parseInt(items[0].postId);
    const postSID = `post-${idx}`;
    const post = document.getElementById(postSID);

    const comMainDiv = document.createElement('div');
    let allComments = "Comments<br>";
    comMainDiv.className = "flex flex-col gap-4";
    comMainDiv.setAttribute('id', 'comment-box');
    for(let item of items){
        allComments += `<div><p class="text-[#6EC1E4] font-semibold">${item.email}</p>
        <p>${item.body}</p></div>
        `
    }
    comMainDiv.innerHTML=allComments;
    post.appendChild(comMainDiv);
    
}

function showFavorite(){

    render(allFpost,0);

}

function showPostComment(item){

    const parentId = item.parentElement.id;
    const idSplits = parentId.split("-");
    const idx = parseInt(idSplits.pop()); 
    const individualComment = postComment.filter((item) => item.postId === idx);
    if(commentState.flag === false){
        commentState.id  = idx;
        commentState.flag = true;
        commentRender(individualComment);
    }
    else{
        const commentBox = document.getElementById("comment-box");

        commentBox.innerHTML = "";
        commentBox.remove();
        if(idx != commentState.id){
            commentState.id = idx;
            commentRender(individualComment);
        }
        else{
            commentState.id = -1;
            commentState.flag=false;
        }

    }
    

}

function processAction(e){
   if(e.target.id === "favorite-btn"){
     addFavorite(e.target);
   }
   else if(e.target.id === "post-title" || e.target.id === "post-body"){
    showPostComment(e.target);
   }
}
function home(){
    render(allPost,1);
}
function requestAction(){
    const clickPost = document.getElementById("post");
    const showFavoriteBtn = document.getElementById("show-btn");
    const homeBtn = document.getElementById("home-btn");

    clickPost.addEventListener("click", processAction);
    showFavoriteBtn.addEventListener("click", showFavorite);
    homeBtn.addEventListener("click", home);
}

requestAction();