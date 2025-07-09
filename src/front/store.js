
export const initialStore = () => ({
  message: null,
  user: JSON.parse(localStorage.getItem("user-profile")) || null,
  projects: [],
  todos: [
    { id: 1, title: "Make the bed", background: null },
    { id: 2, title: "Do my homework", background: null }
  ]
});


export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };

    case "add_task": {
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map(t =>
          t.id === id ? { ...t, background: color } : t
        )
      };
    }

    case "set_user":
      return { ...store, user: action.payload };

    case "add_project":
      return { ...store, projects: [...store.projects, action.payload] };

    case "set_projects":
      return { ...store, projects: action.payload };

    default:
      throw Error("Unknown action.");
  }
}

/*───────────────────────────────────────────────────────────
  Helpers de API
───────────────────────────────────────────────────────────*/

// Registro de usuario
export const register = async (email, password, username) => {
  const res = await fetch("http://127.0.0.1:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username })
  });
  const data = await res.json();
  if (res.ok) {
    alert("Usuario registrado correctamente");
  } else {
    alert(data.msg || "Error al registrar usuario");
  }
};

export const login = async (email, password) => {
  const res = await fetch("http://127.0.0.1:5000/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Login fallido: " + errorText);
  }

  const data = await res.json();
  localStorage.setItem("jwt-token", data.token);
  return data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("jwt-token");
  const res = await fetch("http://127.0.0.1:5000/api/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ PROFILE ERROR TEXT:", errorText);
    throw new Error("Acceso denegado");
  }

  const data = await res.json();
  return data;
};

// Crear proyecto nuevo
export const createProject = async (formData, user) => {
  const token = localStorage.getItem("jwt-token");
  console.log("🔑 TOKEN:", token);

  const payload = {
    ...formData,
    owner_id: user.id,
    is_accepting_applications: true,
  };

  const res = await fetch("http://127.0.0.1:5000/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.msg || "Error al crear proyecto");
  }

  const data = await res.json();
  return data;
};


