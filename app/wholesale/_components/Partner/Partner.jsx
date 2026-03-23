import React from "react";
import styles from "./Partner.module.css";

const Partner = () => {
  return (
    <>
      <div className={styles.Main}>
        <div className={styles.MainContainer}>
          <div className={styles.Left}>
            <h3>How We Work With Partners</h3>
          </div>
          <div className={styles.Right}>
            <p>
              We work with a curated set of partners —
              not a long list of accounts. That's
              deliberate. It means every café, restaurant,
              hotel, and office that uses White Mantis
              coffee gets genuine attention: a tailored
              bean program, hands-on recipe
              development, team training, and regular
              check-ins. We've built our wholesale model
              on the belief that the coffee on your menu
              reflects your brand as much as ours. So we
              take it seriously. We supply standalone
              blends and rotating single-origins, with
              roast profiles designed for your specific
              equipment and service volume. Minimum
              orders are flexible. Setup support is
              standard.{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Partner;
