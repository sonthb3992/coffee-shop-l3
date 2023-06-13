import React, { useEffect, useState } from 'react';
import { Order } from '../domain/order';
import SingleOrderDisplay from '../view/order-item';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../reducer/hook';
import { fetchUserData } from '../reducer/user-slice';
import { auth } from '../domain/firebase';
import PermissionAlertComponent from '../view/permission-alert';
import { GetAllTask, UpdateTaskStatus } from '../domain/task';
import { GetReviewsByIds, Review } from '../domain/review';
import ReviewItem from '../view/review-item';

const TaskPage: React.FC = () => {
  const [allTasks, setAllTasks] = useState<any[]>();

  const user = auth.currentUser;
  const userData = useSelector((state: RootState) => state.user.userData);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const updateTaskStatus = async (task: any, newStatus: string) => {
    const result = await UpdateTaskStatus(task.uid, newStatus);
    if (result === true) {
      fetchAllTasks();
    }
  };

  const fetchAllTasks = async () => {
    var result = await GetAllTask();
    setAllTasks(result);
  };

  useEffect(() => {
    dispatch(fetchUserData());
    fetchAllTasks();
  }, [userData, user]);

  return userData?.role === 'customer' || !userData ? (
    <PermissionAlertComponent></PermissionAlertComponent>
  ) : (
    <section className="section">
      {allTasks && allTasks?.length! > 0 && (
        <div className="container">
          <div className="columns is-desktop">
            <div className="column">
              <article className="message is-link">
                <div className="message-header">Open tasks</div>
                <div
                  className="message-body"
                  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  {allTasks
                    .filter((t) => t.status === 'pending')!
                    .map((t) => (
                      <div className="card p-2">
                        <ReviewItem
                          elevated={false}
                          review={t.review}
                          key={t.review.uid}
                          showUserAvatar={false}
                        ></ReviewItem>
                        <div className="buttons">
                          <button
                            className="button is-primary is-small"
                            onClick={() => {
                              updateTaskStatus(t, 'solving');
                            }}
                          >
                            Begin solving process
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </article>
            </div>
            <div className="column">
              <article className="message is-primary">
                <div className="message-header">Solving</div>
                <div
                  className="message-body"
                  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  {allTasks
                    .filter((t) => t.status === 'solving')!
                    .map((t) => (
                      <div className="card p-2">
                        <ReviewItem
                          elevated={false}
                          review={t.review}
                          key={t.review.uid}
                          showUserAvatar={false}
                        ></ReviewItem>
                        <div className="field pl-4 pr-4">
                          <label className="label">Actions</label>
                          <div className="control">
                            <input type="checkbox"></input>
                            {' Personalized apology'}
                          </div>
                          <div className="control">
                            <input type="checkbox"></input>
                            {' Compensation with voucher for free drinks'}
                          </div>
                          <div className="control">
                            <input type="checkbox"></input>
                            {' Refund'}
                          </div>
                          <div className="control">
                            <input type="checkbox"></input>
                            {' Follow-up communication'}
                          </div>
                        </div>
                        <div className="is-flex pr-4 pb-4 is-flex-direction-row-reverse">
                          <button
                            className="button is-primary is-small"
                            onClick={() => updateTaskStatus(t, 'follow-up')}
                          >
                            Follow up
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </article>
            </div>
            <div className="column">
              <article className="message is-warning">
                <div className="message-header">Follow up</div>
                <div
                  className="message-body"
                  style={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                  {allTasks
                    .filter((t) => t.status === 'follow-up')!
                    .map((t) => (
                      <div className="card p-2">
                        <ReviewItem
                          elevated={false}
                          review={t.review}
                          key={t.review.uid}
                          showUserAvatar={false}
                        ></ReviewItem>
                        <div className="buttons pr-4 pb-4 is-flex is-flex-direction-row-reverse">
                          <button
                            className="button is-primary is-small"
                            onClick={() => {
                              updateTaskStatus(t, 'closed');
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TaskPage;
