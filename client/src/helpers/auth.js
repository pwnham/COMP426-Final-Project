import { auth, db } from "../services/firebase";

export async function signup(name, email, password, groupName, isCreateGroup) {
  const credential = await auth().createUserWithEmailAndPassword(
    email,
    password
  );
  console.log(credential.user);
  if (isCreateGroup) {
    db.ref("/groups/" + groupName).set({
      members: [{ name: name, uid: credential.user.uid }],
    });
  } else {
    const members = await db
      .ref("/groups/" + groupName)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        const res = [];
        for (var i = 0; i < data.members.length; i++) {
          res.push(data.members[i]);
        }
        return res;
      });
    members.push({ name: name, uid: credential.user.uid });
    db.ref("groups/" + groupName).update({
      members: members,
    });
  }
}

export function signin(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function signInWithGoogle() {
  const provider = new auth.GoogleAuthProvider();
  return auth().signInWithPopup(provider);
}

export function signout() {
  return auth().signOut();
}
