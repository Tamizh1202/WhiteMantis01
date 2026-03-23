import React from "react";
import styles from "./OurPhilosophy.module.css";

const OurPhilosophy = () => {
  return (
    <>
      <div className={styles.Main} id="philosophy">
        <div className={styles.MainConatiner}>
          <div className={styles.Left}>
            <h4>How We Think About Coffee</h4>
          </div>
          <div className={styles.Right}>
            <p>
              We think coffee is most interesting at its
              edges: the moment a process changes how
              a bean tastes, the decision a farmer makes
              about when to pick, the seconds between
              under-roasted and perfect. We're obsessed
              with those details — not because it makes
              us precious about it, but because we've
              seen what happens to the cup when you get
              them right. Every bean we source, we
              source for a reason. Every roast profile we
              build, we can defend. And we share all of it
              — because transparency is the only honest
              way to sell coffee.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurPhilosophy;
