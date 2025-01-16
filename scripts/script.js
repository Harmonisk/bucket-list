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
addButton.addEventListener('click', (event) => {
    //prevent refresh
    event.preventDefault();

    //create new list item
    let listItem={
        id: ++id,
        category: activityCategory.value,
        name: activityName.value,
        isFlaggedForDeletion: false,
        isDone: false
    };

    //reset form
    activityName.value="";
    activityCategory[0].selected=true;

    //add object to bucketlist
    bucketList.push(listItem);

    //sort bucketlist
    bucketList.sort((a,b)=>{
        if (a.category < b.category) return -1;
        else if(a.category > b.category) return 1;
        else return 0;
    });

    //redraw bucketlist
    writeList();

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
    
});

function writeList(){
    //nollställ utskrift
    utskrift.innerHTML="";

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
}

