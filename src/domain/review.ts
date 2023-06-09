import {
  DocumentSnapshot,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { app } from './firebase';
import { Order } from './order';
import { User } from 'firebase/auth';

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
  reviewDateTime: Date;
  replies?: Review[];
  hasReply?: boolean;
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
    reviewDateTime: data.timestamp.toDate(),
    hasReply: data.hasReply ?? false,
  };

  return review;
}

export function ReviewToFirestore(review: Review): any {
  const {
    userUid,
    orderId,
    rating,
    comment,
    isPublic,
    reviewerName,
    reviewerImageUrl,
    reviewDateTime,
  } = review;
  const timestamp = Timestamp.fromDate(reviewDateTime);

  return {
    userUid,
    orderId,
    rating,
    comment,
    isPublic,
    reviewerName,
    reviewerImageUrl,
    timestamp,
  };
}

export async function ReplyToReview(
  original_review: Review,
  user: User,
  replyText: string
): Promise<string> {
  try {
    const newReview: Review = {
      parentId: original_review.uid,
      userUid: user.uid,
      orderId: original_review.orderId,
      rating: 0,
      comment: replyText,
      isPublic: true,
      reviewDateTime: new Date(Date.now()),
      reviewerImageUrl: user.photoURL ?? '',
      uid: '',
      reviewerName: user.displayName ?? '',
    };
    await PushReviewToFirebase(newReview);
    return 'success';
  } catch (error) {
    console.log(error);
    return 'error';
  }
}

export async function PushReviewToFirebase(
  review: Review,
  order?: Order
): Promise<string> {
  try {
    const db = getFirestore(app);
    const isReplying = review.parentId !== '';
    const reviewsCollectionRef = isReplying
      ? collection(db, 'reviews', review.parentId, 'replies')
      : collection(db, 'reviews');

    const newReviewDocRef = doc(reviewsCollectionRef);
    await setDoc(newReviewDocRef, ReviewToFirestore(review));
    console.log('New review document added:', newReviewDocRef.id); // Log the ID of the newly added review document

    if (isReplying) {
      const parentDocRef = doc(db, 'reviews', review.parentId);
      await updateDoc(parentDocRef, {
        hasReply: true,
      });
      console.log('Parent review document updated:', review.parentId); // Log the ID of the parent review document
    }

    if (!isReplying) {
      await Order.updateReviewedToFirebase(review.orderId);
      await UpdateShopRating(review.rating);
      if (order && order.baristaUid)
        await UpdateBaristaRating(review.rating, order.baristaUid);
    }

    return 'success';
  } catch (e) {
    console.log(e);
    return 'Error adding review to Firestore: ' + e;
  }
}

async function UpdateBaristaRating(
  rating: number,
  baristaUid: string
): Promise<boolean> {
  try {
    const db = getFirestore(app);
    const _collectionRef = collection(db, 'users');
    const _docRef = doc(_collectionRef, baristaUid);
    const querySnapshot = await getDoc(_docRef);

    if (!querySnapshot.exists()) {
      console.log('Barista not found.');
      return false;
    }

    let count = querySnapshot.data().count ?? 0;
    let currentRating = querySnapshot.data().averageRating ?? 0;
    currentRating = (currentRating * count + rating) / ++count;

    await updateDoc(_docRef, {
      count: count,
      currentRating: currentRating,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function UpdateShopRating(rating: number): Promise<number> {
  try {
    const db = getFirestore(app);
    const _docRef = doc(collection(db, 'reviews_summary'), 'rating');

    const querySnapshot = await getDoc(_docRef);

    if (!querySnapshot.exists()) {
      const review_summary = {
        count: 1,
        average: rating,
      };
      await setDoc(_docRef, review_summary);
      return review_summary.average;
    }

    const updated_summary = {
      count: querySnapshot.data().count + 1,
      average:
        (querySnapshot.data().average * querySnapshot.data().count + rating) /
        (querySnapshot.data().count + 1),
    };

    await updateDoc(_docRef, updated_summary);
    return updated_summary.average;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function GetShopRating(): Promise<number> {
  try {
    const db = getFirestore(app);
    const _docRef = doc(collection(db, 'reviews_summary'), 'rating');

    const querySnapshot = await getDoc(_docRef);

    if (!querySnapshot.exists()) {
      return 0;
    }

    console.log(querySnapshot.data().average);
    return querySnapshot.data().average;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function GetRecentReviews(): Promise<Review[]> {
  try {
    const db = getFirestore(app);
    const reviewsRef = collection(db, 'reviews');

    const querySnapshot = await getDocs(
      query(reviewsRef, orderBy('timestamp', 'desc'), limit(20))
    );

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

export async function GetReviewsOfOrder(orderUid: string): Promise<Review[]> {
  try {
    const db = getFirestore(app);
    const reviewsRef = collection(db, 'reviews');

    const querySnapshot = await getDocs(
      query(
        reviewsRef,
        where('orderId', '==', orderUid),
        orderBy('timestamp', 'desc'),
        limit(20)
      )
    );

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

export async function GetReplies(reviewId: string): Promise<Review[]> {
  try {
    const db = getFirestore(app);
    const reviewsRef = collection(db, 'reviews', reviewId, 'replies');

    const querySnapshot = await getDocs(
      query(reviewsRef, orderBy('timestamp', 'asc'), limit(3))
    );

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
