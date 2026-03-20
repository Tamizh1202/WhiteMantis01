import React from "react";
import styles from "./RichText.module.css";
import Image from "next/image";
import { formatImageUrl } from "@/lib/imageUtils";

const RichText = ({ content }) => {
  if (!content || !content.root || !content.root.children) {
    return null;
  }

  const renderNode = (node, index) => {
    if (!node) return null;

    switch (node.type) {
      case "root":
        return (
          <div key={index}>
            {node.children.map((child, i) => renderNode(child, i))}
          </div>
        );

      case "paragraph":
        return (
          <p
            key={index}
            className={node.indent ? styles[`indent-${node.indent}`] : ""}
          >
            {node.children.map((child, i) => renderNode(child, i))}
          </p>
        );

      case "heading":
        const Tag = node.tag || "h2";
        return (
          <Tag
            key={index}
            className={node.indent ? styles[`indent-${node.indent}`] : ""}
          >
            {node.children.map((child, i) => renderNode(child, i))}
          </Tag>
        );

      case "list":
        const ListTag = node.listType === "number" ? "ol" : "ul";
        return (
          <ListTag
            key={index}
            className={node.indent ? styles[`indent-${node.indent}`] : ""}
          >
            {node.children.map((child, i) => renderNode(child, i))}
          </ListTag>
        );

      case "listitem":
        return (
          <li key={index}>
            {node.children.map((child, i) => renderNode(child, i))}
          </li>
        );

      case "text":
        let textElement = <span key={index}>{node.text}</span>;

        // Lexical formats are bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code
        if (node.format & 1)
          textElement = <strong key={index}>{textElement}</strong>;
        if (node.format & 2) textElement = <em key={index}>{textElement}</em>;
        if (node.format & 4)
          textElement = (
            <span key={index} className={styles.strikethrough}>
              {textElement}
            </span>
          );
        if (node.format & 8)
          textElement = (
            <span key={index} className={styles.underline}>
              {textElement}
            </span>
          );
        if (node.format & 16)
          textElement = <code key={index}>{textElement}</code>;

        return textElement;

      case "link":
        return (
          <a
            key={index}
            href={node.fields?.url}
            target={node.fields?.newTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
          >
            {node.children.map((child, i) => renderNode(child, i))}
          </a>
        );

      case "upload":
        const imageUrl = formatImageUrl(node.value);
        if (!imageUrl) return null;
        return (
          <div key={index} className={styles.ImageWrapper}>
            <Image
              src={imageUrl}
              alt={node.value?.alt || "Blog image"}
              width={node.value?.width || 800}
              height={node.value?.height || 450}
              className={styles.Image}
            />
            {node.value?.caption && (
              <p className={styles.Caption}>{node.value.caption}</p>
            )}
          </div>
        );

      case "linebreak":
        return <br key={index} />;

      case "horizontalrule":
        return <hr key={index} className={styles.HorizontalRule} />;

      case "quote":
        return (
          <blockquote key={index}>
            {node.children.map((child, i) => renderNode(child, i))}
          </blockquote>
        );

      default:
        console.warn("Unhandled Lexical node type:", node.type);
        return null;
    }
  };

  return (
    <div className={styles.RichText}>
      {content.root.children.map((node, index) => renderNode(node, index))}
    </div>
  );
};

export default RichText;
