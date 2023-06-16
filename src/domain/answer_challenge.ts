import {
  DocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { app } from './firebase';

export interface ChallengeAnswer {
  uid: string;
  useruid: string;
  comment: string;
  isVerified: boolean;
  verifiedUserUid?: string;
  timestamp: Date;
  imageUrl?: string;
  userAvatarUrl?: string;
  userDisplayName?: string;
}

export interface ChallengeReply {
  uid: string;
  useruid: string;
  comment: string;
  timestamp: Date;
  userDisplayName?: string;
  userAvatarUrl?: string;
}

export const PutChallengeAnswerToFirebase = async (
  answer: ChallengeAnswer
): Promise<boolean> => {
  try {
    const db = getFirestore(app);
    const answerRef = doc(collection(db, 'answerChallenges'));
    const answerData = {
      useruid: answer.useruid,
      comment: answer.comment,
      isVerified: answer.isVerified,
      status: 'pending',
      timestamp: new Date(Date.now()),
      verifiedUserUid: '',
      imageUrl: answer.imageUrl ?? '',
      userAvatarUrl: answer.userAvatarUrl,
      userDisplayName: answer.userDisplayName,
    };
    await setDoc(answerRef, answerData);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export async function GetAllAnswers(): Promise<ChallengeAnswer[]> {
  try {
    const db = getFirestore(app);
    const collectionRef = collection(db, 'answerChallenges');

    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
      return [];
    }
    const answers = snapshot.docs.map((_doc) => AnswerFromFirestore(_doc));
    return answers;
  } catch {
    return [];
  }
}

export async function VerifyAnswer(answerUid: string): Promise<boolean> {
  try {
    const db = getFirestore(app);
    const _collectionRef = collection(db, 'answerChallenges');
    const _docRef = doc(_collectionRef, answerUid);
    const querySnapshot = await getDoc(_docRef);

    if (!querySnapshot.exists()) {
      console.log('Answer not found.');
      return false;
    }
    await updateDoc(_docRef, {
      isVerified: true,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function ReplyToChallengeAnswer(
  answerUid: string,
  reply: ChallengeReply
): Promise<boolean> {
  try {
    const db = getFirestore(app);
    const _collectionRef = collection(
      db,
      'answerChallenges',
      answerUid,
      'replies'
    );
    const _docRef = doc(_collectionRef);
    await setDoc(_docRef, {
      useruid: reply.useruid,
      comment: reply.comment,
      timestamp: reply.timestamp,
      userDisplayName: reply.userDisplayName,
      userAvatarUrl: reply.userAvatarUrl,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function GetChallengeReplies(
  answerUid: string
): Promise<ChallengeReply[]> {
  try {
    const db = getFirestore(app);
    const reviewsRef = collection(db, 'answerChallenges', answerUid, 'replies');

    const querySnapshot = await getDocs(
      query(reviewsRef, orderBy('timestamp', 'asc'))
    );

    if (querySnapshot.empty) {
      return [];
    }

    const result = querySnapshot.docs.map((doc) => ReplyFromFirestore(doc));
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
    return [];
  }
}

const AnswerFromFirestore = (
  snapshot: DocumentSnapshot<any>
): ChallengeAnswer => {
  const data = snapshot.data();
  const answer: ChallengeAnswer = {
    uid: snapshot.id,
    useruid: data['useruid'],
    comment: data['comment'],
    isVerified: data['isVerified'] ?? false,
    timestamp: data.timestamp.toDate(),
    verifiedUserUid: data['verifiedUserUid'] ?? '',
    userAvatarUrl: data['userAvatarUrl'] ?? '',
    imageUrl: data['imageUrl'] ?? '',
    userDisplayName: data['userDisplayName'] ?? '',
  };
  return answer;
};

const ReplyFromFirestore = (
  snapshot: DocumentSnapshot<any>
): ChallengeReply => {
  const data = snapshot.data();
  const answer: ChallengeReply = {
    uid: snapshot.id,
    useruid: data['useruid'],
    userDisplayName: data['userDisplayName'],
    comment: data['comment'],
    timestamp: data.timestamp.toDate(),
  };
  return answer;
};
