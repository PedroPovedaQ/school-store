import React from "react";

export const RichTextContent = ({ content }: { content: any[] }) => {
  const renderText = (text: any) => {
    return text.bold ? <strong>{text.text}</strong> : text.text;
  };

  return content.map((item: any, index: number) => {
    switch (item.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-2">
            {item.children.map((child: any, childIndex: number) => (
              <React.Fragment key={childIndex}>
                {renderText(child)}
              </React.Fragment>
            ))}
          </p>
        );
      case "heading":
        const HeadingTag = `h${item.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={index} className="mb-2 font-bold">
            {item.children[0].text}
          </HeadingTag>
        );
      case "list":
        return (
          <ul key={index} className="mb-2 list-disc list-inside">
            {item.children.map((listItem: any, itemIndex: number) => (
              <li key={itemIndex}>
                {listItem.children.map((child: any, childIndex: number) => (
                  <React.Fragment key={childIndex}>
                    {renderText(child)}
                  </React.Fragment>
                ))}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  });
};
