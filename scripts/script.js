//List item collection declarations
let bucketList=[];
//console.log(bucketList);
let id=0;
fromLocalStorage();

//DOM-object declarations
const activityName=document.getElementById("activityName");
const activityCategory=document.getElementById("activityCategory");
const bucketForm=document.getElementById("bucketForm");
const utskrift=document.getElementById("utskrift");
const addButton=document.getElementById("add");

//debug list fill
/*
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
*/

//local storage
//localStorage.setItem("bucketList", JSON.stringify(bucketList));

//Inital list paint
writeList();

//Event Listeners

/*//remove button
removeButton.addEventListener('click', (event) =>{
    let itemsToDelete=[];
    for(li of bucketList){
        if(li.isFlaggedForDeletion){
            itemsToDelete.add(li);
        }
    }
    for(li of itemsToDelete){
        bucketList.remove(li);
    }
});*/


//add button
bucketForm.addEventListener('submit', (event) => {
    //prevent refresh
    event.preventDefault();

    //create new list item
    createListItem(activityCategory.value, activityName.value);

    //add list item and sort bucketList
    //bucketList.push(listItem);
    sortBucketList();

    //reset form
    activityName.value="";
    activityCategory[0].selected=true;

    //redraw bucketlist
    writeList();

    /*
    //add eventlisteners for isDone and isFlaggedForDeletion
    //console.log(document.getElementById(`${id}`));
    let idString=`${id}`;
    let idNum=id;
    document.getElementById(`${idString}isFlaggedForDeletion`).addEventListener('change', (event) => {
        if(event.target.checked){
            bucketList.filter((li) => {li.id==idNum}).isFlaggedForDeletion=true;
        }
        else{
            bucketList.filter((li) => {li.id==idNum}).isFlaggedForDeletion=false;
        }
    });
    */
    
});

function writeList(){
    //nollställ utskrift
    utElements=utskrift.querySelectorAll("*");
    console.log(utElements);
    utElements.forEach((element) => {
        element.remove();
    });

    /*//skapa kategorirubriker
    let resRubrik=document.createElement('h2');
    resRubrik.innerHTML="Resor";
    let ävRubrik=document.createElement('h2');
    ävRubrik.innerHTML="Äventyr";
    let lärRubrik=document.createElement('h2');
    rlärRubrik.innerHTML="Lärande";
    let hobbyRubrik=document.createElement('h2');
    hobbyRubrik.innerHTML="Resor";
    */

    //Skriv ut element
    let kategori="";
    bucketList.forEach((element) => {
        if(element.category!=kategori){
            console.log("hej");
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
        //let deleteButton=document.createElement('button');
        element.deleteButton.innerHTML="Ta Bort";
        element.htmlContainer.appendChild(element.deleteButton);
    });


    /*
    //iterera genom bucketList och skriv ut varje objekt via ett divelement
    for(li of bucketList){
        utskrift.innerHTML+=`
        <div id="${li.id}div">
            <span>[ Category: ${li.category} | Name: ${li.name}</span>
            <label for="${li.id}done"> | Klar?: </label>
            <input type="checkbox" id="${li.id}isDone">
            <label for="${li.id}isFlaggedForDeletion" > | ta bort: </label>
            <input type="checkbox" id="${li.id}isFlaggedForDeletion" class="${li.id}">
            <span> ]</span>
        </div>`;
    }
    */
}

function createListItem(aCat, aName){
    let listItem = {
        id: ++id,
        category: aCat,
        name: aName,
        htmlContainer: document.createElement('div'),
        //flaggedLabel: document.createElement('label'),
        //isFlaggedForDeletion: document.createElement('input'),
        deleteButton: document.createElement('button'),
        doneLabel: document.createElement('label'),
        isDone: document.createElement('input')
    };

    listItem.deleteButton.setAttribute('class', `${listItem.id}`);

    listItem.deleteButton.addEventListener('click', (event) => {
        //bucketList.pop(event.target.parentNode.parentNode);
        //console.log(event.target.parentNode.parentNode);
        //console.log(bucketList.indexOf(event.target.parentNode.parentNode));
        //console.log(event.target.getAttribute('class'));
        //console.log(`${bucketList[0].id}`);
        //console.log(`${bucketList[0].id}` === event.target.getAttribute('class'));
        let parentListItem=bucketList.find((element) => 
            element.id == event.target.getAttribute('class')
        );
        console.log(parentListItem);
        bucketList.splice(bucketList.indexOf(parentListItem), 1);
        //event.target.parentNode.remove();
        sortBucketList();
        toLocalStorage();
        writeList();
    });

    bucketList.push(listItem);
    toLocalStorage();
}

function sortBucketList(){
    //sort bucketlist
    bucketList.sort((a,b)=>{
        if (a.category < b.category) return -1;
        //else if(a.category > b.category /*|| a.name>b.name*/) return 1;
        else return 0;
    });    
}

function toLocalStorage(){
    sortBucketList();
    let localBucketList=[];
    for(li of bucketList){
        localBucketList.push({category: li.category, name: li.name});
    }
    localStorage.setItem("bucketList", JSON.stringify(localBucketList));
}

function fromLocalStorage(){
    let localBucketList=JSON.parse(localStorage.getItem("bucketList"));
    console.log(localBucketList);
    for(li of localBucketList){
        console.log("create");
        createListItem(li.category, li.name);
    }
}
