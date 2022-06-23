const toggleBtn = document.querySelector('#toggleBtn');
const divList = document.querySelector('.listHolder');


const addInput= document.querySelector('#addInput');
const addBtn=document.querySelector('#addBtn');


function addLists(){
    
    if(addInput.value=== ''){
        // alert('Enter the list name please');
    }   else{
        const ul= divList.querySelector('ul');
        const li = document.createElement('li');
        li.innerHTML= addInput.value;
        addInput.value="";
        ul.appendChild(li);
        createBtn(li);
    }
};

addBtn.addEventListener('click',()=>{
    addLists();

});


addInput.addEventListener('keyup',(event)=>{
    if(event.which === 13){
        addLists();
    }
})




// create action buttons
const listUl=document.querySelector('.list');
const lis = listUl.children;


function createBtn(li){
    const remove = document.createElement('button');
    remove.className = 'btn-icon remove';
    li.appendChild(remove);

    return li;
}

for(var i = 0; i< lis.length; i++){
    createBtn(lis[i]);
}

// making the buttons work
divList.addEventListener('click',(event)=>{
    if(event.target.tagName ==='BUTTON'){
        const button = event.target;
        const li = button.parentNode;
        const ul = li.parentNode;

        if(button.className === 'btn-icon remove'){
            ul.removeChild(li);       
        }
    }
});