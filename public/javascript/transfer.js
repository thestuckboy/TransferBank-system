const addButton = document.getElementById('addButton');
const addData = document.getElementById('addData');
const transferData = document.querySelector('.transfer-data');
const notContact = document.querySelector('.not-contact');
const contacts = document.querySelector('.contacts');
const searchButton = document.getElementById('searchButton');
const transferButton = document.getElementById('transferButton');
const keyInput = document.getElementById('keyInput');
const transferToKey = document.getElementById('transferToKey');

const transferMessage = document.getElementById('transferMessage');
const contactsMessage = document.getElementById('contactsMessage');

const select = document.getElementById('select');
const amountField = document.getElementById('amountField');
const searchContacts = document.getElementById('searchContacts');
const operationResultMessage = document.getElementById('operationResultMessage');

addButton.addEventListener('click', ()=>{
    let addDataDFlex = addData.style.display == 'flex';
    if(!addDataDFlex){
        addData.style.display = 'flex';
        notContact.style.display = 'none';
        contacts.style.display = 'none';
    }
});

searchButton.addEventListener('click', ()=>{
    let bankKey = keyInput.value;
    let request = fetch('http://localhost:3000/search', {
        body: `bankKey=${bankKey}`,
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    });

    request
    .then(res => res.json())
    .then(response => {
        if (response == '0'){
            transferMessage.innerText = `The contact is already saved`;
            setTimeout(()=>{
                location.reload()
            }, 3000);
        } else if (response == '1'){
            transferMessage.innerText = `Contact saved, reloading...`;
            setTimeout(()=>{
                location.reload()
            }, 3000);
        } else {
            transferMessage.innerText = 'User not found';
        }
    });

    // 0 stands for: the contact it's already on user's contacts array
    // 1 stands for: user saved correctly
    // 2 stands for: user with that key not found
});

searchContacts.addEventListener('click', ()=>{
    let request = fetch('http://localhost:3000/confirm', {
        body: `fullname=${select.value}`,
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    });

    request
    .then(res => res.json())
    .then(response => {
        if (response == '2'){
            contactsMessage.innerText = "An unexpected error ocurred, try to remove an add again the contact";
        }else {
            transferToKey.value = response.bankKey;
            transferData.style.display = 'flex';
        }
    });
});

transferButton.addEventListener('click', ()=>{
    let request = fetch('http://localhost:3000/transfer', {
        body: `target=${transferToKey.value}&amount=${amountField.value}`,
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    });

    request
    .then(res => res.json())
    .then(response => {
        if(response == "1"){
            operationResultMessage.innerText = "Successful operation."
            setTimeout(()=>{
                window.location.replace('/dashboard');
            }, 3000)
        }else {
            operationResultMessage.innerText = "Not enough money";
        }
    });
});