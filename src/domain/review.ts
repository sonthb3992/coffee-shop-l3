import { DocumentSnapshot, collection, doc, getFirestore, query, setDoc, where } from "firebase/firestore";
import { app } from "./firebase";

export interface Review {
    uid: string;
    parentId: string;
    userUid: string;
    orderId: string;
    rating: number;
    comment: string;
    isPublic: boolean;
}

export function ReviewFromFirestore(snapshot: DocumentSnapshot<any>): Review {
    const data = snapshot.data();

    const review: Review = {
        uid: snapshot.id,
        parentId: data.parentId,
        userUid: data.userUid,
        orderId: data.orderId,
        rating: data.rating,
        comment: data.comment,
        isPublic: data.isPublic,
    };

    return review;
}

export function ReviewToFirestore(review: Review): any {
    const { parentId, userUid, orderId, rating, comment, isPublic } = review;
  
    return {
      parentId,
      userUid,
      orderId,
      rating,
      comment,
      isPublic,
    };
  }

 export async function PushReviewToFirebase(review: Review): Promise<string> {
    try {
      const db = getFirestore(app);
      const reviewRef = collection(db, 'reviews');
        await setDoc(doc(db, 'reviews'), ReviewToFirestore(review));
      return 'success';
    } catch (e) {
      return 'Error adding review to Firestore: ' + e;
    }
  }
  
  

