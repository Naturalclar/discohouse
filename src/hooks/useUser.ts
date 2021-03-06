import { useEffect, useState } from "preact/hooks";

import Avater from "../assets/avatar.png";
import { FIRESTORE_KEY } from "../const/firestore-key";
import { db } from "../infra/firebase";
import { FirestoreInvitationField, FirestoreUserField } from "../type/api";
import { Invitor, User } from "../type/user";

export const useUser = (uid?: string) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [invitor, setInvitor] = useState<Invitor | undefined>(undefined);
  const [invited, setInvited] = useState<Invitor[]>([]); // 自分が招待した人
  const [error, setError] = useState("");

  // user情報の取得
  useEffect(() => {
    if (uid === undefined) return;
    db.collection(FIRESTORE_KEY.USERS)
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data: FirestoreUserField = doc.data() as any; // TODO: validation
          setUser({
            name: data.name || "undefined",
            image: data.image || Avater,
            invitation: data.invitation,
            invitationKey: data.invitationKey,
            id: doc.id,
          });
        } else {
          console.log("No such document!");
          setError(
            "該当するユーザーが見つかりません。お手数ですがリロードして下さい。"
          );
        }
      });
  }, [uid]);

  // 自分が招待した人の情報を取得
  useEffect(() => {
    if (uid === undefined) return;
    db.collection(FIRESTORE_KEY.INVITATIONS)
      .where("from", "==", uid)
      .get()
      .then((snapshot) => {
        const promises = snapshot.docs.map(async (snap) => {
          const invitation: FirestoreInvitationField = snap.data() as any;
          return db
            .collection(FIRESTORE_KEY.USERS)
            .doc(invitation.to)
            .get()
            .then((doc) => {
              const data: FirestoreUserField = doc.data() as any; // TODO: validation
              return {
                invitedUserName: data.name || "undefined",
                invitedUserId: doc.id,
                invitedImage: data.image || Avater,
              };
            });
        });
        Promise.all(promises).then((data) => setInvited(data));
      });
    return () => setInvited([]);
  }, [uid]);

  // 自分を招待した人の情報を取得
  useEffect(() => {
    if (uid === undefined) return;
    db.collection(FIRESTORE_KEY.INVITATIONS)
      .where("to", "==", uid)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 1) {
          console.error("same tokens");
        }
        snapshot.forEach(async (doc) => {
          const invitation: FirestoreInvitationField = doc.data() as any;
          db.collection(FIRESTORE_KEY.USERS)
            .doc(invitation.from)
            .get()
            .then((doc) => {
              if (doc.exists) {
                const data: FirestoreUserField = doc.data() as any; // TODO: validation
                setInvitor({
                  invitedUserName: data.name || "undefined",
                  invitedUserId: doc.id,
                  invitedImage: data.image || Avater,
                });
              } else {
                console.log("No such document!");
              }
            });
        });
      });
    return () => setInvitor(undefined);
  }, [uid]);
  return { user, invitor, invited, error };
};
