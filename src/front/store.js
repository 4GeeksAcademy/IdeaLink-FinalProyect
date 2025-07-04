export const initialStore=()=>{
  return{
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    default:
      throw Error('Unknown action.');
  }    
}

export const register = async (email,password) => {
  const res = await fetch("http://127.0.0.1:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({email, password})
  })
  const data = await res.json();
  if (response.ok) {
      alert('Usuario registrado correctamente');
      
    } else {
      alert(data.msg || 'Error al registrar usuario');
    }
  }



export const login = async (email,password) => {
  const res = await fetch("http://127.0.0.1:5000/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  if(!res.ok) throw new Error("Login fallido");

  const data = await res.json();
  localStorage.setItem("jwt-token", data.token);
  return data
};



export const getProfile = async () => {
  const token = localStorage.getItem('jwt-token');

  const res = await fetch("https://potential-chainsaw-97j7q96jxvv4cxx6v-3001.app.github.dev/api/profile", {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
        credentials: "include"

  });

  if(!res.ok) throw new Error('Acceso denegado');

  const data = await res.json();
  return data;
};


 