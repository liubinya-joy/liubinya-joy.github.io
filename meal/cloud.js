import { firebaseConfig } from "./firebase-config.js";
import { locale } from "./copy.js?v=mediterranean-1";

export const isConfigured = ["apiKey", "authDomain", "projectId", "appId"]
  .every(key => typeof firebaseConfig?.[key] === "string" && firebaseConfig[key]);

let connection;

async function connect() {
  if (!isConfigured) throw new Error("Firebase is not configured");
  if (connection) return connection;
  const pending = Promise.all([
    import("https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js"),
  ]).then(async ([firebase, authApi, dbApi]) => {
    const app = firebase.initializeApp(firebaseConfig);
    const auth = authApi.getAuth(app);
    await auth.authStateReady();
    return { auth, authApi, db: dbApi.getFirestore(app), dbApi };
  });
  connection = pending;
  pending.catch(() => { if (connection === pending) connection = undefined; });
  return pending;
}

export async function prepareAccount() {
  return (await connect()).auth.currentUser;
}

export async function signIn() {
  const { auth, authApi } = await connect();
  if (auth.currentUser) return auth.currentUser;
  auth.languageCode = { en: "en", zh: "zh-CN", yue: "zh-HK" }[locale];
  const provider = new authApi.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return (await authApi.signInWithPopup(auth, provider)).user;
}

export async function saveMeal(id, meal) {
  const { auth, db, dbApi } = await connect();
  if (!auth.currentUser) throw new Error("Sign-in required");
  await dbApi.setDoc(dbApi.doc(db, "users", auth.currentUser.uid, "meals", id), {
    title: meal.title,
    style: meal.style,
    items: meal.items.map(item => item.name),
    method: meal.method,
    savedAt: dbApi.serverTimestamp(),
  });
}

export async function getMeals() {
  const { auth, db, dbApi } = await connect();
  if (!auth.currentUser) throw new Error("Sign-in required");
  const list = dbApi.collection(db, "users", auth.currentUser.uid, "meals");
  const query = dbApi.query(list, dbApi.orderBy("savedAt", "desc"), dbApi.limit(40));
  return (await dbApi.getDocs(query)).docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function removeMeal(id) {
  const { auth, db, dbApi } = await connect();
  if (!auth.currentUser) throw new Error("Sign-in required");
  await dbApi.deleteDoc(dbApi.doc(db, "users", auth.currentUser.uid, "meals", id));
}

export async function signOut() {
  const { auth, authApi } = await connect();
  await authApi.signOut(auth);
}
