import { gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { useLogin } from "../../contexts/UserContext";
import { useNotificationsQuery } from "../../generated/graphql";
import { getStringToDate } from "../../utils/dateHelper";
import Spinner from "../Spinner";
import styles from "./Notify.module.scss";

const Notify = () => {
  const {
    state: { details },
    socket,
    cache,
  } = useLogin();

  const { data, loading } = useNotificationsQuery({
    variables: {
      limit: 10,
    },
    skip: !details,
  });

  if (!data?.notifications)
    if (loading)
      return (
        <div className={styles["noti-menu"]}>
          <Spinner />
        </div>
      );
    else
      return (
        <div className={styles["noti-menu"] + " " + styles["noti-none"]}>
          <h2>Không có thông báo</h2>
        </div>
      );

  return (
    <div className={styles["noti-menu"]}>
      <h3>Thông báo</h3>
      {data.notifications.paginatedNotification.map((noti) => (
        <Link to={`watch/${noti.videoId}`} key={noti._id}>
          <div
            className={styles["noti-item"]}
            onClick={() => {
              console.log(noti._id);

              socket.emit("read-one-notify", noti._id);
              cache.writeFragment({
                id: `Notification:${noti._id}`,
                fragment: gql`
                  fragment notificationInfo on Notification {
                    readed
                  }
                `,
                data: { readed: true },
              });
            }}
          >
            {!noti.readed && (
              <div className={styles["noti-item__status"]}></div>
            )}
            <div className={styles["noti-item__authorImg"]}>
              <img src={noti.avatar_url as string} alt="user" />
            </div>
            <div className={styles["noti-item__content"]}>
              <h4>{noti.content}</h4>
              <small>{getStringToDate(noti.createdAt)}</small>
            </div>
            <div className={styles["noti-item__videoImg"]}>
              <img src={noti.thumnail as string} alt="video-" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Notify;