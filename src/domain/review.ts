import { DocumentSnapshot, Timestamp, collection, doc, getDocs, getFirestore, limit, orderBy, query, setDoc, where } from "firebase/firestore";
import { app } from "./firebase";
import { Order } from "./order";

export interface Review {
    uid: string;
    parentId: string;
    userUid: string;
    orderId: string;
    rating: number;
    comment: string;
    isPublic: boolean;
    reviewerName: string;
    reviewerImageUrl: string;
    reviewDateTime: Date
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
        reviewerName: data.reviewerName,
        reviewerImageUrl: data.reviewerImageUrl,
        reviewDateTime: data.timestamp.toDate()
    };

    return review;
}

export function ReviewToFirestore(review: Review): any {
    const { parentId, userUid, orderId, rating, comment, isPublic,reviewerName, reviewerImageUrl, reviewDateTime } = review;
    const timestamp = Timestamp.fromDate(reviewDateTime);

    return {
      parentId,
      userUid,
      orderId,
      rating,
      comment,
      isPublic,
      reviewerName,
      reviewerImageUrl,
      timestamp
    };
  }

 export async function PushReviewToFirebase(review: Review): Promise<string> {
    try {
      const db = getFirestore(app);
      const reviewsCollectionRef = collection(db, 'reviews');
      const newReviewDocRef = doc(reviewsCollectionRef); 
      await setDoc(newReviewDocRef, ReviewToFirestore(review));
      await Order.updateReviewedToFirebase(review.orderId);
      return 'success';
    } catch (e) {
      console.log(e);
      return 'Error adding review to Firestore: ' + e;
    }
  }
  
  
export async function GetRecentReviews(): Promise<Review[]> {
  try {
    const db = getFirestore(app);
    const reviewsRef = collection(db, 'reviews');

    const querySnapshot = await getDocs(query(reviewsRef, orderBy("timestamp", "desc"), limit(20)));

    if (querySnapshot.empty) {
      return [];
    }

    const result = querySnapshot.docs.map((doc) => ReviewFromFirestore(doc));

    return result;
  } catch (e) {
    console.log(e);
    return [];
  }
}

