"use client";
import styles from "./VideoSection.module.css";
import { formatImageUrl } from "@/lib/imageUtils";

const VideoSection = ({ product }) => {

  const videoUrl = formatImageUrl(product?.videoBanner);



  return (
    <section className={styles.banner}>
      <video
        className={styles.bgVideo}
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h3 className={styles.title}>{product?.farm || ""}</h3>
        <p className={styles.text}>{`${typeof(product?.farmDescription) === "object" ? product?.farmDescription?.root?.children?.[0]?.text : product?.farmDescription || ""}`}</p>
      </div>
    </section>
  );
};

export default VideoSection;
