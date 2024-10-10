let firebaseConfig = {
    apiKey: "AIzaSyAUvIKU2cDhCNJjoBDuofvzliZOz0IpcjA",
    authDomain: "demoweb-9bffc.firebaseapp.com",
    projectId: "demoweb-9bffc",
    storageBucket: "demoweb-9bffc.appspot.com",
    messagingSenderId: "871348645073",
    appId: "1:871348645073:web:f31a8a47cdd694c97f69f0"//objeto de configuración de Firebase
  };
  
  firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase
  
  const db = firebase.firestore();// db representa mi BBDD //inicia Firestore
  
  
  //PINTAR EN EL DOM 
  const printPhoto = (nombre, email, comentario, imagen, docId) => {
    let card = document.createElement('article');
    card.setAttribute('class', 'card');
  
    let nameElement = document.createElement('h3');
    nameElement.textContent = `Nombre: ${nombre}`;
  
    let emailElement = document.createElement('p');
    emailElement.textContent = `Email: ${email}`;
  
    let comentarioElement = document.createElement('p');
    comentarioElement.textContent = `Comentario: ${comentario}`;
  
    let imagenElement = document.createElement('img');
    imagenElement.setAttribute('src', imagen);
    imagenElement.setAttribute('style', 'max-width:250px');
  
    let idElement = document.createElement('p');
    idElement.textContent = `ID: ${docId}`;


     // Crear icono de papelera
     let deleteIcon = document.createElement("span");
     deleteIcon.textContent = "✏️";
     deleteIcon.style.cursor = "pointer";
     deleteIcon.style.marginLeft = "30px";
     deleteIcon.addEventListener('click', () => {
        let confirmDelete = window.confirm(`¿Deseas borrar el contacto ${nombre} con el email ${email}?`);
        if (confirmDelete) {
            deleteUsuario(docId); // Si se acepta, se elimina el contacto
        }
    });
  
    const album = document.getElementById('usuarios');
    card.appendChild(nameElement);
    card.appendChild(emailElement);
    card.appendChild(comentarioElement);
    card.appendChild(imagenElement);
    card.appendChild(idElement);
    card.appendChild(deleteIcon);
    album.appendChild(card);
  };
  

  //Create
  const createUsuario = (datosUsuario) => {
    db.collection("usuarios")
      .add(datosUsuario)
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id); // Cambiado a docRef.id
          cleanForm(); // Limpiar formulario después de crear usuario
          // Llamar a readAll para actualizar la vista
          readAll();
      })
      .catch((error) => console.error("Error adding document: ", error));
};

  //Read all
  const readAll = () => {
    // Limpia el album para mostrar el resultado
    cleanUsuarios();
  
    //Petición a Firestore para leer todos los documentos de la colección album
    db.collection("usuarios")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.imagen) { // Verifica que 'imagen' no esté vacía
          printPhoto(
            data.nombre, 
            data.email,
            data.comentario,
            data.imagen,
            doc.id
          );
        } else {
          console.error("La URL de la imagen es inválida:", data.imagen);
        }
      });
    })
    .catch(() => console.log('Error reading documents'));
  
  };
  
  //Eliminar un usuario específico papelera
 const deleteUsuario = (docId) => {
    db.collection('usuarios').doc(docId).delete().then(() => {
      alert(`Documento ${docId} ha sido borrado`);
      //Clean
      cleanUsuarios();
      //Read all again
      readAll();
    })
      .catch(() => console.log('Error borrando documento'));
  };
   
  
  //Eliminar todos los usuarios
  const deleteAllUsuarios = () => {
    db.collection("usuarios")
      .get()
      .then((querySnapshot) => {
        const batch = db.batch(); // Usa batch para eliminar varios documentos
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref); // Elimina cada documento
        });
        return batch.commit(); // Realiza la eliminación
      })
      .then(() => {
        console.log("Todos los usuarios han sido eliminados.");
        cleanUsuarios(); // Limpia el DOM
        alert("Todos los usuarios han sido eliminados."); // Notifica al usuario
      })
      .catch((error) => console.error("Error deleting documents: ", error));
  };
  


  const cleanForm = () => {
    document.getElementById("nombre").value = '';
    document.getElementById("email").value = '';
    document.getElementById("comentario").value = '';
    document.getElementById("imagen").value = '';
};

const cleanUsuarios = () => {
    document.getElementById("usuarios").innerHTML = ''; // Limpia el contenedor de usuarios
};


// Boton de crear usuario
document.getElementById("create").addEventListener("click", () => {
    cleanForm(); // Limpia el formulario antes de mostrarlo
    
});
  
  //**********EVENTS**********
  //Create
  document.getElementById("btn_enviar").addEventListener("click", (event) => {
  
    event.preventDefault(); // paraliza envío formulario
  
      let dgetBId_nombre = document.getElementById("nombre");
      let dgetBId_email = document.getElementById("email");
      let dgetBId_comentario = document.getElementById("comentario");
      let dgetBId_imagen = document.getElementById("imagen");
  
      let nombre = dgetBId_nombre.value;
      let email = dgetBId_email.value;
      let comentario = dgetBId_comentario.value;
      let imagen = dgetBId_imagen.value;
  
      // Debemos validar el formulario!
      const emailPattern = /^[a-zA-Z0-9]{2,}@[a-zA-Z]{3,}\.(?:[a-zA-Z]{2,4})$/;
      // Si el correo electrónico cumple con el patrón
      if (!emailPattern.test(email)) {
        alert("Correo electrónico no válido.");
        return; // Detiene la ejecución si el email no es válido
    }
  
      createUsuario({
          nombre,
          email,
          comentario,
          imagen
      });
  });
  


  
  
  //Read all
  document.getElementById("read-all").addEventListener("click", () => {
    readAll();
  });
  
  //Read one
  document.getElementById('read-one').addEventListener("click", () => {
    const id = prompt("Introduce el id a buscar");
    readOne(id);
  });
  
  //Eliminar todo 
  document.getElementById('delete-all').addEventListener('click', () => {
    if (confirm("¿Estás seguro de que deseas eliminar todos los usuarios?")) {
    deleteAllUsuarios();
  
  }});
  

  //********FIRESTORE USERS COLLECTION******
  
  const createUser = (user) => {
    db.collection("usuarios")
      .add(user)
      .then((docRef) => console.log("Document written with ID: ", docRef.id))
      .catch((error) => console.error("Error adding document: ", error));
  };
  
  // Read ONE
  
  // Ajustar la función readOne
function readOne(id) {
    // Limpia el album para mostrar el resultado
    cleanUsuarios();

    //Petición a Firestore para leer un documento de la colección album 
    var docRef = db.collection("usuarios").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            printPhoto(doc.data().nombre, doc.data().email, doc.data().comentario, doc.data().imagen, doc.id);
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
