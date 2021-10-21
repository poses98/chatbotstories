export const onSnapshot = (ref, callback, options) => {
  ref.onSnapshot((snapshot) => {
    let items = snapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    items = options && options.sort ? items.sort(options.sort) : items;

    callback(items);
  });
};

export const addDoc = (ref, { id, ...data }) => {
  const doc = id ? ref.doc(id) : ref.doc();
  doc.set(data).then(() => {
    console.log("Add new item");
  });
};

export const removeDoc = (ref, id) => {
  ref
    .doc(id)
    .delete()
    .then(() => {
      console.log(`Removed item: ${id}`);
    });
};

export const updateDoc = (ref, id, data) => {
  ref
    .doc(id)
    .set(data)
    .then(() => {
      console.log(`Updated item: ${id}`);
    });
};

export const availableUsername = (ref, id, data) => {
  ref
    .doc(data.username)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data());
        if (doc.data().uid === id) {
          return true;
        } else {
          return false;
        }
      } else {
        console.log("No such document!");
        return true;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
};

