const form = document.querySelector('#add-cafe-form')


const cafeList = document.querySelector('#cafe-list')

//create element and render elements 

function renderCafe(doc) {
    let li = document.createElement('li')
    let name = document.createElement('span')
    let city = document.createElement('span')
    let cross = document.createElement('div')

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name
    city.textContent = doc.data().city
    cross.textContent = 'x'

    li.appendChild(name)
    li.appendChild(city)
    li.appendChild(cross)

    cafeList.appendChild(li)

    //deleting data from firestore
    cross.addEventListener('click', (e) => {
        e.stopPropagation()
        // getting id to for quering
        let id = e.target.parentElement.getAttribute('data-id')

        db.collection('cafes').doc(id).delete()

    })

}

//real time listener

db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges()
    changes.forEach(change => {
        // change.doc.data()
        if (change.type == 'added') {
            renderCafe(change.doc)
        } else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']')
            cafeList.removeChild(li)
        }
    })
})

// updating data using update
// db.collection('cafes').doc()(to grab the element we want to change).update({name:'warrr\ kam'}) 
// db.collection('cafes').doc()(to grab the element we want to change).update({city:'sfwarrr\ kam'}) 

// updating data using set it completly override
// db.collection('cafes').doc()(to grab the element we want to change).set({name:'warrr\ kam'}) (city will be provided empty string) 

// getting data from cloud

//query
// db.collection('cafes').where('city', '==', 'clover kingdom').get().then((snapshot) => {

//orderby field alphabetically lowes case has lower precedence
// db.collection('cafes').orderBy('name').get().then((snapshot) => {

// mix of order and where
// db.collection('cafes').where('city', '==', 'clover kingdom').orderBy('name').get().then((snapshot) => {



//its not real time

//     db.collection('cafes').get().then((snapshot) => {
//     console.log(snapshot.docs)
//     snapshot.docs.forEach(doc => {
//         // console.log(doc)
//         // console.log(doc.data())
//         renderCafe(doc)
//     });
// })


//saving data to cloud
form.addEventListener('submit', (e) => {
    e.preventDefault()
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    })
    form.name.value = ""
    form.city.value = ""
})