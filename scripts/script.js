//GLOBAL VARIABLE DECLARATIONS

//bucket list and id
let bucketList=[];
let id=0;
let editableElement=null;

//global DOM-object declarations
const activityName=document.getElementById("activityName");
const activityCategory=document.getElementById("activityCategory");
const bucketForm=document.getElementById("bucketForm");
const utskrift=document.getElementById("utskrift");
const addButton=document.getElementById("add");
const editName=document.createElement('input');
const editCategory=activityCategory.cloneNode(true);
const editDone=document.createElement('input');
const confirmButton=document.createElement('button');
const cancelButton=document.createElement('button');

//global DOM-object attribute initializations
confirmButton.innerHTML="Spara";
cancelButton.innerHTML="Avbryt";
editDone.setAttribute('type','checkbox');

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

//event listener for edit category dropdown menu
editCategory.addEventListener('change',(event) => {
    editableElement.category=editCategory.value;
});

//event listener for save button
confirmButton.addEventListener('click', () => {
    editableElement.name=editName.value;
    editableElement.category=editCategory.value;
    editableElement.isDone.checked=editDone.checked;
    deactivateEditMode();
    sortBucketList();
    toLocalStorage();
    writeList();
});

//event listener for cancel button
cancelButton.addEventListener('click', () => deactivateEditMode());

//GLOBAL FUNCTIONS

//display bucket list in HTML-document
function writeList(){
    //reset display element
    deactivateEditMode();
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
        element.nameSpan.innerHTML=element.name+" | ";
        element.htmlContainer.appendChild(element.nameSpan);
        element.isDone.setAttribute('id', `${element.id}isDone`);
        element.doneLabel.setAttribute('for', `${element.id}isDone`);
        element.doneLabel.innerHTML="Klar?";
        element.htmlContainer.appendChild(element.doneLabel);
        element.htmlContainer.appendChild(element.isDone);
        element.editButton.innerHTML="Ändra";
        element.deleteButton.innerHTML="Ta Bort";
        element.htmlContainer.appendChild(element.deleteButton);
        element.htmlContainer.appendChild(element.editButton);
    });
}

//create new list item and add it to bucket list
function createListItem(aCat, aName, iDone=false){
    let listItem = {
        id: ++id,
        category: aCat,
        name: aName,
        htmlContainer: document.createElement('div'),
        nameSpan: document.createElement('span'),
        deleteButton: document.createElement('button'),
        editButton: document.createElement('button'),
        doneLabel: document.createElement('label'),
        isDone: document.createElement('input')
    };

    //add list item wide identifiers
    listItem.deleteButton.setAttribute('class', `${listItem.id}`);
    listItem.editButton.setAttribute('class', `${listItem.id}`);
    listItem.isDone.setAttribute('class', `${listItem.id}`);

    //set list item attributes
    listItem.isDone.setAttribute('type', 'checkbox');
    listItem.isDone.checked=iDone;

    //event listener for delete button
    listItem.deleteButton.addEventListener('click', (event) => {
        let parentListItem=bucketList.find((element) => 
            element.id == event.target.getAttribute('class')
        );
        bucketList.splice(bucketList.indexOf(parentListItem), 1);
        sortBucketList();
        toLocalStorage();
        writeList();
    });

    //event listener for edit button
    listItem.editButton.addEventListener('click', (event) => {
        editableElement=bucketList.find( (li) => event.target.getAttribute("class") == li.id);
        activatEditMode();
    });

    //event listener for "is done" checkbox 
    listItem.isDone.addEventListener('change', (event) =>{
        if(editableElement===null){
            if(event.target.checked){
                event.target.disabled=true;
            }
        }
        else if(event.target.getAttribute("class")===`${editableElement.id}`){
            event.target.disabled=false;
        }
        else if(event.target.checked){
            event.target.disabled=true;
        }
        toLocalStorage()
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
        localBucketList.push({category: li.category, name: li.name, isDone: li.isDone.checked});
    }
    localStorage.setItem("bucketList", JSON.stringify(localBucketList));
}

//load bucket list from local storage
function fromLocalStorage(){
    let localBucketList=JSON.parse(localStorage.getItem("bucketList"));
    for(li of localBucketList){
        createListItem(li.category, li.name, li.isDone);
    }
}

//activate edit mode for selected element
function activatEditMode(){
    let editEl=editableElement;
    deactivateEditMode();
    editableElement=editEl;
    editEl.htmlContainer.setAttribute("style", "background-color:red;");
    editEl.isDone.disabled=false;
    editableElement.deleteButton.setAttribute('style','display:none;');
    editableElement.editButton.setAttribute('style', 'display:none;');
    editableElement.nameSpan.setAttribute('style', 'display:none;');
    editableElement.isDone.setAttribute('style', 'display:none;');
    editName.value=editableElement.name;
    for(category of editCategory){if(category.value===editableElement.category)category.selected=true;}
    editableElement.htmlContainer.prepend(editCategory);
    editableElement.htmlContainer.prepend(editName);
    editDone.checked=editableElement.isDone.checked;
    editableElement.htmlContainer.appendChild(editDone);  
    editableElement.htmlContainer.appendChild(confirmButton);
    editableElement.htmlContainer.appendChild(cancelButton);
}

//deactivate edit mode for all elements
function deactivateEditMode(){
    bucketList.forEach((element) => {if(element!=editableElement && element.isDone.checked) element.isDone.disabled=true;})
    editCategory.remove();
    editName.remove();
    confirmButton.remove();
    cancelButton.remove();
    editDone.remove();
    editableElement=null;
    bucketList.forEach((element) => {
        element.htmlContainer.setAttribute("style", "");
        element.deleteButton.setAttribute('style', "");
        element.editButton.setAttribute('style', "");
        element.nameSpan.setAttribute('style', "");
        element.isDone.setAttribute('style', "");
    });
}

//initialize bucket list
function init(){
    //debug placeholder list fill if bucket list in local storage is empty or nonexistent
    let bucketListFromStorage=localStorage.getItem("bucketList");
    if(!bucketListFromStorage || JSON.parse(bucketListFromStorage).length===0){
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
       //generate bucketList from locally stored bucket list
       fromLocalStorage();
    }
    writeList();
}

//INTIIALIZE BUCKET LIST
init();