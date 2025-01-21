//GLOBAL VARIABLE DECLARATIONS

//bucket list and id
let bucketList=[];
let id=0;

//global DOM-object declarations
const activityName=document.getElementById("activityName");
const activityCategory=document.getElementById("activityCategory");
const bucketForm=document.getElementById("bucketForm");
const utskrift=document.getElementById("utskrift");
const addButton=document.getElementById("add");

//GLOBAL EVENT LISTENERS

//add button
bucketForm.addEventListener('submit', (event) => {
    //prevent refresh
    event.preventDefault();

    //create new list item and sort bucketList
    createListItem(activityCategory.value, activityName.value);
    sortBucketList();

    //reset form
    activityName.value="";
    activityCategory[0].selected=true;

    //redraw bucketlist
    writeList();
});

//GLOBAL FUNCTIONS

//display bucket list in HTML-document
function writeList(){
    //reset display element
    utElements=utskrift.querySelectorAll("*");
    utElements.forEach((element) => {
        element.remove();
    });

    //add elements to display elements
    let kategori="";
    bucketList.forEach((element) => {
        if(element.category!=kategori){
            kategori=element.category;
            let rubrik=document.createElement('h2');
            rubrik.innerHTML=element.category;
            utskrift.appendChild(rubrik);
        }
        utskrift.appendChild(element.htmlContainer);
        let span1=document.createElement('span');
        span1.innerHTML=element.name+" | ";
        element.htmlContainer.appendChild(span1);
        element.isDone.setAttribute('id', `${element.id}isDone`);
        element.isDone.setAttribute('type', 'checkbox');
        element.doneLabel.setAttribute('for', `${element.id}isDone`);
        element.doneLabel.innerHTML="Klar?";
        element.htmlContainer.appendChild(element.doneLabel);
        element.htmlContainer.appendChild(element.isDone);
        element.deleteButton.innerHTML="Ta Bort";
        element.htmlContainer.appendChild(element.deleteButton);
    });
}

//create new list item and add it to bucket list
function createListItem(aCat, aName){
    let listItem = {
        id: ++id,
        category: aCat,
        name: aName,
        htmlContainer: document.createElement('div'),
        deleteButton: document.createElement('button'),
        doneLabel: document.createElement('label'),
        isDone: document.createElement('input')
    };

    listItem.deleteButton.setAttribute('class', `${listItem.id}`);

    listItem.deleteButton.addEventListener('click', (event) => {
        let parentListItem=bucketList.find((element) => 
            element.id == event.target.getAttribute('class')
        );
        bucketList.splice(bucketList.indexOf(parentListItem), 1);
        sortBucketList();
        toLocalStorage();
        writeList();
    });

    bucketList.push(listItem);
    toLocalStorage();
}

//sort bucket list
function sortBucketList(){
    //sort bucketlist by category
    bucketList.sort((a,b)=>{
        if (a.category === b.category){
            if(a.name.toUpperCase() < b.name.toUpperCase()) return -1;
            else return 0;
        }
        else if(a.category < b.category) return -1;
    });    
}

//save bucket list to local storage
function toLocalStorage(){
    sortBucketList();
    let localBucketList=[];
    for(li of bucketList){
        localBucketList.push({category: li.category, name: li.name});
    }
    localStorage.setItem("bucketList", JSON.stringify(localBucketList));
}

//load bucket list from local storage
function fromLocalStorage(){
    let localBucketList=JSON.parse(localStorage.getItem("bucketList"));
    for(li of localBucketList){
        createListItem(li.category, li.name);
    }
}

//initialize bucket list
function init(){
    let bucketListFromStorage=localStorage.getItem("bucketList");
    if(!bucketListFromStorage || JSON.parse(bucketListFromStorage).length===0){
         //debug list fill
        createListItem(activityCategory[0].value, "Japan");
        createListItem(activityCategory[1].value, "Fallskärmshoppning");
        createListItem(activityCategory[2].value, "Latin");
        createListItem(activityCategory[3].value, "Judo");
        createListItem(activityCategory[0].value, "Chad");
        createListItem(activityCategory[1].value, "Klättra upp för mt. everest");
        createListItem(activityCategory[2].value, "Assembler");
        createListItem(activityCategory[3].value, "Knyppling");
        sortBucketList();
        toLocalStorage();
    }
    else{
       fromLocalStorage();
    }
    writeList();
}

//INTIIALIZE BUCKET LIST
init();