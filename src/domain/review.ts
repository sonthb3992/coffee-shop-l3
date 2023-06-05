import { collection, doc, getDocs, getFirestore, orderBy, query, setDoc, where } from "firebase/firestore";
import {app} from './firebase';

export class Review {
  id: string = '';
  orderId: string | undefined = '';
  parentId: string = '';
  comment: string = '';
  isPublic: boolean = false;
  rating: number = 0;
  reviewerName: string | null | undefined = '';
  timestamp: Date = new Date();
  userUid: string | undefined = '';

  static toFirestore(review: Review): any {
    return {
        id: review.id,
        orderId: review.orderId,
        comment: review.comment,
        parentId: review.parentId === '' ? null : review.parentId,
        isPublic: review.isPublic,
        rating: review.rating,
        reviewerName: review.reviewerName,
        timestamp: review.timestamp,
        userUid: review.userUid
    }
  };

  static async pushtoFirebase(review: Review | null): Promise<string> {
    try {
        if (review === null) {
            return 'Empty review';
        }
        const db = getFirestore(app);
        const reviewRef = collection(db, 'reviews');
        const _query = query(reviewRef, where('id', '==', review?.id));
        const querySnapshot = await getDocs(_query);
        if (!querySnapshot.empty) {
            return 'Another review with the same id is already existed';
        }

        const docRef = doc(db, 'reviews');
        // docRef.id
        await setDoc(docRef, Review.toFirestore(review));
        return 'Success';
    } catch (e) {
        return 'Error adding review: ' + e;
    }
  }
}
