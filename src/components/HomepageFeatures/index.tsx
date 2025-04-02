import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Local Storage",
    Svg: require("@site/static/img/tag.svg").default,
    description: (
      <>
        TigerTag stores essential filament data directly on the chip, ensuring
        reliable, offline access even when there’s no network connectivity. This
        is key for uninterrupted 3D printing operations, making it a strong
        point for users who need dependable performance.
      </>
    ),
  },
  {
    title: "Online Connectivity",
    Svg: require("@site/static/img/cloud.svg").default,
    description: (
      <>
        With its free REST API, TigerTag connects to a cloud service to deliver
        enhanced information—like product images, detailed printing profiles,
        and multimedia content. This seamless integration between offline
        reliability and online richness offers users up-to-date and
        comprehensive filament data.
      </>
    ),
  },
  {
    title: "TigerTag Maker",
    Svg: require("@site/static/img/maker.svg").default,
    description: (
      <>
        Empowering makers and DIY enthusiasts, TigerTag Maker lets users convert
        standard NFC chips (such as NTAG213) into customized tags. This feature
        encourages innovation and personalization, expanding the technology’s
        use beyond standard 3D printing applications.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
