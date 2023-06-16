import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    updateDoc,
    where,
  } from 'firebase/firestore';
  import { app } from './firebase';

  interface ChallengeAnswer {
    useruid: string,
    imageUrl?: string,
    comment: string,
    replies: [
    ],
  }

  export const PutTaskToFirebase = async (
    reviewId: string,
    baristaId: string
  ): Promise<boolean> => {
    try {
      const db = getFirestore(app);
      const taskRef = doc(collection(db, 'tasks'));
      const taskData = {
        reviewId: reviewId,
        baristaId: baristaId,
        status: 'pending',
      };
      await setDoc(taskRef, taskData);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  
  export const GetAllTask = async (baristaId?: string): Promise<any[]> => {
    try {
      const db = getFirestore(app);
      const taskCollectionRef = collection(db, 'tasks');
      const _query = baristaId
        ? query(taskCollectionRef, where('baristaId', '==', baristaId))
        : query(taskCollectionRef);
  
      const snapshot = await getDocs(_query);
      if (snapshot.empty) {
        return [];
      }
      const tasks = snapshot.docs.map((_doc) => {
        const task = {
          uid: _doc.id,
          baristaId: _doc.data().baristaId,
          reviewId: _doc.data().reviewId,
          status: _doc.data().status,
        };
        return task;
      });
  
      const tasksWithReviews: any[] = [];
      const reviewCollectionRef = collection(db, 'reviews');
      for (let index = 0; index < tasks.length; index++) {
        const id = tasks[index].reviewId;
        const review = await getDoc(doc(reviewCollectionRef, id));
        const taskWithReview = {
          ...tasks[index],
          review: ReviewFromFirestore(review),
        };
        tasksWithReviews.push(taskWithReview);
      }
      console.log(tasksWithReviews);
      return tasksWithReviews;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  
  export const UpdateTaskStatus = async (
    taskId: string,
    newStatus: string
  ): Promise<boolean> => {
    try {
      const db = getFirestore(app);
      const taskRef = doc(collection(db, 'tasks'), taskId);
      await updateDoc(taskRef, {
        status: newStatus,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  