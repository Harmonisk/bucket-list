//List item collection declarations
let bucketList=[];
let id=0;

//DOM-object declarations
const activityName=document.getElementById("activityName");
const activityCategory=document.getElementById("activityCategory");
const bucketForm=document.getElementById("bucketForm");
const utskrift=document.getElementById("utskrift");
const removeButton=document.getElementById("remove");
const addButton=document.getElementById("add");

//debug list fill
bucketList.push(createListItem(activityCategory[0].value, "Japan"));
bucketList.push(createListItem(activityCategory[1].value, "Fallskärmshoppning"));
bucketList.push(createListItem(activityCategory[2].value, "Latin"));
bucketList.push(createListItem(activityCategory[3].value, "Judo"));
bucketList.push(createListItem(activityCategory[0].value, "Chad"));
bucketList.push(createListItem(activityCategory[1].value, "Klättra upp för mt. everest"));
bucketList.push(createListItem(activityCategory[2].value, "Assembler"));
bucketList.push(createListItem(activityCategory[3].value, "Knyppling"));
sortBucketList();


//Inital list paint
writeList();

//Event Listeners
//remove button
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
});
//add button
bucketForm.addEventListener('submit', (event) => {
    //prevent refresh
    event.preventDefault();

    //create new list item
    let listItem=createListItem(activityCategory.value, activityName.value);

    //add list item and sort bucketList
    bucketList.push(listItem);
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

    //Skriv ut element
    bucketList.forEach((element) => {
        utskrift.appendChild(element.htmlContainer);
        let p1=document.createElement('p');
        p1.innerHTML=element.name+" "+element.category;
        element.htmlContainer.appendChild(p1);
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
    return {
        id: ++id,
        category: aCat,
        name: aName,
        htmlContainer: document.createElement('div'),
        flaggedLabel: document.createElement('label'),
        isFlaggedForDeletion: document.createElement('input'),
        doneLabel: document.createElement('label'),
        isDone: document.createElement('input')
    };
}

function sortBucketList(){
    //sort bucketlist
    bucketList.sort((a,b)=>{
        if (a.category < b.category) return -1;
        //else if(a.category > b.category /*|| a.name>b.name*/) return 1;
        else return 0;
    });    
}

