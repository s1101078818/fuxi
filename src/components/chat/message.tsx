import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MessageProps {
  content: string;
  type: "question" | "answer" | "system";
}

export function Message({ content, type }: MessageProps) {
  return (
    <div className="flex w-full">
      <div
        className={`${
          type === "question"
            ? "ml-auto bg-gray-50 max-w-[70%]"
            : type === "system"
            ? "mx-auto bg-gray-50 border-l-4 max-w-[90%]"
            : "mr-auto bg-gray-50 max-w-[70%]"
        } rounded-lg shadow-md p-4 prose prose-sm`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return (
                <code
                  className={`${
                    match ? `language-${match[1]}` : ""
                  } text-stone-100 text-sm`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre({ children }) {
              return (
                <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                  {children}
                </pre>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
